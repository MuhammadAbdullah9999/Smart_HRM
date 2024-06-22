const { connectToMongoDB, closeMongoDBConnection } = require("../connectDB");
const {ObjectId}=require('mongodb');

async function getJobs(organizationId) {
  try {
    const db = await connectToMongoDB();
    const organizationCollection = db.collection('Organizations');

    // Find the organization by organizationId and return the jobs field
    const organization = await organizationCollection.findOne({ _id: new ObjectId(organizationId) });

    if (!organization) {
      throw new Error('Organization not found');
    }

    const jobs = organization.jobs || [];

    return { jobs };
  } catch (error) {
    console.error("Error fetching job data:", error);
    throw error;
  } finally {
    // Do not close the connection here; manage it at a higher level if needed
  }
}

module.exports = { getJobs };
