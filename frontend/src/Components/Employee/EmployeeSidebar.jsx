// src/components/Dashboard/Sidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
// import logoImage from "../../../images/avi.jpg";
import logoImage from '../../images/avi.jpg';
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import PermContactCalendarRoundedIcon from "@mui/icons-material/PermContactCalendarRounded";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import Person2RoundedIcon from "@mui/icons-material/Person2Rounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import LogoutIcon from '@mui/icons-material/Logout';
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setEmployeeData } from "../../state";

function EmployeeSidebar({ isOpen, onClose }) {
  const navigate =useNavigate();
  const dispatch = useDispatch();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const employeeData = useSelector((state) => state.EmployeeData);
  const location = useLocation();

  const isActive = (pathname) => {
    return location.pathname === pathname;
  };
  const handleLogout=()=>{
    console.log('logout')
    dispatch(setEmployeeData(null));
    navigate("/login");
  }

  return (
    <div className="h-[560px]">
      <div className="md:hidden">
        <button
          onClick={toggleSidebar}
          className="bg-gray-100 text-black mt-5 ml-5 p-2 rounded-full"
        >
          {isSidebarOpen ? <CloseRoundedIcon /> : <MenuRoundedIcon />}
        </button>
      </div>
      <aside
        className={`w-60 h-full m-3 ${
          isSidebarOpen ? "block" : "hidden"
        } md:block bg-gradient-to-b from-bg-color to-sec-color p-2 flex flex-col justify-center items-center rounded-3xl shadow-xl shadow-gray-300`}
      >
        {/* Organization Name */}
        <h1 className="text-white text-lg font-semibold mb-2 mt-4 text-center">
          DevTech Solutions
        </h1>

        {/* HR Profile */}
        <div className="flex flex-col items-center mb-5 mt-5">
          <img
            src={logoImage}
            alt="HR Profile"
            className="w-12 h-12 rounded-full mb-1"
          />
          <div className="text-center">
            <p className="text-white text-lg font-semibold mt-1">{employeeData.EmployeeData.user.name}</p>
            <p className="text-gray-300 text-sm">Employee</p>
          </div>
        </div>

        {/* Sidebar Menu */}
        <nav>
          <ul className="space-y-1 w-full">
            <SidebarItem
              to="/Employee/dashboard"
              label="Dashboard"
              isActive={isActive("/dashboard")}
              onClose={onClose}
              icon={
                <DashboardRoundedIcon
                  style={{ color: "white", fontSize: 20 }}
                />
              }
            />
           
            <SidebarItem
              to={`/dashboard/attendanceDetail/${employeeData.user._id}`}
              label="Attendance"
              isActive={isActive("/dashboard/attendance")}
              onClose={onClose}
              icon={
                <PermContactCalendarRoundedIcon
                  style={{ color: "white", fontSize: 20 }}
                />
              }
            />
            <SidebarItem
              to="/Employee/dashboard/leave"
              label="Leave"
              isActive={isActive("/dashboard/leave")}
              onClose={onClose}
              icon={
                <EventRoundedIcon style={{ color: "white", fontSize: 20 }} />
              }
            />
            
            <SidebarItem
              to="/Employee/dashboard/profile"
              label="Profile"
              isActive={isActive("/dashboard/profile")}
              onClose={onClose}
              icon={
                <Person2RoundedIcon style={{ color: "white", fontSize: 20 }} />
              }
            />
            <SidebarItem
              to="#"
              onClick={handleLogout}
              label="Logout"
              isActive={isActive("#")}
              onClose={onClose}
              icon={
                <LogoutIcon style={{ color: "white", fontSize: 20 }} />
              }
            />
          </ul>
        </nav>
      </aside>
    </div>
  );
}

// Sidebar Item Component
function SidebarItem({ to, icon, label, isActive, onClose, onClick }) {
  const content = (
    <div className={`flex items-center justify-between text-white py-2 md:py-1.5 mb-1 hover:bg-blue-600 hover:rounded-2xl ${
      isActive ? "bg-bg-color pr-3 rounded-2xl" : ""
    }`}>
      <div className="flex items-center ml-5">
        <span className="mr-2">{icon}</span>
        <span className="text-md ml-1">{label}</span>
      </div>
    </div>
  );

  return (
    <li className="w-full" onClick={onClick ? onClick : onClose}>
      {to ? <Link to={to} onClick={onClose}>{content}</Link> : content}
    </li>
  );
}

export default EmployeeSidebar;
