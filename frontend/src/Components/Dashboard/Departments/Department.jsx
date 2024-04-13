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
import CircularProgress from '@mui/material/CircularProgress';

function Department() {
  const dispatch = useDispatch();
  const [departments, setDepartments] = useState([]);
  const [newDepartment, setNewDepartment] = useState("");
  const [loading, setLoading] = useState(false);

  const employeeData = useSelector((state) => state.EmployeeData.EmployeeData);

  useEffect(() => {
    const getDepartments = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/Departments/GetDepartments/${employeeData.user.organizationId}`);
        setDepartments(response.data.departments);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };
    // getDepartments();
    setDepartments(employeeData.departments.uniqueDepartmentsArray)
  }, [employeeData.user.organizationId]);

  const countEmployeesByDepartment = (department) => {
    return employeeData.employeeData.filter(
      (employee) => employee.department.toLowerCase() === department.toLowerCase()
    ).length;
  };
  
  const handleAddDepartment = async () => {
    if (!newDepartment.trim()) return; // Prevent adding empty departments
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/Departments/AddDepartment",
        {
          organizationId: employeeData.user.organizationId,
          department: newDepartment,
        }
      );
      setLoading(false);
      dispatch(setEmployeeData({
        ...employeeData,
        departments: {
          ...employeeData.departments,
          uniqueDepartmentsArray: response.data.departments
        }
      }));
      setDepartments(response.data.departments);
      setNewDepartment("");
    } catch (error) {
      console.error("Error adding department:", error);
    }
  };

  const handleDeleteDepartment = async (department) => {
    try {
      const employeesInDepartment = employeeData.employeeData.filter(
        (employee) => employee.department === department
      );

      if (employeesInDepartment.length > 0) {
        alert(`Department '${department}' cannot be deleted as it has ${employeesInDepartment.length} employee(s).`);
      } else {
        setLoading(true);
        const response = await axios.delete(`http://localhost:5000/Departments/DeleteDepartment/${employeeData.user.organizationId}/${department}`);
        setLoading(false);
        dispatch(setEmployeeData({
          ...employeeData,
          departments: {
            ...employeeData.departments,
            uniqueDepartmentsArray: response.data.departments
          }
        }));
        setDepartments(response.data.departments);
      }
    } catch (error) {
      console.error("Error deleting department:", error);
    }
  };

  const handleEditDepartment = (department) => {
    // Future implementation for edit functionality
    console.log(`Editing ${department}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAddDepartment();
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <DashboardOverview pageName="Departments" />
        <div className="flex flex-col gap-12 justify-center items-left">
          <TableContainer component={Paper}>
            <Table className="min-w-full">
              <TableHead>
                <TableRow>
                  <TableCell align="center">
                    <Typography variant="subtitle1" style={{ fontFamily: "Montserrat", fontWeight: "bold" }}>
                      Department
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="subtitle1" style={{ fontFamily: "Montserrat", fontWeight: "bold" }}>
                      Number of Employees
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="subtitle1" style={{ fontFamily: "Montserrat", fontWeight: "bold" }}>
                      Edit
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="subtitle1" style={{ fontFamily: "Montserrat", fontWeight: "bold" }}>
                      Delete
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {departments.map((dept) => (
                  <TableRow key={dept} className="text-center">
                    <TableCell align="center">
                      <Typography variant="body1" style={{ fontFamily: "Montserrat" }}>
                        {dept}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body1" style={{ fontFamily: "Montserrat" }}>
                        {countEmployeesByDepartment(dept)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton color="primary" onClick={() => handleEditDepartment(dept)}>
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton color="primary" onClick={() => handleDeleteDepartment(dept)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Add Department Section */}
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
                onKeyDown={handleKeyDown} 
                placeholder="Enter new department..."
                className="mr-5 h-10 p-3 border rounded-xl outline-none w-2/4"
              />
              <div
                onClick={handleAddDepartment}
                className={`bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-800 flex items-center ${!newDepartment.trim() ? "opacity-50 cursor-not-allowed" : ""}`}
                style={{ fontSize: "0.4rem", padding: "0.4rem" }}
                disabled={!newDepartment.trim()}
              >
                <AddRoundedIcon />
              </div>
            </div>
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div className="absolute inset-0 backdrop-filter backdrop-blur-sm z-20 flex justify-center items-center">
              <CircularProgress style={{ color: 'blue' }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Department;
