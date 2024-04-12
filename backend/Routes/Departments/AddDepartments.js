const express = require('express');
const { addDepartments } = require('../../Database/Departments/addDepartments');
const {getDepartments}=require('../../Database/Departments/getDepartments');
const router = express.Router();

router.post('/AddDepartment', async (req, res) => {
    const { organizationId, department } = req.body;

    try {
        await addDepartments(organizationId, department);
        res.status(200).json({ message: 'Department added successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add department', details: error.message });
    }
});
router.get('/GetDepartments/:organizationId', async (req, res) => {
    const { organizationId } = req.params;

    try {
        const departments = await getDepartments(organizationId);
        if (departments.length === 0) {
            res.status(404).json({ message: 'No departments found for this organization' });
        } else {
            res.status(200).json({ departments });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve departments', details: error.message });
    }
});

module.exports=router;