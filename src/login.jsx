import React, { useState } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import bgImage from "../src/assets/1.webp";
import { useNavigate } from "react-router-dom";
import useAuthStore from "./store/authStore";
// import CustomAlert from "./COMPONENTS/CustomAlert";
import CustomAlert from "./components/CustomAlert";



const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [newEntry, setNewEntry] = useState({ username: "", password: "" });
  const { login } = useAuthStore();
  const [alert, setAlert] = useState(null); // 👈 Alert state

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEntry({ ...newEntry, [name]: value });
  };

  const [admin] = useState({
    dest: "ADMIN",
    empname: "MASTER ADMIN",
    img: null,
    utype: "PAdmin",
    password: "6F&12H",
    username: "SMARTADMIN",
  });

  const open = async () => {
    if (
      newEntry.username === admin.username &&
      newEntry.password === admin.password
    ) {
      const data = admin;
      localStorage.setItem("item", JSON.stringify(data));
      login(data);
      navigate("/Dashboard");
      return;
    }

    try {
      const response = await axios.get(
        `http://147.79.68.117:8000/api/getselecteduser/${newEntry.username}/${newEntry.password}`
      );

      const data = response.data[0];

      if (!data) {
        setAlert({ message: "Login failed: No user found.", type: "error" });
      } else {
        localStorage.setItem("item", JSON.stringify(data));
        login(data);
        navigate("/Dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      setAlert({
        message: "An error occurred while trying to login.",
        type: "error",
      });
    }
  };

  return (
    <div
      className="flex h-screen w-full items-center font-Montserrat uppercase justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="relative z-10 w-full max-w-xs p-6 rounded-lg shadow-xl backdrop-blur-md bg-white/30">
        <h4 className="text-center text-2xl font-bold text-green-900 py-4">
          SMARTWAY POWER
        </h4>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            open();
          }}
        >
          <div className="mb-4">
            <input
              type="text"
              name="username"
              placeholder="ENTER YOUR USERNAME"
              required
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg bg-transparent backdrop-blur-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4 relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="ENTER YOUR PASSWORD"
              required
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg bg-transparent backdrop-blur-md focus:ring-2 focus:ring-blue-500 pr-10"
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

      {/* Alert */}
      {alert && (
        <CustomAlert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
    </div>
  );
};

export default LoginPage;
