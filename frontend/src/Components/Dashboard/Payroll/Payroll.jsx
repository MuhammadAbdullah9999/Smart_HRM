import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TextField,
  MenuItem,
} from "@mui/material";
import RemoveRedEyeRoundedIcon from "@mui/icons-material/RemoveRedEyeRounded";
import Sidebar from "../Sidebar";
import CeoSidebar from "../../Ceo/Dashboard/CeoSidebar";
import DashboardOverview from "../DashboardOverview";
import * as XLSX from 'xlsx';
import { generateBonusesReport } from "./BonusesReport";
import { generateAllowancesReport } from "./AllowancesReport";
import { generateDeductionsReport } from "./DeductionsReport";
import { generateAttendanceReport } from "./AttendanceReport";
import { generateAllReport } from "./AllReport";
import { generatePastEmployeesReport } from "./PastEmployees";

const months = [
  {value:"All Months",label:"All Months"},
  { value: "January", label: "January" },
  { value: "February", label: "February" },
  { value: "March", label: "March" },
  { value: "April", label: "April" },
  { value: "May", label: "May" },
  { value: "June", label: "June" },
  { value: "July", label: "July" },
  { value: "August", label: "August" },
  { value: "September", label: "September" },
  { value: "October", label: "October" },
  { value: "November", label: "November" },
  { value: "December", label: "December" },
];

const reportTypes = [
  { value: "past_employees", label: "Past Employees" },
  { value: "allowances", label: "Allowances" },
  { value: "deductions", label: "Deductions" },
  { value: "attendance", label: "Attendance" },
  { value: "bonuses", label: "Bonuses" },
  { value: "all", label: "All" },
];

