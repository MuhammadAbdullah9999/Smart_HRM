const express = require('express');
const router = express.Router();

// Import the addAttendance function from the database module
const { addAttendance } = require('../../Database/Attendance/addAttendance');

// POST route for adding attendance
router.post('/',async (req, res) => {
    const { hrEmail,organizationId,employeeId, month, date, checkInTime, checkOutTime, attendanceStatus } = req.body;
    // Call the addAttendance function from the database module
    try {
        const {data,error}=await addAttendance(hrEmail,organizationId,employeeId, month, date, checkInTime, checkOutTime, attendanceStatus);
        if(data){
            res.status(200).json({ data:data });
        }
        else if(error){
            res.status(400).json({ error });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to add attendance' });
    }
        
});

module.exports = router;