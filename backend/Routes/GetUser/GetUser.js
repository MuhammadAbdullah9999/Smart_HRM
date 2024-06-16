const express = require('express');
const{getUserData}=require('../../Database/GetOrganizationData/getUser');
const router = express.Router();

// Update user password
router.get('/:userType/:email', async (req, res) => {
    console.log(req.params)
    // console.log(req.body);
    try {
        const { userType, email} = req.params;
        const {user}=await getUserData(email,userType)
        // console.log(user)
        res.status(200).json({ message: 'Successfully fetched user data' ,user:user});
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
