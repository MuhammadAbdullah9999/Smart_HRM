const express = require('express');
const cors=require('cors');
const bodyParser=require('body-parser');
const SignUp=require('./Routes/Authentication/SignUp');
const AddHR=require('./Routes/AddUser/AddHR');
const Login=require('./Routes/Authentication/Login');
const AddEmployee=require('./Routes/AddUser/AddEmployee');
const AddApplicant=require('./Routes/Applicant/AddApplicant');
const GetApplicants=require('./Routes/Applicant/GetApplicants');
const GetTopApplicants=require('./Routes/Applicant/GetTopApplicants');
const RequestLeave=require('./Routes/Leave/RequestLeave');
const AcceptOrRejectLeave=require('./Routes/Leave/AcceptOrRejectLeave');
const GetLeavesData=require('./Routes/Leave/GetLeavesData');
const AddAttendance=require('./Routes/Attendance/AddAttendance');
const AddJob=require('./Routes/Job/AddJob');
const GetJobs=require('./Routes/Job/GetJobs');
const AddAllowance=require('./Routes/Allowances/AddAllowance');
const AddBonus=require('./Routes/Payroll/Bonus/AddBonus');
const Deduction=require('./Routes/Payroll/Deduction/Deduction');
const Payroll=require('./Routes/Payroll/Payroll');
const ForgotPassword=require('./Routes/Authentication/ForgotPassword');
const ResetPassword=require('./Routes/Authentication/ResetPassword');
const UpdateEmployeeProfile=require('./Routes/UpdateEmployeeProfile/UpdateEmployeeProfile');
const ToDoList=require('./Routes/ToDoList/ToDoList');
const Announcements=require('./Routes/Announcements/Announcements');
const GetEmployee=require('./Routes/GetEmployee/GetEmployee')
const AddDepartments=require('./Routes/Departments/AddDepartments');
const DeleteUser=require('./Routes/DeleteUser/DeleteUser');
const UpdateUser=require('./Routes/UpdateUser/UpdateUser');
const GenerateReport=require('./Routes/GenerateReport/GenerateReport');
const GetAttendanceData=require('./Routes/GetAttendance/GetAttendanceData');
const GetUser=require('./Routes/GetUser/GetUser')
const GetDashboardData=require('./Routes/GetDashboardData/GetDashboardData')
const app = express();

app.use(cors({credentials: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/SignUp',SignUp);
app.use('/AddHR',AddHR);
app.use('/Login',Login);
app.use('/AddEmployee',AddEmployee);
app.use('/AddApplicant',AddApplicant);
app.use('/GetApplicants',GetApplicants)
app.use('/GetTopApplicants',GetTopApplicants);
app.use('/RequestLeave',RequestLeave);
app.use('/AcceptOrRejectLeave',AcceptOrRejectLeave);
app.use('/GetLeavesData',GetLeavesData);
app.use('/AddAttendance',AddAttendance);
app.use('/AddJob',AddJob)
app.use('/GetJobs',GetJobs);
app.use('/AddAllowance',AddAllowance);
app.use('/AddBonus',AddBonus);
app.use('/Deduction',Deduction);
app.use('/Payroll',Payroll);
app.use('/ForgotPassword',ForgotPassword);
app.use('/ResetPassword',ResetPassword);
app.use('/UpdateEmployeeProfile',UpdateEmployeeProfile)
app.use('/ToDoList',ToDoList);
app.use('/Announcement',Announcements);
app.use('/GetEmployees',GetEmployee);
app.use('/Departments',AddDepartments)
app.use('/DeleteUser',DeleteUser);
app.use('/UpdateUser',UpdateUser)
app.use('/GenerateReport',GenerateReport);
app.use('/GetAttendance',GetAttendanceData);
app.use('/GetUser',GetUser);
app.use('/GetDashboardData',GetDashboardData)

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
