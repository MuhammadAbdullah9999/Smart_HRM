const express = require("express");
const {forgotPassword} = require('../../Database/Authentication/forgotPassword');
const router = express.Router();

router.post("/", async (req, res) => {
  const { email } = req.body;
console.log(email);
  
  try {
    const {data,error}=await forgotPassword(email);
    if(data){
        res.status(200).json({ message: 'Password reset email sent successfully' });
    }
    else if(error){
        res.status(500).json({ error: error });
    }
  } catch (error) {
    console.error("Error while processing forgot password request:", error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
