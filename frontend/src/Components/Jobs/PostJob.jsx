import React, { useState } from "react";
import axios from 'axios';
import validator from "validator";
import Sidebar from "../Dashboard/Sidebar";
import DashboardOverview from "../Dashboard/DashboardOverview";
import { useSelector } from "react-redux";


function PostJob() {
    const data = useSelector((state) => state.EmployeeData.EmployeeData);

    const [formData, setFormData] = useState({
        jobTitle: "",
        jobDescription: "",
        jobType: "",
        requirements: "",
        noOfPositions: "",
    });
    const [errors, setErrors] = useState({});

    const handleChange = (event) => {
        const { name, value } = event.target;
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    };

    const validateForm = () => {
        let tempErrors = {};
        tempErrors.jobTitle = validator.isEmpty(formData.jobTitle) ? "Job TItle is required." : "";
        tempErrors.jobDescription = validator.isEmpty(formData.jobDescription) ? "Job Description is required." : "";
        tempErrors.jobType = validator.isEmpty(formData.jobType) ? "Job Type is required." : "";
        tempErrors.requirements = validator.isEmpty(formData.requirements) ? "Requirements are required." : "";
        tempErrors.noOfPositions = validator.isEmpty(formData.noOfPositions) || !validator.isNumeric(formData.noOfPositions) ? "Number of Positions is required and must be a number." : "";

        setErrors(tempErrors);
        return Object.values(tempErrors).every((x) => x === "");
    };



    return (
        <div className="flex gap-4">
            <Sidebar />
            <div className="flex flex-col w-full">
                <DashboardOverview pageName="Job Posting" />
                <h3 className="text-2xl font-bold text-center mt-4">Job Form</h3>
                <div className="flex items-center justify-center w-full p-4">
                    <div className="w-full overflow-auto p-4 border rounded-lg shadow max-h-[75vh]">
                        <form className="space-y-4">
                            <div>
                                <label htmlFor="jobTitle" className="block">Job Title</label>
                                <input
                                    type="text"
                                    name="jobTitle"
                                    onChange={handleChange}
                                    value={formData.jobTitle}
                                    className="w-full p-2 border rounded-md"
                                />
                                {errors.jobTitle && <p className="text-red-500">{errors.jobTitle}</p>}
                            </div>
                            <div className="col-span-2">
                                <label htmlFor="jobDescription">Job Description</label>
                                <textarea
                                    id="jobDescription"
                                    name="jobDescription"
                                    rows="3"
                                    onChange={handleChange}
                                    value={formData.jobDescription}
                                    className="w-full p-2 border rounded-md outline-none"
                                />
                                {errors.jobDescription && <p className="text-red-500">{errors.jobDescription}</p>}
                            </div>
                            <div>
                                <label htmlFor="jobType">Type</label>
                                <select
                                    name="jobType"
                                    id="jobType"
                                    onChange={handleChange}
                                    value={formData.jobType}
                                    className="w-full p-2 border rounded-md"
                                >
                                    <option value="Full Time">Full Time</option>
                                    <option value="Part Time">Part Time</option>

                                </select>
                                {errors.jobType && <p className="text-red-500">{errors.jobType}</p>}
                            </div>
                            <div>
                                <label htmlFor="leaveReason">Requirements</label>
                                <textarea
                                    name="leaveReason"
                                    onChange={handleChange}
                                    value={formData.requirements}
                                    className="w-full p-2 border rounded-md"
                                />
                                {errors.requirements && <p className="text-red-500">{errors.requirements}</p>}
                            </div>
                            <div>
                                <label htmlFor="leaveDays">No of Positions</label>
                                <input
                                    type="text"
                                    name="leaveDays"
                                    onChange={handleChange}
                                    value={formData.leaveDays}
                                    className="w-full p-2 border rounded-md"
                                />
                                {errors.noOfPositions && <p className="text-red-500">{errors.noOfPositions}</p>}
                            </div>

                            <button
                                type="submit"
                                className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                            >
                                Add Job
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PostJob;
