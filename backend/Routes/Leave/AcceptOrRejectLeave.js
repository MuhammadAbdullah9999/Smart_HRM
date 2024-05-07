const express = require("express");
const router = express.Router();

const {
  acceptOrRejectLeave,
} = require("../../Database/Leave/AcceptOrRejectLeave");

router.post("/", async (req, res) => {
  try {
    const { leaveId, employeeId, status, organizationId, email, userType } = req.body;
    const {
      resUserType,
      user,
      employeeData,
      totalLeavesRequestPending,
      departments,
      error
    } = await acceptOrRejectLeave(employeeId, leaveId, status, organizationId, email, userType);

    if (error) {
      return res.status(500).json(error); // Return here to prevent further execution
    }
    
    return res.status(200).json({userType:resUserType,user, employeeData, totalLeavesRequestPending, departments }); // Return here as well
  } catch (error) {
    return res.status(500).json({ error: error.message }); // Return here too
  }
});

module.exports = router;
