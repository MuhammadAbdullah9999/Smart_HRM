import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const generatePastEmployeesReport = (data) => {
  const workbook = XLSX.utils.book_new();
  const currentYear = new Date().getFullYear();

  const headers = [
    "Employee ID",
    "Employee Name",
    "Department",
    "position",
    "Contact",
    "Email",
    // "User Type",
    "Salary",
    "Date of Termination",
    // "Reason for Termination",
    // "Remarks",
  ];

  const worksheetData = [headers];
  if (Array.isArray(data)) {
    data.forEach((employee) => {
      worksheetData.push([
        employee.employeeId,
        employee.name,
        employee.department,
        employee.position,
        employee.contact,
        employee.email,
        // employee.userType,
        employee.salary,
        employee.terminationDate,
        // employee.terminationReason,
      ]);
    });
  }

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  XLSX.utils.book_append_sheet(workbook, worksheet, `Past Employees ${currentYear}`);
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, `Past_Employees_${currentYear}.xlsx`);
};
