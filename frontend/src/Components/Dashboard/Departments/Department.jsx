import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Sidebar from "../Sidebar";
import DashboardOverview from "../DashboardOverview";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useDispatch } from "react-redux";
import { setEmployeeData } from "../../../state";

function Department() {
  const dispatch=useDispatch();

  const [departments, setDepartments] = useState([]);
  const [newDepartment, setNewDepartment] = useState("");
  const employeeData = useSelector((state) => state.EmployeeData.EmployeeData);
  console.log(employeeData)
  useEffect(() => {
    const getDepartments=async()=>{
      const response=await axios.get(`http://localhost:5000/Departments/GetDepartments/${employeeData.user.organizationId}`);
      console.log(response)
    }
    getDepartments();
    // const uniqueDepartments = new Set(
    //   employeeData.employeeData.map((employee) => employee.department)
    // );
    // setDepartments([...uniqueDepartments]);
    setDepartments(employeeData.departments.uniqueDepartmentsArray)
  }, [employeeData.employeeData]);

  const countEmployeesByDepartment = (department) => {
    console.log(departments)
    return employeeData.employeeData.filter(
      (employee) => employee.department === department
    ).length;
  };

  const handleAddDepartment = async () => {
    if (!newDepartment.trim()) return; // Prevent adding empty departments
    try {
      const response = await axios.post(
        "http://localhost:5000/Departments/AddDepartment",
        {
          organizationId: employeeData.user.organizationId,
          department: newDepartment,
        }
      );
      console.log(response.data.departments);
      dispatch(setEmployeeData({ 
        ...employeeData, 
        departments: { 
            ...employeeData.departments, 
            uniqueDepartmentsArray: response.data.departments 
        } 
    }));
      setDepartments([...departments, newDepartment]);
      setNewDepartment("");
    } catch (error) {
      console.error("Error adding department:", error);
    }
  };

  const handleDeleteDepartment = async (department) => {
    try {
      const response = await axios.delete(`/api/departments/${department}`);
      setDepartments(departments.filter((dept) => dept !== department));
    } catch (error) {
      console.error("Error deleting department:", error);
    }
  };

  const handleEditDepartment = (department) => {
    // Future implementation for edit functionality
    console.log(`Editing ${department}`);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <DashboardOverview pageName="Departments" />
        <div className="flex flex-col gap-12 justify-center items-left">
          {/* Department table */}
          <TableContainer component={Paper}>
            <Table className="min-w-full">
              <TableHead>
                <TableRow>
                  <TableCell align="center">
                    <Typography
                      variant="subtitle1"
                      style={{ fontFamily: "Montserrat", fontWeight: "bold" }}
                    >
                      Department
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography
                      variant="subtitle1"
                      style={{ fontFamily: "Montserrat", fontWeight: "bold" }}
                    >
                      Number of Employees
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography
                      variant="subtitle1"
                      style={{ fontFamily: "Montserrat", fontWeight: "bold" }}
                    >
                      Edit
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography
                      variant="subtitle1"
                      style={{ fontFamily: "Montserrat", fontWeight: "bold" }}
                    >
                      Delete
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {departments.map((dept) => (
                  <TableRow key={dept} className="text-center">
                    <TableCell align="center">
                      <Typography
                        variant="body1"
                        style={{ fontFamily: "Montserrat" }}
                      >
                        {dept}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography
                        variant="body1"
                        style={{ fontFamily: "Montserrat" }}
                      >
                        {countEmployeesByDepartment(dept)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => handleEditDepartment(dept)}
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => handleDeleteDepartment(dept)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Add department section */}
          <div className="bg-gray-100 rounded-xl p-4 w-10/12 md:w-11/12 shadow-md shadow-gray-200">
            <h2 className="text-xl font-bold m-2">Add Department</h2>
            <div className="flex items-center mt-5 mb-8">
              <input
                type="text"
                id="department"
                name="department"
                value={newDepartment}
                autoComplete="off"
                onChange={(e) => setNewDepartment(e.target.value)}
                placeholder="Enter new department..."
                className="mr-5 h-10 p-3 border rounded-xl outline-none w-2/4"
              />
              <div
                onClick={handleAddDepartment}
                className={`bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-800 flex items-center ${
                  !newDepartment.trim() ? "opacity-50 cursor-not-allowed" : ""
                }`}
                style={{ fontSize: "0.4rem", padding: "0.4rem" }}
                disabled={!newDepartment.trim()}
              >
                <AddRoundedIcon />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Department;
