import React, { useState } from "react";
import { useSpring, animated } from "react-spring";
import { useInView } from 'react-intersection-observer';
import DoneRoundedIcon from '@mui/icons-material/DoneRounded';
import ArrowCircleRightRoundedIcon from '@mui/icons-material/ArrowCircleRightRounded';
import { Link } from "react-router-dom";

function Pricing(props) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    rootMargin: "-50px", // Adjust this value if needed
  });

  const [animate, setAnimate] = useState(false);

  // Trigger animation when the component is in view
  if (inView && !animate) {
    setAnimate(true);
  }

  // Spring configuration for the fade-in animation
  const fadeIn = useSpring({
    opacity: animate ? 1 : 0,
    marginTop: animate ? 0 : 30,
    from: { opacity: 0, marginTop: 30 },
    config: { tension: 50, friction: 14 },
  });

  // Spring configuration for the margin-top between items
  const itemMargin = useSpring({
    marginTop: animate ? 0 : 20, // Adjust the margin as needed
    from: { marginTop: 20 },
    config: { tension: 50, friction: 14 },
  });

  return (
    <div ref={ref} className="text-center mt-12" id="pricing">
      <animated.h1 style={fadeIn} className="text-black text-4xl font-bold">Our Pricing</animated.h1>
      <div className='w-full flex justify-center mt-14'>
        <animated.div style={fadeIn} className="w-full md:w-2/4 lg:w-1/3 xl:w-1/3 cursor-pointer mx-4 bg-white flex flex-col justify-center items-center py-6 border-2 border-black rounded-xl shadow-lg shadow-sec-color">

          <animated.h2 style={fadeIn} className="text-bg-color text-3xl font-extrabold self-center mb-4">
            Free
          </animated.h2>
          <hr className="border-1 border-black w-full mt-1 mb-8"></hr>
          <animated.h3 style={fadeIn} className="text-black text-4xl lg:text-6xl font-bold mt-4">
            $0
          </animated.h3>
          <animated.p style={{fadeIn, marginTop: 10 }} className="text-gray-500 text-base font-medium whitespace-nowrap my-4">
            per employee, per month
          </animated.p>
          <animated.div style={fadeIn} className="flex justify-center items-center mt-4">
            <button
              className="bg-bg-color px-3 py-1.5 rounded-3xl border-none font-bold text-center cursor-pointer transition duration-400 hover:shadow-lg hover:shadow-gray-400 active:transform active:scale-97 active:shadow-lg"
            >
              <ArrowCircleRightRoundedIcon className="inline-block" style={{ color: 'white' }} />
             <Link to='/register'> <span className="ml-2 text-white">Start for Free</span></Link>
            </button>
          </animated.div>
          <animated.div style={{itemMargin, marginTop: 30 }} className="flex flex-col gap-4 items-start mt-6 mb-6">
            <p className="text-black text-lg">
              <DoneRoundedIcon className="mr-4"></DoneRoundedIcon> Smart HRM on Desktop
            </p>
            <p className="text-black text-lg">
              <DoneRoundedIcon className="mr-4"></DoneRoundedIcon> Mobile App for Employee
            </p>
            <p className="text-black text-lg">
              <DoneRoundedIcon className="mr-4"></DoneRoundedIcon> Mobile App for Super Admin
            </p>
            <p className="text-black text-lg">
              <DoneRoundedIcon className="mr-4"></DoneRoundedIcon> HR Management System
            </p>
            <p className="text-black text-lg">
              <DoneRoundedIcon className="mr-4"></DoneRoundedIcon> Leave And Payroll System
            </p>
            <p className="text-black text-lg">
              <DoneRoundedIcon className="mr-4"></DoneRoundedIcon> Smart Recruitment Process
            </p>
          </animated.div>
        </animated.div>
      </div>
    </div>
  );
}

export default Pricing;
