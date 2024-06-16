const express = require('express');

const {addHR}=require('../../Database/AddUser/addHR');
const {verifyEmailDomain}=require('../utilities/VerifyEmailDomain')
const {getCeoAndEmployee}=require('../../Database/GetOrganizationData/getCeoAndEmployee')

const router=express.Router();

router.post('/', async (req, res) => {

   const {organizationId, organizationName,name, email, password, salary, position, contact, dateOfBirth, department, employeeId, allowances, leaves,hrEmail}=req.body
   console.log(organizationId, organizationName, name, email, password, salary, position, contact, dateOfBirth, department, employeeId, allowances, leaves, hrEmail);
//    const result= verifyEmailDomain(email,organizationName);
//    console.log(result);
//     if(!result){
//          res.status(500).send({error:"Email domain does not match organization name"});
//          return;
//     }
   try {
        const {data,error} = await addHR(organizationId, name, email, password, salary, position, contact, dateOfBirth, department, employeeId, allowances, leaves, hrEmail);
        if(data){
            res.status(200).json({data:data}).send();
        }
        else if(error){
            res.status(500).send({error:error});
        }
    } catch (error) {
        res.status(500).send({error:error.message});
    }
})
module.exports=router;
