import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const generateAllowancesReport = (data) => {
  const workbook = XLSX.utils.book_new();
  const currentYear = new Date().getFullYear();

  const allowanceTypes = new Set();
  if (Array.isArray(data)) {
    data.forEach((employee) => {
      if (Array.isArray(employee.allowances.details)) {
        employee.allowances.details.forEach((allowance) => {
          allowanceTypes.add(allowance.type);
        });
      }
    });
  }

  const uniqueAllowanceTypes = Array.from(allowanceTypes);

  const headers = [
    // "Employee ID",
    "Employee Name",
    "Email",
    "Total Allowances",
    ...uniqueAllowanceTypes.map((type) => `Allowance - ${type}`),
    "Year",
  ];

  const worksheetData = [headers];
  if (Array.isArray(data)) {
    data.forEach((employee) => {
      const allowanceAmounts = uniqueAllowanceTypes.map((type) => {
        const allowance = Array.isArray(employee.allowances.details)
          ? employee.allowances.details.find((a) => a.type === type)
          : null;
        return allowance ? allowance.amount : 0;
      });
console.log(data)
      worksheetData.push([
        // employee.employeeId,
        employee.employeeName,
        employee.email,
        employee.allowances.total,
        ...allowanceAmounts,
        currentYear,
      ]);
    });
  }

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  XLSX.utils.book_append_sheet(workbook, worksheet, `Allowances ${currentYear}`);
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, `Allowances_${currentYear}.xlsx`);
};
