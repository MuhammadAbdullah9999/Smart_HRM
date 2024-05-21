import React from 'react';
import Sidebar from '../Dashboard/Sidebar';
import Attendance from './Attendance';
import CeoSidebar from '../Ceo/Dashboard/CeoSidebar';
import EmployeeSidebar from '../Employee/EmployeeSidebar';
import { useSelector } from "react-redux";

const AttendancePage = () => {
  const data = useSelector((state) => state.EmployeeData.EmployeeData);
  
  return (
    <div className="flex h-screen bg-white-100">
      {data && data.userType === "business_owner" ? (
        <CeoSidebar />
      ) : (
        data && data.userType === "employee" ? (
          <EmployeeSidebar />
        ) : (
          <Sidebar />
        )
      )}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <Attendance userType={data.userType} />
        </main>
      </div>
    </div>
  );
};

export default AttendancePage;
