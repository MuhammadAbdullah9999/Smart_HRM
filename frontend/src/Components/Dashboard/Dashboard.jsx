import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import DashboardContent from "./DashboardContent";
import { useSelector } from 'react-redux';
import axios from 'axios';

function Dashboard() {
  const employeeData = useSelector(state => state.EmployeeData.EmployeeData);
  console.log(employeeData);

  const [userData, setUserData] = useState(null);
  const [organizationData, setOrganizationData] = useState(null);

  useEffect(() => {
    console.log("employeeData", employeeData);

    // Check if employeeData is available and not null
    if (employeeData) {
  
      setUserData(employeeData);

      setOrganizationData({
        totalEmployees: employeeData.employeeData.length || 0,
        totalDepartments: employeeData.departments?.uniqueDepartmentsCount || 0,
        totalLeaveRequest: employeeData.totalLeavesRequestPending || 0,
      });
    }
  }, [employeeData]);

  // Render a loading state if organizationData is still null
  if (!organizationData) {
    return (
      <div className="flex flex-col md:flex-row h-screen">
        <Sidebar></Sidebar>
        <div className='flex-1 flex flex-col overflow-hidden bg-color'>
          <main className="flex-1 overflow-x-hidden overflow-y-auto">
            <p>Loading...</p>
          </main>
        </div>
      </div>
    );
  }

  return (
  
    <div className="flex flex-col md:flex-row h-screen">
      {/* <img
      src={`data:image/jpeg;base64,${employeeData.employeeData[9].image}`}
    alt="Employee Image"
  /> */}
      <Sidebar></Sidebar>
      <div className='flex-1 flex flex-col overflow-hidden bg-color'>
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <DashboardContent data={organizationData} />
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
