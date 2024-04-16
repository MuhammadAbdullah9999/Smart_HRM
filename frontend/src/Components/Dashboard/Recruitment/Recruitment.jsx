import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import DashboardOverview from "../DashboardOverview";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function Recruitment() {
  const [job, setJob] = useState([]);
  const jobs = useSelector((state) => state.Jobs.jobs);
  // console.log(jobs);

  useEffect(() => {
    setJob(jobs);
  }, [jobs]);

  return (
    <div className="flex gap-4">
      <Sidebar></Sidebar>
      <div className="w-full p-4">
        <DashboardOverview pageName="Recruitment"></DashboardOverview>
        <div className="flex mt-4">
        
          {job.map((job) => (
            <div
              key={job._id}
              className="flex flex-col gap-4 w-[40%] p-4 rounded-lg border border-black shadow-lg"
            >
              <h1 className="font-bold text-xl">{job.jobTitle}</h1>
              <p className="text-sm">
                {job.jobDescription.split("\n").slice(0, 3).join("\n")}...
              </p>
              <Link
                to={`/HR/dashboard/recruitment/applicants/${job._id}/${job.organizationId}`}
              >
                <button className="p-2 self-end rounded-md bg-sec-color text-white">
                  View
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Recruitment;
