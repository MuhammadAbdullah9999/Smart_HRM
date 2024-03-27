import React, { useState, useEffect } from "react";
import Sidebar from "../Dashboard/Sidebar";
import CeoSidebar from "../../Ceo/Dashboard/CeoSidebar";
import DashboardOverview from "../Dashboard/DashboardOverview";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelIcon from "@mui/icons-material/Cancel";
import { useSelector } from 'react-redux';
import { useDispatch } from "react-redux";
import { setEmployeeData } from "../../../state";
import validator from 'validator';
import { useNavigate } from "react-router-dom";
import axios from "axios";

const MarkAttendance = () => {

  const navigate=useNavigate();
  const dispatch = useDispatch();
  const employeeData = useSelector(state => state.EmployeeData.EmployeeData);

  const email=employeeData.user.email
  const organizationId=employeeData.employeeData[0].organizationId;

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [employeeAttendance, setEmployeeAttendance] = useState([]);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError]=useState('')

  // Populate initial employeeAttendance state based on employeeData
  useEffect(() => {
    if (employeeData) {
      const initialAttendance = employeeData.employeeData.map((employee) => ({
        employeeId: employee._id,
        loginType:employeeData.userType,
        name: employee.name,
        checkInTime: "",
        checkOutTime: "",
        attendanceStatus: "",
        email:email,
        organizationId:organizationId
      }));
      setEmployeeAttendance(initialAttendance);
    
    }
  }, [employeeData]);
// Function to handle submitting the attendance data
const handleSubmit = async() => {
  // Validate fields
  // const validationErrors = {};

  // // Check if date is selected
  // if (!selectedDate) {
  //   validationErrors["selectedDate"] = "Date is required.";
  // }

  // // Check Check-In and Check-Out fields
  // employeeAttendance.forEach((employee) => {
  //   if (validator.isEmpty(employee.checkIn)) {
  //     validationErrors[`${employee.id}_checkIn`] = "Check-in field is required.";
  //   }
  //   if (validator.isEmpty(employee.checkOut)) {
  //     validationErrors[`${employee.id}_checkOut`] = "Check-out field is required.";
  //   }
  // });

  // // If there are validation errors, set them in state
  // if (Object.keys(validationErrors).length > 0) {
  //   setErrors(validationErrors);
  //   return;
  // }

  // Log all data with employee IDs
 const allData = employeeAttendance.map((employee) => {
    const selectedDateObject = new Date(selectedDate);
    const month = selectedDateObject.toLocaleString('en-US', { month: 'long' });

    return {
      employeeId: employee.employeeId,
      name: employee.name,
      checkInTime: "5:00 am",
      checkOutTime: "3:00 am",
      attendanceStatus: "present",
      month: month,
      email:email,
      organizationId:organizationId,
      date:selectedDate,
      loginType:employee.loginType
    };
  });
  try{
    const response=await axios.post('http://localhost:5000/AddAttendance',allData);
    if(response.data){
      dispatch(setEmployeeData(response.data.data));
      // console.log(response.data);
      if(employeeAttendance.loginType==="business_owner"){
        navigate('/CEO/attendance')
      }
      else{
        navigate('/HR/attendance')
      }
    }
  }
  catch(error){
    setApiError(error.message);
    console.log(error);
  }


  // Clear errors after successful submission
  setErrors({});
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
      {employeeData && employeeData.userType === "business_owner" ? (
          <CeoSidebar></CeoSidebar>
        ) : (
          <Sidebar></Sidebar>
        )}

      {/* Main content */}
      <div className="flex-grow p-4 md:p-8">
        {/* Dashboard Overview with date */}
        <DashboardOverview pageName="Mark Attendance"/>

        {/* Date Selection and Submit Button */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-4">
          <div className="flex items-center">
            <CalendarTodayIcon />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className={`border border-gray-300 p-2 ml-2 mb-2 md:mb-0 md:mr-4 rounded-lg ${
                errors["selectedDate"] ? "border-red-500" : ""
              }`}
            />
            {errors["selectedDate"] && (
              <span className="text-red-500">{errors["selectedDate"]}</span>
            )}
          </div>
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-lg"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
{apiError && (<p className="text-red-500 font-bold text-xl text-center">{apiError}</p>)}
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
                      className={`w-full border border-gray-300 p-1 rounded-lg text-center ${
                        errors[`${employee.id}_checkIn`] ? "border-red-500" : ""
                      }`}
                    />
                    {errors[`${employee.id}_checkIn`] && (
                      <span className="text-red-500">{errors[`${employee.id}_checkIn`]}</span>
                    )}
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
                      className={`w-full border border-gray-300 p-1 rounded-lg text-center ${
                        errors[`${employee.id}_checkOut`] ? "border-red-500" : ""
                      }`}
                    />
                    {errors[`${employee.id}_checkOut`] && (
                      <span className="text-red-500">{errors[`${employee.id}_checkOut`]}</span>
                    )}
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