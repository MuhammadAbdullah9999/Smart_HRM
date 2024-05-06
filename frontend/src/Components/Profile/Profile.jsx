import React, { useState } from "react";
import Sidebar from "../Dashboard/Sidebar";
import DashboardOverview from "../Dashboard/DashboardOverview";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";
import CeoSidebar from "../Ceo/Dashboard/CeoSidebar";
import EmployeeSidebar from "../Employee/EmployeeSidebar";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { useSelector } from "react-redux";
import axios from "axios";

const Profile = () => {
  const data = useSelector((state) => state.EmployeeData.EmployeeData);
  console.log(data);

  const [changed, setChanged] = useState(false); // New state to track if any field has been changed

  const [profileData, setProfileData] = useState({
    profilePic: "",
    email: data.user.email,
    contact: data.user.contact,
    password: "", // New password field
    userId: data.user._id,
    userType: data.userType,
  });

  const handleChangeProfileData = (field, value) => {
    setProfileData({ ...profileData, [field]: value });
    setChanged(true); // Set changed state to true when any input field changes
  };

  const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileData({ ...profileData, profilePic: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    console.log("Updated Profile Data:", profileData);
    try {
      const response = await axios.put(
        "http://localhost:5000/UpdateUser",
        profileData
      );
      console.log(response);
    } catch (error) {
      console.error(error);
    }
    setChanged(false); // Reset changed state
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      {data && data.userType === "business_owner" ? (
        <CeoSidebar />
      ) : data && data.userType === "employee" ? (
        <EmployeeSidebar />
      ) : (
        <Sidebar />
      )}
      {/* Main content */}
      <div className="flex-grow p-4 md:p-8">
        {/* Dashboard Overview */}
        <DashboardOverview pageName="Profile" />

        {/* Profile and Additional Information Sections */}
        <div className="flex flex-col md:flex-row md:space-x-8">
          {/* Profile Section */}
          <div className="flex-grow md:w-2/5 border border-gray-300 rounded-md p-4 md:mb-0">
            {/* Profile Picture */}
            <div className="flex justify-center items-center relative">
              <label htmlFor="profile-pic-upload">
                <Avatar
                  alt="Profile Picture"
                  src={profileData.profilePic}
                  sx={{ width: 70, height: 70 }}
                />
                <input
                  accept="image/*"
                  id="profile-pic-upload"
                  type="file"
                  style={{ display: "none" }}
                  onChange={handleProfilePicChange}
                />
                <IconButton
                  onClick={() =>
                    document.getElementById("profile-pic-upload").click()
                  }
                  className="absolute bottom-8 left-16 transform -translate-x-1/3"
                >
                  <PhotoCameraIcon style={{ color: "black" }} />
                </IconButton>
              </label>
            </div>
            {/* Personal Info */}
            <hr className="my-4" />
            <h3 className="text-lg font-semibold mb-4">Personal Info</h3>
            {/* Profile Details */}
            <div className="flex flex-col items-center md:text-left">
              <div className="flex items-center justify-between w-full mb-4">
                <TextField
                  label="Email"
                  value={profileData.email}
                  onChange={(e) =>
                    handleChangeProfileData("email", e.target.value)
                  }
                  className="mt-2 mr-2"
                  style={{ width: "100%" }}
                />
              </div>
              <div className="flex items-center justify-between w-full mb-4">
                <TextField
                  label="Phone Number"
                  value={profileData.contact}
                  onChange={(e) =>
                    handleChangeProfileData("contact", e.target.value)
                  }
                  className="mt-2 mr-2"
                  style={{ width: "100%" }}
                />
              </div>
              {/* New Password Field */}
              <div className="flex items-center justify-between w-full mb-4">
                <TextField
                  label="New Password"
                  type="password"
                  value={profileData.password}
                  onChange={(e) =>
                    handleChangeProfileData("password", e.target.value)
                  }
                  className="mt-2 mr-2"
                  style={{ width: "100%" }}
                />
              </div>
              {/* Save Changes Button */}
              {/* Show save button if any field changes */}
              {changed && (
                <Button
                  variant="contained"
                  color="primary"
                  className="mt-4"
                  onClick={handleSubmit}
                >
                  Save Changes
                </Button>
              )}
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Card */}
            <div className="border border-gray-300 rounded-md p-4 bg-white shadow-md">
              <h3 className="text-lg font-semibold mb-4">Attendance</h3>
              <p className="text-2xl">85%</p> {/* Placeholder for attendance data */}
            </div>

            {/* Second Card */}
            <div className="border border-gray-300 rounded-md p-4 bg-white shadow-md">
              <h3 className="text-lg font-semibold mb-4">Leaves</h3>
              <p  className="text-2xl">5</p> {/* Placeholder for leaves data */}
            </div>

            {/* Third Card */}
            <div className="border border-gray-300 rounded-md p-4 bg-white shadow-md">
              <h3 className="text-lg font-semibold mb-4">Base Salary</h3>
              <p  className="text-2xl">{data.user.salary}</p> {/* Placeholder for salary data */}
            </div>

            {/* Fourth Card */}
            {data.user.Allowances.map((allowance, index) => (
              <div
                key={index}
                className="border border-gray-300 rounded-md p-4 bg-white shadow-md"
              >
                <h3 className="text-lg font-semibold mb-2">
                  {allowance.type} Allowance
                </h3>
                <p  className="text-2xl">{allowance.amount}</p> {/* Placeholder for allowance data */}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
