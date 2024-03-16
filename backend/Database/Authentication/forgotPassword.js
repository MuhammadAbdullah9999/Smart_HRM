const { connectToMongoDB, closeMongoDBConnection } = require("../connectDB");
const crypto = require("crypto");
const { sendPasswordResetEmail } = require("./utilities/sendPasswordResetEmail");

const forgotPassword = async (email) => {
  try {
    const db = await connectToMongoDB();
    const orgCollection = db.collection("Organizations");
    const empCollection = db.collection("Employees");
    const hrCollection = db.collection("HR");

    // Check if user exists in Organizations collection
    let user = await orgCollection.findOne({ email: email });
    let userType = "Organizations"; // Track user type for later use

    // If user not found in Organizations collection, check Employee collection
    if (!user) {
      user = await empCollection.findOne({ email: email });
      userType = "Employees";
    }

    // If user still not found, check HR collection
    if (!user) {
      user = await hrCollection.findOne({ email: email });
      userType = "HR";
    }

    if (user) {
      // Generate token for password reset
      const token = crypto.randomBytes(6).toString("hex");

      // Set token and expiry time in user document
      await db.collection(userType).updateOne(
        { email: email },
        {
          $set: {
            resetPasswordToken: token,
            resetPasswordExpires: Date.now() + 3600000, // Token expires in 1 hour
          },
        }
      );

      // Send password reset email
      await sendPasswordResetEmail(email, token, userType);

      console.log(`Password reset email sent to ${email}`);
      return { data: 'Ok', error: null };
    } else {
      console.log("User not found");
      return { data: null, error: 'No user exists with this email' };
    }
  } catch (error) {
    console.error("Error authenticating user:", error);
    return { data: null, error: 'Server error' };
  } finally {
    await closeMongoDBConnection();
  }
};

module.exports = { forgotPassword };
