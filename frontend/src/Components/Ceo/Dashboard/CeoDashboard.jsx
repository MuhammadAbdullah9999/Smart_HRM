import CeoSidebar from "./CeoSidebar";
import Card from "../Styles/CeoDashboardCard";
import DashboardOverview from "../../Dashboard/DashboardOverview";
import { useSelector } from 'react-redux';

function CeoDashboard() {
  const employeeData = useSelector(state => state.EmployeeData);
  console.log(employeeData);

  return (
    <div className="flex flex-col md:flex-row h-screen md:gap-8">
        <CeoSidebar />
      <div className="w-full ">
        <div className="p-4">
          <DashboardOverview pageName="Dashboard"></DashboardOverview>
        </div>
        <div className="flex flex-col h-[70%] justify-between">
          <div className="flex justify-center md:justify-start flex-wrap gap-4 pl-4">
            <Card
              cardText="Employees"
              cardNumber={employeeData.EmployeeData.noOfEmployees}
              bgColor="blue-500"
            ></Card>
            <Card
              cardText="Departments"
              cardNumber={employeeData.EmployeeData.noOfDepartments.uniqueDepartmentsCount}
              bgColor="green-500"
            ></Card>
            <Card cardText="HRs" cardNumber={employeeData.EmployeeData.noOfHRs} bgColor="red-500"></Card>
            <Card
              cardText="Leave Request"
              cardNumber="10"
              bgColor="blue-500"
            ></Card>
          </div>
          <div>
            <div className="mt-12 border border-black shadow-lg w-11/12 m-auto flex flex-col gap-4 rounded-lg self-end">
              <div className="flex flex-col items-center px-4 mt-4">
                <h1 className="font-bold md:text-xl sm:text-lg">Notice Board</h1>
                <p className="sm:text-base md:text-lg">Important Announcements</p>
              </div>
              <hr className="border-black"></hr>
              <div className="flex justify-between px-4 py-2">
                <div className="flex flex-col gap-2">
                  <h2 className="font-bold">Title</h2>
                  <p className="md:text-lg sm:text-sm">Independence Day Holiday</p>
                </div>
                <div className="flex flex-col gap-2">
                  <h2 className="font-bold">Date</h2>
                  <p className="md:text-lg sm:text-sm">14-8-2024</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default CeoDashboard;
