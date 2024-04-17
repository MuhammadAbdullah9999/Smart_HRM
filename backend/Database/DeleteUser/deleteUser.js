const { connectToMongoDB, closeMongoDBConnection } = require("../connectDB");
const{ObjectId}=require('mongodb')

const deleteUser = async (employeeId,userType) => {
  try {
    let collection=''
    if(userType==="business_owner"){
        collection='HR'
    }
    else{
        collection='Employees'
    }
    const db = await connectToMongoDB();
    const col = db.collection(collection); // Assuming "HR" collection

    const result = await col.deleteOne({ _id:new ObjectId(employeeId) });

    if (result.deletedCount === 1) {
      return { message: "Employee deleted successfully", error: null };
    } else {
      return { message: null, error: "Employee not found" };
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
