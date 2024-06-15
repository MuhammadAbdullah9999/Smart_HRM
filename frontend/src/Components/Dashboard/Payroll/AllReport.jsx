import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const generateAllReport = (data) => {
  console.log(data)
  const workbook = XLSX.utils.book_new();
  const currentYear = new Date().getFullYear();

  // Define headers for the report
  const headers = [
    "Employee Name",
    "Email",
    "Employee Type",
    "Salary",
    "Month",
    "Year",
    "Bonus",
    "Allowances Total",
    "Medical Allowance",
    "Other Allowance 1",
    "Other Allowance 2",
    "Deductions Total",
    "Total Pay",
  ];

  // Initialize the worksheet data with headers
  const worksheetData = [headers];

  // Process each employee's data
  if (Array.isArray(data)) {
    data.forEach((employee) => {
      const allowancesDetails = employee.allowances.details || [];
      const deductionsDetails = employee.deductions.types || [];

      // Map allowances and deductions to their respective types and amounts
      const allowanceAmounts = allowancesDetails.map((allowance) => allowance ? allowance.amount : 0);
      const deductionAmounts = deductionsDetails.map((deduction) => deduction ? deduction.amount : 0);

      // Ensure the allowance amounts array has exactly 3 items
      while (allowanceAmounts.length < 3) {
        allowanceAmounts.push(0);
      }

      // Add employee data to the worksheet
      worksheetData.push([
        employee.employeeName,
        employee.email,
        employee.employeeType,
        employee.salary,
        employee.month,
        employee.year,
        employee.bonus,
        employee.allowances.total,
        ...allowanceAmounts.slice(0, 3), // Use only the first three allowances
        employee.deductions.total,
        employee.totalPay,
      ]);
    });
  }

  // Create worksheet and append it to the workbook
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  XLSX.utils.book_append_sheet(workbook, worksheet, `Employee Report ${currentYear}`);
  
  // Write the workbook to a file
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, `Employee_Report_${currentYear}.xlsx`);
};

// Sample data for testing
// const sampleData = [
//   {
//     _id: "665037ceeaf659f23db460d1",
//     organizationId: "65a53b5d22ee796e64aa8e1f",
//     organizationName: "devsinc",
//     employeeId: "65a6da2b7055f2c5966cf8dc",
//     employeeName: "muhammad",
//     email: "hafizabdullah09090@gmail.com",
//     employeeType: "Employee",
//     salary: 130000,
//     month: "May",
//     year: 2024,
//     totalPay: 140201,
//     bonus: 0,
//     allowances: {
//       total: 11000,
//       details: [
//         { type: "Medical", amount: 5000 },
//         { type: "Other", amount: 3000 },
//         { type: "Other", amount: 3000 }
//       ]
//     },
//     deductions: {
//       total: 799,
//       types: [{ type: "Tax", amount: 799 }]
//     },
//     bonuses: {
//       types: [{ type: null }]
//     }
//   }
// ];

// // Generate the report
// generateAllReport(sampleData);
