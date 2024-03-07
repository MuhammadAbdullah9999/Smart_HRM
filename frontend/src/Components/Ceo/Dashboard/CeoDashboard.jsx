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
        <div className="p-4"><DashboardOverview pageName="Dashboard"></DashboardOverview></div>
        <div className="flex gap-4 pl-4">
        <Card cardText="Employees" cardNumber="12" bgColor="blue-500"></Card>
        <Card cardText="Departments" cardNumber="02" bgColor="green-500"></Card>
        <Card cardText="HRs" cardNumber="31" bgColor="red-500"></Card>
        <Card cardText="Leave Request" cardNumber="10" bgColor="blue-500"></Card>
      </div>
      </div>
    </div>
  );
}
export default CeoDashboard;
