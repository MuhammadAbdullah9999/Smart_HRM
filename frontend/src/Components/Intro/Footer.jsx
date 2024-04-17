import React, { useState } from "react";
import Person2RoundedIcon from "@mui/icons-material/Person2Rounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import InputField from "../Styles/InputField";

const Footer = () => {
  const [contactformData, setContactFormData] = useState({
    username: "",
    email: "",
    message: "",
  });

  const handleInputChange = (e) => {
    setContactFormData({ ...contactformData, [e.target.name]: e.target.value });
  };

  return (
    <footer className="bg-sec-color h-3/4 text-white px-12" id="contact">
      <div className="container mx-auto text-center pt-20 flex flex-col justify-center items-center">
        {/* Centered Heading */}
        <h2 className="text-3xl font-thin mb-4 text-white">
          Smart <span className="font-extrabold">HRM</span>
        </h2>
        <hr className="border-gray-600 w-3/4" />
      </div>

      <div className="w-3/4 my-28 container mx-auto flex flex-col lg:flex-row items-center justify-center">
        {/* Left Section */}
        <div className="lg:w-1/2 text-center lg:text-left mb-8 lg:mb-0 ">
          <h2 className="text-5xl font-bold mb-10 text-white">Contact Us</h2>

          <div className="flex items-center">
            <Person2RoundedIcon className="text-xl mr-2"></Person2RoundedIcon>
            <span>Ahsan Naseem</span>
          </div>
          <div className="flex items-center">
            <Person2RoundedIcon className="text-xl mr-2"></Person2RoundedIcon>
            <span>Muhammad Abdullah</span>
          </div>
          <div className="flex items-center">
            <Person2RoundedIcon className="text-xl mr-2"></Person2RoundedIcon>
            <span>Sameer Ali</span>
          </div>
          <div className="flex items-center mb-2 mt-5">
            <LocationOnRoundedIcon className="text-xl mr-2"></LocationOnRoundedIcon>
            <span>COMSATS University Islamabad, Lahore Campus</span>
          </div>
        </div>

        {/* Center Separator */}
        <hr className="lg:hidden border-gray-600 my-8 w-3/4 mx-auto " />

        {/* Right Section */}
        <div className="flex justify-center items-center lg:w-1/2 lg:pl-8 bg-sec-color ">
          <form action="https://formspree.io/f/xrgnrzod"
            method="POST">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Name
              </label>
                <InputField
                  label="username"
                  type="text"
                  id="name"
                  name="username"
                  autoComplete="off"
                  value={contactformData.username}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                {/* Email */}
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email
                  </label>
                <InputField
                  label="abc@gmail.com"
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="off"
                  value={contactformData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-span-2">
                <label htmlFor="message" className="block text-sm font-medium mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="3"
                  className="mt-1 p-2 w-full border rounded outline-none text-black"
                ></textarea>
              </div>
            </div>
            <button
              type="submit"
              className="bg-bg-color mt-6 px-3 py-1.5 rounded-3xl border-none font-bold text-center cursor-pointer transition duration-400 hover:shadow-lg hover:shadow-gray-400 active:transform active:scale-97 active:shadow-lg"
            >
              <SendRoundedIcon className="inline-block" style={{ color: "white" }} />
              <span className="ml-2 text-white">Send Message</span>
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Separator */}
      <hr className="border-gray-600 w-3/4 mx-auto" />

      {/* Bottom Line */}
      <div className="text-center py-6">
        <p className="text-sm text-white">All Rights Reserved. Smart HRM.</p>
      </div>
    </footer>
  );
};

export default Footer;
