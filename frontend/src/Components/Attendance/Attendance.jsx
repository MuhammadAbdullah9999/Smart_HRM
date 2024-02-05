// Components/Dashboard/Attendance.jsx
import React, { useState, useEffect } from 'react';
import DashboardOverview from '../Dashboard/DashboardOverview';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ReactApexChart from 'react-apexcharts';

const Attendance = () => {
    const [employeeID] = useState('EMP001');
    const [attendancePercentage] = useState(70); // Hardcoded attendance percentage
    const [selectedMonth, setSelectedMonth] = useState('January');
    const [sidebarDate, setSidebarDate] = useState(new Date());

    const attendanceDetails = [
        { date: '2024-01-01', checkIn: '09:00 AM', checkOut: '06:00 PM', status: 'Present' },
        { date: '2024-01-02', checkIn: '09:15 AM', checkOut: '05:45 PM', status: 'Present' },
        { date: '2024-01-01', checkIn: '09:00 AM', checkOut: '06:00 PM', status: 'Absent' },
        { date: '2024-01-02', checkIn: '09:15 AM', checkOut: '05:45 PM', status: 'Present' },
        // Add more details for other days
    ];

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const pieChartData = {
        labels: ['Present', 'Absent'],
        series: [attendancePercentage, 100 - attendancePercentage],
    };

    const pieChartOptions = {
        labels: ['Present', 'Absent'],
        colors: ['#4caf50', '#f44336'],
        legend: {
            position: 'left',
        },
    };

    return (
        <div className="flex flex-col h-full p-4">
            {/* Include DashboardOverview for page name and date */}
            <DashboardOverview pageName="Attendance" />

            {/* Upper Section */}
            <div className="flex flex-row pt-6 mb-8">
                <div className="w-1/3 p-4 bg-transparent rounded-xl mr-4  border border-black ">
                    <p className="text-xl font-extrabold text-center p-2 rounded-md"><EventAvailableIcon /> {employeeID}</p>
                    <p className="text-sm text-center">Employee ID</p>
                </div>

                <div className="w-1/3 p-1 bg-transparent rounded-xl mr-4 border border-black">
                    {/* Attendance Percentage Section */}
                    <div className="w-1/2">
                        <p className="text-xl p-1 font-extrabold text-center rounded-md">
                            {attendancePercentage}%
                        </p>
                        <p className="text-sm text-center mb-[-10px]">Attendance</p>
                    </div>

                    {/* Pie Chart Section */}
                    <div className="flex items-center justify-center mb-[-10px] ">
                        <ReactApexChart
                            type="donut"
                            height={90}
                            options={pieChartOptions}
                            series={pieChartData.series}
                        />
                    </div>
                </div>


                <div className="w-1/3 p-4 bg-transparent rounded-xl mr-4  border border-black ">
                    <p className="text-xl font-extrabold text-center p-2 rounded-md"><CalendarTodayIcon /> Month</p>
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="border border-gray-300 text-center p-2 bg-transparent rounded-md w-full"
                    >
                        {months.map((month) => (
                            <option key={month} value={month}>
                                {month}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Bottom Section - Attendance Details */}
            <p className="text-xl font-semibold mb-4">Attendance Details for {selectedMonth}</p>
            <div className="flex flex-col border border-black bg-transparent rounded-md p-4">

                {/* Headings */}
                <div className="flex flex-row font-semibold mb-2 border-b-2">
                    <div className="w-1/4"><CalendarTodayIcon /> Date</div>
                    <div className="w-1/4"><AccessTimeIcon /> Check In</div>
                    <div className="w-1/4"><AccessTimeIcon /> Check Out</div>
                    <div className="w-1/4"><CheckIcon /> Status</div>
                </div>

                {/* Attendance Details Data */}
                {attendanceDetails.map((detail) => (
                    <div key={detail.date} className="flex flex-row mb-2">
                        <div className="w-1/4">{detail.date}</div>
                        <div className="w-1/4">{detail.checkIn}</div>
                        <div className="w-1/4">{detail.checkOut}</div>
                        <div className="w-1/4">{detail.status === 'Present' ? <CheckIcon style={{ color: '#4caf50' }} /> : <CloseIcon style={{ color: '#f44336' }} />}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Attendance;
