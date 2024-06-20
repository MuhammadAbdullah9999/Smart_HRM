import { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import CeoSidebar from "../../Ceo/Dashboard/CeoSidebar";
import EmployeeSidebar from "../../Employee/EmployeeSidebar";
import DashboardOverview from "../DashboardOverview";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setEmployeeData } from "../../../state/index";
import CircularProgress from "@mui/material/CircularProgress";
import AddIcon from "@mui/icons-material/Add";
import DoneIcon from "@mui/icons-material/Done";
import ClearIcon from "@mui/icons-material/Clear";
import axios from "axios";
import { Link } from "react-router-dom";
import Switch from "@mui/material/Switch";

function Leave() {
  const dispatch = useDispatch();

  const [employees, setEmployees] = useState([]);
  const [hrData, setHrData] = useState([]);
  const [hrEmail, setHrEmail] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showHrLeave, setShowHrLeave] = useState(false);
  const data = useSelector((state) => state.EmployeeData.EmployeeData);
  console.log(data);

  useEffect(() => {
    setLoading(true);
    const getEmployees = async () => {
      const response = await axios.get(
        `http://localhost:5000/GetEmployees/${data.user.organizationId}/${data.user._id}/${data.userType}`
      );
      setLoading(false);
      setEmployees(response.data.employeeData);
      setHrData(response.data.hrData);
      setHrEmail(data.user.email);
      console.log(response);
    };
    getEmployees();
  }, [data.user.organizationId, data.user._id, data.userType]);

  // Function to handle the approval or rejection of leave request
  const handleLeaveAction = async (employeeId, leaveId, action) => {
    try {
      const organizationId = (showHrLeave ? hrData : employees).find(
        (emp) => emp._id === employeeId
      )?.organizationId;
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/AcceptOrRejectLeave",
        {
          employeeId,
          leaveId,
          status: action,
          organizationId,
          email: hrEmail,
          userType: data.userType,
        }
      );
      if (response) {
        setLoading(false);
        dispatch(setEmployeeData(response.data));
        // Reload the page after a successful API response
        window.location.reload();
      }
    } catch (error) {
      setLoading(false);
      console.error("Error occurred while making API call:", error.message);
    }
  };

  const currentData =
    data.userType === "HR" && showHrLeave ? hrData : employees;

  return (
    <div className="flex gap-4 w-full">
      <div>
        {data && data.userType === "business_owner" ? (
          <CeoSidebar />
        ) : data && data.userType === "employee" ? (
          <EmployeeSidebar />
        ) : (
          <Sidebar />
        )}
      </div>
      <div className="w-full p-4">
        <DashboardOverview pageName="Leave"></DashboardOverview>
        {data.userType !== "business_owner" && (
          <div className="flex justify-between">
            <Link to="/dashboard/leave/applyLeave">
              <button className="bg-bg-color px-3 py-2 rounded-3xl text-white mb-4 border-none font-bold text-center cursor-pointer transition duration-400 hover:shadow-lg hover:shadow-gray-400 active:transform active:scale-97 active:shadow-lg">
                <AddIcon />
                Apply Leave
              </button>
            </Link>
            {data.userType === "HR" && (
              <div className="ml-auto flex items-center">
                <Switch
                  label="HR"
                  checked={showHrLeave}
                  onChange={() => setShowHrLeave(!showHrLeave)}
                />
                <p>My Leaves</p>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between gap-8 w-full h-[50%]">
          {/* Leave Calendar Section */}
          <div className="flex flex-col w-1/3 border border-gray-300 rounded-md shadow-lg shadow-gray-300 h-96 relative">
            <div className="font-bold bg-white">
              <p className="p-4 sticky top-0 z-10 bg-white">Leave Calendar</p>
              <hr className="border border-gray-300"></hr>
            </div>
            {loading && (
              <div className="absolute inset-0 backdrop-filter backdrop-blur-sm z-10 flex items-center justify-center">
                <CircularProgress style={{ color: "blue" }} />
              </div>
            )}
            <div className="overflow-y-auto">
              {currentData &&
                currentData.length > 0 &&
                currentData.map(
                  (employee) =>
                    employee.leaveRequest &&
                    employee.leaveRequest.length > 0 &&
                    employee.leaveRequest.map((leave) => (
                      <div key={leave._id}>
                        {leave.status !== "pending" && (
                          <div className="flex justify-between w-full gap-2 p-4">
                            <div>
                              <p className="font-bold text-sm">
                                {employee.name}
                              </p>
                              <span className="text-sm">
                                {leave.leaveReason}
                              </span>
                            </div>
                            <div className="self-center">
                              <div>
                                {/* <p className="font-bold text-sm">{employee.name}</p> */}
                                <span className="text-sm">
                                  {leave.leaveDate}
                                </span>
                              </div>
                              <div className="self-center">
                                <div>
                                  <p>
                                    <span className="font-bold text-xs">
                                      Status:{" "}
                                    </span>
                                    <span
                                      className={`text-sm font-bold ${
                                        leave.status === "Approved"
                                          ? "text-green-500"
                                          : "text-red-500"
                                      }`}
                                    >
                                      {leave.status}
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        <hr className="border"></hr>
                      </div>
                    ))
                )}
            </div>
          </div>

          {/* Leave Requests Section */}
          <div className="w-2/3">
            <div className="flex flex-col w-full border border-gray-300 rounded-md shadow-lg shadow-gray-300 h-96 relative">
              <div className="font-bold">
                <p className="p-4">Leave Requests</p>
                <hr className="border border-gray-300"></hr>
              </div>
              {loading && (
                <div className="absolute inset-0 backdrop-filter backdrop-blur-sm z-10 flex items-center justify-center">
                  <CircularProgress style={{ color: "blue" }} />
                </div>
              )}
              {currentData &&
                currentData.length > 0 &&
                currentData.map(
                  (employee) =>
                    employee.leaveRequest &&
                    employee.leaveRequest.length > 0 &&
                    employee.leaveRequest.map((leave) =>
                      leave.status === "pending" ? (
                        <div key={leave._id}>
                          <div className="flex justify-between w-full gap-2 p-4">
                            <div>
                              <p className="font-bold">{employee.name}</p>
                              <span className="text-sm">
                                {leave.leaveReason}
                              </span>
                            </div>
                            <div className="self-center">
                              <p className="text-sm">{leave.leaveDate}</p>
                            </div>
                            <div className="self-center">
                              {data.userType !== "employee" && !showHrLeave && (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() =>
                                      handleLeaveAction(
                                        employee._id,
                                        leave._id,
                                        "Approved"
                                      )
                                    }
                                    className="p-2 text-sm bg-green-500 text-white rounded-lg active:text-green-600 active:bg-white"
                                  >
                                    <DoneIcon fontSize="small"></DoneIcon>
                                    Approve
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleLeaveAction(
                                        employee._id,
                                        leave._id,
                                        "reject"
                                      )
                                    }
                                    className="p-2 text-sm bg-red-500 text-white rounded-lg active:text-red-600 active:bg-white"
                                  >
                                    <ClearIcon fontSize="small"></ClearIcon>
                                    Reject
                                  </button>
                                </div>
                              )}
                              {data.userType === "employee" ||
                                (showHrLeave && <div>{leave.status}</div>)}
                            </div>
                          </div>
                          <hr className="border"></hr>
                        </div>
                      ) : null
                    )
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Leave;
