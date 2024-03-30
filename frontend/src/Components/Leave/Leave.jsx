import React, { useState } from "react";
import axios from 'axios';
import validator from "validator";
import Sidebar from "../Dashboard/Sidebar";
import EmployeeSidebar from "../Employee/EmployeeSidebar";
import DashboardOverview from "../Dashboard/DashboardOverview";
import { useSelector } from "react-redux";

function LeaveApplication() {
  const data = useSelector((state) => state.EmployeeData.EmployeeData);

  const [formData, setFormData] = useState({
    leaveType: "Sick Leave",
    startDate: "",
    endDate: "",
    leaveReason: "",
    leaveDays: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const validateForm = () => {
    let tempErrors = {};
    tempErrors.leaveType = validator.isEmpty(formData.leaveType) ? "Leave type is required." : "";
    tempErrors.startDate = validator.isEmpty(formData.startDate) ? "Start Date is required." : "";
    tempErrors.endDate = validator.isEmpty(formData.endDate) ? "End Date is required." : "";
    tempErrors.leaveReason = validator.isEmpty(formData.leaveReason) ? "Leave Reason is required." : "";
    tempErrors.leaveDays = validator.isEmpty(formData.leaveDays) || !validator.isNumeric(formData.leaveDays) ? "Number of leave days is required and must be a number." : "";

    if (!validator.isEmpty(formData.startDate) && !validator.isEmpty(formData.endDate)) {
      tempErrors.endDate = !validator.isAfter(formData.endDate, formData.startDate) ? "End Date must be after Start Date." : "";
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
        userType:data?data.userType:undefined,
        leaveDate: `${formData.startDate} to ${formData.endDate}`,
      };

      try {
        const response = await axios.post('http://localhost:5000/requestleave', submissionData);
        console.log(response.data);
        // Handle response data here, e.g., showing a success message to the user
      } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        // Handle errors here, e.g., showing an error message to the user
      }
    }
  }


  return (
    <div className="flex gap-4">
      {data && data.userType === "employee" ? <EmployeeSidebar /> : <Sidebar />}
      <div className="flex flex-col w-full">
        <DashboardOverview pageName="Leave" />
        <h3 className="text-2xl font-bold text-center mt-4">Leave Application</h3>
        <div className="flex items-center justify-center w-full p-4">
          <div className="w-full overflow-auto p-4 border rounded-lg shadow max-h-[75vh]">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="leaveType" className="block">Leave Type</label>
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
                {errors.leaveType && <p className="text-red-500">{errors.leaveType}</p>}
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
                {errors.startDate && <p className="text-red-500">{errors.startDate}</p>}
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
                {errors.endDate && <p className="text-red-500">{errors.endDate}</p>}
              </div>
              <div>
                <label htmlFor="leaveReason">Leave Reason</label>
                <textarea
                  name="leaveReason"
                  onChange={handleChange}
                  value={formData.leaveReason}
                  className="w-full p-2 border rounded-md"
                />
                {errors.leaveReason && <p className="text-red-500">{errors.leaveReason}</p>}
              </div>
              <div>
                <label htmlFor="leaveDays">Leave Days</label>
                <input
                  type="text"
                  name="leaveDays"
                  onChange={handleChange}
                  value={formData.leaveDays}
                  className="w-full p-2 border rounded-md"
                />
                {errors.leaveDays && <p className="text-red-500">{errors.leaveDays}</p>}
              </div>
             
              <button
                type="submit"
                className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                Submit Application
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeaveApplication;
