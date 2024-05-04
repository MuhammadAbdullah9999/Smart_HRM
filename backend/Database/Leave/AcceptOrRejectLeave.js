const { connectToMongoDB, closeMongoDBConnection } = require("../connectDB");
const {
  getHrAndEmployee,
} = require("../GetOrganizationData/GetHRandEmployee");

const { ObjectId } = require("mongodb");

async function acceptOrRejectLeave(
  employeeId,
  leaveId,
  status,
  organizationId,
  email
) {
  try {
    const db = await connectToMongoDB();
    const employeeCollection = db.collection("Employees");

    const result = await employeeCollection.updateOne(
      {
        _id: new ObjectId(employeeId),
        "leaveRequest._id": new ObjectId(leaveId),
        "leaveRequest.status": "pending",
      },

      {
        $set: { "leaveRequest.$.status": status },
      }
    );

    if (status === "Approved") {
      const leave = await employeeCollection.findOne({
        _id: new ObjectId(employeeId),
      });

      if (leave) {
        const leaveRequest = leave.leaveRequest.find((request) =>
          request._id.equals(new ObjectId(leaveId))
        );

        if (leaveRequest) {
          const leaveDays = parseInt(leaveRequest.leaveDays, 10);
          const currentLeaves = parseInt(leave.leaves, 10);

          if (!isNaN(leaveDays) && !isNaN(currentLeaves)) {
            const updatedLeaves = currentLeaves + leaveDays;

            await employeeCollection.updateOne(
              { _id: new ObjectId(employeeId) },
              { $set: { leaves: updatedLeaves.toString() } }
            );
          }
        }
      }
    }
z
   const{
      userType,
      user,
      employeeData,
      totalLeavesRequestPending,
      departments,
    } = await getHrAndEmployee(email,organizationId);
    // console.log(user,userType,employeeData,totalLeavesRequestPending,departments);
    return({user, departments, employeeData, totalLeavesRequestPending, userType,error:null})

  } catch (error) {
    return { error: error };
  } finally {
    await closeMongoDBConnection();
  }
}

module.exports = {
  acceptOrRejectLeave,
};
