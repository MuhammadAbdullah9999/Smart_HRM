const { connectToMongoDB, closeMongoDBConnection } = require('../../Database/connectDB');

// Function to add a task to the ToDoList collection
async function addToDoList(userType, userEmail, task) {
    try {
        // Connect to MongoDB
        const db = await connectToMongoDB();

        // Access the UserType collection
        let col;
        if(userType==='HR'){
            col='HR'
        }
        else if(userType==='employee'){
            col='Employees'
        }
        const userTypeCollection = db.collection(col);

        // Find the user by email
        const user = await userTypeCollection.findOne({ email: userEmail });

        if (user) {
            // Check if ToDoList array exists, if not, create it
            if (!user.toDoList) {
                user.toDoList = [];
            }

            // Add the task to the ToDoList array
            user.toDoList.push({
                userType: userType,
                task: task
            });

            // Update the user document in the collection
            await userTypeCollection.updateOne({ email: userEmail }, { $set: { toDoList: user.toDoList } });

            console.log('Task added successfully.');
        } else {
            console.error('User not found.');
        }

        // Close the MongoDB connection
        await closeMongoDBConnection();
    } catch (error) {
        console.error('Error adding task:', error);
    }
}

module.exports = { addToDoList};
