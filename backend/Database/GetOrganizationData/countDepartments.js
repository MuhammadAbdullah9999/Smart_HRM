const { connectToMongoDB, closeMongoDBConnection } = require("../connectDB");
const {ObjectId}=require('mongodb');

async function countUniqueDepartments(organizationId) {
  try {
    const db = await connectToMongoDB();
    // const employeesCollection = db.collection("Employees");

    const orgCollection = db.collection("Organizations");
    const org = await orgCollection
    .findOne({_id:new ObjectId(organizationId) })

    if(org){
      console.log(org.departments);
    }

    // const employees = await employeesCollection
    //   .find({ organizationId })
    //   .toArray();

    // // Use a Set to store unique department names
    // const uniqueDepartments = new Set();

    // employees.forEach((employee) => {
    //   if (employee.department) {
    //     // Add the department to the set
    //     uniqueDepartments.add(employee.department);
    //   }
    // });

    // // Convert the set to an array if needed
    // const uniqueDepartmentsArray = [...uniqueDepartments];
    // console.log(uniqueDepartmentsArray);

    // // Count the number of unique departments
    // const uniqueDepartmentsCount = uniqueDepartmentsArray.length;
    const departments = { uniqueDepartmentsArray:org.departments, uniqueDepartmentsCount:org.departments.length };
    return departments;
  } finally {
    await closeMongoDBConnection();
  }
}

module.exports = {
  countUniqueDepartments,
};
