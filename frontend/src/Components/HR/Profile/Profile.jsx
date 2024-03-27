import React, { useState } from "react";
import Sidebar from "../Dashboard/Sidebar";
import DashboardOverview from "../Dashboard/DashboardOverview";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

const Profile = () => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isEditingPic, setIsEditingPic] = useState(false);
  const [profileData, setProfileData] = useState({
    profilePic: "",
    name: "Samir",
    designation: "HR Manager",
    email: "samir@gmail.com",
    phoneNumber: "03123456789",
  });

  // Dummy data for attendance, leaves, and salary
  const [attendance, setAttendance] = useState("85%");
  const [leaves, setLeaves] = useState("5");
  const [salary, setSalary] = useState("$5000");

  const handleChangeProfileData = (field, value) => {
    setProfileData({ ...profileData, [field]: value });
  };

  const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileData({ ...profileData, profilePic: reader.result });
      };
      reader.readAsDataURL(file);
      setIsEditingPic(false); // Hide the edit options after uploading the image
    }
  };

  const handleSubmit = () => {
    console.log("Updated Profile Data:", profileData);
    setIsEditingName(false);
    setIsEditingEmail(false);
    setIsEditingPhone(false);
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-grow p-4 md:p-8">
        {/* Dashboard Overview */}
        <DashboardOverview pageName="Profile" />

        {/* Profile and Additional Information Sections */}
        <div className="flex flex-col md:flex-row md:space-x-8">
          {/* Profile Section */}
          <div className="flex-grow md:w-2/5 border border-gray-300 rounded-md p-4 mb-4 md:mb-0">
            {/* Profile Picture */}
            <div className="flex justify-center items-center relative">
              <label htmlFor="profile-pic-upload">
                <Avatar alt="Profile Picture" src={profileData.profilePic} sx={{ width: 65, height: 65 }} />
                {isEditingPic && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
                    <input
                      accept="image/*"
                      id="profile-pic-upload"
                      type="file"
                      style={{ display: "none" }}
                      onChange={handleProfilePicChange}
                    />
                  </div>
                )}
                {!isEditingPic && (
                  <IconButton
                    onClick={() => setIsEditingPic(true)}
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
                  >
                    <EditIcon />
                  </IconButton>
                )}
              </label>
            </div>
            {/* Designation */}
            <div className="text-center mt-2">
              <p>{profileData.designation}</p>
            </div>
            {/* Personal Info */}
            <hr className="my-4" />
            <h3 className="text-lg font-semibold mb-2">Personal Info</h3>
            {/* Profile Details */}
            <div className="flex flex-col items-center md:text-left">
              <div className="flex items-center justify-between w-full mb-4">
                <TextField
                  label="Name"
                  value={profileData.name}
                  onChange={(e) => handleChangeProfileData("name", e.target.value)}
                  className="mt-2 mr-2"
                  style={{ width: "100%" }}
                  disabled={!isEditingName}
                />
                <IconButton
                  color="primary"
                  onClick={() => setIsEditingName(!isEditingName)}
                >
                  <EditIcon />
                </IconButton>
              </div>
              <div className="flex items-center justify-between w-full mb-4">
                <TextField
                  label="Email"
                  value={profileData.email}
                  onChange={(e) => handleChangeProfileData("email", e.target.value)}
                  className="mt-2 mr-2"
                  style={{ width: "100%" }}
                  disabled={!isEditingEmail}
                  error={!isValidEmail(profileData.email)}
                />
                <IconButton
                  color="primary"
                  onClick={() => setIsEditingEmail(!isEditingEmail)}
                >
                  <EditIcon />
                </IconButton>
              </div>
              <div className="flex items-center justify-between w-full mb-4">
                <TextField
                  label="Phone Number"
                  value={profileData.phoneNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
                    handleChangeProfileData("phoneNumber", value);
                  }}
                  className="mt-2 mr-2"
                  style={{ width: "100%" }}
                  disabled={!isEditingPhone}
                  error={!isValidPhoneNumber(profileData.phoneNumber)}
                />
                <IconButton
                  color="primary"
                  onClick={() => setIsEditingPhone(!isEditingPhone)}
                >
                  <EditIcon />
                </IconButton>
              </div>
              {/* Save Changes Button */}
              {(isEditingName || isEditingEmail || isEditingPhone) && (
                <Button variant="contained" color="primary" className="mt-4" onClick={handleSubmit}>
                  Save Changes
                </Button>
              )}
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="flex flex-col space-y-4 md:w-3/5">
            {/* Attendance Box */}
            <div className="border border-gray-300 rounded-md p-4 bg-white shadow-md mb-4">
              <h3 className="text-lg font-semibold mb-2">Attendance</h3>
              <p>{attendance}</p>
            </div>

            {/* Leaves Box */}
            <div className="border border-gray-300 rounded-md p-4 bg-white shadow-md mb-4">
              <h3 className="text-lg font-semibold mb-2">Leaves</h3>
              <p>{leaves}</p>
            </div>

            {/* Salary Box */}
            <div className="border border-gray-300 rounded-md p-4 bg-white shadow-md">
              <h3 className="text-lg font-semibold mb-2">Salary</h3>
              <p>{salary}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

// Function to check if email is valid
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Function to check if phone number is valid (10 digits)
const isValidPhoneNumber = (phoneNumber) => {
  return /^\d{11}$/.test(phoneNumber);
};
