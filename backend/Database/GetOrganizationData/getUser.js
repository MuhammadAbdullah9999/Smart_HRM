const { connectToMongoDB, closeMongoDBConnection } = require("../connectDB");

async function getUserData(email,userType) {
  try {
    const db = await connectToMongoDB();

    let doc = '';
    if (userType === 'HR') {
        doc = 'HR';
    } else {
        doc = 'Employees';
    }
    const Collection = db.collection(doc);
    const user = await Collection.findOne({ email: email });
   
    return {
      user,
    };
  } catch (error) {
    console.error("Error connecting to MongoDB Atlas:", error);
    throw error;
  } finally {
    await closeMongoDBConnection();
  }
}

module.exports = { getUserData };
