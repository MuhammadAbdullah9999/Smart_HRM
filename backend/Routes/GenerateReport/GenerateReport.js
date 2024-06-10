const express = require('express');
const { generateReport } = require('../../Database/GenerateReport/generateReport');

const router = express.Router();

router.post('/', async (req, res) => {
    const { organizationId, year, month } = req.body;

    if (!organizationId || !year || !month) {
        return res.status(400).json({ error: "Missing required fields: organizationId, year, month" });
    }

    const result = await generateReport(organizationId, year, month);

    if (result.error) {
        return res.status(500).json({ error: result.error });
    }

    return res.status(200).json(result);
});

module.exports = router;
