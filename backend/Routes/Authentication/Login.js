const express = require("express");
const bcrypt = require("bcrypt");

const { authenticateUser } = require("../../Database/Authentication/login");
const router = express.Router();

router.post("/", async (req, res) => {
  const { email, password } = req.body;
  const result = await authenticateUser(email, password);
  // console.log(result);
  if (!result.user) {
    res.status(500).json(result);
  } else {
    res.status(200).send(result);
  }
});
module.exports = router;
