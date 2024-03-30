const express = require("express");
const {getEmployees}=require('../../Database/GetOrganizationData/getEmployees')
const router = express.Router();

router.get("/:organizationId/:userId/:userType", async (req, res) => {
  const { organizationId,userId,userType } = req.params;

  const employeeData = await getEmployees(organizationId,userId,userType);
//   console.log(result);
  if (!employeeData) {
    res.status(500).json(employeeData);
  } else {
    res.status(200).send(employeeData);
  }
});
module.exports = router;
