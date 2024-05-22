import React from "react";
import Sidebar from "../Sidebar";
import CeoSidebar from "../../Ceo/Dashboard/CeoSidebar";
import RemoveRedEyeRoundedIcon from "@mui/icons-material/RemoveRedEyeRounded";
import DashboardOverview from "../DashboardOverview";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import {
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function Payroll() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [payrollData, setPayrollData] = useState(null);
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
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = new Intl.DateTimeFormat("en-US", {
          month: "long",
        }).format(currentDate);

        const response = await axios.post("http://localhost:5000/Payroll", {
          organizationId: organizationId,
          year: currentYear,
          month: currentMonth,
          userType: data.userType,
        });

        window.confirm(response.data.message);
        setPayrollData(response.data.data);

        console.log("Payroll generated successfully!", response.data);
      } catch (error) {
        console.error("Error generating payroll:", error.message);
      }
    }
  };

  const handleDownloadPayroll = () => {
    const workbook = XLSX.utils.book_new();
    const currentYear = new Date().getFullYear();

    // Collect all unique allowance types
    const allowanceTypes = new Set();
    payrollData.forEach((employee) => {
      employee.allowances.details.forEach((allowance) => {
        allowanceTypes.add(allowance.type);
      });
    });

    // Convert set to array
    const uniqueAllowanceTypes = Array.from(allowanceTypes);

    // Generate headers
    const headers = [
      "Employee ID",
      "Employee Name",
      "Email",
      "Salary",
      "Total Allowances",
      ...uniqueAllowanceTypes.map((type) => `Allowance - ${type}`),
      "Deductions",
      "Total Pay",
      "Month",
      "Year",
    ];

    // Generate worksheet data
    const worksheetData = [headers];
    payrollData.forEach((employee) => {
      const allowanceAmounts = uniqueAllowanceTypes.map((type) => {
        const allowance = employee.allowances.details.find(
          (a) => a.type === type
        );
        return allowance ? allowance.amount : 0;
      });

      worksheetData.push([
        employee.employeeId,
        employee.employeeName,
        employee.email,
        employee.salary,
        employee.allowances.total,
        ...allowanceAmounts,
        employee.deductions.total,
        employee.totalPay,
        employee.month,
        employee.year,
      ]);
    });

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, `Payroll ${currentYear}`);
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `Payroll_${currentYear}.xlsx`);
  };

  return (
    <div className="flex w-full gap-4">
      {data && data.userType === "business_owner" ? (
        <CeoSidebar></CeoSidebar>
      ) : (
        <Sidebar></Sidebar>
      )}
      <div className="w-full m-4">
        <DashboardOverview pageName="Payroll"></DashboardOverview>
        <div className="my-4">
          <button
            onClick={handleGeneratePayrollClick}
            className="bg-bg-color px-3 py-2 rounded-3xl text-white mb-4 border-none font-semibold text-center cursor-pointer transition duration-400 hover:shadow-lg hover:shadow-gray-400 active:transform active:scale-97 active:shadow-lg"
          >
            Generate Payroll
          </button>
          {payrollData && (
            <button
              onClick={handleDownloadPayroll}
              className="bg-green-500 px-3 py-2 ml-4 rounded-3xl text-white border-none font-semibold text-center cursor-pointer transition duration-400 hover:shadow-lg hover:shadow-gray-400 active:
              transform active:scale-97 active:shadow-lg"
            >
              Download Payroll
            </button>
          )}
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
                  Salary
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
