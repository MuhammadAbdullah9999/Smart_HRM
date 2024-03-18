import React, { useState, useEffect } from "react";
import DashboardOverview from "../DashboardOverview";
import { Link } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from 'axios'

function EmployeeProfile() {
  const employeesData = useSelector(
    (state) => state.EmployeeData.EmployeeData.employeeData
  );

  const { employeeId } = useParams();

  // Find the employee with the matching employeeId
  const employeeData = employeesData.find(
    (employee) => employee._id === employeeId
  );

  // State to manage edit mode for each input
  const [editMode, setEditMode] = useState({
    basicSalary: false,
    homeAllowance: false,
    medicalAllowance: false,
    transportAllowance: false,
    bonus: false,
    grossSalary: false,
  });

  // State to manage input values
  const [grossSalary, setGrossSalary] = useState("");
  const [inputValues, setInputValues] = useState({
    basicSalary: employeeData ? employeeData.salary : "",
    homeAllowance: employeeData
      ? employeeData.Allowances.find((allowance) => allowance.type === "Home")
        ? employeeData.Allowances.find((allowance) => allowance.type === "Home")
            .amount
        : ""
      : "",
    medicalAllowance: employeeData
      ? employeeData.Allowances.find(
          (allowance) => allowance.type === "Medical"
        )
        ? employeeData.Allowances.find(
            (allowance) => allowance.type === "Medical"
          ).amount
        : ""
      : "",
    transportAllowance: employeeData
      ? employeeData.Allowances.find(
          (allowance) => allowance.type === "Transportation"
        )
        ? employeeData.Allowances.find(
            (allowance) => allowance.type === "Transportation"
          ).amount
        : ""
      : "",
      bonus: employeeData
      ? employeeData.bonuses
          .filter((bonus) => bonus.month === new Date().toLocaleString('en-US', { month: 'long' }).toLowerCase())
          .map((bonus) => bonus.bonusAmount)
          .reduce((acc, val) => acc + parseFloat(val), 0) // Sum up the bonus amounts
      : "", 
    bonusReason: employeeData
  ? employeeData.bonuses
      .filter((bonus) => bonus.month === new Date().toLocaleString('en-US', { month: 'long' }).toLowerCase())
      .map((bonus) => bonus.bonusType)
      .join(", ") // Join the bonus types into a single string separated by commas
  : "",

      deduction:"",
      deductionReason:"",
    grossSalary: grossSalary,
  });

  // State to manage gross salary

  // Function to toggle edit mode for an input field
  const toggleEditMode = (field) => {
    setEditMode({ ...editMode, [field]: !editMode[field] });
  };

  // Function to handle input changes
  const handleInputChange = (field, value) => {
    setInputValues({ ...inputValues, [field]: value });
  };

  // Function to calculate gross salary
  const calculateGrossSalary = () => {
    let grossSalaryValue = parseFloat(inputValues.basicSalary || 0);
    grossSalaryValue += parseFloat(inputValues.homeAllowance || 0);
    grossSalaryValue += parseFloat(inputValues.medicalAllowance || 0);
    grossSalaryValue += parseFloat(inputValues.transportAllowance || 0);
    grossSalaryValue += parseFloat(inputValues.bonus || 0)
    setGrossSalary(grossSalaryValue);
    return grossSalaryValue;

  };

  // Effect to calculate gross salary on component mount and whenever inputValues change
  useEffect(() => {
    calculateGrossSalary();
  }, [inputValues]);
  // Effect to set day, date, and month on component mount
// Effect to set day and month on component mount
useEffect(() => {
  // Get the current date
  const currentDate = new Date();

  // Array of month names
  const monthNames = [
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"
  ];

  // Get day name (e.g., Monday, Tuesday, etc.)
  const dayName = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(currentDate);

  // Get month name (e.g., January, February, etc.)
  const monthName = monthNames[currentDate.getMonth()];

  // Set the input values with day and month
  setInputValues({
    ...inputValues,
    day: dayName,
    month: monthName
  });
  
}, []);

// Function to handle saving changes
const handleSaveChanges = async () => {
  // Calculate the gross salary value
  const grossSalaryValue = calculateGrossSalary();

  // Update the inputValues state with the new gross salary value
  setInputValues({ ...inputValues, grossSalary: grossSalaryValue });

  console.log("Changes saved:", inputValues);
  const response = await axios.post('http://localhost:5000/UpdateEmployeeProfile', inputValues);
  console.log(response.data);
};

  const handleGeneratePayroll = () => {
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
                <th className="p-3 pl-8 text-left text-md text-gray-500">
                  Employee ID
                </th>
                <td className="p-3 text-md font-bold">
                  {employeeData?.employeeId}
                </td>
              </tr>
              <tr>
                <th className="p-3 pl-8 text-left text-md text-gray-500">
                  Employee Name
                </th>
                <td className="p-3 text-md font-bold">{employeeData?.name}</td>
              </tr>
              <tr>
                <th className="p-3 pl-8 text-left text-md text-gray-500">
                  Department
                </th>
                <td className="p-3 text-md font-bold">
                  {employeeData?.department}
                </td>
              </tr>
              <tr>
                <th className="p-3 pl-8 text-left text-md text-gray-500">
                  Employee Type
                </th>
                <td className="p-3 text-md font-bold">
                  {employeeData?.employeeType}
                </td>
              </tr>
              <tr>
                <th className="p-3 pl-8 text-left text-md text-gray-500">
                  Position
                </th>
                <td className="p-3 text-md font-bold">
                  {employeeData?.position}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Editable fields */}
          <div className="mt-10">
            <div className="flex flex-wrap justify-between">
              {/* Basic Salary */}
              <div className="flex flex-col items-left mt-4 w-full md:w-1/2 lg:w-1/4 mr-2">
                <label className="flex items-center font-bold text-lg mr-4">
                  Basic Salary{" "}
                  <EditIcon
                    className="ml-2 cursor-pointer"
                    onClick={() => toggleEditMode("basicSalary")}
                  />
                </label>
                <input
                  type="text"
                  value={inputValues.basicSalary}
                  onChange={(e) =>
                    handleInputChange("basicSalary", e.target.value)
                  }
                  className={`border border-gray-300 rounded-md mt-1 p-1 w-full ${
                    !editMode.basicSalary
                      ? "cursor-pointer outline-none"
                      : "cursor-text"
                  }`}
                  readOnly={!editMode.basicSalary}
                />
              </div>

              {/* Home Allowance */}
              <div className="flex flex-col items-left mt-4 w-full md:w-1/2 lg:w-1/4 mr-2">
                <label className="flex items-center font-bold text-lg mr-4">
                  Home Allowance{" "}
                  <EditIcon
                    className="ml-2 cursor-pointer"
                    onClick={() => toggleEditMode("homeAllowance")}
                  />
                </label>
                <input
                  type="text"
                  value={inputValues.homeAllowance}
                  onChange={(e) =>
                    handleInputChange("homeAllowance", e.target.value)
                  }
                  className={`border border-gray-300 rounded-md mt-1 p-1 w-full ${
                    !editMode.homeAllowance
                      ? "cursor-pointer outline-none"
                      : "cursor-text"
                  }`}
                  readOnly={!editMode.homeAllowance}
                />
              </div>

              {/* Medical Allowance */}
              <div className="flex flex-col items-left mt-4 w-full md:w-1/2 lg:w-1/4 mr-2">
                <label className="flex items-center font-bold text-lg mr-4">
                  Medical Allowance{" "}
                  <EditIcon
                    className="ml-2 cursor-pointer"
                    onClick={() => toggleEditMode("medicalAllowance")}
                  />
                </label>
                <input
                  type="text"
                  value={inputValues.medicalAllowance}
                  onChange={(e) =>
                    handleInputChange("medicalAllowance", e.target.value)
                  }
                  className={`border border-gray-300 rounded-md mt-1 p-1 w-full ${
                    !editMode.medicalAllowance
                      ? "cursor-pointer outline-none"
                      : "cursor-text"
                  }`}
                  readOnly={!editMode.medicalAllowance}
                />
              </div>

              {/* Transport Allowance */}
              <div className="flex flex-col items-left mt-4 w-full md:w-1/2 lg:w-1/4 mr-2">
                <label className="flex items-center font-bold text-lg mr-4">
                  Transport Allowance{" "}
                  <EditIcon
                    className="ml-2 cursor-pointer"
                    onClick={() => toggleEditMode("transportAllowance")}
                  />
                </label>
                <input
                  type="text"
                  value={inputValues.transportAllowance}
                  onChange={(e) =>
                    handleInputChange("transportAllowance", e.target.value)
                  }
                  className={`border border-gray-300 rounded-md mt-1 p-1 w-full ${
                    !editMode.transportAllowance
                      ? "cursor-pointer outline-none"
                      : "cursor-text"
                  }`}
                  readOnly={!editMode.transportAllowance}
                />
              </div>

              {/* Bonus */}
              <div className="flex flex-col items-left mt-4 w-full md:w-1/2 lg:w-1/4 mr-2">
                <label className="flex items-center font-bold text-lg mr-4">
                  Bonus{" "}
                  <EditIcon
                    className="ml-2 cursor-pointer"
                    onClick={() => toggleEditMode("bonus")}
                  />
                </label>
                <input
                  type="text"
                  value={inputValues.bonus}
                  onChange={(e) => handleInputChange("bonus", e.target.value)}
                  className={`border border-gray-300 rounded-md mt-1 p-1 w-full ${
                    !editMode.bonus
                      ? "cursor-pointer outline-none"
                      : "cursor-text"
                  }`}
                  readOnly={!editMode.bonus}
                />
              </div>
              {/* Reason for Bonus */}
              <div className="flex flex-col items-left mt-4 w-full md:w-1/2 lg:w-1/4 mr-2">
                <label className="flex items-center font-bold text-lg mr-4">
                  Reason for Bonus{" "}
                  <EditIcon
                    className="ml-2 cursor-pointer"
                    onClick={() => toggleEditMode("bonusReason")}
                  />
                </label>
                <input
                  type="text"
                  value={inputValues.bonusReason}
                  onChange={(e) =>
                    handleInputChange("bonusReason", e.target.value)
                  }
                  className={`border border-gray-300 rounded-md mt-1 p-1 w-full ${
                    !editMode.bonusReason
                      ? "cursor-pointer outline-none"
                      : "cursor-text"
                  }`}
                  readOnly={!editMode.bonusReason}
                />
              </div>
              {/* Deduction */}
              <div className="flex flex-col items-left mt-4 w-full md:w-1/2 lg:w-1/4 mr-2">
                <label className="flex items-center font-bold text-lg mr-4">
                  Deduction{" "}
                  <EditIcon
                    className="ml-2 cursor-pointer"
                    onClick={() => toggleEditMode("deduction")}
                  />
                </label>
                <input
                  type="text"
                  value={inputValues.deduction}
                  onChange={(e) =>
                    handleInputChange("deduction", e.target.value)
                  }
                  className={`border border-gray-300 rounded-md mt-1 p-1 w-full ${
                    !editMode.deduction
                      ? "cursor-pointer outline-none"
                      : "cursor-text"
                  }`}
                  readOnly={!editMode.deduction}
                />
              </div>

              {/* Reason for Deduction */}
              <div className="flex flex-col items-left mt-4 w-full md:w-1/2 lg:w-1/4 mr-2">
                <label className="flex items-center font-bold text-lg mr-4">
                  Reason for Deduction{" "}
                  <EditIcon
                    className="ml-2 cursor-pointer"
                    onClick={() => toggleEditMode("deductionReason")}
                  />
                </label>
                <input
                  type="text"
                  value={inputValues.deductionReason}
                  onChange={(e) =>
                    handleInputChange("deductionReason", e.target.value)
                  }
                  className={`border border-gray-300 rounded-md mt-1 p-1 w-full ${
                    !editMode.deductionReason
                      ? "cursor-pointer outline-none"
                      : "cursor-text"
                  }`}
                  readOnly={!editMode.deductionReason}
                />
              </div>

              {/* Gross Salary */}
              <div className="flex flex-col items-left mt-4 w-full md:w-1/2 lg:w-1/4 mr-2">
                <label className="flex items-center font-bold text-lg mr-4">
                  Gross Salary{" "}
                  <EditIcon
                    className="ml-2 cursor-pointer"
                    onClick={() => toggleEditMode("grossSalary")}
                  />
                </label>
                <input
                  type="text"
                  value={grossSalary}
                  onChange={(e) =>
                    handleInputChange("grossSalary", e.target.value)
                  }
                  className={`border border-gray-300 rounded-md mt-1 p-1 w-full ${
                    !editMode.grossSalary
                      ? "cursor-pointer outline-none"
                      : "cursor-text"
                  }`}
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
