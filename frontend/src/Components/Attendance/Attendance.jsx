import React, { useState } from "react";
import DashboardOverview from "../Dashboard/DashboardOverview";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import ReactApexChart from "react-apexcharts";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";


const Attendance = ({userType}) => {
  // const { employeeId } = useParams();
  const employeeData = useSelector((state) => state.EmployeeData.EmployeeData);
  const currentYear = new Date().getFullYear();
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toLocaleString("en-US", { month: "long" })
  );
  const [selectedYear, setSelectedYear] = useState(currentYear);

  // const employee =
  //   employeeData.userType === "employee"
  //     ? employeeData.user
  //     : employeeData.employeeData.find((emp) => emp._id === employeeId);

  const parseDate = (dateString) => {
    const date = new Date(dateString);
    return {
      year: date.getFullYear(),
      month: date.toLocaleString("en-US", { month: "long" }),
      day: date.getDate(),
      fullDate: date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };
  };

  const currentMonthAttendance =
    employeeData.user.attendance?.filter((entry) => {
      const { year, month } = parseDate(entry.date);
      return (
        year === selectedYear &&
        month.toLowerCase() === selectedMonth.toLowerCase()
      );
    }) || [];

  const presentDays = currentMonthAttendance.filter(
    (entry) => entry.attendanceStatus.toLowerCase() === "present"
  ).length;
  const absentDays = currentMonthAttendance.filter(
    (entry) => entry.attendanceStatus.toLowerCase() === "absent"
  ).length;
  const onLeaveDays = currentMonthAttendance.filter(
    (entry) => entry.attendanceStatus.toLowerCase() === "onleave"
  ).length;

  const totalDays = currentMonthAttendance.length;
  const totalAttendedDays = presentDays + onLeaveDays;
  const attendancePercentage = totalDays
    ? Math.floor((totalAttendedDays / totalDays) * 100)
    : 0;

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

  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const pieChartData = {
    series: [presentDays, absentDays, onLeaveDays],
  };

  const pieChartOptions = {
    labels: ["Present", "Absent", "On Leave"],
    colors: ["#02ed2d", "#f73e3e", "#ff9800"],
    legend: {
      position: "bottom",
    },
    chart: {
      toolbar: {
        show: false,
      },
    },
  };

  // const getLastTwoWords = (str) => {
  //   const words = str.split(" ");
  //   return words.slice(-2).join(" ");
  // };

  return (
    <div className="flex flex-col h-full px-4">
     {userType==='employee'&& <DashboardOverview pageName="Attendance" />}

      <div className="flex flex-col md:flex-row pt-6 mb-6">
        <div className="flex flex-col justify-center items-center w-full md:w-1/3 rounded-xl mb-4 md:mb-0 mr-0 md:mr-4 border border-gray-200 shadow-md shadow-gray-300 hover:shadow-blue-300 cursor-pointer">
          <p className="text-xl font-extrabold text-center p-2 rounded-md">
            <EventAvailableIcon /> {employeeData.user.employeeId}
          </p>
          <p className="text-md text-center text-gray-500">Employee ID</p>
        </div>

        <div className="w-full md:w-1/3 p-1 bg-transparent rounded-xl mb-4 md:mb-0 mr-0 md:mr-4 border border-gray-200 shadow-md shadow-gray-300 hover:shadow-blue-300 cursor-pointer">
          <div className="w-full">
            <p className="text-xl p-1 font-extrabold text-center rounded-md">
              {attendancePercentage}%
            </p>
            <p className="text-sm text-center mb-[-10px] text-gray-500">
              Attendance
            </p>
          </div>

          <div className="flex items-center justify-center">
            <ReactApexChart
              type="donut"
              height={150}
              options={pieChartOptions}
              series={pieChartData.series}
            />
          </div>
        </div>

        <div className="flex flex-col justify-center items-center w-full md:w-1/3 p-4 rounded-xl mb-4 md:mb-0 mr-0 md:mr-4 border border-gray-200 shadow-md shadow-gray-300 hover:shadow-blue-300 cursor-pointer">
          <div className="flex font-extrabold p-1 ">
            <CalendarTodayIcon fontSize="small" />
            <p className="">Month</p>
          </div>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border border-gray-300 text-center p-1 rounded-lg w-10/12 mt-2"
          >
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
          <div className="flex font-extrabold p-1 mt-4">
            <CalendarTodayIcon fontSize="small" />
            <p className="ml-2">Year</p>
          </div>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="border border-gray-300 text-center p-1 rounded-lg w-10/12 mt-2"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="text-xl font-semibold mb-4">
        Attendance Details for {selectedMonth} {selectedYear}
      </p>
      <div className={`flex flex-col border border-black bg-transparent rounded-md p-4 overflow-y-auto`}>
        <div className="flex flex-row justify-evenly font-semibold mb-2 border-b-2">
          <div className="w-1/5 text-center">
            <CalendarTodayIcon /> Date
          </div>
          {/* <div className="w-1/5 text-center">
            <AccessTimeIcon /> Check In
          </div>
          <div className="w-1/5 text-center">
            <AccessTimeIcon /> Check Out
          </div> */}
          <div className="w-1/5 text-center">
            <CheckIcon /> Status
          </div>
          <div className="w-1/5 text-center">
            <CheckIcon /> Attendance Status
          </div>
        </div>

        {currentMonthAttendance.map((detail) => {
          const { fullDate } = parseDate(detail.date);
          return (
            <div key={detail.date} className="flex flex-row justify-evenly mb-2">
              <div className="w-1/5 text-center">{fullDate}</div>
              {/* <div className="w-1/5 text-center">{detail.checkInTime}</div>
              <div className="w-1/5 text-center">{detail.checkOutTime}</div> */}
              <div className="w-1/5 text-center">
                {detail.attendanceStatus.toLowerCase() === "present" ? (
                  <CheckIcon style={{ color: "#4caf50" }} />
                ) : detail.attendanceStatus.toLowerCase() === "onleave" ? (
                  <CheckIcon style={{ color: "#ff9800" }} />
                ) : (
                  <CloseIcon style={{ color: "#f44336" }} />
                )}
              </div>
              <div className="w-1/5 text-center">
                {detail.attendanceStatus.toLowerCase() === "present"
                  ? "Present"
                  : detail.attendanceStatus.toLowerCase() === "onleave"
                  ? "On Leave"
                  : "Absent"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Attendance;
