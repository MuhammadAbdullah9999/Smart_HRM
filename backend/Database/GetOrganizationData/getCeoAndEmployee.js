const { connectToMongoDB, closeMongoDBConnection } = require("../connectDB");
const {getUserData}=require('../Authentication/utilities/getUserData');
const { countEmployeesInOrganization,countHrsInOrganization } = require("../GetOrganizationData/countEmployeeAndHRInOrg");
const {countUniqueDepartments}=require('./countDepartments');
const {countPendingLeaves}=require('../Leave/GetPendingLeavesCount')

async function getCeoAndEmployee(ceoEmail, organizationId) {
  try {
    const db=await connectToMongoDB();

    const orgCollection = db.collection("Organizations");
    const orgUser = await orgCollection.findOne({ email: ceoEmail });

    const hrData = await getUserData("HR", organizationId);
    const employeesCount = await countEmployeesInOrganization(
      organizationId
    );
    const hrCount = await countHrsInOrganization(organizationId);
    const departments = await countUniqueDepartments(organizationId);
    const pendingLeavesRequest=await countPendingLeaves(organizationId,userType='business_owner')

    return {
      userType: "business_owner",
      user: orgUser,
      employeeData: hrData,
      noOfEmployees: employeesCount,
      noOfHRs: hrCount,
      noOfDepartments: departments,
      pendingLeaveRequests: pendingLeavesRequest
    };
  } catch (error) {
    throw error;
    // console.error("Error connecting to MongoDB Atlas:", error);
  } finally {
    await closeMongoDBConnection();
  }
}
module.exports={
    getCeoAndEmployee
}
