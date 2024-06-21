const { connectToMongoDB, closeMongoDBConnection } = require("../connectDB");
const { getUserData } = require("../Authentication/utilities/getUserData");
const {
  countEmployeesInOrganization,
  countHrsInOrganization,
} = require("../GetOrganizationData/countEmployeeAndHRInOrg");
const { countUniqueDepartments } = require("./countDepartments");
const { countPendingLeaves } = require("../Leave/GetPendingLeavesCount");

async function getDashboardData(userType,organizationId) {
  try {
    const db = await connectToMongoDB();

    const employeesCount = await countEmployeesInOrganization(organizationId);
    const departments = await countUniqueDepartments(organizationId);
    const pendingLeavesRequest = await countPendingLeaves(
      organizationId,
      userType
    );

    return {
      noOfEmployees: employeesCount,
      noOfDepartments: departments,
      pendingLeaveRequests: pendingLeavesRequest,
    };
  } catch (error) {
    throw error;
  } finally {
    // await closeMongoDBConnection();
  }
}

module.exports = {
  getDashboardData
};
