const express = require('express');

const router = express.Router();
const {getCeoAndEmployee}=require('../../Database/GetOrganizationData/getCeoAndEmployee')
const {addBonus}=require('../../Database/Payroll/Bonus/addBonus')
const {addAllowances}=require('../../Database/Allowances/AddAllowances')
const {addDeductionToEmployee}=require('../../Database/Payroll/Deduction/deduction');
const {getHrAndEmployee}=require('../../Database/GetOrganizationData/GetHRandEmployee');
const { connectToMongoDB, closeMongoDBConnection } = require("../../Database/connectDB");
const {ObjectId}=require('mongodb');

router.post('/', async (req, res) => {
console.log(req.body)
   const {medicalAllowance,homeAllowance,transportAllowance,employeeId,bonus,month ,year,deduction,email,organizationId,userType}=req.body;
  try{
   await addAllowances(employeeId, medicalAllowance.allowanceType, medicalAllowance.amount,userType);
   await addAllowances(employeeId, homeAllowance.allowanceType, homeAllowance.amount,userType);
   await addAllowances(employeeId, transportAllowance.allowanceType, transportAllowance.amount,userType);
   await addBonus(employeeId, bonus.bonusReason,  month, year,bonus.amount,userType);
   await addDeductionToEmployee(employeeId, month, year, deduction.deductionReason, deduction.amount,userType);
   
   const db = await connectToMongoDB();
   const organizationCollection = db.collection("Organizations");
   const organization = await organizationCollection.findOne({ _id: new ObjectId(organizationId) });

   if(userType==='HR'){

    const { userType, user, employeeData, totalLeavesRequestPending, departments } = await getHrAndEmployee(email, organizationId);
    res.status(200).json({ userType, user, employeeData, totalLeavesRequestPending, departments,organizationName:organization.name })

   }
   else{
    const {userType,user,employeeData,noOfEmployees,noOfDepartments,noOfHRs}=await getCeoAndEmployee(email,organizationId)
    res.status(200).json({userType, user, employeeData, noOfEmployees, noOfDepartments, noOfHRs,organizationName:organization.name })
   }

   
  }catch(error){
   res.status(500).send("Error Updating Employee Profile",error);
  }
   
});

module.exports = router;