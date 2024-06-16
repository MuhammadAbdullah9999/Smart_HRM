const { countUniqueDepartments } = require("./countDepartments");
const { countPendingLeaves } = require("../Leave/GetPendingLeavesCount");
const { connectToMongoDB, closeMongoDBConnection } = require("../connectDB");
const {ObjectId}=require('mongodb');

async function getHrAndEmployee(email, organizationId) {
  try {
    const db = await connectToMongoDB();

    const hrCollection = db.collection("HR");
    const employeeCollection = db.collection("Employees");
    const organizationCollection = db.collection("Organizations");

    // Fetch HR user details
    const hrUser = await hrCollection.findOne({ email: email });

    // Fetch employee data
    const employeeData = await employeeCollection
      .find({ organizationId: organizationId })
      .toArray();

    // Fetch unique departments count
    const departments = await countUniqueDepartments(organizationId);

    // Fetch total pending leaves count
    const totalLeavesRequestPending = await countPendingLeaves(organizationId);

    // Fetch organization name
    const organization = await organizationCollection.findOne({ _id: new ObjectId(organizationId) });
    return {
      userType: "HR",
      user: hrUser,
      employeeData: employeeData,
      totalLeavesRequestPending,
      departments,
      organizationName: organization ? organization.name : null, // Ensure the organization object exists
    };
  } catch (error) {
    console.error("Error connecting to MongoDB Atlas:", error);
    throw error;
  } finally {
    await closeMongoDBConnection();
  }
}

module.exports = { getHrAndEmployee };
