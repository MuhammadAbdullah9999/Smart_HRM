import React from "react";
import { Email, Phone } from "@mui/icons-material";
import ApartmentIcon from '@mui/icons-material/Apartment';
import LaunchRoundedIcon from '@mui/icons-material/LaunchRounded';

const EmployeeCard = ({ Id, Name, EmailText, Contact, Department, Image }) => {
    return (
        <div className="flex flex-col border border-gray-300 shadow-md shadow-gray-300 hover:shadow-blue-300 rounded-xl overflow-hidden cursor-pointer transition-transform transform hover:scale-105">
            <div className="p-1 border-b border-gray-300 bg-blue-100">
                <p className="text-md text-center font-bold">{Id}</p>
            </div>
            
            <div className="flex flex-col p-4">
                {/* <div className="rounded-full overflow-hidden w-20 h-20 self-center mb-2">
                    <img
                        src={`data:image/png;base64,${Image}`}
                        alt={`${Name}'s Image`}
                        className="w-full h-full object-cover"
                    />
                </div> */}
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
