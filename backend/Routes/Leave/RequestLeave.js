const express = require('express');
const router = express.Router();

const { requestLeave } = require('../../Database/Leave/RequestLeave');

router.post('/', async(req, res) => {
    const { employeeId, leaveType, leaveReason, leaveDays,leaveDate,userType } = req.body;

    const { message, error,leaveId } = await requestLeave(employeeId, leaveDays,leaveType, leaveReason,leaveDate,userType);

    if (error) {
        res.status(500).send(error);
    } else {
        res.status(200).json({message:message,leaveId:leaveId}).send();
    }
});

module.exports = router;
