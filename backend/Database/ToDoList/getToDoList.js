const {
  connectToMongoDB,
  closeMongoDBConnection,
} = require("../../Database/connectDB");

// Function to get the ToDoList for a user
async function getToDoList(userType, userEmail) {
  try {
    // Connect to MongoDB
    const db = await connectToMongoDB();

    // Access the UserType collection
    if(userType==='HR'){
        userType='HR'
    }
    else if(userType==='employee'){
        userType='Employees'
    }
    const userTypeCollection = db.collection(userType);

    // Find the user by email
    const user = await userTypeCollection.findOne({ email: userEmail });

    if (user && user.toDoList) {
      return user.toDoList;
    } else {
      console.error("User not found or ToDoList not found.");
      return [];
    }

    // Close the MongoDB connection
  } catch (error) {
    console.error("Error getting ToDoList:", error);
    return [];
  } finally {
    await closeMongoDBConnection();
  }
}
module.exports = { getToDoList };
