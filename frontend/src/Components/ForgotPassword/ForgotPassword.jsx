import React, { useState, useEffect } from "react";
import axios from "axios";
import {useParams, useNavigate } from "react-router-dom";
import LoginImage from "../../images/log1.jpg"
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CircularProgress from '@mui/material/CircularProgress';
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import InputField from "../Styles/InputField";
import validator from "validator";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setEmployeeData } from "../../state/index";
import { setJobs } from "../../state/JobsSlice";

const ForgotPassword = () => {
    const { userType, token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setApiError("");
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};
  
    // if (validator.isEmpty(formData.password)) {
    //   newErrors.password = "Password is required";
    //   isValid = false;
    // } else if (!validator.isLength(formData.password, { min: 8 })) {
    //   newErrors.password = "Password must be at least 8 characters long";
    //   isValid = false;
    // } else if (!validator.isAlphanumeric(formData.password)) {
    //   newErrors.password = "Password must contain alphanumeric characters";
    //   isValid = false;
    // }
  
    // if (validator.isEmpty(formData.confirmPassword)) {
    //   newErrors.confirmPassword = "Confirm Password is required";
    //   isValid = false;
    // } else if (formData.password !== formData.confirmPassword) {
    //   newErrors.confirmPassword = "Passwords do not match";
    //   isValid = false;
    // }
  
    setErrors(newErrors);
    return isValid;
  };
  

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    try {
        setLoading(true);
        const data={
            userType:userType,
            token:token,
            password:formData.password
        }
        console.log(data)

      const response = await axios.post(
        "http://localhost:5000/ResetPassword",
        data
      );

      if (response.data) {
        setLoading(false);
        console.log(response.data)
        navigate(`/login`);
        
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      setApiError(error.response.data.error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Background blur effect */}
      {loading && <div className="absolute inset-0 backdrop-filter backdrop-blur-sm z-10"></div>}
      
      {/* Left Section */}
      <div className="w-full md:w-1/2 p-4 h-full">
        <Link to='/'><ArrowBackIcon className="cursor-pointer absolute top-8 left-8 text-black" /></Link>
        <img
          src={LoginImage}
          alt="login"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Section */}
      <div className="bg-sec-color w-full md:w-1/2 p-4 flex items-center justify-center h-full">
        <div className="bg-sec-color p-8 text-center max-w-md mx-auto">
          <h2 className="text-4xl font-bold mb-4 text-white">Reset Password</h2>
          <p className="text-lg text-white mb-6">
            Enter password to reset
          </p>

          <form className="grid grid-cols-1 gap-6 mt-20" onSubmit={handleResetPassword}>
            {/* Email */}
            <div>
              <InputField
                label="Password"
                type="text"
                id="password"
                name="password"
                value={formData.password}
                autoComplete="off"
                onChange={handleInputChange}
                focusColor="white"
                top="6"
              />
              {errors.password && (
                <p className="text-red-800 font-bold text-xs text-left">
                  {errors.password}
                </p>
              )}
            </div>
            {/* Password */}
            <div>
              <InputField
                label="confirmPassword"
                type="confirmPassword"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                autoComplete="off"
                onChange={handleInputChange}
                focusColor="white"
                top="6"
              />
              {errors.confirmPassword && (
                <p className="text-red-800 font-bold text-xs text-left">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
            {apiError && (
              <p className="text-red-800 font-bold text-xs text-left w-full">
                {apiError}
              </p>
            )}

            {/* Submit Button */}
            <div className="mb-4">
              <button className="flex justify-center bg-bg-color text-white p-1 rounded cursor-pointer w-full mt-4 active:text-sec-color active:bg-white">
                <LoginOutlinedIcon className="mr-2" />
                <p className="text-lg font-bold">Reset Password</p>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Circular progress */}
      {loading && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <CircularProgress style={{ color: 'blue' }} />
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
