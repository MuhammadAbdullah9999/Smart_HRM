import React, { useState } from "react";
import DashboardOverview from "../DashboardOverview";
import { Link } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";

function EmployeeProfile() {
  // Sample employee data
  const employeeData = {
    id: "01",
    name: "Ahsan Naseem",
    department: "Design",
    employeeType: "Full Time",
    position: "Software Engineer",
  };

  // State to manage edit mode for each input
  const [editMode, setEditMode] = useState({
    basicSalary: false,
    homeAllowance: false,
    medicalAllowance: false,
    transportAllowance: false,
    loan: false,
    bonus: false,
    grossSalary: false,
  });

  // State to manage input values
  const [inputValues, setInputValues] = useState({
    basicSalary: "200",
    homeAllowance: "200",
    medicalAllowance: "200",
    transportAllowance: "",
    loan: "",
    bonus: "",
    grossSalary: "",
  });

  // Function to toggle edit mode for an input field
  const toggleEditMode = (field) => {
    setEditMode({ ...editMode, [field]: !editMode[field] });
  };

  // Function to handle input changes
  const handleInputChange = (field, value) => {
    setInputValues({ ...inputValues, [field]: value });
  };

  // Function to handle saving changes
  const handleSaveChanges = () => {
    // Implement logic to save changes
    console.log("Changes saved:", inputValues);
  };

  // Function to handle generating payroll
  const handleGeneratePayroll = () => {
    // Implement logic to generate payroll
    console.log("Payroll generated");
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* Back button */}
      <Link to="/dashboard/Employees">
        <ArrowBackIcon className="cursor-pointer absolute top-8 left-8 " />
      </Link>

      {/* Main content */}
      <div className="w-full p-16">
        {/* Dashboard overview */}
        <DashboardOverview pageName="Employee Profile" />

        {/* Employee profile details */}
        <div className="mt-10">
          <table className="w-full rounded-lg border border-gray-200 shadow-lg shadow-gray-200 cursor-pointer hover:shadow-blue-200 ">
            <tbody>
              <tr>
                <th className="p-3 pl-8 text-left text-md text-gray-500">Employee ID</th>
                <td className="p-3 text-md font-bold">{employeeData.id}</td>
              </tr>
              <tr>
                <th className="p-3 pl-8 text-left text-md text-gray-500">Employee Name</th>
                <td className="p-3 text-md font-bold">{employeeData.name}</td>
              </tr>
              <tr>
                <th className="p-3 pl-8 text-left text-md text-gray-500">Department</th>
                <td className="p-3 text-md font-bold">{employeeData.department}</td>
              </tr>
              <tr>
                <th className="p-3 pl-8 text-left text-md text-gray-500">Employee Type</th>
                <td className="p-3 text-md font-bold">{employeeData.employeeType}</td>
              </tr>
              <tr>
                <th className="p-3 pl-8 text-left text-md text-gray-500">Position</th>
                <td className="p-3 text-md font-bold">{employeeData.position}</td>
              </tr>
            </tbody>
          </table>

          {/* Editable fields */}
          <div className="mt-10">
            <div className="flex flex-wrap justify-between">
              {/* Basic Salary */}
              <div className="flex flex-col items-left mt-4 w-full md:w-1/2 lg:w-1/4 mr-2">
                <label className="flex items-center font-bold text-lg mr-4">Basic Salary <EditIcon className="ml-2 cursor-pointer" onClick={() => toggleEditMode('basicSalary')} /></label>
                <input
                  type="text"
                  value={inputValues.basicSalary}
                  onChange={(e) => handleInputChange('basicSalary', e.target.value)}
                  className={`border border-gray-300 rounded-md mt-1 p-1 w-full ${!editMode.basicSalary ? 'cursor-pointer outline-none' : 'cursor-text'}`}
                  readOnly={!editMode.basicSalary}
                />
              </div>

              {/* Home Allowance */}
              <div className="flex flex-col items-left mt-4 w-full md:w-1/2 lg:w-1/4 mr-2">
                <label className="flex items-center font-bold text-lg mr-4">Home Allowance <EditIcon className="ml-2 cursor-pointer" onClick={() => toggleEditMode('homeAllowance')} /></label>
                <input
                  type="text"
                  value={inputValues.homeAllowance}
                  onChange={(e) => handleInputChange('homeAllowance', e.target.value)}
                  className={`border border-gray-300 rounded-md mt-1 p-1 w-full ${!editMode.homeAllowance ? 'cursor-pointer outline-none' : 'cursor-text'}`}
                  readOnly={!editMode.homeAllowance}
                />
              </div>

              {/* Medical Allowance */}
              <div className="flex flex-col items-left mt-4 w-full md:w-1/2 lg:w-1/4 mr-2">
                <label className="flex items-center font-bold text-lg mr-4">Medical Allowance <EditIcon className="ml-2 cursor-pointer" onClick={() => toggleEditMode('medicalAllowance')} /></label>
                <input
                  type="text"
                  value={inputValues.medicalAllowance}
                  onChange={(e) => handleInputChange('medicalAllowance', e.target.value)}
                  className={`border border-gray-300 rounded-md mt-1 p-1 w-full ${!editMode.medicalAllowance ? 'cursor-pointer outline-none' : 'cursor-text'}`}
                  readOnly={!editMode.medicalAllowance}
                />
              </div>

              {/* Transport Allowance */}
              <div className="flex flex-col items-left mt-4 w-full md:w-1/2 lg:w-1/4 mr-2">
                <label className="flex items-center font-bold text-lg mr-4">Transport Allowance <EditIcon className="ml-2 cursor-pointer" onClick={() => toggleEditMode('transportAllowance')} /></label>
                <input
                  type="text"
                  value={inputValues.transportAllowance}
                  onChange={(e) => handleInputChange('transportAllowance', e.target.value)}
                  className={`border border-gray-300 rounded-md mt-1 p-1 w-full ${!editMode.transportAllowance ? 'cursor-pointer outline-none' : 'cursor-text'}`}
                  readOnly={!editMode.transportAllowance}
                />
              </div>

              {/* Loan */}
              <div className="flex flex-col items-left mt-4 w-full md:w-1/2 lg:w-1/4 mr-2">
                <label className="flex items-center font-bold text-lg mr-4">Loan <EditIcon className="ml-2 cursor-pointer" onClick={() => toggleEditMode('loan')} /></label>
                <input
                  type="text"
                  value={inputValues.loan}
                  onChange={(e) => handleInputChange('loan', e.target.value)}
                  className={`border border-gray-300 rounded-md mt-1 p-1 w-full ${!editMode.loan ? 'cursor-pointer outline-none' : 'cursor-text'}`}
                  readOnly={!editMode.loan}
                />
              </div>

              {/* Bonus */}
              <div className="flex flex-col items-left mt-4 w-full md:w-1/2 lg:w-1/4 mr-2">
                <label className="flex items-center font-bold text-lg mr-4">Bonus <EditIcon className="ml-2 cursor-pointer" onClick={() => toggleEditMode('bonus')} /></label>
                <input
                  type="text"
                  value={inputValues.bonus}
                  onChange={(e) => handleInputChange('bonus', e.target.value)}
                  className={`border border-gray-300 rounded-md mt-1 p-1 w-full ${!editMode.bonus ? 'cursor-pointer outline-none' : 'cursor-text'}`}
                  readOnly={!editMode.bonus}
                />
              </div>

              {/* Gross Salary */}
              <div className="flex flex-col items-left mt-4 w-full md:w-1/2 lg:w-1/4 mr-2">
                <label className="flex items-center font-bold text-lg mr-4">Gross Salary <EditIcon className="ml-2 cursor-pointer" onClick={() => toggleEditMode('grossSalary')} /></label>
                <input
                  type="text"
                  value={inputValues.grossSalary}
                  onChange={(e) => handleInputChange('grossSalary', e.target.value)}
                  className={`border border-gray-300 rounded-md mt-1 p-1 w-full ${!editMode.grossSalary ? 'cursor-pointer outline-none' : 'cursor-text'}`}
                  readOnly={!editMode.grossSalary}
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex mt-8">
            <button
              className="px-4 py-2 mr-4 bg-white border border-bg-color border-2 text-black rounded-lg hover:bg-blue-100"
              onClick={handleSaveChanges}
            >
              Save Changes
            </button>
            <button
              className="px-4 py-2 mr-4 bg-bg-color text-white rounded-lg hover:bg-blue-800"
              onClick={handleGeneratePayroll}
            >
              Generate Payroll
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeProfile;
