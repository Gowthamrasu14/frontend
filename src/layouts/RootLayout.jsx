import React, { useEffect, useState, useRef } from "react";
import Sidebar from "./sidebar";
import Navbar from "./sidebar/Navbar.jsx";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { RiLogoutCircleRLine } from "react-icons/ri";

function RootLayout({ children }) {
  const navigate = useNavigate();
  const { user, logout, login } = useAuthStore();
  const [user1, setUser1] = useState(null);
  const [loading, setLoading] = useState(true);
  const logoutTimerRef = useRef(null);
  const inactivityLimit = 5 * 60 * 1000; // 15 minutes

  useEffect(() => {
    const storedUser = localStorage.getItem("item");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser1(parsedUser);
        if (!user) login(parsedUser);
      } catch (error) {
        console.error("Failed to parse user", error);
        navigate("/", { replace: true });
      }
    } else {
      navigate("/", { replace: true });
    }

    setLoading(false);
  }, []);

  // 👇 Activity detection effect
  useEffect(() => {
    if (!user) return;

    const resetTimer = () => {
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = setTimeout(() => {
        handleLogout(true);
      }, inactivityLimit);
    };

    const activityEvents = ["mousemove", "keydown", "mousedown", "touchstart"];
    activityEvents.forEach((event) => window.addEventListener(event, resetTimer));

    resetTimer(); // start timer initially

    return () => {
      activityEvents.forEach((event) =>
        window.removeEventListener(event, resetTimer)
      );
      clearTimeout(logoutTimerRef.current);
    };
  }, [user]);

  const handleLogout = (auto = false) => {
    localStorage.clear();
    logout();
    navigate("/", { replace: true });

    if (auto) {
      console.log("Auto-logged out due to inactivity.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <>{children}</>;

  return (
 
      <div className="relative flex flex-col md:flex-row min-h-screen">
        <Sidebar />
    
        <div className="flex flex-col flex-1 w-full">
          <Navbar />
    
          <div className="p-4 flex-1 overflow-auto">{children}</div>
    
          <div className="fixed top-4 right-4 flex items-center gap-2 bg-black/60 text-white px-3 py-1 rounded-full shadow-md z-50">
            <RiLogoutCircleRLine
              onClick={handleLogout}
              size={23}
              className="cursor-pointer hover:text-red-400"
            />
            <span className="text-sm">{user1?.empname || user?.empname || "USER"}</span>
          </div>
        </div>
      </div>
    );

}

export default RootLayout;
