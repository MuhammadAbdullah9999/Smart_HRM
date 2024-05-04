const express = require('express');
const router = express.Router();
const {addJob}=require('../../Database/Job/addJob')
router.post('/',async (req, res) => {
    console.log(req.body);
    const { organizationId, jobTitle, jobDescription, location ,jobType,requirements,noOfPositions} = req.body;
    console.log(organizationId, jobTitle, jobDescription, location,jobType,requirements,noOfPositions);
    await addJob( organizationId, jobTitle, jobDescription, location ,jobType,requirements,noOfPositions);
    res.status(200).send({message:"Job added successfully!"});

});

module.exports = router;