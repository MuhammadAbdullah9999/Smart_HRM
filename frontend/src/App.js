// App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Components/Intro/Home';
import Pricing from './Components/Intro/Pricing';
import WhyUs from './Components/Intro/WhyUs';
import Testimonial from './Components/Intro/Testimonial';
import FAQ from './Components/Intro/FAQ';
import Footer from './Components/Intro/Footer';
import Login from './Components/Login';
import Register from './Components/Register';
import Dashboard from './Components/Dashboard/Dashboard';
import Department from './Components/Dashboard/Departments/Department';
import Employees from './Components/Dashboard/Employees/Employees';
import AddEmployee from './Components/Dashboard/Employees/AddEmployee/AddEmployee';
import AttendancePage from './Components/Attendance/AttendancePage';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Home />
                <Pricing />
                <WhyUs />
                <Testimonial />
                <FAQ />
                <Footer />
              </>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/HR/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/departments" element={<Department />} />
          <Route path="/dashboard/Employees" element={<Employees />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard/Employees/AddEmployee"
            element={<AddEmployee />}
          />
          <Route path="/attendance" element={<AttendancePage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
