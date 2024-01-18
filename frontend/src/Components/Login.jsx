import * as React from "react";
import LoginImage from "../images/log1.jpg";


function Login(props) {
  return (
    <div className="flex h-screen">
      {/* Left side */}
      <div className="flex w-1/2 border-black-100 border-5">
        <div className="flex flex-col gap-8 p-8 bg-bg-color text-white w-full">
       
          <div className="flex flex-col gap-5">
            <h2 className="text-5xl font-bold">Login</h2>
            <p className="text-2xl">Enter your Credentials to Login</p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="text-black">
              <p className="text-white pl-1">Email</p>
              <input
                className="p-2 rounded-lg w-full"
                placeholder="Enter Email"
              />
            </div>
            <div className="text-black mt-4">
              <p className="text-white pl-1">Password</p>
              <input
                className="p-2 rounded-lg w-full"
                placeholder="Enter Password"
              />
            </div>
          </div>
          <button className="bg-blue-500 text-white p-2 rounded-lg w-full">
            Login
          </button>
        </div>
      </div>

      {/* Right side */}
      <div className="w-1/2 border-gray-100 border-5">
        <img src={LoginImage} alt="login" className="w-full h-full object-cover" />
      </div>
    </div>
  );
}

export default Login;
