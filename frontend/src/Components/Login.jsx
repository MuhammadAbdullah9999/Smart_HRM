import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LoginImage from "../images/log1.jpg";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CircularProgress from '@mui/material/CircularProgress';
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import InputField from "./Styles/InputField";
import validator from "validator";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setEmployeeData } from "../state/index";
import { setJobs } from "../state/JobsSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "hafizzabdullah@gmail.com",
    password: "123456",
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

    if (!validator.isEmail(formData.email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }
    if (validator.isEmpty(formData.email)) {
      newErrors.email = "Email is required";
      isValid = false;
    }

    if (validator.isEmpty(formData.password)) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateForm()) {
      return;
    }
    try {
      setErrors({});
      const response = await axios.post(
        "http://localhost:5000/Login",
        formData
      );

      if (response.data) {
        console.log(response.data)
        if(response.data.userType === "business_owner"){
          dispatch(setEmployeeData(response.data));
          setLoading(false);
          navigate(`/CEO/dashboard`);
          return;
        }
        else if(response.data.userType === "HR"){
          dispatch(setJobs(response.data.jobs.jobs));
          dispatch(setEmployeeData(response.data));
          setUser(response.data);
          setLoading(false);
          navigate(`/HR/dashboard`, { state: { data: response.data } });
        }
        else if(response.data.userType === "employee"){
          // dispatch(setJobs(response.data.jobs.jobs));
          dispatch(setEmployeeData(response.data));
          setUser(response.data);
          setLoading(false);
          navigate(`/Employee/dashboard`, { state: { data: response.data } });
        }
        
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      setApiError(error.response.data.error);
    }
  };

  const forgotPassword=async()=>{
    try{
      const response=await axios.post('http://localhost:5000/ForgotPassword',formData);
      console.log(response.data);
      if(response.data){
        alert(response.data.message)
      }
    }
    catch(error){
      console.log(error);
      setApiError(error.response.data.error)
    }
    
  }
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
          <h2 className="text-5xl font-bold mb-4 text-white">Login</h2>
          <p className="text-lg text-white mb-6">
            Enter your credentials to login
          </p>

          <form className="grid grid-cols-1 gap-6 mt-20" onSubmit={handleLogin}>
            {/* Email */}
            <div>
              <InputField
                label="Email"
                type="text"
                id="email"
                name="email"
                value={formData.email}
                autoComplete="off"
                onChange={handleInputChange}
                focusColor="white"
                top="6"
              />
              {errors.email && (
                <p className="text-red-800 font-bold text-xs text-left">
                  {errors.email}
                </p>
              )}
            </div>
            {/* Password */}
            <div>
              <InputField
                label="Password"
                type="password"
                id="password"
                name="password"
                value={formData.password}
                autoComplete="off"
                onChange={handleInputChange}
                focusColor="white"
                top="6"
              />
              <p className="text-white text-xs text-start underline cursor-pointer active:text-gray-400" onClick={forgotPassword}>Forgot Password ?</p>
              {errors.password && (
                <p className="text-red-800 font-bold text-xs text-left">
                  {errors.password}
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
                <p className="text-lg font-bold">Login</p>
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

export default Login;
