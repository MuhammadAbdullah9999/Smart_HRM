const express = require('express');
const {updateUser} = require('../../Database/UpdateUser/updateUser');
const{getUserData}=require('../../Database/GetOrganizationData/getUser');
const router = express.Router();

// Update user password
router.put('/', async (req, res) => {
    // console.log(req.body);
    try {
        const { userType, userId, email, contact, password } = req.body;
        await updateUser(userType, userId, email, contact, password);
        const {user}=await getUserData(email,userType)
        console.log(user)
        res.status(200).json({ message: 'User data updated successfully' ,user:user});
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
