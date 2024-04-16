import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import DashboardOverview from "../DashboardOverview";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";

function Recruitment() {
  const [job, setJob] = useState([]);
  const jobs = useSelector((state) => state.Jobs.jobs);

  useEffect(() => {
    setJob(jobs);
  }, [jobs]);

  return (
    <div className="flex gap-4">
      <Sidebar></Sidebar>
      <div className="w-full p-4">
        <DashboardOverview pageName="Recruitment"></DashboardOverview>
        <div className="mt-4">
        <Link to="/HR/dashboard/recruitment/postjob">
          <button className="bg-bg-color px-3 py-2 rounded-3xl text-white mb-4 border-none font-bold text-center cursor-pointer transition duration-400 hover:shadow-lg hover:shadow-gray-400 active:transform active:scale-97 active:shadow-lg">
            <AddIcon></AddIcon>Post Job
          </button>
        </Link>
          {job.map((job) => (
            <div
              key={job._id}
              className="flex flex-col gap-4 w-[40%] p-4 rounded-lg border border-gray-300 shadow-lg shadow-gray-200"
            >
              <h1 className="font-bold text-xl">{job.jobTitle}</h1>
              <p className="text-sm">
                {job.jobDescription.split("\n").slice(0, 3).join("\n")}...
              </p>
              <Link
                to={`/HR/dashboard/recruitment/applicants/${job._id}/${job.organizationId}`}
              >
                <button className="px-4 py-2 self-end rounded-xl font-bold bg-bg-color text-white hover:bg-blue-800">
                  Open
                </button>
              </Link>{" "}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Recruitment;
