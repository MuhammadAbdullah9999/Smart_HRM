const {
    connectToMongoDB,
    closeMongoDBConnection,
  } = require("../../Database/connectDB");
  
async function deleteToDoList(userType, userEmail, task) {
    try {
        // Connect to MongoDB
    console.log(task)
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
            // Filter out the task to be deleted
            user.toDoList = user.toDoList.filter(todo => todo.task !== task);

            // Update the user document in the collection
            await userTypeCollection.updateOne({ email: userEmail }, { $set: { toDoList: user.toDoList } });

            console.log('Task deleted successfully.');
        } else {
            console.error('User not found or ToDoList not found.');
        }
    } catch (error) {
        console.error('Error deleting task:', error);
    } finally {
        // Close the MongoDB connection
        await closeMongoDBConnection();
    }
}

module.exports = {deleteToDoList };
