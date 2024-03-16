const express = require("express");
const router = express.Router();
const resetPassword = require("../../Database/Authentication/resetPassword");

router.post("/", async (req, res) => {
  const { userType, password, token } = req.body;

  try {
    const {data,error} = await resetPassword(userType, password, token);
    if(data){
        res.status(200).json({ data: data });
    }
    else if(error){
        res.status(500).json({ error: error });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
