const express = require("express");
// const{getUserData}=require('../../Database/GetOrganizationData/getUser');
const {
  getCeoDashboardData,
} = require("../../Database/GetOrganizationData/getDashboardData");
const router = express.Router();

// Update user password
router.get("/:userType/:organizationId", async (req, res) => {
  console.log(req.params);
  // console.log(req.body);
  try {
    const { userType, organizationId } = req.params;
    if(userType==='business_owner'){
        const { noOfEmployees, noOfDepartments, pendingLeaveRequests } =
        await getCeoDashboardData(organizationId);
        res
        .status(200)
        .json({ noOfEmployees, noOfDepartments, pendingLeaveRequests  });
    }

  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
