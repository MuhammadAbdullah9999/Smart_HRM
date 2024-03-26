import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import { useSelector } from "react-redux";
import AddIcon from '@mui/icons-material/Add';
import EmployeeCard from "../../Styles/EmployeeCard";
import DashboardOverview from "../DashboardOverview";
import InputField from "../../Styles/InputField";
import EnhancedTable from "../../Styles/Table";
import { Link } from "react-router-dom";
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const data = useSelector((state) => state.EmployeeData);

  useEffect(() => {
    console.log("employees");
    console.log(data.employeeData);
    setEmployees(data.employeeData);
  }, [data.employeeData]);

  const filteredEmployees = employees.filter((employee) => {
    const nameMatch = employee.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const departmentMatch = employee.department
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return nameMatch || departmentMatch;
  });

  return (
    <div className="flex">
      <div className="fixed">
        <Sidebar />
      </div>
      <div className="flex flex-col md:ml-72 w-full">
        <div className="sm:ml-20 md:ml-0 w-full pr-8 mt-6">
          <DashboardOverview pageName="Employees" />

          <div className="flex justify-between rounded-md w-full my-3">

            <div className="flex items-center w-3/4">
              <input
                label="Search Employee"
                type="text"
                id="Search"
                name="Search"
                value={searchTerm}
                autoComplete="off"
                onChange={(e) => setSearchTerm(e.target.value)}
                top="3"
                placeholder="Search"
                className="mr-5 h-10 p-3 border rounded-xl outline-none w-2/4"
              />
              <div

                className="bg-bg-color text-white p-2 rounded-full cursor-pointer hover:bg-blue-800 flex items-center"
                style={{ fontSize: '0.4rem', padding: '0.4rem' }}
              >
                <SearchRoundedIcon />
              </div>
            </div>




            <div className="flex items-center">
              <Link to='/dashboard/Employees/AddEmployee'><button
                className="bg-bg-color px-3 py-2 rounded-3xl border-none font-bold text-center cursor-pointer transition duration-400 hover:shadow-lg hover:shadow-gray-400 active:transform active:scale-97 active:shadow-lg"
              >
                <AddIcon className="inline-block" style={{ color: 'white' }} />
                <span className="ml-2 text-white">Add Employee</span>
              </button>
              </Link>
            </div>


          </div>
        </div>


        <div className="flex justify-center gap-8 h-full w-full p-4 flex-wrap">
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map((employee, index) => (
              <div className="w-72" key={index}>
                <EmployeeCard
                  Id={index + 1}
                  Name={employee.name}
                  Department={employee.department}
                  Contact={employee.contact}
                  EmailText={employee.email}
                  employeeId={employee._id}
                // Image={employee.image}
                />
              </div>
            ))
          ) : (
            <p>No employees found</p>
          )}
        </div>

        {/* <div className="mr-4">
       
          <EnhancedTable employeeData={filteredEmployees}></EnhancedTable>
        </div> */}
      </div>
    </div>
  );
}

export default Employees;
