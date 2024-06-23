const express = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config();

const router = express.Router();

router.post('/sendEmail', async (req, res) => {
  const { to, subject, text } = req.body;
  console.log(to,subject)

  const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use other services as well
    auth: {
      user: process.env.EMAIL, // Your email
      pass: process.env.PASSWORD   // Your email password or app password
    }
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to,
    subject,
    text
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending email');
  }
});

module.exports = router;
