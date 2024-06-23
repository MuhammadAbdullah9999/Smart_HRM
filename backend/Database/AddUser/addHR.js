const { generateHash } = require("../utilities/generatePasswordHash");
const { connectToMongoDB, closeMongoDBConnection } = require("../connectDB");
const { getCeoAndEmployee } = require('../../Database/GetOrganizationData/getCeoAndEmployee');
const { ObjectId } = require('mongodb');

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
  leaves,
  hrEmail
) => {
  try {
    const db = await connectToMongoDB();
    const hrCollection = db.collection("HR");
    const employeeCollection = db.collection("Employees");
    const organizationCollection = db.collection("Organizations");

    // Convert email to lowercase
    email = email.toLowerCase();

    // Check if email exists in HR collection
    const existingHR = await hrCollection.findOne({ email: email });
    if (existingHR) {
      return {
        message: null,
        error: "User is already registered with these credentials.",
      };
    }

    // Check if employeeId exists in HR collection
    const existingHRById = await hrCollection.findOne({ employeeId: employeeId });
    if (existingHRById) {
      return {
        message: null,
        error: "HR with this ID already exists.",
      };
    }

    // Check if email exists in Employees collection
    const existingEmployee = await employeeCollection.findOne({ email: email });
    if (existingEmployee) {
      return {
        message: null,
        error: "User is already registered with these credentials.",
      };
    }

    // Check if employeeId exists in Employees collection
    const existingEmployeeById = await employeeCollection.findOne({ employeeId: employeeId });
    if (existingEmployeeById) {
      return {
        message: null,
        error: "Employee with this ID already exists.",
      };
    }

    // Check if email exists in Organization collection
    const existingOrganization = await organizationCollection.findOne({ email: email });
    if (existingOrganization) {
      return {
        message: null,
        error: "User is already registered with these credentials.",
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

    const result = await hrCollection.insertOne(hrDocument);
    if (result) {
      const { userType, user, employeeData, noOfEmployees, noOfDepartments, noOfHRs } = await getCeoAndEmployee(hrEmail, organizationId);
      const organization = await organizationCollection.findOne({ _id: new ObjectId(organizationId) });
      const data = { userType, user, employeeData, noOfEmployees, noOfDepartments, noOfHRs, organizationName: organization.name };
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
