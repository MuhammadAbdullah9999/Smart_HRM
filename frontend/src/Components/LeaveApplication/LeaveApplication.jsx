import React, { useState } from "react";
import axios from "axios";
import validator from "validator";
import Sidebar from "../Dashboard/Sidebar";
import EmployeeSidebar from "../Employee/EmployeeSidebar";
import DashboardOverview from "../Dashboard/DashboardOverview";
import { useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";

function LeaveApplication() {
  const navigate = useNavigate();
  const data = useSelector((state) => state.EmployeeData.EmployeeData);

  const [formData, setFormData] = useState({
    leaveType: "Sick Leave",
    startDate: "",
    endDate: "",
    leaveReason: "",
    leaveDays: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    // Check if start date is in the past
    if (name === "startDate" && new Date(value) < new Date().setHours(0, 0, 0, 0)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        startDate: "Start Date cannot be in the past.",
      }));
      return;
    }

    // Calculate leave days if start date and end date are provided
    if (name === "startDate" || name === "endDate") {
      const startDate = name === "startDate" ? value : formData.startDate;
      const endDate = name === "endDate" ? value : formData.endDate;

      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (start > end) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            endDate: "End Date must be after Start Date.",
          }));
        } else {
          const diffTime = Math.abs(end - start);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Include the start date

          setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
            leaveDays: diffDays.toString(),
          }));
          setErrors((prevErrors) => ({ ...prevErrors, endDate: "" }));
        }
      } else {
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: value,
        }));
      }
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const validateForm = () => {
    let tempErrors = {};
    tempErrors.leaveType = validator.isEmpty(formData.leaveType)
      ? "Leave type is required."
      : "";
    tempErrors.startDate = validator.isEmpty(formData.startDate)
      ? "Start Date is required."
      : "";
    tempErrors.endDate = validator.isEmpty(formData.endDate)
      ? "End Date is required."
      : "";
    tempErrors.leaveReason = validator.isEmpty(formData.leaveReason)
      ? "Leave Reason is required."
      : "";
    tempErrors.leaveDays =
      validator.isEmpty(formData.leaveDays) ||
      !validator.isNumeric(formData.leaveDays)
        ? "Number of leave days is required and must be a number."
        : "";

    if (!validator.isEmpty(formData.startDate) && new Date(formData.startDate) < new Date().setHours(0, 0, 0, 0)) {
      tempErrors.startDate = "Start Date cannot be in the past.";
    }

    if (
      !validator.isEmpty(formData.startDate) &&
      !validator.isEmpty(formData.endDate)
    ) {
      tempErrors.endDate = !validator.isAfter(
        formData.endDate,
        formData.startDate
      ) && formData.endDate !== formData.startDate
        ? "End Date must be after Start Date."
        : "";
    }

    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      const submissionData = {
        ...formData,
        employeeId: data ? data.user._id : undefined,
        userType: data ? data.userType : undefined,
        leaveDate: `${formData.startDate} to ${formData.endDate}`,
      };

      try {
        setLoading(true);
        const response = await axios.post(
          "http://localhost:5000/requestleave",
          submissionData
        );
        setLoading(false);
        navigate(
          data.userType === "HR"
            ? "/HR/dashboard/leave"
            : "/employee/dashboard/leave"
        );
      } catch (error) {
        setLoading(false);
        console.error(error.response ? error.response.data : error.message);
      }
    }
  };

  return (
    <div className="flex gap-4">
      {data && data.userType === "employee" ? <EmployeeSidebar /> : <Sidebar />}
      <div className="flex flex-col w-full">
        <DashboardOverview pageName="Leave" />
        {loading && (
          <div className="absolute inset-0 backdrop-filter backdrop-blur-sm z-10"></div>
        )}
        <h3 className="text-2xl font-bold text-center mt-4">
          Leave Application
        </h3>
        <div className="flex items-center justify-center w-full p-4">
          <div className="w-full overflow-auto p-4 border rounded-lg shadow max-h-[75vh]">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="leaveType" className="block">
                  Leave Type
                </label>
                <select
                  name="leaveType"
                  id="leaveType"
                  onChange={handleChange}
                  value={formData.leaveType}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Emergency Leave">Emergency Leave</option>
                  <option value="Other">Other</option>
                </select>
                {errors.leaveType && (
                  <p className="text-red-500">{errors.leaveType}</p>
                )}
              </div>
              <div>
                <label htmlFor="startDate">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  onChange={handleChange}
                  value={formData.startDate}
                  className="w-full p-2 border rounded-md"
                />
                {errors.startDate && (
                  <p className="text-red-500">{errors.startDate}</p>
                )}
              </div>
              <div>
                <label htmlFor="endDate">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  onChange={handleChange}
                  value={formData.endDate}
                  className="w-full p-2 border rounded-md"
                />
                {errors.endDate && (
                  <p className="text-red-500">{errors.endDate}</p>
                )}
              </div>
              <div>
                <label htmlFor="leaveReason">Leave Reason</label>
                <textarea
                  name="leaveReason"
                  onChange={handleChange}
                  value={formData.leaveReason}
                  className="w-full p-2 border rounded-md"
                />
                {errors.leaveReason && (
                  <p className="text-red-500">{errors.leaveReason}</p>
                )}
              </div>
              <div>
                <label htmlFor="leaveDays">Leave Days</label>
                <input
                  type="text"
                  name="leaveDays"
                  onChange={handleChange}
                  value={formData.leaveDays}
                  className="w-full p-2 border rounded-md"
                  readOnly // Add the readOnly attribute here
                />
                {errors.leaveDays && (
                  <p className="text-red-500">{errors.leaveDays}</p>
                )}
              </div>
              <button
                type="submit"
                className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                Submit Application
              </button>
              {loading && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                  <CircularProgress style={{ color: "blue" }} />
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeaveApplication;
