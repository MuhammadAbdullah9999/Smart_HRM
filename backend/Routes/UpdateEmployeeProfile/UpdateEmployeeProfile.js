const express = require('express');

const router = express.Router();

// const { addBonus } = require('../../../Database/Payroll/Bonus/addBonus');
const {addBonus}=require('../../Database/Payroll/Bonus/addBonus')
const {addAllowances}=require('../../Database/Allowances/AddAllowances')
const {addDeductionToEmployee}=require('../../Database/Payroll/Deduction/deduction')
router.post('/', async (req, res) => {
   const {inputValues}=req.body;
   console.log(req.body);
   res.send('ok');
});

module.exports = router;