const { connectToMongoDB, closeMongoDBConnection } = require("../connectDB");
const { ObjectId } = require('mongodb');

async function deleteJobById(organizationId, jobId) {
  try {
    const db = await connectToMongoDB();
    const orgCollection = db.collection('Organizations');

    const result = await orgCollection.updateOne(
      { _id: new ObjectId(organizationId) },
      { $pull: { jobs: { _id: new ObjectId(jobId) } } }
    );
    return { result };
  } catch (error) {
    console.error("Error deleting job:", error);
    return { error: error.message };
  }
}

module.exports = { deleteJobById };
