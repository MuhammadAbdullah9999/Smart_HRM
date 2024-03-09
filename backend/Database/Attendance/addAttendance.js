const { ObjectId } = require("mongodb");
const {
  getHrAndEmployee,
} = require("../../Database/GetOrganizationData/GetHRandEmployee");
const { connectToMongoDB, closeMongoDBConnection } = require("../connectDB");

async function addAttendance(
  hrEmail,
  organizationId,
  employeeId,
  month,
  date,
  checkInTime,
  checkOutTime,
  attendanceStatus
) {
  try {
    const db = await connectToMongoDB();
    const employeeCollection = db.collection("Employees");

    const attendance = {
      employeeId,
      month,
      date,
      checkInTime,
      checkOutTime,
      attendanceStatus
    };

    const result = await employeeCollection.findOneAndUpdate(
      { _id: new ObjectId(employeeId) },
      { $push: { attendance: attendance } },
      { upsert: true }
    );
    if (result) {
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
      return { data: data, error: null };
    } else {
      result({ error: "Error Adding Attendance", data: null });
    }
  } catch (error) {
    console.error("Error adding attendance:", error);
  } finally {
    await closeMongoDBConnection();
  }
}

module.exports = { addAttendance };
