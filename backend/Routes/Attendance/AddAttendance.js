const express = require('express');
const router = express.Router();
const { addAttendance } = require('../../Database/Attendance/addAttendance');

router.post('/', async (req, res) => {
  const employeeData = req.body.data;
  const overwrite = req.body.overwrite;

  try {
    const { data, error, existingAttendance } = await addAttendance(employeeData, overwrite);

    if (data) {
      res.status(200).json({ data: data, existingAttendance: existingAttendance });
    } else if (error) {
      res.status(400).json({ error });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to add attendance' });
  }
});

module.exports = router;
