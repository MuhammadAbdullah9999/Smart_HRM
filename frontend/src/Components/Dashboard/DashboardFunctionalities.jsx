// src/components/Dashboard/DashboardFunctionalities.jsx
import React from "react";
import DashboardStat from "./DashboardStat";
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import InputField from "../Styles/InputField";


function DashboardFunctionalities({ toDoList,newTask, setNewTask, handleAddToDo, handleDeleteToDo }) {

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 mt-10 rounded-lg">
      {/* Notifications Section */}
      <div className="bg-gray-100 rounded-xl p-4 shadow-md shadow-gray-200">
        <h2 className="text-xl font-semibold mb-4">Notifications</h2>
        <ul>
          <li className="flex items-center mb-2">
            <span className="bg-green-500 w-4 h-4 mr-2 rounded-full"></span>
            New Employee Joined
          </li>
          <li className="flex items-center mb-2">
            <span className="bg-yellow-500 w-4 h-4 mr-2 rounded-full"></span>
            Upcoming Meeting
          </li>
        </ul>
      </div>

      {/* To-Do List Section */}
      <div className="bg-gray-100 rounded-xl p-4 shadow-md shadow-gray-200">
        <h2 className="text-xl font-semibold mb-4">To-Do List</h2>
        <div className="flex items-center justify-center mt-5 mb-8">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add new task..."
            className="mr-5 h-10 p-3 border rounded-xl outline-none w-2/4"
          />
          <div
            onClick={handleAddToDo}
            className="bg-sec-color text-white p-2 rounded-full cursor-pointer hover:bg-blue-600 flex items-center"
            style={{ fontSize: '0.4rem', padding: '0.4rem' }}
          >
            <AddRoundedIcon />
          </div>
        </div>
        <ul className="list-disc list-inside">
          {toDoList && toDoList.map((item, index) => (
            <li key={index} className="flex items-center justify-between mb-2 relative ml-2">
              <div className="flex items-center">
                <div className="list-item ">{item.task}</div>
              </div>
              <div
                onClick={() => handleDeleteToDo(index)}
                className="cursor-pointer text-sec-color ml-2"
              >
                <DeleteRoundedIcon />
              </div>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}

export default DashboardFunctionalities;
