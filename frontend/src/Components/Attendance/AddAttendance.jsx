import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Sidebar from "../Dashboard/Sidebar";
import DashboardOverview from "../Dashboard/DashboardOverview";

const AddAttendance = () => {
  const [formData, setFormData] = useState({
    month: "",
    date: new Date(),
    checkInTime: new Date(), // Initialize with a date object for both date and time
    checkOutTime: new Date(),
    attendanceStatus: "Present",
  });

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      date,
    });
  };

  const handleTimeChange = (name, time) => {
    setFormData({
      ...formData,
      [name]: time,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  
  const timeOptions = [
    "9:00:am",
    "10:00:am",
    "11:00:am",
    "12:00:pm",
    "1:00:pm",
    "2:00:pm",
    "3:00:pm",
    "4:00:pm",
    "5:00:pm",
    "6:00:pm",
    "7:00:pm",
    "8:00:pm",
    "9:00:pm",
    "10:00:pm",
    "11:00:pm",
  ];

  const attendanceStatusOptions = ["Present", "Absent"];

  return (
    <div className="flex gap-8 w-full">
      <Sidebar />
      <div className="w-full mr-8">
        <DashboardOverview pageName="Add Attendance" />
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <div>
            <label htmlFor="month" className="block text-sm font-medium text-gray-700">
              Month
            </label>
            <select
              id="month"
              name="month"
              value={formData.month}
              onChange={handleInputChange}
              className="mt-1 p-2 block w-full rounded-md border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200"
            >
              <option value="" disabled>
                Select Month
              </option>
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <DatePicker
              id="date"
              name="date"
              selected={formData.date}
              onChange={handleDateChange}
              className="mt-1 p-2 block w-full rounded-md border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
          <div>
            <label htmlFor="checkInTime" className="block text-sm font-medium text-gray-700">
              Check In Time
            </label>
            <select
              id="checkInTime"
              name="checkInTime"
              value={formData.checkInTime}
              onChange={handleInputChange}
              className="mt-1 p-2 block w-full rounded-md border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200"
            >
              {timeOptions.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="checkOutTime" className="block text-sm font-medium text-gray-700">
              Check Out Time
            </label>
            <select
              id="checkOutTime"
              name="checkOutTime"
              value={formData.checkOutTime}
              onChange={handleInputChange}
              className="mt-1 p-2 block w-full rounded-md border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200"
            >
              {timeOptions.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>


          <div>
            <label htmlFor="attendanceStatus" className="block text-sm font-medium text-gray-700">
              Attendance Status
            </label>
            <select
              id="attendanceStatus"
              name="attendanceStatus"
              value={formData.attendanceStatus}
              onChange={handleInputChange}
              className="mt-1 p-2 block w-full rounded-md border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200"
            >
              {attendanceStatusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-2">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 mt-4 rounded-lg active:bg-white  hover:shadow-lg">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAttendance;
