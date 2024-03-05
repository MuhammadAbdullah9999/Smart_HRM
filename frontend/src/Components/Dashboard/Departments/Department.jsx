import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Sidebar from "../Sidebar";
import DashboardOverview from "../DashboardOverview";
import InputField from "../../Styles/InputField";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, Typography } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddRoundedIcon from '@mui/icons-material/AddRounded';

function Department() {
  const [departments, setDepartments] = useState([]);
  const [newDepartment, setNewDepartment] = useState("");
  const employeeData = useSelector((state) => state.EmployeeData);

  useEffect(() => {
    const uniqueDepartments = [
      ...new Set(
        employeeData.employeeData.map((employee) => employee.department)
      ),
    ];
    setDepartments(uniqueDepartments);
  }, [employeeData.employeeData]);

  const countEmployeesByDepartment = (department) => {
    return employeeData.employeeData.filter(
      (employee) => employee.department === department
    ).length;
  };

  const handleAddDepartment = () => {
    setDepartments([...departments, newDepartment]);
    setNewDepartment("");
  };

  const handleEditDepartment = (department) => {
    // Implement edit functionality
    console.log(`Editing ${department}`);
  };

  const handleDeleteDepartment = (department) => {
    // Implement delete functionality
    console.log(`Deleting ${department}`);
  };

  return (
    <div className="flex">
      <Sidebar></Sidebar>
      <div className="flex-1 p-6">
        <DashboardOverview pageName="Departments"></DashboardOverview>
        <div className="flex flex-col gap-12 justify-center items-left">
          <div className="w-10/12 md:w-11/12 mt-5 shadow-md shadow-gray-200 cursor-pointer border border-gray-200">
            <TableContainer component={Paper}>
              <Table className="min-w-full">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">
                      <Typography variant="subtitle1" style={{fontFamily: 'Montserrat',fontWeight:'bold'}}>Department</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="subtitle1" style={{fontFamily: 'Montserrat',fontWeight:'bold'}}>Number of Employees</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="subtitle1" style={{fontFamily: 'Montserrat',fontWeight:'bold'}}>Edit</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="subtitle1" style={{fontFamily: 'Montserrat',fontWeight:'bold'}}>Delete</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {departments.map((dept) => (
                    <TableRow key={dept} className="text-center">
                      <TableCell align="center">
                        <Typography variant="body1" style={{fontFamily: 'Montserrat'}}>{dept}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body1" style={{fontFamily: 'Montserrat'}}>{countEmployeesByDepartment(dept)}</Typography>
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
          </div>




          <div className="bg-gray-100 rounded-xl p-4 w-10/12 md:w-11/12 shadow-md shadow-gray-200">
            <h2 className="text-xl font-bold m-2">Add Department</h2>
            <div className="flex items-center mt-5 mb-8">
              <input
                label="New Department"
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
                className="bg-bg-color text-white p-2 rounded-full cursor-pointer hover:bg-blue-800 flex items-center"
                style={{ fontSize: '0.4rem', padding: '0.4rem' }}
              >
                <AddRoundedIcon />
              </div>
            </div>
          </div>

          {/* <div className="w-full lg:w-8/12 h-full">
              <InputField
                label="New Department"
                type="text"
                id="department"
                name="department"
                value={newDepartment}
                autoComplete="off"
                onChange={(e) => setNewDepartment(e.target.value)}
              />
            </div>
            <div className="text-center">
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddDepartment}
              >
                Add
              </Button>
            </div> */}
    
      </div>
    </div>
    </div >
  );
}

export default Department;
