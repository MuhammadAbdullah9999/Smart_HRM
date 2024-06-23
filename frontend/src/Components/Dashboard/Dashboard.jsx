import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import DashboardContent from "./DashboardContent";
import { useSelector } from 'react-redux';
import axios from 'axios';

function Dashboard() {
  const employeeData = useSelector(state => state.EmployeeData.EmployeeData);
  console.log(employeeData);

  const [userData, setUserData] = useState(null);
  const [job, setJob] = useState([]);
  const [organizationData, setOrganizationData] = useState(null);

  useEffect(() => {
    console.log("employeeData", employeeData);

    const fetchJobsAndDashboardData = async () => {
      try {
        // Fetch jobs
        const jobResponse = await axios.get(`http://localhost:5000/jobs/${employeeData.user.organizationId}`);
        const jobs = jobResponse.data || [];
        console.log(jobs.length);
        setJob(jobs);

        // Fetch dashboard data
        const dashboardResponse = await axios.get(`http://localhost:5000/GetDashboardData/${employeeData.userType}/${employeeData.user.organizationId}`);
        const dashboardData = dashboardResponse.data;
        
        // Set organization data
        setOrganizationData({
          totalEmployees: dashboardData?.noOfEmployees || 0,
          totalDepartments: dashboardData?.noOfDepartments?.uniqueDepartmentsCount || 0,
          totalLeaveRequest: dashboardData?.pendingLeaveRequests || 0,
          totalJobs: jobs.length || 0
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Check if employeeData is available and not null
    if (employeeData) {
      setUserData(employeeData);
      fetchJobsAndDashboardData();
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
