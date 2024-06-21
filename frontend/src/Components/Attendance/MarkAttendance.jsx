import React, { useState, useEffect } from "react";
import Sidebar from "../Dashboard/Sidebar";
import CeoSidebar from "../Ceo/Dashboard/CeoSidebar";
import DashboardOverview from "../Dashboard/DashboardOverview";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelIcon from "@mui/icons-material/Cancel";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import { useSelector, useDispatch } from "react-redux";
import { setEmployeeData } from "../../state";
import validator from "validator";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';

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
      const initialAttendance = employeeData.employeeData.map((employee) => {
        const leaveStatus = employee.leaveRequest && employee.leaveRequest.some((leave) => {
          if (leave.status === "Approved") {
            const [startDate, endDate] = leave.leaveDate.split(" to ");
            const start = new Date(startDate);
            const end = new Date(endDate);
            const selected = new Date(selectedDate);
            return selected >= start && selected <= end;
          }
          return false;
        }) ? "onLeave" : "";
        return {
          employeeId: employee._id,
          name: employee.name,
          attendanceStatus: leaveStatus || "",
        };
      });
      setEmployeeAttendance(initialAttendance);
    }
  }, [employeeData, selectedDate]);

  const handleSubmit = async (overwrite = false) => {
    const validationErrors = {};

    // Validate selectedDate
    if (validator.isEmpty(selectedDate)) {
      validationErrors["selectedDate"] = "Date is required.";
    }

    // Validate attendanceStatus for each employee
    employeeAttendance.forEach((employee, index) => {
      if (validator.isEmpty(employee.attendanceStatus)) {
        validationErrors[`attendanceStatus_${index}`] = "Attendance status is required.";
      }
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const dateObj = new Date(selectedDate);
    const month = dateObj.toLocaleString("default", { month: "long" });

    const attendanceData = employeeAttendance.map((employee) => ({
      employeeId: employee.employeeId,
      name: employee.name,
      attendanceStatus: employee.attendanceStatus,
      date: selectedDate,
      month: month,
      organizationId: employeeData.employeeData[0].organizationId,
      email: employeeData.user.email,
      loginType: employeeData.userType,
    }));

    try {
      setErrors({});
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/AddAttendance",
        { data: attendanceData, overwrite }
      );

      if (response.data.existingAttendance.length > 0 && !overwrite) {
        const confirmOverwrite = window.confirm(
          "Attendance for the selected date already exists. Do you want to overwrite it?"
        );
        setLoading(false);
        if (confirmOverwrite) {
          handleSubmit(true);
        }
        return;
      }

      if (response.data.data) {
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
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      {employeeData && employeeData.userType === "business_owner" ? (
        <CeoSidebar />
      ) : (
        <Sidebar />
      )}

      <div className="flex-grow p-4 md:p-8">
        <DashboardOverview pageName="Mark Attendance" />
        {loading && <div className="absolute inset-0 backdrop-filter backdrop-blur-sm z-10"></div>}

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
            onClick={() => handleSubmit(false)}
          >
            Submit
          </button>
        </div>
        {apiError && (
          <p className="text-red-500 font-bold text-xl text-center">
            {apiError}
          </p>
        )}

        <div className="overflow-auto">
          <table className="table-auto border-collapse border border-gray-300 w-full">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2">
                  <EventAvailableIcon /> Name
                </th>
                <th className="border border-gray-300 p-2">
                  <CheckCircleRoundedIcon /> Present
                </th>
                <th className="border border-gray-300 p-2">
                  <CancelIcon /> Absent
                </th>
                <th className="border border-gray-300 p-2">
                  <BeachAccessIcon /> Leave
                </th>
              </tr>
            </thead>
            <tbody>
              {employeeAttendance.map((employee, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-2 text-center">
                    {employee.name}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    <CheckCircleRoundedIcon
                      style={{
                        color: employee.attendanceStatus === "present" ? "#4aff26" : "gray",
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
                  <td className="border border-gray-300 p-2 text-center">
                    <BeachAccessIcon
                      style={{
                        color: employee.attendanceStatus === "onLeave" ? "orange" : "gray",
                      }}
                      onClick={() =>
                        setEmployeeAttendance((prev) =>
                          prev.map((emp, i) =>
                            i === index ? { ...emp, attendanceStatus: "onLeave" } : emp
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
