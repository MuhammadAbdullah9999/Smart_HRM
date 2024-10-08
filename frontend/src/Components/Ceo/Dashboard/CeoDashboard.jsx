import CeoSidebar from "./CeoSidebar";
import Card from "../Styles/CeoDashboardCard";
import DashboardOverview from "../../Dashboard/DashboardOverview";
import { useSelector } from "react-redux";
import axios from "axios";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";

function CeoDashboard() {
  const employeeData = useSelector((state) => state.EmployeeData.EmployeeData);
  console.log(employeeData);

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchAnnouncementsAndDashboardData = async () => {
      try {
        setLoading(true);
        const data = await axios.get(`http://localhost:5000/GetDashboardData/${employeeData.userType}/${employeeData.user._id}`);
        // console.log(data.data);

        setDashboardData(data.data);
        const response = await axios.get(`http://localhost:5000/Announcement/GetAnnouncements/${employeeData.user._id}`);
        if (response) {
          setLoading(false);
          console.log("Announcements:", response.data.announcement.announcements);

          // Filter announcements for the current month and whose date has not passed
          const currentDate = new Date();
          const filteredAnnouncements = response.data.announcement.announcements.filter((announcement) => {
            const announcementDate = new Date(announcement.date);
            return announcementDate >= currentDate; // Filter announcements whose date has not passed
          });

          setAnnouncements(filteredAnnouncements);
        }
      } catch (error) {
        setLoading(false);
        console.error("Error fetching announcements:", error);
      }
    };

    fetchAnnouncementsAndDashboardData();
  }, [employeeData]);

  return (
    <div className="flex flex-col md:flex-row h-screen md:gap-8">
      <CeoSidebar />
      <div className="w-full">
        <div className="p-4">
          <DashboardOverview pageName="Dashboard"></DashboardOverview>
        </div>
        <div className="flex flex-col h-[70%] justify-between">
          <div className="flex justify-center md:justify-start flex-wrap gap-4 pl-4">
            <Card
              cardText="Employees"
              cardNumber={dashboardData ? dashboardData.noOfEmployees : '-'}
              bgColor="blue-500"
            ></Card>
            <Card
              cardText="Departments"
              cardNumber={dashboardData && dashboardData.noOfDepartments ? dashboardData.noOfDepartments.uniqueDepartmentsCount : '-'}
              bgColor="green-500"
            ></Card>
            <Card
              cardText="HRs"
              cardNumber={employeeData.noOfHRs}
              bgColor="red-500"
            ></Card>
            <Card
              cardText="Leave Request"
              cardNumber={dashboardData ? dashboardData.pendingLeaveRequests : '-'}
              bgColor="blue-500"
            ></Card>
          </div>
          <div>
            <div className="border border-gray-200 shadow-gray-300 shadow-lg w-11/12 m-auto flex flex-col gap-4 rounded-lg self-end">
              <div className="flex flex-col items-center px-4 mt-4">
                <h1 className="font-bold md:text-xl sm:text-lg">
                  Notice Board
                </h1>
                <p className="sm:text-base md:text-lg">
                  Important Announcements
                </p>
              </div>

              <hr className="border-gray-400"></hr>
              <div className="flex justify-between px-6 mb-4">
                <h2 className="font-bold">Title</h2>
                <h2 className="font-bold">Date</h2>
              </div>
              {loading && (
                <div className="text-center">
                  <CircularProgress></CircularProgress>
                </div>
              )}
              {announcements.map((announcement, index) => (
                <div key={index} className="flex justify-between px-4 mb-4">
                  <p className="md:text-lg sm:text-sm">{announcement.title}</p>
                  <p className="md:text-lg sm:text-sm">{announcement.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CeoDashboard;
