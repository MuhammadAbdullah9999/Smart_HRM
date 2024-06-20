import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import InputField from "../Styles/InputField";
import CircularProgress from "@mui/material/CircularProgress";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/GetJobs");
        if (response) {
          setLoading(false);
          // console.log(response.data)
        }
        setJobs(response.data);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching jobs:", error.message);
        setError(error.message);
      }
    };

    fetchJobs();
  }, []);

  const totalJobs = jobs.reduce(
    (count, organization) => count + organization.jobArray.length,
    0
  );

  const filteredJobs = jobs.filter((organization) =>
    organization.jobArray.some(
      (job) =>
        job.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        organization.organizationName
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div
      className={`bg-sec-color ${
        loading ? "pointer-events-none" : ""
      } min-h-screen`}
    >
      {loading && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <CircularProgress color="primary" />
        </div>
      )}

      <Link to="/">
        <ArrowBackIcon className="cursor-pointer absolute top-8 left-8 text-white" />
      </Link>
      <div className="w-9/12 m-auto">
        <div className="pt-12 text-2xl font-bold text-white">
          <p>Total {totalJobs} Jobs Available</p>
          <hr className="mt-2"></hr>
        </div>
        <div className="w-1/2 mt-8">
          <InputField
            label="Search Jobs"
            type="text"
            id="search"
            name="search"
            autoComplete="off"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            focusColor="sec-color"
            top="6"
          />
        </div>
        <div className="w-full">
          {filteredJobs.map((organization) => (
            <div key={organization.organizationId}>
              {organization.jobArray && organization.jobArray.length > 0 ? (
                organization.jobArray.map((job) => (
                  <div className="py-8" key={job.jobTitle}>
                    <div className="flex justify-between flex-wrap bg-white text-black rounded-xl p-4">
                      <div className="flex flex-col gap-4 sm:w-full md:w-9/12 ">
                        <h2>{organization.organizationName}</h2>
                        <p className="font-bold text-2xl">{job.jobTitle}</p>
                       
                        <p className="text-sm text-justify">
                        <span className="font-bold">Job Description: </span>
                          {job.jobDescription
                            .split("\n")
                            .slice(0, 3)
                            .join("\n")}
                        </p>
                        <p><span className="font-bold">Location:</span> {job.location}</p>
                        <p><span className="font-bold">Status:</span> {job.status}</p>
                        <p><span className="font-bold">Type: </span>{job.jobType}</p> {/* Display job type */}
                        <p><span className="font-bold">Requirements:</span> {job.requirements}</p>{" "}
                        {/* Display job requirements */}
                        <p><span className="font-bold">No. of Positions:</span> {job.noOfPositions}</p>{" "}
                        {/* Display number of positions */}
                      </div>

                      <div className="flex flex-col justify-center gap-4 lg:w-auto lg:mt-0 mt-4 w-full">
                        {/* <div className="w-full">
                          <button className="w-full p-2 bg-bg-color text-white rounded-xl active:bg-sec-color hover:shadow-gray-500 hover:shadow-lg">
                            Apply Now
                          </button>
                        </div> */}

                        <div className="w-full">
                          <Link
                            to={`/ApplyJob/${
                              organization.organizationId
                            }/${encodeURIComponent(
                              job.jobTitle
                            )}/${encodeURIComponent(
                              job.jobDescription
                            )}/${encodeURIComponent(
                              organization.organizationName
                            )}/${encodeURIComponent(job._id)}`}
                          >
                            <button className="w-full p-2 bg-bg-color text-white rounded-xl active:bg-sec-color hover:shadow-gray-500 hover:shadow-lg">
                              Open Now
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No jobs available</p>
              )}
            </div>
          ))}
          {error && (
            <div className="text-red-800 font-bold text-center text-2xl mt-8">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Jobs;
