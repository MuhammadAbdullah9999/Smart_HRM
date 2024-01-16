const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");
require('dotenv').config();


const createHash = async (password) => {
  try {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);

    const hash = await bcrypt.hash(password, salt);

    return hash;
  } catch (error) {
    throw error;
  }
};

const uri =process.env.DB_URI;
const dbName = process.env.DB_NAME;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const addHR = async (organizationId, name, email, password, salary, position, contact, dateOfBirth, department, employeeId, allowances, leaves) => {
  const hashedPassword = await createHash(password);
  try {
    await client.connect();
    const db = client.db(dbName);

    const col = db.collection("HR");

    let hrDocument = {
      organizationId: organizationId,
      name:name,
      salary:salary,
      contact:contact,
      dateOfBirth:dateOfBirth,
      employeeId:employeeId,
      department:department,
      position:position,
      allowances:allowances || {},
      leaves:leaves || 0,
      email: email,
      password: hashedPassword,
    };

    const result = await col.insertOne(hrDocument);
  } catch (err) {
    console.log(err.stack);
  } finally {
    await client.close();
  }
};
module.exports = {
  addHR,
};
