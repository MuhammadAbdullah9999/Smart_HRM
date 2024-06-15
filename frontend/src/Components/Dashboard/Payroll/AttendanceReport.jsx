import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const generateAttendanceReport = (data) => {
  const workbook = XLSX.utils.book_new();
  const currentYear = new Date().getFullYear();

  const headers = ["Employee ID", "Employee Name", "Email", "Days Present", "Days Absent", "Year"];

  const worksheetData = [headers];
  let totalDaysPresent = 0;
  let totalDaysAbsent = 0;

  if (Array.isArray(data)) {
    data.forEach((employee) => {
      const daysPresent = employee.attendance.filter(entry => entry.attendanceStatus === 'present').length;
      const daysAbsent = employee.attendance.filter(entry => entry.attendanceStatus === 'absent').length;
      
      totalDaysPresent += daysPresent;
      totalDaysAbsent += daysAbsent;

      worksheetData.push([
        employee.employeeId,
        employee.employeeName,
        employee.email,
        daysPresent,
        daysAbsent,
        currentYear,
      ]);
    });

    // Push total days present and absent to the end of the worksheet data
    worksheetData.push(["Total", "", "", totalDaysPresent, totalDaysAbsent, ""]);
  }

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  XLSX.utils.book_append_sheet(workbook, worksheet, `Attendance ${currentYear}`);
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, `Attendance_${currentYear}.xlsx`);
};
