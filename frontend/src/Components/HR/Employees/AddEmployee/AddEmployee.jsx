import { useState } from "react";
import axios from "axios";
import validator from "validator";
import InputField from "../../../Styles/InputField";
import Sidebar from "../../Dashboard/Sidebar";
import Add from "@mui/icons-material/Add";
import { useSelector } from "react-redux";
import DashboardOverview from "../../Dashboard/DashboardOverview";
import { useDispatch } from "react-redux";
import { setEmployeeData } from "../../../../state";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

const AddEmployee = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const employeeData = useSelector((state) => state.EmployeeData);

  const [formData, setFormData] = useState({
    organizationId: employeeData.user.organizationId,
    hrEmail: employeeData.user.email,
    employeeId: "021",
    name: "usama",
    position: "software engineer",
    department: "development",
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

    if (formData.allowances && !validator.isNumeric(formData.allowances)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        allowances: "Please enter a valid numeric value",
      }));
      hasErrors = true;
    }
    if (!image) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        image: "Please select an image",
      }));
      hasErrors = true;
    }

    if (hasErrors) {
      return;
    }

    try {
      setApiError("");
      setLoading(true);

      const formDataWithImage = new FormData();
      formDataWithImage.append("image", image); // Append the image correctly

      Object.entries(formData).forEach(([key, value]) => {
        formDataWithImage.append(key, value);
      });

      const response = await axios.post(
        "http://localhost:5000/AddEmployee",
        formDataWithImage,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data) {
        setLoading(false);
        dispatch(setEmployeeData(response.data.data));
        setApiError("");
        console.log(response.data.data);
        navigate("/HR/dashboard");
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
          <Sidebar />
        </div>
      </div>
      <div className="w-full mt-4 ml-72 mr-8">
        <DashboardOverview pageName="AddEmployee"></DashboardOverview>

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
              <InputField
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
              />
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
              <InputField
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
              />
              <div className="">
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
              </div>
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
