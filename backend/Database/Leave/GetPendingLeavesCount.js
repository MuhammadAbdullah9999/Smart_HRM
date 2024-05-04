const { connectToMongoDB, closeMongoDBConnection } = require("../connectDB");

async function countPendingLeaves(organizationId,userType) {
  try {
    const db = await connectToMongoDB();
    let col=''
    if(userType && userType==='business_owner'){
      col='HR'
    }
    else{
      col='Employees'
    }
    const employeesCollection = db.collection(col);

    const employees = await employeesCollection
      .find({ organizationId })
      .toArray();

    const totalPendingLeaves = employees.reduce((count, employee) => {
      if (employee.leaveRequest) {
        const pendingLeaves = employee.leaveRequest.filter(
          (request) => request.status === "pending"
        ).length;
        count += pendingLeaves;
      }
      return count;
    }, 0);

    return totalPendingLeaves;
  } finally {
    await closeMongoDBConnection();
  }
}

module.exports = {
  countPendingLeaves,
};
