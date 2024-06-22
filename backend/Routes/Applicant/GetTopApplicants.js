const express = require('express');
const axios = require('axios');
const { GetApplicantsData } = require('../../Database/Applicant/GetApplicantsData');
const {addRanking}=require('../../Database/Applicant/addRankings');


const app = express();


const router = express.Router();


app.use(express.json());

router.get('/', async (req, res) => {
    const{job_description,organizationId,jobId}=req.query;
    // console.log(job_description,organizationId, jobId);
    const applicants = await GetApplicantsData(organizationId, jobId);
console.log('applicantData',applicants);
    const flaskApiUrl = 'http://127.0.0.1:5001/api';  // Replace with your Flask API URL
        const response = await axios.post(flaskApiUrl, { applicants , job_description});

        // Handle the Flask API response if needed
        const flaskApiResponse = response.data;
        // console.log('Flask API Response:', flaskApiResponse);
        await addRanking(flaskApiResponse.ranking);
        // Continue with other logic or send the applicants data as a response
        res.json(flaskApiResponse);

    // res.json(applicants);
});

module.exports = router;
