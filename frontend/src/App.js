import React from "react";
import Dashboard from "./Components/Dashboard/Dashboard";
import Home from "./Components/Intro/Home";
import Pricing from "./Components/Intro/Pricing";
import Testimonial from "./Components/Intro/Testimonial";
import WhyUs from "./Components/Intro/WhyUs";
import FAQ from "./Components/Intro/FAQ";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Department from "./Components/Dashboard/Departments/Department";
import Employees from "./Components/Dashboard/Employees/Employees";
import EmployeeProfile from "./Components/Dashboard/Employees/EmployeeProfile";
import AddEmployee from "./Components/Dashboard/Employees/AddEmployee/AddEmployee";
import AttendancePage from "./Components/Attendance/AttendancePage";
import Leave from './Components/Dashboard/Leave/Leave'
import Jobs from "./Components/Jobs/Jobs";
import Payroll from "./Components/Dashboard/Payroll/Payroll";
import ApplyJob from "./Components/Jobs/ApplyJob";
import Recruitment from "./Components/Dashboard/Recruitment/Recruitment";
import Applicants from "./Components/Dashboard/Recruitment/Applicants";
import MarkAttendance from "./Components/Attendance/MarkAttendance"; // Import the new component
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Footer from "./Components/Intro/Footer";
import AttendanceMain from "./Components/Attendance/AttendanceMain";
import CeoDashboard from "./Components/Ceo/Dashboard/CeoDashboard";
import AddAttendance from "./Components/Attendance/AddAttendance";
import ForgotPassword from "./Components/ForgotPassword/ForgotPassword";
import Announcements from "./Components/Dashboard/Announcements/Announcements";
import OTPVerify from "./Components/ForgotPassword/OTPVerify";
import Profile from "./Components/Profile/Profile";
import Setting from "./Components/Setting/Setting";
import LeaveApplication from "./Components/LeaveApplication/LeaveApplication";
import EmployeeDashboard from "./Components/Employee/EmployeeDashboard/EmployeeDashboard";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Home></Home>
                <Pricing></Pricing>
                <WhyUs></WhyUs>
                <Testimonial></Testimonial>
                <FAQ></FAQ>
                <Footer></Footer>
              </>
            }
          ></Route>
          <Route path="/login" element={<Login></Login>}></Route>
          <Route path="/:userType/dashboard" element={<Dashboard></Dashboard>} />
          <Route
            path="/:userType/dashboard/departments"
            element={<Department></Department>}
          />
          <Route
            path="/:userType/dashboard/Employees"
            element={<Employees></Employees>}
          />
           <Route
            path="/dashboard/Employees/EmployeeProfile/:employeeId"
            element={<EmployeeProfile></EmployeeProfile>}
          />
          <Route path="/Jobs" element={<Jobs></Jobs>} />
          <Route path="/register" element={<Register></Register>}></Route>
          <Route
            path="/dashboard/Employees/AddEmployee"
            element={<AddEmployee></AddEmployee>}
          ></Route>
          <Route
            path="/dashboard/attendanceDetail/:employeeId"
            element={<AttendancePage></AttendancePage>}
          ></Route>
          <Route path="/:userType/dashboard/attendance" element={<AttendanceMain></AttendanceMain>}></Route>
          <Route path="/:userType/dashboard/Attendance/AddAttendance" element={<AddAttendance />} /> {/* New route for marking attendance */}
          <Route path="/:userType/dashboard/Attendance/mark-attendance" element={<MarkAttendance />} />
          <Route path="/:userType/dashboard/profile" element={<Profile />} />
          <Route path="/:userType/dashboard/settings" element={<Setting />} />
          <Route path="/:userType/dashboard/leave" element={<Leave></Leave>}></Route>
          <Route path="/:userType/dashboard/payroll" element={<Payroll></Payroll>}></Route>
          <Route path="/:userType/dashboard/recruitment" element={<Recruitment></Recruitment>}></Route>
          <Route path="/:userType/dashboard/recruitment/applicants/:jobId/:organizationId" element={<Applicants></Applicants>}></Route>

          <Route path="/ApplyJob/:orgId/:jobTitle/:jobDescription/:orgName/:jobId" element={<ApplyJob></ApplyJob>}></Route>
          <Route path="/CEO/Dashboard" element={<CeoDashboard></CeoDashboard>}></Route>
          <Route path="/reset-password/:userType/:token" element={<ForgotPassword></ForgotPassword>}></Route>
          <Route path="/CEO/dashboard/Announcements" element={<Announcements></Announcements>}></Route>
          <Route path="/dashboard/leave/applyLeave" element={<LeaveApplication></LeaveApplication>}></Route>

          <Route path="/Employee/Dashboard" element={<EmployeeDashboard></EmployeeDashboard>}></Route>

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
