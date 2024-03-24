import React, { useState, useEffect } from "react";
import DashboardOverview from "./DashboardOverview";
import DashboardFunctionalities from "./DashboardFunctionalities";
import DashboardStat from "./DashboardCard";
import axios from "axios";
import { useSelector, useDispatch } from 'react-redux';
import { setEmployeeData } from "../../state";

function DashboardContent(props) {
    const employeeData = useSelector(state => state.EmployeeData.EmployeeData);
    
    const dispatch = useDispatch();
    const [apiError, setApiError] = useState('');
    const [toDoList, setToDoList] = useState(employeeData.user.toDoList);
    const [newTask, setNewTask] = useState("");

    const handleAddToDo = async () => {
      if (newTask.trim() !== "") {
          try {
              const response = await axios.post('http://localhost:5000/ToDoList/addToDoList', {
                  userType: employeeData.userType,
                  email: employeeData.user.email,
                  task: newTask.trim()
              });
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
        const response = await axios.post('http://localhost:5000/ToDoList/deleteToDoList', {
            userType: employeeData.userType,
            email: employeeData.user.email,
            task: deletedTask.task
        });
        
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
        setApiError(error.message);
        console.log(error);
    }
};


    return (
        <div className="p-6 mt-2">
            <DashboardOverview pageName="Dashboard" />
            <div className="grid grid-cols-2 gap-4">
                <DashboardStat label="Total Employees" value={props.data.totalEmployees} />
                <DashboardStat label="Departments" value={props.data.totalDepartments} />
                <DashboardStat label="Leave Requests" value={props.data.totalLeaveRequest} />
                <DashboardStat label="Loan Requests" value="0" />
            </div>
            {toDoList && 
                <DashboardFunctionalities
                    toDoList={toDoList}
                    newTask={newTask}
                    setNewTask={setNewTask}
                    handleAddToDo={handleAddToDo}
                    handleDeleteToDo={handleDeleteToDo}
                />
            }
        </div>
    );
}

export default DashboardContent;
