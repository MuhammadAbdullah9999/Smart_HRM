import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const generateDeductionsReport = (data) => {
  const workbook = XLSX.utils.book_new();
  const currentYear = new Date().getFullYear();

  const headers = [
    // "Employee ID",
    "Employee Name",
    "Email",
    "Total Deductions",
    "Year",
  ];

  const worksheetData = [headers];
  if (Array.isArray(data)) {
    data.forEach((employee) => {
      worksheetData.push([
        // employee.employeeId,
        employee.employeeName,
        employee.email,
        employee.deductions.total,
        currentYear,
      ]);
    });
  }

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    `Deductions ${currentYear}`
  );
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, `Deductions_${currentYear}.xlsx`);
};
