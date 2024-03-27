import React from "react";
import Sidebar from "../Dashboard/Sidebar";
import DashboardOverview from "../Dashboard/DashboardOverview";

const EmployeeManagement = () => {
  const currentDate = new Date().toLocaleDateString();

  // Hardcoded employee data
  const employees = [
    {
      id: 1,
      name: "Samir",
      designation: "Software Engineer",
      email: "samir@gmail.com",
      phoneNumber: "03123456789",
    },
    {
      id: 2,
      name: "Ahsan",
      designation: "HR Manager",
      email: "ahsan@gmail.com",
      phoneNumber: "03176543210",
    },
    {
        id: 3,
        name: "Abdullah",
        designation: "HR Manager",
        email: "abdullah@gmail.com",
        phoneNumber: "03226543210",
      }
    // Add more employees as needed
  ];

  // Function to handle employee selection (dummy function)
  const handleEmployeeSelect = (employeeId) => {
    console.log("Selected employee ID:", employeeId);
    // Implement logic to display employee profile or perform other actions
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-grow p-4 md:p-8">
        {/* Dashboard Overview */}
        <DashboardOverview pageName="Employee Management" currentDate={currentDate} />

        {/* Employee List */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Employee List</h2>
          <ul className="space-y-4">
            {employees.map((employee) => (
              <li key={employee.id} className="border border-gray-300 p-4 rounded-md flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{employee.name}</h3>
                  <p className="text-gray-500">{employee.designation}</p>
                  <p className="text-gray-500">{employee.email}</p>
                  <p className="text-gray-500">{employee.phoneNumber}</p>
                </div>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  onClick={() => handleEmployeeSelect(employee.id)}
                >
                  View Profile
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EmployeeManagement;