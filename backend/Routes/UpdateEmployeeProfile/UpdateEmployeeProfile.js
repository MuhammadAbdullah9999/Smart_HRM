const express = require('express');

const router = express.Router();

// const { addBonus } = require('../../../Database/Payroll/Bonus/addBonus');
const {addBonus}=require('../../Database/Payroll/Bonus/addBonus')
const {addAllowances}=require('../../Database/Allowances/AddAllowances')
const {addDeductionToEmployee}=require('../../Database/Payroll/Deduction/deduction');
const {getHrAndEmployee}=require('../../Database/GetOrganizationData/GetHRandEmployee');
router.post('/', async (req, res) => {
console.log(req.body)
   const {medicalAllowance,homeAllowance,transportAllowance,employeeId,bonus,month ,year,deduction,email,organizationId}=req.body;
  try{
   await addAllowances(employeeId, medicalAllowance.allowanceType, medicalAllowance.amount);
   await addAllowances(employeeId, homeAllowance.allowanceType, homeAllowance.amount);
   await addAllowances(employeeId, transportAllowance.allowanceType, transportAllowance.amount);
   await addBonus(employeeId, bonus.bonusReason,  month, year,bonus.amount);
   await addDeductionToEmployee(employeeId, month, year, deduction.deductionReason, deduction.amount);

   const { userType, user, employeeData, totalLeavesRequestPending, departments } = await getHrAndEmployee(email, organizationId);

   res.status(200).json({ userType, user, employeeData, totalLeavesRequestPending, departments })
   
  }catch(error){
   res.status(500).send("Error Updating Employee Profile",error);
  }
   
});

module.exports = router;