const express = require("express");
const { MongoClient, Binary } = require("mongodb");
const pdf = require("pdf-parse");

const uri = process.env.DB_URI;
const dbName = process.env.DB_NAME;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const extractTextFromResume = async (resumeBuffer) => {
  await client.connect();
  try {
    const data = await pdf(resumeBuffer);
    return data.text;
  } catch (error) {
    console.error("Error extracting text from resume:", error);
    return null;
  }
};

async function GetApplicantsData(organizationId, jobId) {
  try {
    await client.connect();
    const db = client.db(dbName);
    const applicantCollection = db.collection("Applicants");

    const applicants = await applicantCollection
      .find({
        orgId: organizationId,
        jobId: jobId,
      })
      .toArray();
    console.log(applicants);

    const applicantsWithDecodedResume = await Promise.all(
      applicants.map(async (applicant) => {
        const { _id, name,phoneNumber,email, password, cv } = applicant;
        const decodedResume = await extractTextFromResume(cv.buffer);

        return {
          id: _id,
          name,
          cv,
          phoneNumber,
          email,
          password,
          resume: decodedResume,
        };
      })
    );

    return applicantsWithDecodedResume;
  } catch (error) {
    console.error(error);
    // Return an empty array or handle the error as per your application's requirements
    return [];
  } finally {
    // Close the MongoDB connection after completing the operation
    await client.close();
  }
}

module.exports = { GetApplicantsData };
