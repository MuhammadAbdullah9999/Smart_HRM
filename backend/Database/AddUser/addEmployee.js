const { generateHash } = require("../utilities/generatePasswordHash");
const { getHrAndEmployee } = require("../GetOrganizationData/GetHRandEmployee");
const { connectToMongoDB, closeMongoDBConnection } = require("../connectDB");
const {ObjectId}=require('mongodb');

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
  leaves,
  image // Add image parameter
) => {
  try {
    const db = await connectToMongoDB();
    const employeeCollection = db.collection("Employees");
    const hrCollection = db.collection("HR");
    const organizationCollection = db.collection("Organizations");

    // Convert email to lowercase
    email = email.toLowerCase();

    // Check if email exists in Employees collection
    const existingEmployee = await employeeCollection.findOne({ email: email });
    if (existingEmployee) {
      return {
        message: null,
        error: "User is already registered with these credentials.",
      };
    }

    // Check if email exists in HR collection
    const existingHR = await hrCollection.findOne({ email: email });
    if (existingHR) {
      return {
        message: null,
        error: "User is already registered with these credentials.",
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

    if (image && image.buffer) {
      // Check if image is provided
      employeeDocument.image = image.buffer.toString("base64"); // Convert image to base64 string
    }

    const result = await employeeCollection.insertOne(employeeDocument);

    if (result) {
      const {
        userType,
        user,
        employeeData,
        totalLeavesRequestPending,
        departments,
      } = await getHrAndEmployee(hrEmail, organizationId);
      const organization = await organizationCollection.findOne({ _id: new ObjectId(organizationId) });


      const data = {
        userType: userType,
        user: user,
        employeeData: employeeData,
        totalLeavesRequestPending: totalLeavesRequestPending,
        departments: departments,
        organizationName:organization.name
      };

      return { data: data, error: null };
    }
  } catch (err) {
    console.log(err.stack);
  } finally {
    await closeMongoDBConnection();
  }
};

module.exports = {
  addEmployee,
};
