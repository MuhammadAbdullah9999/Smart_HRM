const { getUserData } = require("./utilities/getUserData");
const { getHrAndEmployee } = require("../GetOrganizationData/GetHRandEmployee");
const { connectToMongoDB, closeMongoDBConnection } = require("../connectDB");
const {getJobsByOrganizationId} = require('../GetOrganizationData/getOrganizationJobs');
const { countEmployeesInOrganization,countHrsInOrganization } = require("../GetOrganizationData/countEmployeeAndHRInOrg");
const {countUniqueDepartments}=require('../GetOrganizationData/countDepartments');
const bcrypt = require("bcrypt");

const authenticateUser = async (email, password) => {
  try {
    const db = await connectToMongoDB();
    // Check if the email exists in the Organizations collection
    const orgCollection = db.collection("Organizations");
    const orgUser = await orgCollection.findOne({ email: email });

    if (orgUser && (await bcrypt.compare(password, orgUser.password))) {
      const hrData = await getUserData("HR", orgUser._id.toString());
      const employeesCount = await countEmployeesInOrganization(orgUser._id.toString());
      const hrCount=await countHrsInOrganization(orgUser._id.toString());
      const departments = await countUniqueDepartments(orgUser._id.toString());
      return { userType: "business_owner", user: orgUser, hrData: hrData,noOfEmployees:employeesCount,noOfHRs:hrCount,noOfDepartments:departments };
    }

    // Check if the email exists in the HRs collection
    const hrCollection = db.collection("HR");
    const hrUser = await hrCollection.findOne({ email: email });

    if (hrUser && (await bcrypt.compare(password, hrUser.password))) {
      const { userType, user, employeeData, totalLeavesRequestPending, departments } = await getHrAndEmployee(hrUser.email, hrUser.organizationId);
      
      const jobs = await getJobsByOrganizationId(hrUser.organizationId);
    
      return {
        userType,
        user,
        employeeData,
        totalLeavesRequestPending,
        departments,
        jobs,
      };
    }
    
    // Check if the email exists in the Employees collection
    const empCollection = db.collection("Employees");
    const empUser = await empCollection.findOne({ email: email });

    if (empUser && (await bcrypt.compare(password, empUser.password))) {
      return { userType: "employee", user: empUser };
    }

    // Password does not match
    return { userType: "error", user: null, error: "Password does not match." };
  } catch (error) {
    console.error("Error authenticating user:", error);
    return {
      userType: "error",
      user: null,
      error: "An error occurred while authenticating user.",
    };
  } finally {
    await closeMongoDBConnection();
  }
};

module.exports = { authenticateUser };
