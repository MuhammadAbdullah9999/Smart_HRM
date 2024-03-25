import React from "react";
import Sidebar from "../Sidebar";
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

function Payroll() {
  const navigate=useNavigate();
  const [employees, setEmployees] = useState([]);
  const data = useSelector((state) => state.EmployeeData);
const organizationId=data.user.organizationId;

useEffect(() => {
    // console.log("employees");
    // console.log(data.employeeData);
    setEmployees(data.employeeData);
  }, [data.employeeData]);

  const handleViewClick = (employeeId) => {
    // Handle view click logic here
    console.log(`View button clicked for employeeId: ${employeeId}`);
    navigate(`/dashboard/Employees/EmployeeProfile/${employeeId}`)
  };

  const handleGeneratePayrollClick = async () => {
    const confirmGenerate = window.confirm("Are you sure you want to generate payroll?");
    
    if (confirmGenerate) {
      try {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = new Intl.DateTimeFormat("en-US", { month: "long" }).format(currentDate);
  
        const response = await axios.post('http://localhost:5000/Payroll', {
          organizationId: organizationId,
          year: currentYear,
          month: currentMonth
        });
        
        const responseMessage = window.confirm(response.data.message);


        console.log('Payroll generated successfully!', response.data);
      } catch (error) {
        console.error('Error generating payroll:', error.message);
      }
    }
  };
  

  return (
    <div className="flex w-full gap-4">
      <Sidebar></Sidebar>
      <div className="w-full m-4">
        <DashboardOverview pageName="Payroll"></DashboardOverview>
        <div className="my-4">
          <button
            onClick={handleGeneratePayrollClick}
            className="p-2 bg-bg-color hover:bg-blue-700 active:bg-gray-200 active:text-bg-color text-white rounded-lg"
          >
            Generate Payroll
          </button>
        </div>
        <TableContainer
          component={Paper}
          style={{
            maxHeight: "53%",
            overflowY: "auto",
            border: "1px solid black", // 1-pixel black border
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Employee Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Department</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Salary</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((employee, index) => (
                <TableRow
                  key={employee.id}
                  sx={{
                    backgroundColor: index % 2 === 1 ? "#f5f5f5" : "inherit",
                  }}
                >
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{employee.salary}</TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleViewClick(employee._id)}
                      className="bg-bg-color hover:bg-blue-700 active:bg-gray-200 active:text-bg-color text-white p-2 px-4 rounded-lg cursor-pointer "
                    >
                      View
                    </button>
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
