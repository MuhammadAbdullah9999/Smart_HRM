const { ObjectId } = require("mongodb");
const { connectToMongoDB, closeMongoDBConnection } = require("../connectDB");

async function requestLeave(
  employeeId,
  leaveDays,
  leaveType,
  leaveReason,
  leaveDate,
  userType
) {
  try {
    if(userType === "employee") {
      userType="Employees";
    }
    else if(userType==="HR"){
      userType="HR";
    }
    const db = await connectToMongoDB();
    const employeeCollection = db.collection(userType);

    const leaveId = new ObjectId(); // Generate a new ObjectId for the leave request
   
    const leave = {
      _id: leaveId,
      leaveDays,
      leaveType,
      leaveReason,
      leaveDate,
      status: "pending",
    };

    await employeeCollection.updateOne(
      { _id: new ObjectId(employeeId) },
      { $push: { leaveRequest: leave } }
    );

    return {
      error: null,
      message: "Leave request stored successfully",
      leaveId: leaveId.toHexString(),
    };
  } catch (error) {
    return { error: error, message: null, leaveId: null };
  } finally {
    await closeMongoDBConnection();
  }
}

module.exports = {
  requestLeave,
};
