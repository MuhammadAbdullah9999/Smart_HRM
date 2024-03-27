import React from "react";
import Sidebar from "../Dashboard/Sidebar";
import DashboardOverview from "../Dashboard/DashboardOverview";
import Button from "@mui/material/Button";
import LockIcon from "@mui/icons-material/Lock";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

const Setting = () => {
  const currentDate = new Date().toLocaleDateString();

  const handleChangePassword = () => {
    // Implement change password functionality
    console.log("Change password clicked");
  };

  const handleLogout = () => {
    // Implement logout functionality
    console.log("Logout clicked");
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-grow p-4 md:p-8">
        {/* Dashboard Overview */}
        <DashboardOverview pageName="Settings" currentDate={currentDate} />

        {/* Change Password Button */}
        <div className="mt-8">
          <Button
            variant="contained"
            startIcon={<LockIcon />}
            onClick={handleChangePassword}
          >
            Change Password
          </Button>
        </div>

        {/* Logout Button */}
        <div className="mt-4">
          <Button
            variant="contained"
            startIcon={<ExitToAppIcon />}
            onClick={handleLogout}
          >
            Log out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Setting;
