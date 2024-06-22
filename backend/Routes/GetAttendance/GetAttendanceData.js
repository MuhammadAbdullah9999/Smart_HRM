const express = require("express");
const { getAttendanceData, getEmployeeAttendance } = require('../../Database/GetOrganizationData/GetAttendanceData');
const router = express.Router();

// Route to get attendance data for an entire organization
router.get("/:organizationId/:userType", async (req, res) => {
  const { organizationId, userType } = req.params;
  // console.log(organizationId, userType);

  getAttendanceData(organizationId, userType)
    .then(result => {
      if (result.error) {
        console.log(result.error);
        res.status(500).json(result.error);
      } else {
        console.log(result);
        res.status(200).json(result.attendanceArrays);
      }
    })
    .catch(error => {
      console.log(error)
      res.status(500).json(error);
    });
});

// Route to get attendance data for a particular employee
router.get("/employee/:employeeId/:attendanceType", async (req, res) => {
  const { employeeId, attendanceType } = req.params;
  console.log(employeeId, attendanceType);

  getEmployeeAttendance(employeeId, attendanceType)
    .then(result => {
      console.log(result)
      if (result.error) {
        res.status(500).json(result);
      } else {
        res.status(200).json(result);
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

module.exports = router;
