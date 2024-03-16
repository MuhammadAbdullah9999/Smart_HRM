const { connectToMongoDB, closeMongoDBConnection } = require("../connectDB");
const bcrypt = require("bcrypt");

async function resetPassword(userType, password, token) {
  try {
    // Connect to MongoDB
    const db = await connectToMongoDB();
    const collection = db.collection(userType); // Change "users" to your collection name

    // Find the user by reset token
    const user = await collection.findOne({ resetPasswordToken: token });

    if (!user) {
        return({data:null,error:'Invalid or expired token'})
    }

    // Check if token has expired
    if (user.resetPasswordExpires < Date.now()) {
        return({data:null,error:'Token has expired'})

    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user's password and clear reset token
    await collection.updateOne(
      { resetPasswordToken: token },
      {
        $set: {
          password: hashedPassword,
          resetPasswordToken: null,
          resetPasswordExpires: null,
        },
      }
    );

    // Close MongoDB connection
    await closeMongoDBConnection();

    return { data:"Password reset successfully",error:null };
  } catch (error) {
    console.error("Error resetting password:", error);
    throw new Error("Internal server error");
  }
}

module.exports = resetPassword;
