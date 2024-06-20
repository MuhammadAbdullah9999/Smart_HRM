const { connectToMongoDB, closeMongoDBConnection } = require("../connectDB");

async function findEmployeesWithPendingLeaveRequests(organizationId) {
  try {

    const database = await connectToMongoDB();
    const employeesCollection = database.collection("Employees");

    const employees = await employeesCollection
      .find({ organizationId })
      .toArray();

    const employeesWithPendingLeaveRequests = employees.filter((employee) => {
      return (
        employee.leaveRequest &&
        employee.leaveRequest.some((request) => request.status === "pending")
      );
    });

    const employeesWithOnlyPendingLeaveRequests =
      employeesWithPendingLeaveRequests.filter((employee) => {
        return employee.leaveRequest.every(
          (request) => request.status !== "approved"
        );
      });

    const filteredEmployees = employeesWithOnlyPendingLeaveRequests.map(
      (employee) => {
        return {
          ...employee,
          leaveRequest: employee.leaveRequest.filter(
            (request) => request.status !== "Approved"
          ),
        };
      }
    );

    return filteredEmployees;
  } finally {
    // await closeMongoDBConnection();
  }
}
async function countPendingLeaves(organizationId) {
  // const uri = dbUri;
  // const client = new MongoClient(uri);

  try {
    // await client.connect();
    const database = await connectToMongoDB();

    // const database = client.db(dbName);
    
    const employeesCollection = database.collection("Employees");

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
    // await closeMongoDBConnection();
  }
}

module.exports = {
  findEmployeesWithPendingLeaveRequests,
  countPendingLeaves,
};
