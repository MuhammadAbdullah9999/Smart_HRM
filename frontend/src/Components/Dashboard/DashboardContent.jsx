import React, { useState, useEffect } from "react";
import DashboardOverview from "./DashboardOverview";
import DashboardFunctionalities from "./DashboardFunctionalities";
import DashboardStat from "./DashboardCard";
import axios from "axios";
import { useSelector, useDispatch } from 'react-redux';
import { setEmployeeData } from "../../state";
import CircularProgress from '@mui/material/CircularProgress';


function DashboardContent(props) {
    const employeeData = useSelector(state => state.EmployeeData.EmployeeData);
    
    const dispatch = useDispatch();
    const [apiError, setApiError] = useState('');
    const [toDoList, setToDoList] = useState();
    const [newTask, setNewTask] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        const getToDoList=async()=>{
            const response=await axios.get(`http://localhost:5000/ToDoList/getToDoList/${employeeData.userType}/${employeeData.user.email}`);
            console.log(response);
            setToDoList(response.data.toDoList);
        }
        // getToDoList();
        setToDoList(employeeData.user.toDoList);

    },[])
    const handleAddToDo = async () => {
      if (newTask.trim() !== "") {
          try {
            setLoading(true);
              const response = await axios.post('http://localhost:5000/ToDoList/addToDoList', {
                  userType: employeeData.userType,
                  email: employeeData.user.email,
                  task: newTask.trim()
              });
              setLoading(false);
              console.log(response.data)
              setToDoList(response.data.toDoList);
              setNewTask("");
              dispatch(setEmployeeData({ 
                  ...employeeData, 
                  user: { 
                      ...employeeData.user, 
                      toDoList: response.data.toDoList 
                  } 
              }));
          } catch (error) {
            setLoading(false);
              setApiError(error.message);
              console.log(error);
          }
      }
  };

    const handleDeleteToDo = async (index) => {
    console.log(index);
    const updatedToDoList = [...toDoList];
    const deletedTask = updatedToDoList.splice(index, 1)[0]; // Remove the task at the specified index and store it
    setToDoList(updatedToDoList);
    
    try {
        setLoading(true)
        const response = await axios.post('http://localhost:5000/ToDoList/deleteToDoList', {
            userType: employeeData.userType,
            email: employeeData.user.email,
            task: deletedTask.task
        });
        
        setLoading(false)
        setToDoList(response.data.toDoList);
        setNewTask("");
        dispatch(setEmployeeData({ 
            ...employeeData, 
            user: { 
                ...employeeData.user, 
                toDoList: response.data.toDoList 
            } 
        }));
    } catch (error) {
        setLoading(false)
        setApiError(error.message);
        console.log(error);
    }
};


    return (
        <div className="p-6 mt-2">
            <DashboardOverview pageName="Dashboard" />
            {employeeData.userType==='employee'?'':(<div className="grid grid-cols-2 gap-4">
                <DashboardStat label="Total Employees" value={props.data.totalEmployees} />
                <DashboardStat label="Departments" value={props.data.totalDepartments} />
                <DashboardStat label="Leave Requests" value={props.data.totalLeaveRequest} />
                <DashboardStat label="Loan Requests" value="0" />
            </div>)}
            
            {/* {toDoList?( */}

                <DashboardFunctionalities 
                    toDoList={toDoList}
                    newTask={newTask}
                    setNewTask={setNewTask}
                    handleAddToDo={handleAddToDo}
                    handleDeleteToDo={handleDeleteToDo}
                    loading={loading}
                />
            {/* ) :(
                <CircularProgress></CircularProgress>
            )
            } */}
        </div>
    );
}

export default DashboardContent;
