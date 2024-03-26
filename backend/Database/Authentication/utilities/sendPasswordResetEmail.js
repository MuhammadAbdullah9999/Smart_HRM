const nodemailer = require("nodemailer");
require('dotenv').config();

const sendPasswordResetEmail = async (email, token,userType) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL, // Your email username
        pass: process.env.PASSWORD, // Your email password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL, // Your email address
      to: email,
      subject: 'Password Reset Request',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        http://localhost:3000/reset-password/${userType}/${token}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };

    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${email}`);
  } catch (error) {
    console.error("Error sending password reset email:", error);
  }
};

module.exports ={ sendPasswordResetEmail};
