import React, { useState, useEffect } from "react";
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { useSelector } from 'react-redux';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';

function DashboardFunctionalities({ toDoList, newTask, setNewTask, handleAddToDo, handleDeleteToDo, loading }) {
  const employeeData = useSelector(state => state.EmployeeData.EmployeeData);

  const [announcements, setAnnouncements] = useState([]);
  const [announcementLoading, setAnnouncementLoading] = useState(false);
  const organizationId = employeeData.user.organizationId;

  useEffect(() => {
    // Fetch announcements initially
    const fetchAnnouncements = async () => {
      try {
        setAnnouncementLoading(true);
        const response = await axios.get(
          `http://localhost:5000/Announcement/GetAnnouncements/${organizationId}`
        );
        if (response) {
          setAnnouncementLoading(false);
          console.log(
            "Announcements:",
            response.data.announcement.announcements
          );

          // Filter announcements whose date has not passed
          const currentDate = new Date();
          const filteredAnnouncements =
            response.data.announcement.announcements.filter((announcement) => {
              const announcementDate = new Date(announcement.date);
              return announcementDate >= currentDate; // Filter announcements whose date has not passed
            });

          setAnnouncements(filteredAnnouncements);
        }
      } catch (error) {
        setAnnouncementLoading(false);
        console.error("Error fetching announcements:", error);
      }
    };

    fetchAnnouncements();
  }, [organizationId]);

  return (
    <div className={`mt-8 grid grid-cols-1 md:grid-cols-${employeeData.userType === 'employee' ? '1' : '2'} gap-4 rounded-lg`}>
      {/* Notifications Section */}
      {employeeData.userType !== 'employee' && (
        <div className="bg-gray-100 rounded-xl p-4 shadow-md shadow-gray-200">
          <h2 className="text-xl font-semibold mb-4">Announcements</h2>
          {announcementLoading ? (
            <div className="text-center">
              <CircularProgress />
            </div>
          ) : (
            <ul>
              {announcements.length === 0 ? (
                <li>No new announcements</li>
              ) : (
                announcements.map((announcement, index) => (
                  <li key={index} className="flex items-center mb-2">
                    <span className="bg-blue-500 w-4 h-4 mr-2 rounded-full"></span>
                    {announcement.title} - {new Date(announcement.date).toLocaleDateString()}
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      )}

      {/* To-Do List Section */}
      <div className={`bg-gray-100 rounded-xl p-4 shadow-md shadow-gray-200 ${loading ? 'opacity-70' : ''}`}>
        {loading && (
          <div className="absolute inset-0 backdrop-filter backdrop-blur-sm z-10"></div>
        )}
        <h2 className="text-xl font-semibold mb-4">To-Do List</h2>
        <div className="flex items-center justify-center mt-5 mb-8">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add new task..."
            className="mr-5 h-10 p-3 border rounded-xl outline-none w-2/4"
          />
          <div
            onClick={handleAddToDo}
            className="bg-sec-color text-white p-2 rounded-full cursor-pointer hover:bg-blue-600 flex items-center"
            style={{ fontSize: '0.4rem', padding: '0.4rem' }}
          >
            <AddRoundedIcon />
          </div>
        </div>
        <ul className="list-disc list-inside">
          {toDoList && toDoList.map((item, index) => (
            <li key={index} className="flex items-center justify-between mb-2 relative ml-2">
              <div className="flex items-center">
                <div className="list-item ">{item.task}</div>
              </div>
              <div
                onClick={() => handleDeleteToDo(index)}
                className="cursor-pointer text-sec-color ml-2"
              >
                <DeleteRoundedIcon />
              </div>
            </li>
          ))}
          {loading && (
            <div className="relative top-1/2 left-1/2 transform -translate-x-[0%] -translate-y-1/2 z-20">
              <CircularProgress style={{ color: "blue" }} />
            </div>
          )}
        </ul>
      </div>
    </div>
  );
}

export default DashboardFunctionalities;
