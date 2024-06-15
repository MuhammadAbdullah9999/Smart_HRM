const express = require("express");
const { getAttendanceData, getEmployeeAttendance } = require('../../Database/GetOrganizationData/GetAttendanceData');
const router = express.Router();

// Route to get attendance data for an entire organization
router.get("/:organizationId/:userType", async (req, res) => {
  const { organizationId, userType } = req.params;
  console.log(organizationId, userType);

  getAttendanceData(organizationId, userType)
    .then(result => {
      if (result.error) {
        res.status(500).json(result.error);
      } else {
        res.status(200).json(result.attendanceArrays);
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

// Route to get attendance data for a particular employee
router.get("/employee/:employeeId/:userType", async (req, res) => {
  const { employeeId, userType } = req.params;
  console.log(employeeId, userType);

  getEmployeeAttendance(employeeId, userType)
    .then(result => {
      if (result.error) {
        res.status(500).json(result.error);
      } else {
        res.status(200).json(result.attendance);
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

module.exports = router;
