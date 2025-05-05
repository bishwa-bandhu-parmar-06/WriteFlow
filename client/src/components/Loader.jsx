import React from "react";

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[100px]">
      <div className="relative">
        {/* Animated dots */}
        <div className="flex space-x-1 mb-2">
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
        </div>
        
        {/* Typing animation text */}
        <div className="text-center">
          <span className="text-gray-700 font-medium text-lg relative">
            WriteFlow
            <span className="absolute -right-2 w-1 h-6 bg-indigo-500 animate-pulse"></span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Loader;