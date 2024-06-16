const express = require('express');
const {deleteUser}=require('../../Database/DeleteUser/deleteUser')
const {getHrAndEmployee}=require('../../Database/GetOrganizationData/GetHRandEmployee');
const {getCeoAndEmployee}=require('../../Database/GetOrganizationData/getCeoAndEmployee');
const router = express.Router();

router.delete('/:employeeId/:userType/:email/:organizationId', async (req, res) => {
    const {employeeId,userType,email,organizationId} = req.params;
console.log(employeeId, userType,email,organizationId);
    try {
        // Call the function from the database to delete the user
        // await database.deleteUser(userId);

        const{message,error}=await deleteUser(employeeId,userType);
   
        if(userType==='HR'){
            const { userType, user, employeeData, totalLeavesRequestPending, departments,organizationName } = await getHrAndEmployee(email, organizationId);
            res.status(200).json({ userType, user, employeeData, totalLeavesRequestPending, departments,organizationName })
        
           }
           else{
            const {userType,user,employeeData,noOfEmployees,noOfDepartments,noOfHRs}=await getCeoAndEmployee(email,organizationId)
            res.status(200).json({userType, user, employeeData, noOfEmployees, noOfDepartments, noOfHRs })
           }
        // res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;