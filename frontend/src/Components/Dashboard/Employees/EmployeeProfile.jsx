import React, { useState, useEffect } from "react";
import DashboardOverview from "../DashboardOverview";
import { Link } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setEmployeeData } from "../../../state/index";
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from "react-router-dom";


function EmployeeProfile() {
  const dispatch = useDispatch();
  const navigate=useNavigate();

  const employeesData = useSelector((state) => state.EmployeeData.EmployeeData);
  const { employeeId } = useParams();
  console.log(employeesData);
  
  // Find the employee with the matching employeeId
  const employeeData = employeesData.employeeData.find(
    (employee) => employee._id === employeeId
  );

  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState({
    basicSalary: false,
    homeAllowance: false,
    medicalAllowance: false,
    transportAllowance: false,
    bonus: false,
    grossSalary: false,
  });

  // State to manage input values
  const [apiError, setApiError] = useState("");
  const [grossSalary, setGrossSalary] = useState("");
  const [inputValues, setInputValues] = useState({
    basicSalary: employeeData ? employeeData.salary : "",
    homeAllowance: employeeData
      ? employeeData.Allowances?.find((allowance) => allowance.type === "Home")
        ? employeeData.Allowances?.find(
            (allowance) => allowance.type === "Home"
          ).amount
        : ""
      : "",
    medicalAllowance: employeeData
      ? employeeData.Allowances?.find(
          (allowance) => allowance.type === "Medical"
        )
        ? employeeData.Allowances.find(
            (allowance) => allowance.type === "Medical"
          ).amount
        : ""
      : "",
    transportAllowance: employeeData
      ? employeeData.Allowances?.find(
          (allowance) => allowance.type === "Transportation"
        )
        ? employeeData.Allowances.find(
            (allowance) => allowance.type === "Transportation"
          ).amount
        : ""
      : "",
    // State to manage input values
    bonus: employeeData
      ? employeeData.bonuses
          ?.filter(
            (bonus) =>
              bonus.month ===
                new Date().toLocaleString("en-US", { month: "long" }) &&
              bonus.year === new Date().getFullYear()
          )
          .map((bonus) => bonus.bonusAmount)
          .reduce((acc, val) => acc + parseFloat(val), 0) // Sum up the bonus amounts
      : "",
    bonusReason: employeeData
      ? employeeData.bonuses
          ?.filter(
            (bonus) =>
              bonus.month ===
                new Date().toLocaleString("en-US", { month: "long" }) &&
              bonus.year === new Date().getFullYear()
          )
          .map((bonus) => bonus.bonusReason)
          .join(", ")
      : "",

    grossSalary: grossSalary,
  });

  const toggleEditMode = (field) => {
    setEditMode({ ...editMode, [field]: !editMode[field] });
  };

  const handleInputChange = (field, value) => {
    // Check if the field should only accept numbers
    const numberFields = ["basicSalary", "homeAllowance", "medicalAllowance", "transportAllowance", "bonus", "grossSalary"];
    if (numberFields.includes(field)) {
      // If the value is not a number, return without updating the state
      if (isNaN(value)) {
        return;
      }
    }
    setInputValues({ ...inputValues, [field]: value });
  };

  // Function to calculate gross salary
  const calculateGrossSalary = () => {
    let grossSalaryValue = parseFloat(inputValues.basicSalary || 0);
    grossSalaryValue += parseFloat(inputValues.homeAllowance || 0);
    grossSalaryValue += parseFloat(inputValues.medicalAllowance || 0);
    grossSalaryValue += parseFloat(inputValues.transportAllowance || 0);
    grossSalaryValue += parseFloat(inputValues.bonus || 0);
    setGrossSalary(grossSalaryValue);
    return grossSalaryValue;
  };

  useEffect(() => {
    calculateGrossSalary();
  }, [inputValues]);

  useEffect(() => {
    const currentDate = new Date();

    // Array of month names
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // Get day name (e.g., Monday, Tuesday, etc.)
    const dayName = new Intl.DateTimeFormat("en-US", {
      weekday: "long",
    }).format(currentDate);

    // Get month name (e.g., January, February, etc.)
    const monthName = monthNames[currentDate.getMonth()];

    // Set the input values with day and month
    setInputValues({
      ...inputValues,
      day: dayName,
      month: monthName,
    });
  }, []);

  // Function to handle saving changes
  const handleSaveChanges = async () => {
    // Calculate the gross salary value
    const grossSalaryValue = calculateGrossSalary();

    // Get the current date
    const currentDate = new Date();

    // Get the current month and year
    const month = new Intl.DateTimeFormat("en-US", {
      month: "long",
    }).format(currentDate);
    const year = currentDate.getFullYear();

    // Update the inputValues state with the new gross salary value, month, and year
    setInputValues({
      ...inputValues,
      grossSalary: grossSalaryValue,
      month,
      year,
      
    });

    // Prepare the data to be sent to the API
    const data = {
      medicalAllowance: {
        allowanceType: "Medical",
        amount: inputValues.medicalAllowance,
      },
      homeAllowance: {
        allowanceType: "Home",
        amount: inputValues.homeAllowance,
      },
      transportAllowance: {
        allowanceType: "Transportation",
        amount: inputValues.transportAllowance,
      },
      bonus: {
        bonusReason: inputValues.bonusReason,
        amount: inputValues.bonus,
      },
      deduction: {
        deductionReason: inputValues.deductionReason,
        amount: inputValues.deduction,
      },
      employeeId,
      month,
      year,
      email: employeesData.user.email,
      organizationId: employeesData.userType==='business_owner'? employeesData.user._id:employeesData.user.organizationId,
      userType:employeesData.userType
    };

    try {
      setApiError("");
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/UpdateEmployeeProfile",
        data
      );
      console.log(response.data);
      setLoading(false);
      dispatch(setEmployeeData(response.data));
      // console.log(response.data);
    } catch (error) {
      setLoading(false);
      setApiError(error.response.data);
      console.error("Error updating employee profile:", error);
    }
  };

  const handleGeneratePayroll = () => {
    console.log("Payroll generated");
  };

  useEffect(() => {
    const attendance = employeeData ? employeeData.attendance : [];

    // Get the current month and date
    if(employeeData.attendance){
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth(); // Get current month (0-indexed)
      const currentYear = currentDate.getFullYear(); // Get current year
  
      // Filter attendance records for the current month and year
      const attendanceForCurrentMonthAndYear = attendance.filter((record) => {
        const recordDate = new Date(record.date);
        const recordMonth = recordDate.getMonth();
        const recordYear = recordDate.getFullYear();
        return recordMonth === currentMonth && recordYear === currentYear;
      });
  
      const totalWorkingDays = attendanceForCurrentMonthAndYear.length;
      const presentDays = attendanceForCurrentMonthAndYear.filter(
        (record) => record.attendanceStatus === "present"
      ).length;
      console.log(totalWorkingDays, presentDays);
      const attendancePercentage = (presentDays / totalWorkingDays) * 100;
      const legalDays = (totalWorkingDays * 80) / 100;
      const daysOfDeduction = legalDays - presentDays;
      if (presentDays < legalDays) {
        const deductionValue = Math.floor(daysOfDeduction * 2000);
        console.log(deductionValue);
        setInputValues({
          ...inputValues,
  
          deduction: deductionValue,
          deductionReason: "Short Attendance",
        });
      }
  
      console.log(
        `Attendance percentage for the current month: ${attendancePercentage}%`
      );
    }
  
  }, []);
