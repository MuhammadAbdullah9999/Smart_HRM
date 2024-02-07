const argon2 = require("argon2");
const { getHrAndEmployee } = require("../GetOrganizationData/GetHRandEmployee");
const { connectToMongoDB, closeMongoDBConnection } = require("../connectDB");

const generateHash = async (password) => {
  try {
    // Hash the password using Argon2
    const hash = await argon2.hash(password);
    return hash;
  } catch (error) {
    throw error;
  }
};

const addEmployee = async (
  organizationId,
  hrEmail,
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
    const col = db.collection("Employees");

    // Check if employee with the same email already exists
    const existingEmployee = await col.findOne({ email: email });
    if (existingEmployee) {
      return {
        message: null,
        error: "Employee is already registered with these credentials.",
      };
    }

    const hashedPassword = await generateHash(password);

    let employeeDocument = {
      organizationId: organizationId,
      employeeId: employeeId,
      name: name,
      email: email,
      password: hashedPassword,
      salary: salary,
      allowances: allowances || {},
      leaves: leaves || 0,
      department: department,
      position: position,
      contact: contact,
      dateOfBirth: dateOfBirth,
    };

    const result = await col.insertOne(employeeDocument);
    if (result) {
      const {
        userType,
        user,
        employeeData,
        totalLeavesRequestPending,
        departments,
      } = await getHrAndEmployee(hrEmail, organizationId);
      const data = {
        userType: userType,
        user: user,
        employeeData: employeeData,
        totalLeavesRequestPending: totalLeavesRequestPending,
        departments: departments,
      };
      return { data: data, error: null };
    }
  } catch (err) {
    console.error(err.stack);
  } finally {
    await closeMongoDBConnection();
  }
};

module.exports = {
  addEmployee,
};
