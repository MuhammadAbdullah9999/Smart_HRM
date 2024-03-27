import React from "react";
import Dashboard from "./Components/HR/Dashboard/Dashboard";
import Home from "./Components/Intro/Home";
import Pricing from "./Components/Intro/Pricing";
import Testimonial from "./Components/Intro/Testimonial";
import WhyUs from "./Components/Intro/WhyUs";
import FAQ from "./Components/Intro/FAQ";
import Login from "./Components/Intro/Login";
import Register from "./Components/Intro/Register";
import Department from "./Components/HR/Departments/Department";
import Employees from "./Components/HR/Employees/Employees";
import EmployeeProfile from "./Components/HR/Employees/EmployeeProfile";
import AddEmployee from "./Components/HR/Employees/AddEmployee/AddEmployee";
import AttendancePage from "./Components/HR/Attendance/AttendancePage";
import Leave from './Components/HR/Leave/Leave';
import Jobs from "./Components/Jobs/Jobs";
import Payroll from "./Components/HR/Payroll/Payroll";
import ApplyJob from "./Components/Jobs/ApplyJob";
import Recruitment from "./Components/HR/Recruitment/Recruitment";
import Applicants from "./Components/HR/Recruitment/Applicants";
import MarkAttendance from "./Components/HR/Attendance/MarkAttendance"; // Import the new component
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Footer from "./Components/Intro/Footer";
import AttendanceMain from "./Components/HR/Attendance/AttendanceMain";
import CeoDashboard from "./Components/Ceo/Dashboard/CeoDashboard";
import AddAttendance from "./Components/HR/Attendance/AddAttendance";
import ForgotPassword from "./Components/HR/ForgotPassword/ForgotPassword";
import OTPVerify from "./Components/HR/ForgotPassword/OTPVerify";
import Profile from "./Components/HR/Profile/Profile";
import Setting from "./Components/HR/Setting/Setting";
import EmployeeManagement from "./Components/HR/Profile/EmployeeManagement";

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
            path="/:userType/departments"
            element={<Department></Department>}
          />
          <Route
            path="/:userType/Employees"
            element={<Employees></Employees>}
          />
           <Route
            path="/Employees/EmployeeProfile/:employeeId"
            element={<EmployeeProfile></EmployeeProfile>}
          />
          <Route path="/Jobs" element={<Jobs></Jobs>} />
          <Route path="/register" element={<Register></Register>}></Route>
          <Route
            path="/Employees/AddEmployee"
            element={<AddEmployee></AddEmployee>}
          ></Route>
          <Route
            path="/attendanceDetail/:employeeId"
            element={<AttendancePage></AttendancePage>}
          ></Route>
          <Route path="/:userType/attendance" element={<AttendanceMain></AttendanceMain>}></Route>
          <Route path="/:userType/Attendance/AddAttendance" element={<AddAttendance />} /> {/* New route for marking attendance */}
          <Route path="/:userType/Attendance/mark-attendance" element={<MarkAttendance />} />
          <Route path="/:userType/profile" element={<Profile />} />
          <Route path="/:userType/settings" element={<Setting />} />
          <Route path="/:userType/employee-management" element={<EmployeeManagement />} />
          <Route path="/:userType/leave" element={<Leave></Leave>}></Route>
          <Route path="/:userType/payroll" element={<Payroll></Payroll>}></Route>
          <Route path="/:userType/recruitment" element={<Recruitment></Recruitment>}></Route>
          <Route path="/:userType/recruitment/applicants/:jobId/:organizationId" element={<Applicants></Applicants>}></Route>

          <Route path="/:userType/ApplyJob/:orgId/:jobTitle/:jobDescription/:orgName/:jobId" element={<ApplyJob></ApplyJob>}></Route>
          <Route path="/CEO/Dashboard" element={<CeoDashboard></CeoDashboard>}></Route>
          <Route path="/reset-password/:userType/:token" element={<ForgotPassword></ForgotPassword>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
