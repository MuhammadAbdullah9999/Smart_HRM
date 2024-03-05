import React from "react";
import { Email, Phone } from "@mui/icons-material";
import ApartmentIcon from '@mui/icons-material/Apartment';
import LaunchRoundedIcon from '@mui/icons-material/LaunchRounded';
import { Link } from "react-router-dom";

const AttendanceCard = ({ Id, Name, EmailText, Contact, Department }) => {
    return (
        <div className="flex flex-col shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105 cursor-pointer hover:shadow-blue-300" >
            <div className="p-1 bg-blue-200">
                <p className="text-lg text-center font-bold" >{Id}</p>
            </div>
            {/* <div className="rounded-full overflow-hidden w-20 h-20 self-center mb-2">
                    <img
                        src={`data:image/png;base64,${Image}`}
                        alt={`${Name}'s Image`}
                        className="w-full h-full object-cover"
                    />
                </div> */}
            <div className="flex items-center justify-center mt-5">
                {/* Image */}
                <div className="rounded-full overflow-hidden w-10 h-10 self-center mb-2 mr-2">
                    <img
                        src={`data:image/png;base64,${Image}`}
                        alt={`${Name}'s Image`}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Name */}
                <h2 className="text-lg font-bold mb-2">{Name}</h2>
            </div>
            <div className="flex flex-col p-4">
                {/* <h2 className="text-lg font-bold mb-2 self-center">{Name}</h2> */}
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
                <Link to='/dashboard/Employees/EmployeeProfile'><button className="bg-bg-color hover:bg-blue-700 text-white font-bold px-1 py-1.5 rounded-lg mt-3 w-full">
                    <LaunchRoundedIcon className="mr-2" style={{ fontSize: "1.2rem" }} ></LaunchRoundedIcon>
                    Open
                </button>
                </Link>
            </div>
        </div>
    );
};

export default AttendanceCard;
