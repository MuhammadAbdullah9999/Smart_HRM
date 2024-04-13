const express = require('express');
const { addDepartments } = require('../../Database/Departments/addDepartments');
const { getDepartments } = require('../../Database/Departments/getDepartments');
const { deleteDepartment } = require('../../Database/Departments/deleteDepartments'); // Import the deleteDepartment function
const router = express.Router();

// POST route to add a department
router.post('/AddDepartment', async (req, res) => {
    const { organizationId, department } = req.body;

    try {
        await addDepartments(organizationId, department);
        const departments = await getDepartments(organizationId);
        res.status(200).json({ message: 'Department added successfully', departments });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add department', details: error.message });
    }
});

// GET route to retrieve departments for an organization
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

// DELETE route to delete a department from an organization
router.delete('/DeleteDepartment/:organizationId/:departmentName', async (req, res) => {
    const { organizationId, departmentName } = req.params;

    try {
        await deleteDepartment(organizationId, departmentName);
        const departments = await getDepartments(organizationId);

        res.status(200).json({ message: `Department '${departmentName}' deleted successfully`,departments });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete department', details: error.message });
    }
});

module.exports = router;
