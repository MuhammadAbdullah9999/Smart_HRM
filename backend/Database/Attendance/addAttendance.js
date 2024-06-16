const { ObjectId } = require("mongodb");
const { getHrAndEmployee } = require("../../Database/GetOrganizationData/GetHRandEmployee");
const { connectToMongoDB, closeMongoDBConnection } = require("../connectDB");
const { getCeoAndEmployee } = require("../../Database/GetOrganizationData/getCeoAndEmployee");

async function addAttendance(employeeData, overwrite = false) {
  const { email, organizationId } = employeeData[0];
  const loginType = employeeData[0].loginType;

  try {
    const db = await connectToMongoDB();
    const employeeCollection = db.collection(loginType === "HR" ? "Employees" : "HR");

    const results = await Promise.all(
      employeeData.map(async (employee) => {
        const { employeeId, month, date, attendanceStatus } = employee;
        const attendance = { employeeId, month, date, attendanceStatus };

        const existingAttendance = await employeeCollection.findOne({
          _id: new ObjectId(employeeId),
          "attendance.date": date,
        });

        let result;
        if (existingAttendance) {
          if (overwrite) {
            result = await employeeCollection.updateOne(
              { _id: new ObjectId(employeeId), "attendance.date": date },
              { $set: { "attendance.$[elem].attendanceStatus": attendanceStatus } },
              { arrayFilters: [{ "elem.date": date }] }
            );
          } else {
            return { status: 'exists', employeeId: employeeId };
          }
        } else {
          result = await employeeCollection.updateOne(
            { _id: new ObjectId(employeeId) },
            { $push: { attendance: attendance } }
          );
        }

        return result.matchedCount > 0 
          ? { status: 'success', employeeId: employeeId }
          : { status: 'failed', employeeId: employeeId };
      })
    );

    const successfulResults = results.filter(result => result.status === 'success' || result.status === 'exists');

    if (successfulResults.length === employeeData.length) {
      const data = await (loginType === "HR" ? getHrAndEmployee : getCeoAndEmployee)(email, organizationId);
      return { data, error: null, existingAttendance: successfulResults.filter(result => result.status === 'exists').map(result => result.employeeId) };
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
