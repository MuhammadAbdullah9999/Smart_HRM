import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LoginImage from "../../../images/log1.jpg"
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CircularProgress from '@mui/material/CircularProgress';
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import InputField from "../../Styles/InputField";
import validator from "validator";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

const OTPVerify = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [OTP, setOTP] = useState('');
  const [error, setError] = useState('');
  const [apiError, setApiError] = useState("");
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setOTP(e.target.value);
    setApiError("");
  };

  const validateForm = () => {
    let isValid = true;
   
    if (validator.isEmpty(OTP)) {
        setError('Please Enter OTP');
        isValid = false;
    }

    return isValid;
  };

  const verifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateForm()) {
      return;
    }
    try {
      // Add your API call here
    } catch (error) {
      console.log(error);
      setLoading(false);
      if (error.response && error.response.data && error.response.data.error) {
        setApiError(error.response.data.error);
      } else {
        setApiError('Unknown error occurred. Please try again later.');
      }
    }
  };

  const forgotPassword = async () => {
    // Add your forgot password logic here
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
          <h2 className="text-4xl font-bold mb-4 text-white">Verify OTP</h2>
          <p className="text-lg text-white mb-6">
            Enter the OTP sent in Email
          </p>

          <form className="grid grid-cols-1 gap-6 mt-20" onSubmit={verifyOTP}>
            {/* OTP Input Field */}
            <div>
              <InputField
                label="Enter OTP"
                type="text"
                id="OTP"
                name="OTP"
                value={OTP}
                autoComplete="off"
                onChange={handleInputChange}
                focusColor="white"
                top="6"
              />
              {error && (
                <p className="text-red-800 font-bold text-xs text-left">
                  {error}
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
                <p className="text-lg font-bold">Verify</p>
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

export default OTPVerify;
