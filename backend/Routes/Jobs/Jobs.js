const express = require('express');
const router = express.Router();
const { getJobsByOrganizationId } = require('../../Database/Job/getJobs');
const {deleteJobById}=require('../../Database/Job/deleteJob');

router.get('/:organizationId', async (req, res) => {
  const { organizationId } = req.params;

  try {
    const { jobs, error } = await getJobsByOrganizationId(organizationId);

    if (jobs) {
      res.status(200).json(jobs);
    } else {
      res.status(500).json({ error: error });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:organizationId/:jobId', async (req, res) => {
  const { organizationId, jobId } = req.params;

  try {
    const { result, error } = await deleteJobById(organizationId, jobId);

    if (result) {
        console.log(result);
      res.status(200).json({ message: 'Job deleted successfully' });
    } else {
      res.status(500).json({ error: error });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
