const argon2 = require("argon2");
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

    // Check if HR with the same email already exists
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
      allowances: allowances || {},
      leaves: leaves || 0,
      email: email,
      password: hashedPassword,
    };

    const result = await col.insertOne(hrDocument);
    if (result) {
      return { message: "HR added successfully", error: null };
    }
  } catch (err) {
    console.error(err.stack);
  } finally {
    await closeMongoDBConnection();
  }
};

module.exports = {
  addHR,
};
