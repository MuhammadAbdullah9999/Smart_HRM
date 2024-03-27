import React, { useState } from "react";
import axios from "axios";
import RegisterImage from "../../images/reg7.jpg";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import InputField from "../Styles/InputField";
import validator from 'validator'
import { Link } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from "react-router-dom";
const Register = () => {
  const navigate=useNavigate();
  
  const employeesOptions = [
    { start: 1, end: 10, label: "1 - 10" },
    { start: 11, end: 20, label: "11 - 20" },
    { start: 21, end: 30, label: "21 - 30" },
    // Add more ranges as needed
  ];

  const hrOptions = Array.from({ length: 10 }, (_, i) => i + 1);

  const [formData, setFormData] = useState({
    orgName: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    phoneNumber: "",
    numberOfEmployees: "",
    numberOfHrs: "",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading,setLoading]=useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setApiError(null);
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    // Email validation
    if (!validator.isEmail(formData.email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    // Password validation
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Password must be at least 8 characters and include letters, numbers, and special characters";
      isValid = false;
    }

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    // Check for empty fields
    for (const key in formData) {
      if (formData[key].trim() === "") {
        newErrors[key] = "This field is required";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Form validation
    if (!validateForm()) {
      return;
    }

    // Make axios call
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/SignUp",  // Update with your actual backend API endpoint
        formData
      );

      if(response){
        setLoading(false);
        navigate('/Login');
      }
      console.log(response.data);
      // Handle success
    } catch (error) {
      setLoading(false);
      setApiError(error.response.data.error)
      console.error(error.response.data.error);
      // Handle error
    }
  };

  return (
    <div className={`flex flex-col sm:flex-row w-full min-h-screen ${loading ? 'pointer-events-none opacity-70' : ''} `}>
     {loading && (
          <div className="absolute top-1/2 left-[74%] z-10 transform -translate-x-1/2 -translate-y-1/2">
            <CircularProgress color="inherit" />
          </div>
        )}
      {/* Container with Image */}
      <div className="flex-1 justify-center items-center">
        <Link to='/'><ArrowBackIcon className="cursor-pointer absolute top-8 left-8 text-black" /></Link>
        <img
          src={RegisterImage}
          alt="background"
          className="w-auto md:w-full md:mt-40 sm:mt-48"
        />
      </div>

      {/* Form Container */}
      <div className="flex-1 bg-sec-color p-8 shadow-md text-center">
        <h2 className="text-3xl font-bold mb-4 text-white mt-4 md:mt-1 sm:mt-5">Register your Organization</h2>
        <p className="md:text-md sm:text-sm mb-4 text-white">Sign Up as a Super Admin of your organization</p>
        <form className="grid grid-cols-1 gap-6 md:gap-5 lg:gap-6 sm:mt-10 md:mt-14 lg:mt-16 mt-12 text-left sm:grid-cols-2" onSubmit={handleRegister}>
          {/* Organization Name */}
          <InputField
            label="Organization Name"
            type="text"
            id="orgName"
            name="orgName"
            autoComplete="off"
            value={formData.orgName}
            error={errors.orgName}
            onChange={handleInputChange}
            focusColor="white"
            top="6"
          />

          {/* Email */}
          <InputField
            label="Email"
            type="email"
            id="email"
            name="email"
            autoComplete="off"
            value={formData.email}
            error={errors.email}
            onChange={handleInputChange}
            focusColor="white"
            top="6"
          />

          {/* Password */}
          <InputField
            label="Password"
            type="password"
            id="password"
            name="password"
            autoComplete="off"
            value={formData.password}
            error={errors.password}
            onChange={handleInputChange}
            focusColor="white"
            top="6"
          />

          {/* Confirm Password */}
          <InputField
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            autoComplete="off"
            value={formData.confirmPassword}
            error={errors.confirmPassword}
            onChange={handleInputChange}
            focusColor="white"
            top="6"
          />

          {/* Address */}
          <InputField
            label="Address"
            type="text"
            id="address"
            name="address"
            autoComplete="off"
            value={formData.address}
            error={errors.address}
            onChange={handleInputChange}
            focusColor="white"
            top="6"
          />

          {/* Phone Number */}
          <InputField
            label="Phone Number"
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            autoComplete="off"
            value={formData.phoneNumber}
            error={errors.phoneNumber}
            onChange={handleInputChange}
            focusColor="white"
            top="6"
          />

          {/* Number of Employees */}
          <div className="mb-4 relative">
            <label
              htmlFor="numberOfEmployees"
              className={`absolute transition-all duration-300 ${
                formData.numberOfEmployees ? "text-sm text-white -top-6 left-1" : "top-2 left-3 text-gray-500 text-xs md:text-sm lg:text-sm"
              }`}
            >
              {formData.numberOfEmployees ? "No of Employees" : ""}
            </label>
            <select
              id="numberOfEmployees"
              name="numberOfEmployees"
              className={`p-2 border rounded w-full outline-none ${
                formData.numberOfEmployees ? "text-black" : "text-gray-500"
              } bg-white`}
              autoComplete="off"
              value={formData.numberOfEmployees}
              onChange={handleInputChange}
            >
              <option value="">Number of Employees</option>
              {employeesOptions.map((option, index) => (
                <option key={index} value={`${option.start}-${option.end}`}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.numberOfEmployees && (
              <p className="text-red-800 font-bold text-xs mt-1">{errors.numberOfEmployees}</p>
            )}
          </div>

          {/* Number of HRs */}
          <div className="mb-4 relative">
            <label
              htmlFor="numberOfHrs"
              className={`absolute transition-all duration-300 ${
                formData.numberOfHrs ? "text-sm text-white -top-6 left-1" : "top-2 left-3 text-gray-500 text-xs md:text-sm lg:text-sm"
              }`}
            >
              {formData.numberOfHrs ? "No of HRs" : ""}
            </label>
            <select
              id="numberOfHrs"
              name="numberOfHrs"
              className={`p-2 border rounded w-full outline-none ${
                formData.numberOfHrs ? "text-black" : "text-gray-500"
              } bg-white`}
              autoComplete="off"
              value={formData.numberOfHrs}
              onChange={handleInputChange}
            >
              <option value="">Number of HRs</option>
              {hrOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.numberOfHrs && (
              <p className="text-red-800 font-bold text-xs mt-1">{errors.numberOfHrs}</p>
            )}
          </div>

          {/* Submit Button */}
          {apiError && (
            <p className="text-red-800 font-bold text-xs mt-3 w-full">{apiError}</p>
          )}
          <button
            type="submit"
            className="flex justify-center sm:col-span-2 bg-bg-color text-white px-4 py-2 rounded cursor-pointer lg:mt-6 md:mt-4"
          >
            <ExitToAppOutlinedIcon className="mr-1"></ExitToAppOutlinedIcon>
            <p className="text-1xl font-bold">Register</p>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
