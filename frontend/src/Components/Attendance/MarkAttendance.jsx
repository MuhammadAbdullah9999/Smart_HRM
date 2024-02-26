import React, { useState } from "react";
import Sidebar from "../Dashboard/Sidebar";
import DashboardOverview from "../Dashboard/DashboardOverview";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelIcon from "@mui/icons-material/Cancel";

const MarkAttendance = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [employeeAttendance, setEmployeeAttendance] = useState([
    { id: 1, name: "Sameer", checkIn: "", checkOut: "", status: "" },
    { id: 2, name: "Ahsan", checkIn: "", checkOut: "", status: "" },
    { id: 3, name: "Abdullah", checkIn: "", checkOut: "", status: "" },
    { id: 4, name: "Babar Azam", checkIn: "", checkOut: "", status: "" },
    { id: 5, name: "Saim Ayub", checkIn: "", checkOut: "", status: "" },
    { id: 6, name: "Haris", checkIn: "", checkOut: "", status: "" },
    // Add more dummy data as needed
  ]);

  // Function to handle submitting the attendance data
  const handleSubmit = () => {
    // Implement logic to submit attendance data
    console.log("Attendance submitted:", employeeAttendance);
  };

  // Function to set all employees' status to present
  const handleSetAllPresent = () => {
    setEmployeeAttendance((prev) =>
      prev.map((employee) => ({ ...employee, status: "present" }))
    );
  };

  // Function to set all employees' status to absent
  const handleSetAllAbsent = () => {
    setEmployeeAttendance((prev) =>
      prev.map((employee) => ({ ...employee, status: "absent" }))
    );
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-grow p-4 md:p-8">
        {/* Dashboard Overview with date */}
        <DashboardOverview pageName="Mark Attendance" currentDate={selectedDate} />

        {/* Date Selection and Submit Button */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-4">
          <div className="flex items-center">
            <CalendarTodayIcon />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-300 p-2 ml-2 mb-2 md:mb-0 md:mr-4 rounded-lg"
            />
          </div>
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-lg"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>

        {/* Employee Attendance Section with scrollbar */}
        <div className="overflow-auto">
          <table className="table-auto border-collapse border border-gray-300 w-full">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2" onClick={handleSetAllPresent}>
                  <EventAvailableIcon /> Name
                </th>
                <th className="border border-gray-300 p-2">
                  <AccessTimeIcon /> Check In
                </th>
                <th className="border border-gray-300 p-2">
                  <AccessTimeIcon /> Check Out
                </th>
                <th className="border border-gray-300 p-2" onClick={handleSetAllPresent}>
                  Present
                </th>
                <th className="border border-gray-300 p-2" onClick={handleSetAllAbsent}>
                  Absent
                </th>
              </tr>
            </thead>
            <tbody>
              {employeeAttendance.map((employee) => (
                <tr key={employee.id}>
                  <td className="border border-gray-300 p-2 text-center">{employee.name}</td>
                  <td className="border border-gray-300 p-2">
                    <input
                      type="time"
                      value={employee.checkIn}
                      onChange={(e) =>
                        setEmployeeAttendance((prev) =>
                          prev.map((emp) =>
                            emp.id === employee.id
                              ? { ...emp, checkIn: e.target.value }
                              : emp
                          )
                        )
                      }
                      className="w-full border border-gray-300 p-1 rounded-lg text-center"
                    />
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    <input
                      type="time"
                      value={employee.checkOut}
                      onChange={(e) =>
                        setEmployeeAttendance((prev) =>
                          prev.map((emp) =>
                            emp.id === employee.id
                              ? { ...emp, checkOut: e.target.value }
                              : emp
                          )
                        )
                      }
                      className="w-full border border-gray-300 p-1 rounded-lg text-center"
                    />
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    <CheckCircleOutlineIcon
                      style={{ color: employee.status === "present" ? "green" : "gray" }}
                      onClick={() =>
                        setEmployeeAttendance((prev) =>
                          prev.map((emp) =>
                            emp.id === employee.id ? { ...emp, status: "present" } : emp
                          )
                        )
                      }
                    />
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    <CancelIcon
                      style={{ color: employee.status === "absent" ? "red" : "gray" }}
                      onClick={() =>
                        setEmployeeAttendance((prev) =>
                          prev.map((emp) =>
                            emp.id === employee.id ? { ...emp, status: "absent" } : emp
                          )
                        )
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MarkAttendance;
    