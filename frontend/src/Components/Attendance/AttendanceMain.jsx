import React, { useEffect, useState } from "react";
import Sidebar from "../Dashboard/Sidebar";
import { useSelector } from "react-redux";
import AddIcon from "@mui/icons-material/Add";
import AttendanceCard from "../Styles/AttendanceCard";
import DashboardOverview from "../Dashboard/DashboardOverview";
import InputField from "../Styles/InputField";
import EnhancedTable from "../Styles/Table";
import { Link } from "react-router-dom";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CeoSidebar from "../Ceo/Dashboard/CeoSidebar";

function AttendanceMain() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const data = useSelector((state) => state.EmployeeData.EmployeeData);
  console.log(data.userType);

  useEffect(() => {
    setEmployees(data.employeeData);
    const currentMonth = new Date()
      .toLocaleString("default", { month: "long" })
      .toLowerCase();
    const updatedEmployees = data.employeeData.map((employee) => {
      const currentMonthAttendance =
        employee.attendance?.filter(
          (entry) => entry.month.toLowerCase() === currentMonth
        ) || [];

      const presentDays = currentMonthAttendance.filter(
        (entry) => entry.attendanceStatus.toLowerCase() === "present"
      ).length;
      const absentDays = currentMonthAttendance.filter(
        (entry) => entry.attendanceStatus.toLowerCase() === "absent"
      ).length;

      const totalDays = currentMonthAttendance.length;
      const attendancePercentage = (presentDays / totalDays) * 100;

      return {
        ...employee,
        presentDays,
        absentDays,
        attendancePercentage,
        currentMonth,
      };
    });

    setEmployees(updatedEmployees);
    setAttendanceData(updatedEmployees);
  }, [data.EmployeeData]);

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
        {data && data.userType === "business_owner" ? (
          <CeoSidebar></CeoSidebar>
        ) : (
          <Sidebar></Sidebar>
        )}
        {/* <Sidebar /> */}
      </div>
      <div className="flex flex-col md:ml-72 w-full">
        <div className="sm:ml-20 md:ml-0 w-full pr-8 mt-6">
          <DashboardOverview pageName="Attendance" />

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
                style={{ fontSize: "0.4rem", padding: "0.4rem" }}
              >
                <SearchRoundedIcon />
              </div>
            </div>

            <div className="flex items-center">
              <Link to="/dashboard/Employees/AddEmployee">
                <button className="bg-bg-color px-3 py-2 rounded-3xl border-none font-bold text-center cursor-pointer transition duration-400 hover:shadow-lg hover:shadow-gray-400 active:transform active:scale-97 active:shadow-lg">
                  <AddIcon
                    className="inline-block"
                    style={{ color: "white" }}
                  />
                  <span className="ml-2 text-white">Add Attendance</span>
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-8 h-full w-full p-4 flex-wrap">
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map((employee, index) => (
              <div className="w-72" key={index}>
                <AttendanceCard
                  Id={index + 1}
                  Name={employee.name}
                  Month={employee.currentMonth}
                  Percentage={employee.attendancePercentage}
                  employeeId={employee._id}
                  // Image={employee.image}
                />
              </div>
            ))
          ) : (
            <p>No employees attendance found</p>
          )}
        </div>

        {/* <div className="mr-4">
       
          <EnhancedTable employeeData={filteredEmployees}></EnhancedTable>
        </div> */}
      </div>
    </div>
  );
}

export default AttendanceMain;
