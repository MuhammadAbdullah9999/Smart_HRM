const express = require("express");
const {getEmployees}=require('../../Database/GetOrganizationData/getEmployees')
const router = express.Router();

router.get("/:organizationId/:userId/:userType", async (req, res) => {
  const { organizationId,userId,userType } = req.params;

  const {employeeData,hrData} = await getEmployees(organizationId,userId,userType);
//   console.log(result);


  if (!employeeData) {
    res.status(500).json(employeeData);
  } else {
    if(userType==='HR'){
      res.status(200).json({employeeData,hrData});
    }
    else{
      res.status(200).json({employeeData});
    }
  }
});
module.exports = router;
