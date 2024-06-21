const { connectToMongoDB, closeMongoDBConnection } = require("../connectDB");
const { ObjectId } = require('mongodb');

async function getEmployees(organizationId, userId, userType) {
  try {
    const db = await connectToMongoDB();
    let collectionName = userType === 'business_owner' ? 'HR' : 'Employees';
    const employeeCollection = db.collection(collectionName);

    let employeeData;
    let hrData;

    switch (userType) {
      case 'HR':
        employeeData = await employeeCollection.find({ organizationId }).toArray();
        const hrCollection = db.collection('HR');
        hrData = await hrCollection.find({ _id: new ObjectId(userId) }).toArray();
        break;
      case 'employee':
        employeeData = await employeeCollection.find({ _id: new ObjectId(userId) }).toArray();
        break;
      case 'business_owner':
        employeeData = await employeeCollection.find({ organizationId: userId }).toArray();
        break;
      default:
        throw new Error(`Unknown userType: ${userType}`);
    }

    if (userType === 'HR') {
      return { employeeData, hrData };
    } else {
      return { employeeData };
    }
  } catch (error) {
    console.error("Error fetching employee data:", error);
    throw error;
  } finally {
    // Do not close the connection here; manage it at a higher level if needed
  }
}

module.exports = { getEmployees };
