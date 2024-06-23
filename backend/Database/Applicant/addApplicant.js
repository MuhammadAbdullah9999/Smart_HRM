const { generateHash } = require("../utilities/generatePasswordHash");
const { connectToMongoDB, closeMongoDBConnection } = require("../connectDB");

const addApplicant = async (name, email, password, phoneNumber, jobId, orgId, cv) => {
  try {
    const db = await connectToMongoDB();
    const col = db.collection("Applicants");

    // Check if an applicant with the same email and jobId already exists
    const existingApplicant = await col.findOne({ email, jobId });
    if (existingApplicant) {
      return {
        message: null,
        error: "Applicant has already applied for this job with these credentials.",
      };
    }

    const hashedPassword = await generateHash(password);

    let applicantDocument = {
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      jobId,
      orgId,
      cv,
    };

    const result = await col.insertOne(applicantDocument);

    if (result) {
      // Add any additional logic you need after successfully adding an applicant
      console.log('Applicant data stored successfully');
      return { data: "Applied Successfully", error: null };
    }
  } catch (err) {
    console.error('Failed to store applicant data:', err);
    return { data: null, error: 'Failed to submit application' };
  } finally {
    await closeMongoDBConnection();
  }
};

module.exports = {
  addApplicant,
};
