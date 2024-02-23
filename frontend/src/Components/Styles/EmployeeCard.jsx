import React from "react";
import { Email, Phone } from "@mui/icons-material";
import ApartmentIcon from '@mui/icons-material/Apartment';
import LaunchRoundedIcon from '@mui/icons-material/LaunchRounded';

const EmployeeCard = ({ Id, Name, EmailText, Contact, Department }) => {
    return (
        <div className="flex flex-col shadow-md rounded-md overflow-hidden" >
            <div className="p-4 bg-gradient-to-r from-blue-400 to-indigo-500 text-white">
                <p className="text-lg text-center font-bold" >{Id}</p>
            </div>
            
            <div className="flex flex-col p-4">
                <h2 className="text-xl font-bold mb-4 self-center">{Name}</h2>
                <p className="text-gray-400 mb-2 text-sm">
                    <ApartmentIcon className="mr-2 p-1" />
                    {Department}
                </p>
                <div className="flex items-center mb-2">
                    <Email className="mr-2 p-1" />
                    <p className="text-gray-400 text-sm">{EmailText}</p>
                </div>
                <div className="flex items-center mb-2">
                    <Phone className="mr-2 p-1" />
                    <p className="text-gray-400 text-sm">{Contact}</p>
                </div>
                <button className="bg-bg-color hover:bg-blue-700 text-white font-bold px-1 py-1.5 rounded-lg mt-3">
                    <LaunchRoundedIcon className="mr-2" style={{ fontSize: "1.2rem" }} ></LaunchRoundedIcon>
                    Open
                </button>
            </div>
        </div>
    );
};

export default EmployeeCard;
