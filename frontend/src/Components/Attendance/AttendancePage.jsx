// Components/Dashboard/AttendancePage.jsx
import React from 'react';
import Sidebar from '../Dashboard/Sidebar';
import Attendance from './Attendance';

const AttendancePage = () => {
  return (
    <div className="flex h-screen bg-white-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <Attendance />
        </main>
      </div>
    </div>
  );
};

export default AttendancePage;
