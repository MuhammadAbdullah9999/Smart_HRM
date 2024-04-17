const express = require("express");
const multer = require("multer");

const { addEmployee } = require("../../Database/AddUser/addEmployee");
const { verifyEmailDomain } = require("../utilities/VerifyEmailDomain");
const { getOrganizationName } = require("../../Database/GetOrganizationData/GetOrganizationName");

const router = express.Router();

// Configure multer to store the image in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/", upload.single("image"), async (req, res) => {
  const {
    organizationId,
    hrEmail,
    name,
    email,
    password,
    salary,
    position,
    contact,
    dateOfBirth,
    department,
    employeeId,
    allowances,
    leaves,
  } = req.body;

  // const organizationName = await getOrganizationName(organizationId);

  // const result = verifyEmailDomain(email, organizationName);
  // console.log(result);
  // if (!result) {
  //   res.status(500).send({ error: "Email domain does not match organization name" });
  //   return;
  // }

  try {
    const image = req.file; // Access the uploaded image
    console.log("Received image:", image); // Log the image

    const { data, error } = await addEmployee(
      organizationId,
      hrEmail,
      name,
      email,
      password,
      salary,
      position,
      contact,
      dateOfBirth,
      department,
      employeeId,
      allowances,
      leaves,
      image
    );

    if (data) {
      res.status(200).json({ data: data }).send();
    } else if (error) {
      res.status(500).send({ error: error });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
