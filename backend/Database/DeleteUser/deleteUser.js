const { connectToMongoDB, closeMongoDBConnection } = require("../connectDB");
const { ObjectId } = require('mongodb');

const deleteUser = async (employeeId, userType) => {
  try {
    let collection = '';
    if (userType === "business_owner") {
      collection = 'HR';
    } else {
      collection = 'Employees';
    }

    const db = await connectToMongoDB();
    const col = db.collection(collection);
    const pastEmployeesCol = db.collection('PastEmployees');

    // Find the user in the current collection
    const user = await col.findOne({ _id: new ObjectId(employeeId) });

    if (!user) {
      return { message: null, error: "Employee not found" };
    }

    // Add a new field to indicate whether the user was an employee or HR
    user.userType = userType;
    
    // Format the date to "Month Year"
    const currentDate = new Date();
    const options = { year: 'numeric', month: 'long' };
    const formattedDate = currentDate.toLocaleDateString('en-US', options);
    user.terminationDate = formattedDate;

    // Insert the user into the PastEmployees collection
    await pastEmployeesCol.insertOne(user);

    // Delete the user from the original collection
    const result = await col.deleteOne({ _id: new ObjectId(employeeId) });

    if (result.deletedCount === 1) {
      return { message: "Employee deleted successfully", error: null };
    } else {
      return { message: null, error: "Failed to delete employee" };
    }
  } catch (err) {
    console.error("Error deleting employee:", err);
    return { message: null, error: "Internal server error" };
  } finally {
    await closeMongoDBConnection();
  }
};

module.exports = {
  deleteUser,
};
