const { generateHash } = require("../utilities/generatePasswordHash");
const { connectToMongoDB, closeMongoDBConnection } = require("../connectDB");
const { getCeoAndEmployee } = require('../../Database/GetOrganizationData/getCeoAndEmployee');

const addHR = async (
  organizationId,
  name,
  email,
  password,
  salary,
  position,
  contact,
  dateOfBirth,
  department,
  employeeId,
  allowances,
  leaves
) => {
  try {
    const db = await connectToMongoDB();
    const col = db.collection("HR");

    // Convert email to lowercase
    email = email.toLowerCase();

    const existingHR = await col.findOne({ email: email });
    if (existingHR) {
      return {
        message: null,
        error: "HR is already registered with these credentials.",
      };
    }
    const hashedPassword = await generateHash(password);

    let hrDocument = {
      organizationId: organizationId,
      name: name,
      salary: salary,
      contact: contact,
      dateOfBirth: dateOfBirth,
      employeeId: employeeId,
      department: department,
      position: position,
      allowances: allowances || [],
      leaves: leaves || 0,
      email: email,
      password: hashedPassword,
    };

    const result = await col.insertOne(hrDocument);
    if (result) {
      const { userType, user, employeeData, noOfEmployees, noOfDepartments, noOfHRs } = await getCeoAndEmployee(email, organizationId);
      const data = { userType, user, employeeData, noOfEmployees, noOfDepartments, noOfHRs };
      return { data: data, error: null };
    }
  } catch (err) {
    console.log(err.stack);
  } finally {
    await closeMongoDBConnection();
  }
};

module.exports = {
  addHR,
};
