require("dotenv").config();
const { generateHash } = require("../utilities/generatePasswordHash");
const { connectToMongoDB, closeMongoDBConnection } = require("../connectDB");

const addOrganization = async (
  name,
  numberOfEmployees,
  numberOfHRs,
  email,
  address,
  contact,
  password
) => {
  const hashedPassword = await generateHash(password);

  try {
    const db = await connectToMongoDB();
    const col = db.collection("Organizations");

    // Check if email or name is already registered
    const existingOrganization = await col.findOne({
      $or: [{ email: email }, { name: name }],
    });

    if (existingOrganization) {
      return {
        organizationId: null,
        error: `${
          existingOrganization.email === email ? email : name
        } is already registered.`,
      };
    }

    const organizationDocument = {
      name,
      numberOfEmployees,
      numberOfHRs,
      email,
      address,
      contact,
      password: hashedPassword,
    };

    const result = await col.insertOne(organizationDocument);
    console.log(result);
    const organizationId = result.insertedId;
    const organizationName = name;
    return {
      organizationId,
      organizationName,
      error: null,
    };
  } catch (err) {
    console.error(err.stack);
    return {
      organizationId: null,
      organizationName: null,
      error: err.message,
    };
  } finally {
    await closeMongoDBConnection();
  }
};

module.exports = {
  addOrganization,
};
