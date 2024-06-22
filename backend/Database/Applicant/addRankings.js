const { ObjectId } = require("mongodb");
const { connectToMongoDB, closeMongoDBConnection } = require("../connectDB");

async function addRanking(flaskApiResponse) {
  // console.log(flaskApiResponse);
  try {
    const db = await connectToMongoDB();
    const collection = db.collection("Applicants");

    for (const applicantWithRanking of flaskApiResponse) {
      const applicantId = applicantWithRanking.id;

      console.log("Updating document with _id:", applicantId);

      const ranking = applicantWithRanking.ranking;

      const result = await collection.updateOne(
        { _id: new ObjectId(applicantId) },
        { $set: { ranking: ranking } }
      );
    }

    await closeMongoDBConnection();
    console.log("MongoDB collection updated successfully");
  } catch (error) {
    console.error("Error updating MongoDB collection:", error);
    throw error;
  }
}
module.exports = {
  addRanking,
};
