import React from "react";
import Sidebar from "../Sidebar";
import CeoSidebar from "../../Ceo/Dashboard/CeoSidebar";
import RemoveRedEyeRoundedIcon from '@mui/icons-material/RemoveRedEyeRounded';
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
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const data = useSelector((state) => state.EmployeeData.EmployeeData);
  const organizationId = data.userType === 'business_owner' ? data.user._id : data.user.organizationId;

  useEffect(() => {
    // console.log("employees");
    // console.log(data.userType);
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
          month: currentMonth,
          userType: data.userType
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
      {data && data.userType === "business_owner" ? (
        <CeoSidebar></CeoSidebar>
      ) : (
        <Sidebar></Sidebar>
      )}      <div className="w-full m-4">
        <DashboardOverview pageName="Payroll"></DashboardOverview>
        <div className="my-4">
          <button
            onClick={handleGeneratePayrollClick}
            className="bg-bg-color px-3 py-2 rounded-3xl text-white mb-4 border-none font-semibold text-center cursor-pointer transition duration-400 hover:shadow-lg hover:shadow-gray-400 active:transform active:scale-97 active:shadow-lg"
          >
            Generate Payroll
          </button>
        </div>
        <TableContainer
          component={Paper}
          style={{
            maxHeight: "53%",
            border: "1px solid #cccccc",
          }}
        >
          <Table>
            <TableHead sx={{ position: "sticky", top: 0, zIndex: 10, backgroundColor: "#fff"}}>
              <TableRow >
                <TableCell sx={{ fontWeight: "bold", fontFamily: "Montserrat", fontSize: "15px" }}>Employee Name</TableCell>
                <TableCell sx={{ fontWeight: "bold", fontFamily: "Montserrat", fontSize: "15px" }}>Department</TableCell>
                <TableCell sx={{ fontWeight: "bold", fontFamily: "Montserrat", fontSize: "15px" }}>Salary</TableCell>
                <TableCell sx={{ fontWeight: "bold", fontFamily: "Montserrat", fontSize: "15px" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className="overflow-y-auto" >
              {employees.map((employee, index) => (
                <TableRow className="flex justify-center items-center"
                  key={employee.id}
                  sx={{
                    backgroundColor: index % 2 === 1 ? "#f5f5f5" : "inherit",
                  }}
                >
                  <TableCell sx={{ fontFamily: "Montserrat" }}>{employee.name}</TableCell>
                  <TableCell sx={{ fontFamily: "Montserrat" }}>{employee.department}</TableCell>
                  <TableCell sx={{ fontFamily: "Montserrat" }}>{employee.salary}</TableCell>
                  <TableCell>
                    <RemoveRedEyeRoundedIcon style={{ color: "blue", cursor: "pointer" }} onClick={() => handleViewClick(employee._id)}></RemoveRedEyeRoundedIcon>
                    {/* <button
                      onClick={() => handleViewClick(employee._id)}
                      className="bg-bg-color hover:bg-blue-700 active:bg-gray-200 active:text-bg-color text-white p-2 px-4 rounded-2xl cursor-pointer "
                    >
                      View
                    </button> */}
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
