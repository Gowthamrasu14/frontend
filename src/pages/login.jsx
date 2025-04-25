import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react"; // Importing eye icons
import bgImage from "../assets/1.webp";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div
      className="flex h-screen w-full items-center font-Montserrat uppercase justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Blurred Login Form - Centered */}
      <div className="relative z-10 w-full max-w-xs p-6 rounded-lg shadow-xl backdrop-blur-md bg-white/30">
        <h4 className="text-center text-2xl font-bold text-green-900 py-4">
          SMARTWAY POWER
        </h4>

        <form>
          <div className="mb-4">
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none bg-transparent backdrop-blur-md focus:ring-2 focus:ring-blue-500"
              placeholder="ENTER YOUR USERNAME"
              required
            />
          </div>

          {/* Password Field with Custom Closed Eye Icon */}
          <div className="mb-4 relative">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none bg-transparent backdrop-blur-md focus:ring-2 focus:ring-blue-500 pr-10"
              placeholder="ENTER YOUR PASSWORD"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-600 hover:text-gray-800"
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full font-semibold text-white py-2 rounded-lg backdrop-blur-md hover:bg-sky-900 transition"
          >
            LOGIN
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
