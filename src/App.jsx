import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import useAuthStore from "./store/authStore";

import AllApps from "./pages/AllApps";
import Settings from "./pages/Settings";
import Stroage from "./pages/Stroage";
import Lineloss from "./pages/adminpage/Linloss";
import HtDetail from "./pages/adminpage/HtDetail";
import Dashboard from "./pages/Dashboard";
import PlantType from "./pages/adminpage/Planttype";
import Charges from "./pages/adminpage/Charges";
import Genplant from "./pages/userpage/genplant";
import Htreadentry from "./pages/userpage/htreading";
import Plantreadentry from "./pages/userpage/genreading";
import Allotread from "./pages/userpage/allotread";
import Htscnounitprice from "./pages/adminpage/Htscnounitprice";
import Masterreport from "./pages/reportpage/masterreport";
import Adjustedreport from "./pages/reportpage/adjustedsummary";
import Htledger from "./pages/reportpage/htledger";
import Report from "./pages/reportpage/report";
import Allotcharges from "./pages/userpage/allotcharges";
import Allotsave from "./pages/userpage/allotsave";
import Allotment from "./pages/reportpage/allotment";
import Genbulk from "./pages/userpage/genbulk";
import LogIn from "./login";
import Test from "./pages/test";
import Test1 from "./pages/test1";
import USERS from "./pages/userpage/user";
import Genbulk1 from "./pages/userpage/genplant1";

const App = () => {
  // const isLoggedIn = localStorage.getItem("LOGIN") === "true";
  // const isLoggedIn = !!localStorage.getItem("user");
  const { user } = useAuthStore();
  const isLoggedIn = !!user;

// console.log(isLoggedIn)
  return (
    <RootLayout>
      <Routes>
        <Route path="/" element={<LogIn />} />
        {isLoggedIn ? (
          <>
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/app" element={<AllApps />} />
            <Route path="/stroage" element={<Stroage />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/ADMIN/LINE LOSS" element={<Lineloss />} />
            <Route path="/HT DETAIL" element={<HtDetail />} />
            <Route path="/ADMIN/PLANT TYPE" element={<PlantType />} />
            <Route path="/ADMIN/CHARGES" element={<Charges />} />
            <Route path="/Genplantdetails" element={<Genplant />} />
            <Route path="/Htreadentry" element={<Htreadentry />} />
            <Route path="/Plantreadentry" element={<Plantreadentry />} />
            <Route path="/readentry" element={<Allotread />} />
            <Route path="/Htscnounitprice" element={<Htscnounitprice />} />
            <Route path="/REPORT/MASTER REPORT" element={<Masterreport />} />
            <Route path="/REPORT/HT-COM/CON ADJUSTMENT" element={<Adjustedreport />} />
            <Route path="/REPORT/HT LEDGER" element={<Htledger />} />
            <Route path="/REPORT/DEMO REPORT" element={<Report />} />
            <Route path="/Allotcharges" element={<Allotcharges />} />
            <Route path="/Allotsave" element={<Allotsave />} />
            <Route path="/REPORT/Allotment" element={<Allotment />} />
            <Route path="/Genbulk" element={<Genbulk />} />
            <Route path="/Genbulk1" element={<Genbulk1 />} />
            <Route path="/Test" element={<Test />} />
            <Route path="/TEST1" element={<Test1 />} />
            <Route path="/USER" element={<USERS />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/" />} />
        )}
        <Route path="/" element={<LogIn />} />
      </Routes>
    </RootLayout>
  );
};

export default App;