function Payroll() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [payrollData, setPayrollData] = useState(null);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [payrollGenerated, setPayrollGenerated] = useState(false);

  const currentDate = new Date();
  const currentMonth = new Intl.DateTimeFormat("en-US", {
    month: "long",
  }).format(currentDate);
  const currentYear = currentDate.getFullYear();

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedReportType, setSelectedReportType] = useState("all");

  const data = useSelector((state) => state.EmployeeData.EmployeeData);
  const organizationId =
    data.userType === "business_owner"
      ? data.user._id
      : data.user.organizationId;

  useEffect(() => {
    setEmployees(data.employeeData);
  }, [data.employeeData]);

  const handleViewClick = (employeeId) => {
    navigate(`/dashboard/Employees/EmployeeProfile/${employeeId}`);
  };

  const handleGeneratePayrollClick = async () => {
    const confirmGenerate = window.confirm(
      "Are you sure you want to generate payroll?"
    );
    if (confirmGenerate) {
      try {
        const response = await axios.post("http://localhost:5000/Payroll", {
          organizationId: organizationId,
          year: currentYear,
          month: currentMonth,
          userType: data.userType,
        });

        window.confirm(response.data.message);
        setPayrollData(response.data.data);
        setPayrollGenerated(true);

        console.log("Payroll generated successfully!", response.data);
      } catch (error) {
        console.error("Error generating payroll:", error.message);
      }
    }
  };

  const handleGenerateReportClick = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/GenerateReport",
        {
          organizationId: organizationId,
          year: selectedYear,
          month: selectedMonth,
          reportType: selectedReportType,
          userType: data.userType,
        }
      );

      console.log(response.data);
      setPayrollData(response.data.data);

      switch (selectedReportType) {
        case "bonuses":
          generateBonusesReport(response.data.data);
          break;
        case "allowances":
          generateAllowancesReport(response.data.data);
          break;
        case "deductions":
          generateDeductionsReport(response.data.data);
          break;
        case "attendance":
          generateAttendanceReport(response.data.data);
          break;
          case "all":
          generateAllReport(response.data.data);
          break;
          case "past_employees":
            generatePastEmployeesReport(response.data.data);
            break;
        // Add more cases as needed for other report types
        default:
          console.error("Unknown report type");
      }
    } catch (error) {
      console.error("Error generating report:", error.message);
    }
  };


  const handleDownloadPayroll = () => {
    if (!payrollData || !payrollGenerated) return;

    // Format the data to include allowances, deductions, and bonuses
    const formattedPayrollData = payrollData.map(({ 
      employeeId, organizationId, attendance, _id, 
      allowances, deductions, bonuses, ...rest 
    }) => {
      // const formattedAllowances = allowances.details.map(item => `${item.type}: ${item.amount}`).join(", ");
      // const formattedDeductions = deductions.types.join(", ");
      // const formattedBonuses = bonuses.types.join(", ");
      return {
        ...rest,
        totalAllowances: allowances.total,
        totalDeductions: deductions.total,
        // totalBonuses: bonuses.total,
        // formattedAllowances,
        // formattedDeductions,
        // formattedBonuses
      };
    });

    const ws = XLSX.utils.json_to_sheet(formattedPayrollData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Payroll');

    XLSX.writeFile(wb, `Payroll_${currentMonth}_${currentYear}.xlsx`);
  };
  return (
    <div className="flex w-full gap-4">
      {data && data.userType === "business_owner" ? (
        <CeoSidebar />
      ) : (
        <Sidebar />
      )}
      <div className="w-full m-4">
        <DashboardOverview pageName="Payroll" />
        <div className="my-4 flex items-center">
          <button
            onClick={handleGeneratePayrollClick}
            className="bg-bg-color px-3 py-2 rounded-3xl text-white mb-4 border-none font-semibold text-center cursor-pointer transition duration-400 hover:shadow-lg hover:shadow-gray-400 active:transform active:scale-97 active:shadow-lg"
          >
            Generate Payroll
          </button>
          {payrollGenerated && ( // Show download button only if payroll is generated
            <button
              onClick={handleDownloadPayroll}
              className="bg-bg-color px-3 py-2 rounded-3xl text-white ml-4 mb-4 border-none font-semibold text-center cursor-pointer transition duration-400 hover:shadow-lg hover:shadow-gray-400 active:transform active:scale-97 active:shadow-lg"
            >
              Download Payroll
            </button>
          )}

          <div className="ml-auto flex items-center gap-4">
            <TextField
              select
              label="Report Type"
              value={selectedReportType}
              onChange={(e) => setSelectedReportType(e.target.value)}
              size="small"
              style={{ minWidth: "100px" }}
            >
              {reportTypes.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              size="small"
            >
              {months.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Year"
              type="number"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              size="small"
              style={{ width: "100px" }}
            />

            <button
              onClick={handleGenerateReportClick}
              className="bg-green-500 px-3 py-2 rounded-3xl text-white border-none font-semibold text-center cursor-pointer transition duration-400 hover:shadow-lg hover:shadow-gray-400 active:transform active:scale-97 active:shadow-lg"
            >
              Generate Report
            </button>
          </div>
        </div>
        <TableContainer
          component={Paper}
          style={{
            maxHeight: "53%",
            border: "1px solid #cccccc",
          }}
        >
          <Table>
            <TableHead
              sx={{
                position: "sticky",
                top: 0,
                zIndex: 10,
                backgroundColor: "#fff",
              }}
            >
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontFamily: "Montserrat",
                    fontSize: "15px",
                  }}
                >
                  Employee Name
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontFamily: "Montserrat",
                    fontSize: "15px",
                  }}
                >
                  Department
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontFamily: "Montserrat",
                    fontSize: "15px",
                  }}
                >
                  Base Salary
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontFamily: "Montserrat",
                    fontSize: "15px",
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody className="overflow-y-auto">
              {employees.map((employee, index) => (
                <TableRow
                  className="flex justify-center items-center"
                  key={employee.id}
                  sx={{
                    backgroundColor: index % 2 === 1 ? "#f5f5f5" : "inherit",
                  }}
                >
                  <TableCell sx={{ fontFamily: "Montserrat" }}>
                    {employee.name}
                  </TableCell>
                  <TableCell sx={{ fontFamily: "Montserrat" }}>
                    {employee.department}
                  </TableCell>
                  <TableCell sx={{ fontFamily: "Montserrat" }}>
                    {employee.salary}
                  </TableCell>
                  <TableCell>
                    <RemoveRedEyeRoundedIcon
                      style={{ color: "blue", cursor: "pointer" }}
                      onClick={() => handleViewClick(employee._id)}
                    ></RemoveRedEyeRoundedIcon>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default Payroll;
