import React, { useState } from "react";
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';

function FAQ() {
  const [showAnswer1, setShowAnswer1] = useState(false);
  const [showAnswer2, setShowAnswer2] = useState(false);
  const [showAnswer3, setShowAnswer3] = useState(false);

  const toggleAnswer = (faqNumber) => {
    switch (faqNumber) {
      case 1:
        setShowAnswer1(!showAnswer1);
        break;
      case 2:
        setShowAnswer2(!showAnswer2);
        break;
      case 3:
        setShowAnswer3(!showAnswer3);
        break;
      default:
        break;
    }
  };

  return (
    <div className="bg-white flex flex-col justify-center items-center">
      <div className="flex flex-col my-20">
        <div className="text-black text-2xl font-bold self-center">
          Frequently asked questions about Smart HRM
        </div>

        {/* FAQ 1 */}
        <div className="border w-11/12 m-auto bg-white flex items-center justify-between px-4 gap-5 mt-20 rounded-2xl border-solid border-teal-950">
          <div className="text-black text-lg font-bold p-2">
            What features do Smart HRM offer?
          </div>
          <div className="text-xl" onClick={() => toggleAnswer(1)}>
            {showAnswer1 ? (
              <RemoveCircleOutlineOutlinedIcon className="text-lg cursor-pointer" />
            ) : (
              <AddCircleOutlineOutlinedIcon className="text-lg cursor-pointer" />
            )}
          </div>
        </div>
        {showAnswer1 && (
          <div className="text-black text-lg p-2 mt-2 w-10/12 ml-5">
            Answer 1: Smart HRM offers various features such as...
          </div>
        )}

        {/* FAQ 2 */}
        <div className="border w-11/12 m-auto bg-white flex items-center justify-between px-4 gap-5 mt-20 rounded-2xl border-solid border-teal-950">
          <div className="text-black text-lg font-bold p-2">
            How will Smart HRM help my business?
          </div>
          <div className="text-xl" onClick={() => toggleAnswer(2)}>
            {showAnswer2 ? (
              <RemoveCircleOutlineOutlinedIcon className="text-lg cursor-pointer" />
            ) : (
              <AddCircleOutlineOutlinedIcon className="text-lg cursor-pointer" />
            )}
          </div>
        </div>
        {showAnswer2 && (
          <div className="text-black text-lg p-2 mt-2 w-10/12 ml-5">
            Answer 2: Smart HRM can help your business by...
          </div>
        )}

        {/* FAQ 3 */}
        <div className="border w-11/12 m-auto bg-white flex items-center justify-between px-4 gap-5 mt-20 rounded-2xl border-solid border-teal-950">
          <div className="text-black text-lg font-bold p-2">
            Do Smart HRM help with software implementation?
          </div>
          <div className="text-xl" onClick={() => toggleAnswer(3)}>
            {showAnswer3 ? (
              <RemoveCircleOutlineOutlinedIcon className="text-lg cursor-pointer" />
            ) : (
              <AddCircleOutlineOutlinedIcon className="text-lg cursor-pointer" />
            )}
          </div>
        </div>
        {showAnswer3 && (
          <div className="text-black text-lg p-2 mt-2 w-9/12 ml-5">
            Answer 3: Yes, Smart HRM provides support with software implementation.
          </div>
        )}
      </div>
    </div>
  );
}

export default FAQ;
