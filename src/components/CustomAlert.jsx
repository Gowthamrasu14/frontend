import React, { useEffect } from "react";

const CustomAlert = ({ message, type = "error", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const baseStyle = {
    success: "bg-green-100 text-green-800 border-green-300",
    error: "bg-red-100 text-red-800 border-red-300",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-300",
    info: "bg-blue-100 text-blue-800 border-blue-300",
  };

  return (
    <div className={`fixed top-6 right-6 z-50 px-4 py-2 border rounded-lg shadow-md w-fit animate-slide-in ${baseStyle[type]}`}>
      <div className="flex items-center gap-2">
        <span className="text-sm">{message}</span>
        <button onClick={onClose} className="text-xl font-bold">&times;</button>
      </div>
    </div>
  );
};

export default CustomAlert;
