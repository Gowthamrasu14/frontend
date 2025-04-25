import React, { useEffect, useState } from "react";
import axios from "axios";
const LocalIP = () => {
  const [localIp, setLocalIp] = useState("Fetching...");

  useEffect(() => {

    const fetchhtData = async () => {
      const response = await axios.get("http://localhost:8000/api/getSystemInfo");
      setLocalIp(response.data[0]);
      localStorage.setItem("localIp", response.data[0]); // Save to localStorage
    };
    fetchhtData();
   
  }, []);

  
};

export default LocalIP;
