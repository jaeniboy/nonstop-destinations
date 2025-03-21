import React, { useState } from 'react';
import { BsChevronUp, BsChevronDown  } from "react-icons/bs";

const BottomSheet = ({children}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSheet = () => setIsOpen(!isOpen);

  return (
    <div className={
        `fixed bottom-0 left-0 right-0 
        bg-white
        shadow-[0px_-3px_9px_0px_rgba(0,0,0,0.2)] 
        rounded-xl 
        transition-all duration-300 ease-in-out 
        z-[1001]
        md:hidden
        px-5
        ${isOpen ? 'h-[90vh]' : 'h-[22em] sm:h-[18em]'}`
        }>
      {/* <div onClick={toggleSheet} className="flex justify-center p-4">
        {isOpen ? (
          <button  className="text-gray-500 hover:text-gray-700">
            <BsChevronDown className="h-6 w-6" />
          </button>
        ) : (
          <button className="text-gray-500 hover:text-gray-700">
            <BsChevronUp className="h-6 w-6" />
          </button>
        )}
      </div> */}
      <div className="px-42 flex flex-col h-full pt-5">
        {children}
      </div>
    </div>
  );
};

export default BottomSheet;
