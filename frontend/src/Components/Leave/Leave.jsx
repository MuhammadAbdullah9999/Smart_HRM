import React, { useState } from "react";
import validator from "validator";
import Sidebar from "../Dashboard/Sidebar";
import DashboardOverview from "../Dashboard/DashboardOverview";

function LeaveApplication() {
  // State for form fields and errors
  const [formData, setFormData] = useState({
    employeeId: "",
    employeeName: "",
    department: "Accounts",
    type: "Sick Leave",
    startDate: "",
    endDate: "",
  });
  const [errors, setErrors] = useState({});

  // Handle form data changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    // Reset errors for the current field
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  // Validate form data
  const validateForm = () => {
    let tempErrors = {};
    tempErrors.employeeId = validator.isEmpty(formData.employeeId)
      ? "Employee ID is required."
      : "";
    tempErrors.employeeName = validator.isEmpty(formData.employeeName)
      ? "Employee Name is required."
      : "";
    tempErrors.startDate = validator.isEmpty(formData.startDate)
      ? "Start Date is required."
      : "";
    tempErrors.endDate = validator.isEmpty(formData.endDate)
      ? "End Date is required."
      : "";

    if (
      !validator.isEmpty(formData.startDate) &&
      !validator.isEmpty(formData.endDate)
    ) {
      tempErrors.endDate = !validator.isAfter(
        formData.endDate,
        formData.startDate
      )
        ? "End Date must be after Start Date."
        : "";
    }

    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateForm()) {
      console.log(formData);
      // Add your submit logic here, such as sending data to an API
    }
  };

  return (
    <div className="flex gap-4">
      <Sidebar />
      <div className="flex flex-col w-full">
        <DashboardOverview pageName="Leave" />
        <h3 className="text-2xl font-bold text-center mt-4">
          Leave Application
        </h3>
        <div className="flex items-center justify-center w-full p-4">
          <div className="px-8 py-6 mt-4 text-left bg-white shadow-md rounded-lg border w-full">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block" htmlFor="employeeId">
                    Employee Id
                  </label>
                  <input
                    type="text"
                    placeholder="Type..."
                    name="employeeId"
                    id="employeeId"
                    onChange={handleChange}
                    value={formData.employeeId}
                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                  {errors.employeeId && (
                    <p className="text-red-500 text-xs italic">
                      {errors.employeeId}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block" htmlFor="employeeName">
                    Employee Name
                  </label>
                  <input
                    type="text"
                    placeholder="Type..."
                    name="employeeName"
                    id="employeeName"
                    onChange={handleChange}
                    value={formData.employeeName}
                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                  {errors.employeeName && (
                    <p className="text-red-500 text-xs italic">
                      {errors.employeeName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block" htmlFor="department">
                    Department
                  </label>
                  <select
                    name="department"
                    id="department"
                    onChange={handleChange}
                    value={formData.department}
                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                  >
                    <option value="Accounts">Accounts</option>
                    <option value="HR">HR</option>
                    <option value="IT">IT</option>
                    <option value="Sales">Sales</option>
                  </select>
                </div>
                <div>
                  <label className="block" htmlFor="type">
                    Type
                  </label>
                  <select
                    name="type"
                    id="type"
                    onChange={handleChange}
                    value={formData.type}
                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                  >
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Casual Leave">Casual Leave</option>
                    <option value="Emergency Leave">Emergency Leave</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    onChange={handleChange}
                    value={formData.startDate}
                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                  {errors.startDate && (
                    <p className="text-red-500 text-xs italic">
                      {errors.startDate}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    onChange={handleChange}
                    value={formData.endDate}
                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                  {errors.endDate && (
                    <p className="text-red-500 text-xs italic">
                      {errors.endDate}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-baseline justify-between mt-4">
                <button
                  type="submit"
                  className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
                >
                  Apply Leave
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeaveApplication;
