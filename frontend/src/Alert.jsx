import React from "react";

const Alert = ({ message, type, retry }) => {
    return (
      <div className={`
        p-4 rounded-lg shadow-lg w-fit mx-auto
        ${type === 'warning' ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' : ''}
        ${type === 'error' ? 'bg-red-100 text-red-800 border border-red-300' : ''}
      `}>
        {message}. <span className="cursor-pointer underline" onClick={retry}>Retry</span>?
      </div>)
  };

  export default Alert;