const { connectToMongoDB, closeMongoDBConnection } = require("../connectDB");
const {ObjectId}=require('mongodb')

async function getEmployees(organizationId,userId,userType) {
    // console.log(organizationId,userId,userType)
  try {
    const db = await connectToMongoDB();

    let col;
    if(userType==='business_owner'){
        col='HR';
    }
    else {
        col='Employees'
    }
    const employeeCollection = db.collection(col);
    let employeeData;
    let hrData;
if(userType==='HR'){
    employeeData = await employeeCollection
    .find({ organizationId: organizationId })
    .toArray();

    const hrCollection=db.collection('HR');
    hrData=await hrCollection.find({ _id:new ObjectId(userId) }).toArray();
}
    else if(userType==='employee'){
        employeeData = await employeeCollection
        .find({ _id:new ObjectId(userId) })
        .toArray();
    }
    else if(userType==='business_owner'){
        employeeData = await employeeCollection
        .find({ organizationId: userId })
        .toArray();
    }
      // console.log(employeeData);
      if(userType==='HR'){
        return{
          employeeData,
          hrData
        }
      }
      else{
        return {
          employeeData: employeeData,
        };
      }
   
  } catch (error) {
    console.error("Error connecting to MongoDB Atlas:", error);
    throw error;
  } finally {
    await closeMongoDBConnection();
  }
}

module.exports = { getEmployees };
