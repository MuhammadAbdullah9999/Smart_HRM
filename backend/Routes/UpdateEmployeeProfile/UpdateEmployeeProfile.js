const express = require('express');

const router = express.Router();

// const { addBonus } = require('../../../Database/Payroll/Bonus/addBonus');
const {addBonus}=require('../../Database/Payroll/Bonus/addBonus')
const {addAllowances}=require('../../Database/Allowances/AddAllowances')
const {addDeductionToEmployee}=require('../../Database/Payroll/Deduction/deduction')
router.post('/', async (req, res) => {

   const {medicalAllowance,homeAllowance,transportAllowance,employeeId,bonus,month ,year,deduction}=req.body;
  try{
   await addAllowances(employeeId, medicalAllowance.allowanceType, medicalAllowance.amount);
   await addAllowances(employeeId, homeAllowance.allowanceType, homeAllowance.amount);
   await addAllowances(employeeId, transportAllowance.allowanceType, transportAllowance.amount);
   await addBonus(employeeId, bonus.bonusReason,  month, year,bonus.amount);
   await addDeductionToEmployee(employeeId, month, year, deduction.deductionReason, deduction.amount);
   res.status(200).send("Employee Profile Updated")
   
  }catch(error){
   res.status(500).send("Error Updating Employee Profile",error);
  }
   
});

module.exports = router;