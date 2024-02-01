const express = require('express');

const {addEmployee}=require('../Database/addEmployee');
const {verifyEmailDomain}=require('./utilities/VerifyEmailDomain');
const {getOrganizationName}=require('../Database/GetOrganizationData/GetOrganizationName');
 
const router=express.Router();

router.post('/', async (req, res) => {

   const {organizationId, name, email, password, salary, position, contact, dateOfBirth, department, employeeId, allowances, leaves}=req.body
   
   const organizationName=await getOrganizationName(organizationId);

   const result= verifyEmailDomain(email,organizationName);
   console.log(result);
    if(!result){
         res.status(500).send({error:"Email domain does not match organization name"});
         return;
    }
   try {
        const {message,error} = await addEmployee(organizationId, name, email, password, salary, position, contact, dateOfBirth, department, employeeId, allowances, leaves);
        if(message){
            res.status(200).json({message:message}).send();
        }
        else if(error){
            res.status(500).send({error:error});
        }
    } catch (error) {
        res.status(500).send({error:error.message});
    }
})
module.exports=router;
