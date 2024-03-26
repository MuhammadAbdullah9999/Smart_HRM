const { ObjectId } = require("mongodb");
const {
  getHrAndEmployee,
} = require("../../Database/GetOrganizationData/GetHRandEmployee");
const { connectToMongoDB, closeMongoDBConnection } = require("../connectDB");
const {
  getCeoAndEmployee,
} = require("../../Database/GetOrganizationData/getCeoAndEmployee");

async function addAttendance(employeeData) {
  const { email, organizationId } = employeeData[0];
  console.log(email, organizationId);
  const loginType = employeeData[0].loginType;
  try {
    const db = await connectToMongoDB();
    const employeeCollection = db.collection(
      loginType === "HR" ? "Employees" : "HR"
    );

    // Use Promise.all to wait for all async operations to complete
    const results = await Promise.all(
      employeeData.map(async (employee) => {
        const {
          employeeId,
          month,
          date,
          checkInTime,
          checkOutTime,
          attendanceStatus,
        } = employee;
        const attendance = {
          employeeId,
          month,
          date,
          checkInTime,
          checkOutTime,
          attendanceStatus,
        };

        const result = await employeeCollection.findOneAndUpdate(
          { _id: new ObjectId(employeeId) },
          { $push: { attendance: attendance } },
          { upsert: true }
        );

        return result;
      })
    );

    // Check if all operations were successful
    const success = results.every((result) => result.value !== null);
    // console.log(success)
    if (success) {
      if (loginType === "HR") {
        const {
          userType,
          user,
          employeeData,
          totalLeavesRequestPending,
          departments,
        } = await getHrAndEmployee(email, organizationId);

        const data = {
          userType,
          user,
          employeeData,
          totalLeavesRequestPending,
          departments,
        };

        return { data, error: null };
      } else if (loginType === "business_owner") {
        const {
          userType,
          user,
          employeeData,
          noOfEmployees,
          noOfDepartments,
          noOfHRs,
        } = await getCeoAndEmployee(email, organizationId);
        const data = {
          userType,
          user,
          employeeData,
          noOfEmployees,
          noOfDepartments,
          noOfHRs,
        };
        return { data, error: null };
      }
    } else {
      return { data: null, error: "Error Adding Attendance" };
    }
  } catch (error) {
    console.error("Error adding attendance:", error);
    return { data: null, error: "Internal Server Error" };
  } finally {
    await closeMongoDBConnection();
  }
}

module.exports = { addAttendance };