const handleDeleteEmployee=async()=>{
  console.log(employeeId);
  const email= employeesData.user.email;
  const organizationId= employeesData.userType==='business_owner'? employeesData.user._id:employeesData.user.organizationId;
  const userType= employeesData.userType;
  const data={email,organizationId,employeeId,userType};
  
  try {
    setApiError("");
    setLoading(true);
    const response = await axios.post(
      "http://localhost:5000/DeleteEmployee",
      data
    );
    console.log(response.data);
    setLoading(false);
    dispatch(setEmployeeData(response.data));
    navigate('/employees');

  } catch (error) {
    setLoading(false);
    setApiError(error.response.data);
    console.error("Error deleting employee profile:", error);
  }

}
  return (
    <div className={`flex flex-col md:flex-row ${
      loading ? "pointer-events-none opacity-60" : ""
    }`}>
      {/* Back button */}
      {employeesData && employeesData.userType === "business_owner" ? (
        <Link to="/CEO/dashboard/Employees">
          <ArrowBackIcon className="cursor-pointer absolute top-8 left-8 " />
        </Link>
      ) : (
        <Link to="/HR/dashboard/Employees">
          <ArrowBackIcon className="cursor-pointer absolute top-8 left-8 " />
        </Link>
      )}

      {/* Main content */}
      <div className="w-full p-16">
        {/* Dashboard overview */}
        <DashboardOverview pageName="Employee Profile" />
        {/* {loading && <div className="absolute top-12 inset-0 backdrop-filter backdrop-blur-sm z-10"></div>} */}

        {/* Employee profile details */}
        <div className="mt-10">
          <table className="bg-sec-color bg-opacity-90 text-white w-full rounded-lg border border-gray-200 shadow-lg shadow-gray-200 cursor-pointer hover:shadow-blue-200 ">
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
                  Employee Email
                </th>
                <td className="p-3 text-md font-bold">{employeeData?.email}</td>
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
                  disabled={true}
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
                  disabled={true}
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
                {loading && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <CircularProgress style={{ color: 'blue' }} />
        </div>
      )}
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
          {apiError && (
            <p className="text-red-500 font-bold mt-2">{apiError}</p>
          )}
          <div className="flex mt-8">
            <button
              className="px-4 py-2 mr-4 bg-white border border-bg-color border-2 text-black rounded-lg hover:bg-blue-100"
              onClick={handleSaveChanges}
            >
              Save Changes
            </button>
            {/* <button
              className="px-4 py-2 mr-4 bg-bg-color text-white rounded-lg hover:bg-blue-800"
              onClick={handleGeneratePayroll}
            >
              Generate Payroll
            </button> */}
            <button
              className="px-4 py-2 mr-4 bg-red-500 text-white rounded-lg hover:bg-red-800"
              onClick={handleDeleteEmployee}
            >
             {employeesData.userType==='business_owner'?'Delete HR':'Delete Employee'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeProfile;
