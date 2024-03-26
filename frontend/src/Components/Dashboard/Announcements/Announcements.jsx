import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import CeoSidebar from "../../Ceo/Dashboard/CeoSidebar";
import DashboardOverview from "../DashboardOverview";
import validator from "validator";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CircularProgress from '@mui/material/CircularProgress';

const Announcements = () => {
  const employeeData = useSelector((state) => state.EmployeeData.EmployeeData);

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [errors, setErrors] = useState({});
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiError,setApiError]=useState('');

  const navigate = useNavigate();

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!validator.isLength(title.trim(), { min: 1 })) {
      errors.title = "Title is required";
      isValid = false;
    }

    if (!validator.isISO8601(date)) {
      errors.date = "Date is required";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const handleAddAnnouncement = async () => {
    if (validateForm()) {
      try {
        setLoading(true);
        const response = await axios.post("http://localhost:5000/Announcement/AddAnnouncement", {
          organizationId: employeeData.user._id,
          title: title,
          date: date,
        });
        if(response){
            setLoading(false);
            console.log("Response:", response);
        setAnnouncements(response.data.announcement.announcements);
        }
        
      } catch (error) {
        setApiError(error.response.data.message)
        setLoading(false);
        console.error("Error:", error);
      }

      // Clear the fields after adding announcement
      setTitle("");
      setDate("");
    }
  };

  const handleDeleteAnnouncement = async (announcementId) => {
    try {
        setLoading(true);
      const response = await axios.delete(`http://localhost:5000/Announcement/DeleteAnnouncement/${announcementId}/${employeeData.user._id}`);
      if(response){
            setLoading(false);
            console.log("Response:", response);
      setAnnouncements(announcements.filter(announcement => announcement._id !== announcementId));
      }
      
    } catch (error) {
        setApiError(error.response.data.message)
        setLoading(false)
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    // Fetch announcements initially
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/Announcement/GetAnnouncements/${employeeData.user._id}`);
        if(response){
            setLoading(false);
            console.log("Announcements:", response.data.announcement.announcements);
            setAnnouncements(response.data.announcement.announcements);
        }
       
      } catch (error) {
        setApiError(error.response.data.message)
        setLoading(false);
        console.error("Error fetching announcements:", error);
      }
    };

    fetchAnnouncements();
  }, [employeeData]);

  return (
    <div className="flex flex-col md:flex-row">
          {loading && <div className="absolute inset-0 backdrop-filter backdrop-blur-sm z-10"></div>}
      <CeoSidebar></CeoSidebar>
      {/* Main content */}
      <div className="flex-grow p-4 md:p-8">
        {/* Dashboard Overview with date */}
        <div>
          <DashboardOverview pageName="Announcements" />
        </div>
        {/* Announcement Form */}
        <div className="announcement-form border border-gray-300 shadow-md p-4 rounded">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={handleTitleChange}
                className="border border-gray-300 px-3 py-2 rounded w-full"
              />
              {errors.title && (
                <span className="text-red-500">{errors.title}</span>
              )}
            </div>
            <div>
              <input
                type="date"
                value={date}
                onChange={handleDateChange}
                className="border border-gray-300 px-3 py-2 rounded w-full"
              />
              {errors.date && (
                <span className="text-red-500">{errors.date}</span>
              )}
            </div>
          </div>
          <button
            onClick={handleAddAnnouncement}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4"
          >
            Add Announcement
          </button>
        </div>
        {/* Table to display announcements */}
        {<p className="font-bold text-red-500">{apiError}</p>}
        {announcements.length > 0 ? ( 
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Announcements</h2>
            <table className="table-auto w-full">
              <thead>
                <tr>
                  <th className="border px-4 py-2">Title</th>
                  <th className="border px-4 py-2">Date</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {announcements.map((announcement) => (
                  <tr key={announcement._id}>
                    <td className="border px-4 py-2">{announcement.title}</td>
                    <td className="border px-4 py-2">{announcement.date}</td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => handleDeleteAnnouncement(announcement._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ):(<p className="mt-8 text-center font-bold">No Announcements to Show !!!</p>)}
        {loading && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <CircularProgress style={{ color: 'blue' }} />
        </div>
      )}
      </div>
    </div>
  );
};

export default Announcements;
