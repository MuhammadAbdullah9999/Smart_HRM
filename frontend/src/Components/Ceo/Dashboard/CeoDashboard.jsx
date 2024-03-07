import CeoSidebar from "./CeoSidebar";
import Card from "../Styles/CeoDashboardCard";
import DashboardOverview from "../../Dashboard/DashboardOverview";
function CeoDashboard() {
  return (
    <div className="flex gap-8">
      <div>
        <CeoSidebar />
      </div>
      <div className="w-full ">
        <div className="p-4">
          <DashboardOverview pageName="Dashboard"></DashboardOverview>
        </div>
        <div className="flex flex-col h-[70%] justify-between">
          <div className="flex gap-4 pl-4">
            <Card
              cardText="Employees"
              cardNumber="12"
              bgColor="blue-500"
            ></Card>
            <Card
              cardText="Departments"
              cardNumber="02"
              bgColor="green-500"
            ></Card>
            <Card cardText="HRs" cardNumber="31" bgColor="red-500"></Card>
            <Card
              cardText="Leave Request"
              cardNumber="10"
              bgColor="blue-500"
            ></Card>
          </div>
          <div>
            <div className="border border-black shadow-lg w-1/2 flex flex-col gap-4 rounded-lg self-end">
              <div className="flex flex-col items-center px-4 mt-4">
                <h1 className="font-bold text-xl">Notice Board</h1>
                <p>Important Announcements</p>
              </div>
              <hr className="border-black"></hr>
              <div className="flex justify-between px-4 py-2">
                <div className="flex flex-col gap-2">
                  <h2 className="font-bold">Title</h2>
                  <p>Independence Day Holiday</p>
                </div>
                <div className="flex flex-col gap-2">
                  <h2 className="font-bold">Date</h2>
                  <p>14-8-2024</p>
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
