import React, { useState } from "react";
import Sidebar from "../Dashboard/Sidebar";
import DashboardOverview from "../Dashboard/DashboardOverview";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";

const Profile = () => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isEditingPic, setIsEditingPic] = useState(false);
  const [profileData, setProfileData] = useState({
    profilePic: "../../images/avi.jpg",
    name: "John Doe",
    designation: "Manager",
    email: "john.doe@example.com",
    phoneNumber: "1234567890",
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
    }
  };

  const handleSubmit = () => {
    console.log("Updated Profile Data:", profileData);
    setIsEditingName(false);
    setIsEditingEmail(false);
    setIsEditingPhone(false);
    setIsEditingPic(false);
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
          <div className="flex-grow md:w-3/5 border border-gray-300 rounded-md p-4 mb-4 md:mb-0">
            {/* Profile Picture */}
            <div className="flex justify-center items-center mb-4">
              {isEditingPic ? (
                <div className="relative">
                  <Avatar alt="Profile Picture" src={profileData.profilePic} sx={{ width: 100, height: 100 }} />
                  <input
                    accept="image/*"
                    id="profile-pic-upload"
                    type="file"
                    style={{ display: "none" }}
                    onChange={handleProfilePicChange}
                  />
                  <label htmlFor="profile-pic-upload">
                    <Button
                      variant="contained"
                      component="span"
                      className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2"
                    >
                      Upload
                    </Button>
                  </label>
                </div>
              ) : (
                <Avatar alt="Profile Picture" src={profileData.profilePic} sx={{ width: 100, height: 100 }} />
              )}
              {isEditingPic && (
                <Button
                  variant="outlined"
                  onClick={() => setIsEditingPic(false)}
                  className="mt-2"
                >
                  Cancel
                </Button>
              )}
              {!isEditingPic && (
                <Button
                  variant="outlined"
                  onClick={() => setIsEditingPic(true)}
                  className="mt-2"
                >
                  Edit
                </Button>
              )}
            </div>
            {/* Profile Details */}
            <div className="flex flex-col items-center md:text-left">
              <div className="flex items-center justify-center md:justify-start">
                <TextField
                  label="Name"
                  value={profileData.name}
                  onChange={(e) => handleChangeProfileData("name", e.target.value)}
                  className="mt-2 mr-2"
                  style={{ width: "calc(50% - 4px)" }}
                  disabled={!isEditingName}
                />
                {isEditingName ? (
                  <Button
                    variant="outlined"
                    onClick={() => setIsEditingName(false)}
                  >
                    Cancel
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    onClick={() => setIsEditingName(true)}
                  >
                    Edit
                  </Button>
                )}
              </div>
              <TextField
                label="Email"
                value={profileData.email}
                onChange={(e) => handleChangeProfileData("email", e.target.value)}
                className="mt-2"
                style={{ width: "100%" }}
                disabled={!isEditingEmail}
              />
              <TextField
                label="Phone Number"
                value={profileData.phoneNumber}
                onChange={(e) => handleChangeProfileData("phoneNumber", e.target.value)}
                className="mt-2"
                style={{ width: "100%" }}
                disabled={!isEditingPhone}
              />
              {(isEditingEmail || isEditingPhone) && (
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
