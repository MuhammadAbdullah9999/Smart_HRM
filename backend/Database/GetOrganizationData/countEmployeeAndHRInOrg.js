const { connectToMongoDB, closeMongoDBConnection } = require("../connectDB");

async function countEmployeesInOrganization(organizationId) {
  try {
    const db = await connectToMongoDB();
    const employeesCollection = db.collection("Employees");

    // Count the number of employees in the organization
    const employeesCount = await employeesCollection.countDocuments({ organizationId });

    // console.log(`Number of employees in the organization: ${employeesCount}`);

    return employeesCount;
  } finally {
    await closeMongoDBConnection();
  }
}
async function countHrsInOrganization(organizationId) {
  // console.log(organizationId)
  try {
    const db = await connectToMongoDB();
    const hrCollection = db.collection("HR");

    // Count the number of employees in the organization
    const hrCount = await hrCollection.countDocuments({ organizationId });

    // console.log(`Number of HR in the organization: ${hrCount}`);

    return hrCount;
  } finally {
    await closeMongoDBConnection();
  }
}

module.exports = {
  countEmployeesInOrganization,countHrsInOrganization
};
