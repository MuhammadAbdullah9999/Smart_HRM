const { connectToMongoDB, closeMongoDBConnection } = require("../connectDB");
const { ObjectId } = require('mongodb');

async function countUniqueDepartments(organizationId) {
  try {
    const db = await connectToMongoDB();
    const orgCollection = db.collection("Organizations");

    const org = await orgCollection.findOne({ _id: new ObjectId(organizationId) });

    if (!org || !org.departments || org.departments.length === 0) {
      // If organization not found or has no departments, return 0
      return { uniqueDepartmentsArray: [], uniqueDepartmentsCount: 0 };
    }

    // Retrieve departments from the organization document
    const departments = org.departments;

    // Count the number of unique departments
    const uniqueDepartmentsCount = departments.length;

    // Return the array of departments and the count
    return { uniqueDepartmentsArray: departments, uniqueDepartmentsCount };
  } catch (error) {
    console.error("Error counting unique departments:", error);
    return { uniqueDepartmentsArray: [], uniqueDepartmentsCount: 0 };
  } finally {
    await closeMongoDBConnection();
  }
}

module.exports = {
  countUniqueDepartments,
};
