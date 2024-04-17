import React, { useState, useEffect } from "react";
import Sidebar from "../Dashboard/Sidebar";
import CeoSidebar from "../Ceo/Dashboard/CeoSidebar";
import DashboardOverview from "../Dashboard/DashboardOverview";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelIcon from "@mui/icons-material/Cancel";
<<<<<<< HEAD
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
=======
import { useSelector, useDispatch } from "react-redux";
>>>>>>> frontend
import { setEmployeeData } from "../../state";
import validator from "validator";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';

const MarkAttendance = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const employeeData = useSelector((state) => state.EmployeeData.EmployeeData);

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [employeeAttendance, setEmployeeAttendance] = useState([]);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (employeeData) {
      const initialAttendance = employeeData.employeeData.map((employee) => ({
        employeeId: employee._id,
        name: employee.name,
        checkInTime: "",
        checkOutTime: "",
        attendanceStatus: "",
      }));
      setEmployeeAttendance(initialAttendance);
    }
  }, [employeeData]);

  const handleSubmit = async () => {
    const validationErrors = {};

    // Validate selectedDate
    if (!selectedDate) {
      validationErrors["selectedDate"] = "Date is required.";
    }

    // Validate checkInTime and checkOutTime for each employee
    employeeAttendance.forEach((employee, index) => {
      if (validator.isEmpty(employee.checkInTime)) {
        validationErrors[`checkInTime_${index}`] = "Check-in time is required.";
      }
      if (validator.isEmpty(employee.checkOutTime)) {
        validationErrors[`checkOutTime_${index}`] = "Check-out time is required.";
      }
      if (!validator.isEmpty(employee.checkInTime) && !validator.isEmpty(employee.checkOutTime)) {
        const checkInTime = new Date(`${selectedDate}T${employee.checkInTime}`);
        const checkOutTime = new Date(`${selectedDate}T${employee.checkOutTime}`);
        if (checkOutTime <= checkInTime) {
          validationErrors[`checkOutTime_${index}`] = "Check-out time should be after check-in time.";
        }
      }
      // Validate attendanceStatus
      if (!employee.attendanceStatus) {
        validationErrors[`attendanceStatus_${index}`] = "Attendance status is required.";
      }
    });

    // If there are validation errors, update state and return
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Extract month from selectedDate
    const dateObj = new Date(selectedDate);
    const month = dateObj.toLocaleString("default", { month: "long" });

    // Prepare data for submission
    const attendanceData = employeeAttendance.map((employee) => ({
      ...employee,
      date: selectedDate, // Include selected date
      month: month, // Include month obtained from selected date
      organizationId: employeeData.employeeData[0].organizationId,
      email: employeeData.user.email,
      loginType: employeeData.userType,
    }));

    // Proceed with API call
    try {
      setErrors({});
      setLoading(true); // Set loading state to true while making API call
      const response = await axios.post(
        "http://localhost:5000/AddAttendance",
        attendanceData
      );
      if (response.data) {
        setLoading(false);
        dispatch(setEmployeeData(response.data.data));
        const redirectPath =
          employeeData.userType === "business_owner"
            ? "/CEO/dashboard/attendance"
            : "/HR/dashboard/attendance";
        navigate(redirectPath);
      }
    } catch (error) {
      setApiError(error.message);
      console.log(error);
    } finally {
      setLoading(false); // Reset loading state after API call is completed
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar */}
      {employeeData && employeeData.userType === "business_owner" ? (
        <CeoSidebar />
      ) : (
        <Sidebar />
      )}

      {/* Main content */}
      <div className="flex-grow p-4 md:p-8">
        {/* Dashboard Overview with date */}
        <DashboardOverview pageName="Mark Attendance" />
        {loading && <div className="absolute inset-0 backdrop-filter backdrop-blur-sm z-10"></div>}

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
            className="bg-blue-500 hover:bg-blue-800 active:bg-white active:text-blue-600 text-white py-2 px-4 rounded-lg"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
        {apiError && (
          <p className="text-red-500 font-bold text-xl text-center">
            {apiError}
          </p>
        )}

        {/* Employee Attendance Table */}
        <div className="overflow-auto">
          <table className="table-auto border-collapse border border-gray-300 w-full">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2">
                  <EventAvailableIcon /> Name
                </th>
                <th className="border border-gray-300 p-2">
                  <AccessTimeIcon /> Check In
                </th>
                <th className="border border-gray-300 p-2">
                  <AccessTimeIcon /> Check Out
                </th>
                <th className="border border-gray-300 p-2"></th>
                <th className="border border-gray-300 p-2"></th>
              </tr>
            </thead>
            <tbody>
              {employeeAttendance.map((employee, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-2 text-center">
                    {employee.name}
                  </td>
                  <td className="border border-gray-300 p-2">
                    <input
                      type="time"
                      value={employee.checkInTime}
                      onChange={(e) =>
                        setEmployeeAttendance((prev) =>
                          prev.map((emp, i) =>
                            i === index ? { ...emp, checkInTime: e.target.value } : emp
                          )
                        )
                      }
                      className={`w-full border border-gray-300 p-1 rounded-lg text-center ${
                        errors[`checkInTime_${index}`] ? "border-red-500" : ""
                      }`}
                    />
                    {errors[`checkInTime_${index}`] && (
                      <span className="text-red-500">
                        {errors[`checkInTime_${index}`]}
                      </span>
                    )}
                  </td>
                  <td className="border border-gray-300 p-2">
                    <input
                      type="time"
                      value={employee.checkOutTime}
                      onChange={(e) =>
                        setEmployeeAttendance((prev) =>
                          prev.map((emp, i) =>
                            i === index ? { ...emp, checkOutTime: e.target.value } : emp
                          )
                        )
                      }
                      className={`w-full border border-gray-300 p-1 rounded-lg text-center ${
                        errors[`checkOutTime_${index}`] ? "border-red-500" : ""
                      }`}
                    />
                    {errors[`checkOutTime_${index}`] && (
                      <span className="text-red-500">
                        {errors[`checkOutTime_${index}`]}
                      </span>
                    )}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    <CheckCircleOutlineIcon
                      style={{
                        color: employee.attendanceStatus === "present" ? "green" : "gray",
                      }}
                      onClick={() =>
                        setEmployeeAttendance((prev) =>
                          prev.map((emp, i) =>
                            i === index ? { ...emp, attendanceStatus: "present" } : emp
                          )
                        )
                      }
                    />
                    {errors[`attendanceStatus_${index}`] && (
                      <span className="text-red-500 block text-center">
                        {errors[`attendanceStatus_${index}`]}
                      </span>
                    )}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    <CancelIcon
                      style={{
                        color: employee.attendanceStatus === "absent" ? "red" : "gray",
                      }}
                      onClick={() =>
                        setEmployeeAttendance((prev) =>
                          prev.map((emp, i) =>
                            i === index ? { ...emp, attendanceStatus: "absent" } : emp
                          )
                        )
                      }
                    />
                    {errors[`attendanceStatus_${index}`] && (
                      <span className="text-red-500 block text-center">
                        {errors[`attendanceStatus_${index}`]}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {loading && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <CircularProgress style={{ color: 'blue' }} />
        </div>
      )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MarkAttendance;
