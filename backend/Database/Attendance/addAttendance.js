const { ObjectId } = require("mongodb");
const {
  getHrAndEmployee,
} = require("../../Database/GetOrganizationData/GetHRandEmployee");
const { connectToMongoDB, closeMongoDBConnection } = require("../connectDB");

async function addAttendance(employeeData) {
  const { hrEmail, organizationId } = employeeData[0];
  console.log(hrEmail, organizationId);
  try {
    const db = await connectToMongoDB();
    const employeeCollection = db.collection("Employees");

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
      // Assuming hrEmail and organizationId are accessible in the scope
      const {
        userType,
        user,
        employeeData,
        totalLeavesRequestPending,
        departments,
      } = await getHrAndEmployee(hrEmail, organizationId);

      const data = {
        userType,
        user,
        employeeData,
        totalLeavesRequestPending,
        departments,
      };

      return { data, error: null };
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
