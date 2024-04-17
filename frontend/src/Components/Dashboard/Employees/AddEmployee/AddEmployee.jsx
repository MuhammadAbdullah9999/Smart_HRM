
import React, { useState, useEffect } from "react";
import axios from "axios";
import validator from "validator";
import InputField from "../../../Styles/InputField";
import Sidebar from "../../Sidebar";
import Add from "@mui/icons-material/Add";
import { useSelector } from "react-redux";
import DashboardOverview from "../../DashboardOverview";
import { useDispatch } from "react-redux";
import { setEmployeeData } from "../../../../state";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import CeoSidebar from "../../../Ceo/Dashboard/CeoSidebar";

const AddEmployee = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const employeeData = useSelector((state) => state.EmployeeData.EmployeeData);
  console.log(employeeData)
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    organizationId: employeeData.userType==='business_owner'?employeeData.user._id: employeeData.user.organizationId,
    hrEmail: employeeData.user.email,
    employeeId: "021",
    name:"usama",
    position: "software engineer",
    department: employeeData.userType === "business_owner" ? "human resource" : "",
    dateOfBirth: "12-04-1977",
    contact: "0321111222333",
    email: "usama@devsinc.com",
    password: "123456",
    salary: "50000",
    allowances: "0",
    image: null,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    const getDepartments = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/Departments/GetDepartments/${employeeData.user.organizationId}`);
        setDepartments(response.data.departments);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    // Fetch departments only if user is not a business owner
    if (employeeData.userType !== "business_owner") {
      getDepartments();
    }
  }, [employeeData.user.organizationId, employeeData.userType]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear the error message when the user starts typing
    setErrors({
      ...errors,
      [name]: "",
      image: "",
    });
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
  
    setErrors({
      ...errors,
      image: "",
    });
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Perform form validation
    let hasErrors = false;
  
    if (!validator.isEmail(formData.email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Please enter a valid email address",
      }));
      hasErrors = true;
    }
  
    // Check for empty fields
    Object.entries(formData).forEach(([field, value]) => {
      if (value === "" && field !== "allowances") {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [field]: "This field is required",
        }));
        hasErrors = true;
      }
    });
  
    // Validate numeric input for salary and allowances
    if (formData.salary && !validator.isNumeric(formData.salary)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        salary: "Please enter a valid numeric value",
      }));
      hasErrors = true;
    }
  
    // if (formData.allowances && !validator.isNumeric(formData.allowances)) {
    //   setErrors((prevErrors) => ({
    //     ...prevErrors,
    //     allowances: "Please enter a valid numeric value",
    //   }));
    //   hasErrors = true;
    // }
    // if (!image) {
    //   setErrors((prevErrors) => ({
    //     ...prevErrors,
    //     image: "Please select an image",
    //   }));
    //   hasErrors = true;
    // }
  
    if (hasErrors) {
      return;
    }
  
    try {
      setApiError("");
      setLoading(true);
  
      // const formDataWithImage = new FormData();
      // formDataWithImage.append("image", image); // Append the image correctly
      
      
      // Object.entries(formData).forEach(([key, value]) => {
      //   formDataWithImage.append(key, value);
      // });

      console.log("FormData with Image:", formData);
      let apiUrl = "http://localhost:5000/AddEmployee";
  
      if (employeeData.userType === "business_owner") {
        apiUrl = "http://localhost:5000/AddHR"; // Use AddHR endpoint for business owners
      }
  
     const response = await axios.post(apiUrl, formData, {
  // headers: {
  //   "Content-Type": "multipart/form-data",
  // },
});

      if (response.data) {
        setLoading(false);
        dispatch(setEmployeeData(response.data.data));
        setApiError("");
        if(employeeData.userType==='business_owner'){
          navigate('/CEO/dashboard')
        }
        else{
          navigate("/HR/dashboard");
        }
      }
  
      setFormData({
        employeeId: "",
        name: "",
        position: "",
        department: "",
        dateOfBirth: "",
        contact: "",
        email: "",
        password: "",
        salary: "",
        allowances: "",
      });
    } catch (error) {
      // Handle error
      setLoading(false);
      console.error(error);
      setApiError(error.response.data.error);
    }
  };
  
  return (
    <div
      className={`flex gap-12 ${
        loading ? "pointer-events-none opacity-70" : ""
      }`}
    >
      {loading && (
        <div className="absolute z-10 top-1/2 left-[62%] transform -translate-x-1/2 -translate-y-1/2">
          <CircularProgress color="inherit" />
        </div>
      )}
      <div>
        <div className="fixed">
        {employeeData && employeeData.userType === "business_owner" ? (
        <CeoSidebar />
      ) : (
        <Sidebar />
      )}
        </div>
      </div>
      <div className="w-full mt-4 ml-72 mr-8">
        <DashboardOverview pageName="Add Employee"></DashboardOverview>

        <div className="w-full px-12 mr-4 p-6 pt-16 rounded-xl shadow-md grid grid-cols-1 md:grid-cols-1 gap-4 mt-4 bg-slate-200">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Employee ID"
                type="text"
                id="employeeId"
                name="employeeId"
                autoComplete="off"
                value={formData.employeeId}
                error={errors.employeeId}
                onChange={handleInputChange}
                focusColor="black"
                top="6"
              />
              <InputField
                label="Name"
                type="text"
                id="name"
                name="name"
                autoComplete="off"
                value={formData.name}
                error={errors.name}
                onChange={handleInputChange}
                focusColor="black"
                top="6"
              />
              <InputField
                label="Position"
                type="text"
                id="position"
                name="position"
                autoComplete="off"
                value={formData.position}
                error={errors.position}
                onChange={handleInputChange}
                focusColor="black"
                top="6"
              />
              {/* <InputField
                label="Department"
                type="text"
                id="department"
                name="department"
                autoComplete="off"
                value={formData.department}
                error={errors.department}
                onChange={handleInputChange}
                focusColor="black"
                top="6"
              /> */}
              <div className="mb-4 relative">
            <label
              htmlFor="numberOfHrs"
              className={`absolute transition-all duration-300 ${
                formData.numberOfHrs ? "text-sm text-white -top-6 left-1" : "top-2 left-3 text-gray-500 text-xs md:text-sm lg:text-sm"
              }`}
            >
              {/* {formData.department ? "Select Departments" : ""} */}
            </label>
            {employeeData.userType === "business_owner" ? (
  <div className="p-2 border rounded w-full bg-gray-100">
    <p className="text-black">Human Resource</p>
  </div>
) : (
  <select
    id="department"
    name="department"
    className={`p-2 border rounded w-full outline-none ${
      formData.department ? "text-black" : "text-gray-500"
    } bg-white`}
    autoComplete="off"
    value={formData.department}
    onChange={handleInputChange}
  >
    <option value="">Select Departments</option>
    {departments.map((option, index) => (
      <option key={index} value={option}>
        {option}
      </option>
    ))}
  </select>
)}

            
          </div>
              <InputField
                label="Date of Birth"
                type="text"
                id="dateOfBirth"
                name="dateOfBirth"
                autoComplete="off"
                value={formData.dateOfBirth}
                error={errors.dateOfBirth}
                onChange={handleInputChange}
                focusColor="black"
                top="6"
              />
              <InputField
                label="Contact"
                type="text"
                id="contact"
                name="contact"
                autoComplete="off"
                value={formData.contact}
                error={errors.contact}
                onChange={handleInputChange}
                focusColor="black"
                top="6"
              />
              <InputField
                label="Email"
                type="text"
                id="email"
                name="email"
                autoComplete="off"
                value={formData.email}
                error={errors.email}
                onChange={handleInputChange}
                focusColor="black"
                top="6"
              />
              <InputField
                label="Password"
                type="password"
                id="password"
                name="password"
                autoComplete="off"
                value={formData.password}
                error={errors.password}
                onChange={handleInputChange}
                focusColor="black"
                top="6"
              />
              <InputField
                label="Salary"
                type="text"
                id="salary"
                name="salary"
                autoComplete="off"
                value={formData.salary}
                error={errors.salary}
                onChange={handleInputChange}
                focusColor="black"
                top="6"
              />
              {/* <InputField
                label="Allowances"
                type="text"
                id="allowances"
                name="allowances"
                autoComplete="off"
                value={formData.allowances}
                error={errors.allowances}
                onChange={handleInputChange}
                focusColor="black"
                top="6"
              /> */}
              {/* <div className="">
                <label className="block text-sm font-medium text-gray-700">
                  Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className=" p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                />
                {errors.image && (
                  <p className="text-red-800 font-bold mt-1">{errors.image}</p>
                )}
              </div> */}
            </div>
            <div className="">
              {apiError && (
                <p className="text-red-800 font-bold mb-6">{apiError}</p>
              )}
              <button
                type="submit"
                className="flex justify-center m-auto sm:col-span-2 bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer lg:mt-6 md:mt-4"
              >
                <Add className="mr-1"></Add>
                <p className="text-1xl font-bold">Add Employee</p>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;
