import React, { useState } from "react";
import Sidebar from "../Dashboard/Sidebar";
import DashboardOverview from "../Dashboard/DashboardOverview";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import CeoSidebar from "../Ceo/Dashboard/CeoSidebar";
import EmployeeSidebar from "../Employee/EmployeeSidebar";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { useSelector } from "react-redux";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setEmployeeData } from "../../state";

const Profile = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.EmployeeData.EmployeeData);

  const [changed, setChanged] = useState(false);

  const [profileData, setProfileData] = useState({
    profilePic: "",
    email: data.user.email,
    contact: data.user.contact,
    password: "",
    userId: data.user._id,
    userType: data.userType,
  });

  const handleChangeProfileData = (field, value) => {
    setProfileData({ ...profileData, [field]: value });
    setChanged(true);
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
      console.log("response is", response);
      const updatedUserData = { ...data, user: response.data.user };

      dispatch(setEmployeeData(updatedUserData));
    } catch (error) {
      console.error(error);
    }
    setChanged(false);
  };

  const filterCurrentMonthAttendance = (records) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    return records.filter((record) => {
      const recordDate = new Date(record.date);
      return (
        recordDate.getMonth() === currentMonth &&
        recordDate.getFullYear() === currentYear
      );
    });
  };

  const calculateAttendancePercentage = (records) => {
    if (!records || records.length === 0) {
      return { presentPercentage: "0%", absentCount: 0 };
    }

    const filteredRecords = filterCurrentMonthAttendance(records);
    const totalDays = filteredRecords.length;
    let presentCount = 0;
    let absentCount = 0;

    filteredRecords.forEach((record) => {
      if (
        record.attendanceStatus.toLowerCase() === "present" ||
        record.attendanceStatus.toLowerCase() === "onleave"
      ) {
        presentCount++;
      } else if (record.attendanceStatus.toLowerCase() === "absent") {
        absentCount++;
      }
    });

    const presentPercentage = totalDays ? (presentCount / totalDays) * 100 : 0;

    return {
      presentPercentage: presentPercentage.toFixed(0) + "%",
      absentCount,
    };
  };
  const percentages = calculateAttendancePercentage(data?.user?.attendance);

  let leaveCount=0;
  data.user.leaveRequest.map((leave)=>{
    if(leave.status.toLowerCase()==="approved"){
      
    // const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const leaveDates = leave.leaveDate.split(" to ");
    const leaveStartDate = new Date(leaveDates[0]);
    // const leaveEndDate = new Date(leaveDates[1]);
    if(leaveStartDate.getFullYear()===currentYear){
      leaveCount++;
    }
    }
  })
  return (
    <div className="flex">
      {data && data.userType === "business_owner" ? (
        <CeoSidebar />
      ) : data && data.userType === "employee" ? (
        <EmployeeSidebar />
      ) : (
        <Sidebar />
      )}
      <div className="flex-grow p-4 md:p-8">
        <DashboardOverview pageName="Profile" />
        <div className="flex flex-col md:flex-row md:space-x-8">
          <div className="flex-grow md:w-2/5 border border-gray-300 rounded-md p-4 md:mb-0">
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
            <hr className="my-4" />
            <h3 className="text-lg font-semibold mb-4">Personal Info</h3>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="hover:shadow-blue-200 shadow-gray-200 cursor-pointer border border-gray-300 rounded-md p-4 bg-white shadow-md">
              <h3 className="text-md font-light mb-4">Attendance</h3>
              <p className="text-2xl">{percentages.presentPercentage}</p>
            </div>
            <div className="hover:shadow-blue-200 shadow-gray-200 cursor-pointer border border-gray-300 rounded-md p-4 bg-white shadow-md">
              <h3 className="text-md font-light mb-4">Leaves</h3>
              <p className="text-2xl font-thin">{leaveCount}</p>
            </div>
            <div className="hover:shadow-blue-200 shadow-gray-200 cursor-pointer border border-gray-300 rounded-md p-4 bg-white shadow-md">
              <h3 className="text-md font-light mb-4">Base Salary</h3>
              <p className="text-2xl font-light">{data.user.salary}</p>
            </div>
            {data.user.Allowances.map((allowance, index) => (
              <div
                key={index}
                className="hover:shadow-blue-200 shadow-gray-200 cursor-pointer border border-gray-300 rounded-md p-4 bg-white shadow-md"
              >
                <h3 className="text-md font-light mb-2">
                  {allowance.type} Allowance
                </h3>
                <p className="text-2xl">{allowance.amount}</p>
              </div>
            ))}
          </div>
        </div>
      </div>  
    </div>
  );
};

export default Profile;
