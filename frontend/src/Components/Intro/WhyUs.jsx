import React, { useState } from "react";
import { useSpring, animated } from "react-spring";
import { useInView } from 'react-intersection-observer';
import QueuePlayNextRoundedIcon from "@mui/icons-material/QueuePlayNextRounded";
import PaidRoundedIcon from "@mui/icons-material/PaidRounded";

const WhyUs = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    rootMargin: "-50px",
  });

  const [animate, setAnimate] = useState(false);

  // Trigger animation when the component is in view
  if (inView && !animate) {
    setAnimate(true);
  }

  // Spring configuration for the fade-in animation of heading text
  const fadeInHeading = useSpring({
    opacity: animate ? 1 : 0,
    from: { opacity: 0 },
    config: { tension: 50, friction: 14 },
  });

  // Spring configuration for the slide-in animation of left card
  const slideInLeft = useSpring({
    opacity: animate ? 1 : 0,
    transform: animate ? "translateX(0%)" : "translateX(-100%)",
    from: { opacity: 0, transform: "translateX(-100%)" },
    config: { tension: 100, friction: 30 },
  });

  // Spring configuration for the slide-in animation of right card
  const slideInRight = useSpring({
    opacity: animate ? 1 : 0,
    transform: animate ? "translateX(0%)" : "translateX(100%)",
    from: { opacity: 0, transform: "translateX(100%)" },
    config: { tension: 100, friction: 30 },
  });

  return (
    <div ref={ref} className="h-screen flex flex-col items-center justify-center mt-2">
      <animated.div style={fadeInHeading} className="w-2/3 md:w-2/4">
        <h1 className="text-3xl text-black font-bold mb-2 text-center">
          The older <span className="text-bg-color">HR software</span> is ineffective.
        </h1>
        <h1 className="text-3xl text-black font-bold mb-10 text-center">Why Smart HRM?</h1>
      </animated.div>

      <div className="container mx-auto justify-center items-center flex flex-col md:flex-row p-4 md:p-8">
        {/* Left Card */}
        <animated.div style={slideInLeft} className="w-full md:w-2/5 bg-white text-black p-4 md:p-8 rounded-lg cursor-pointer hover:shadow-md hover:shadow-bg-color border-2 border-black-400 mb-4 md:mb-0 mx-5 transition-transform transform origin-center hover:scale-105">
          <div className="flex items-center mb-4">
            <QueuePlayNextRoundedIcon style={{ color: "black", fontSize: 22 }} />
            <h2 className="text-2xl font-bold ml-4">Smart Recruitment</h2>
          </div>
          <p>
            Smart Recruitment is based on CV filtering of the applicants. CV filtering is based on Natural Language Processing NLP which extracts information from the resumes of the applicants and matches it with the keywords specified by the HR.
          </p>
        </animated.div>

        {/* Right Card */}
        <animated.div style={slideInRight} className="w-full md:w-2/5 bg-sec-color text-white p-4 md:p-8 rounded-lg cursor-pointer hover:shadow-md hover:shadow-bg-color mx-5 transition-transform transform origin-center hover:scale-105">
          <div className="flex items-center mb-4">
            <PaidRoundedIcon style={{ color: "white", fontSize: 22 }} />
            <h2 className="text-2xl font-bold ml-4">Payroll Process</h2>
          </div>
          <p>
            HR of the organization can easily generate the payroll for all the employees in the organization. HR can manage allowances of the employees such as medical allowances, transport allowances and other allowances.
          </p>
        </animated.div>
      </div>
    </div>
  );
};

export default WhyUs;
