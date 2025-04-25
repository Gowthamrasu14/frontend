import { useEffect, useState } from "react";
import { useRef } from "react";
import SubMenu from "./SubMenu";
import { motion } from "framer-motion";

// * React icons

import { SlSettings } from "react-icons/sl";
import { AiOutlineAppstore } from "react-icons/ai";
import { BsPerson } from "react-icons/bs";
import { HiOutlineDatabase } from "react-icons/hi";
import { TbAdjustmentsBolt, TbReportAnalytics } from "react-icons/tb";
import { useMediaQuery } from "react-responsive";
import { MdMenu, MdOutlineBallot } from "react-icons/md";
import { GiRegeneration } from 'react-icons/gi'
import { FaIdCard } from 'react-icons/fa'
import { SiNginxproxymanager } from "react-icons/si";
import { NavLink, useLocation } from "react-router-dom";
import { GiPowerGenerator } from "react-icons/gi";
import { LiaIndustrySolid } from "react-icons/lia";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { MdFormatListNumbered } from "react-icons/md";
import { GiControlTower } from "react-icons/gi";
import { TbLogout } from "react-icons/tb";
// import { TbReportAnalytics } from "react-icons/tb";
import logo from "../../assets/logo.png";
import { GrTestDesktop } from "react-icons/gr";
import { FaUsersLine } from "react-icons/fa6";
import useAuthStore from "../../store/authStore";


const Sidebar = () => {


  const { user, logout, login } = useAuthStore();
  const [user1, setUser1] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("item");
    const parsedUser = JSON.parse(storedUser);
    setUser1(parsedUser);

  }, []);


  let isTabletMid = useMediaQuery({ query: "(max-width: 768px)" });
  const [open, setOpen] = useState(isTabletMid ? false : true);
  const sidebarRef = useRef();
  const { pathname } = useLocation();
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    // Format the date as you need, for example: DD-MM-YYYY
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  };
  const currentDate = new Date();
  useEffect(() => {
    if (isTabletMid) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [isTabletMid]);

  useEffect(() => {
    isTabletMid && setOpen(false);
  }, [pathname]);

  const Nav_animation = isTabletMid
    ? {
      open: {
        x: 0,
        width: "18rem",
        transition: {
          damping: 40,
        },
      },
      closed: {
        x: -250,
        width: 0,
        transition: {
          damping: 40,
          delay: 0.15,
        },
      },
    }
    : {
      open: {
        width: "18rem",
        transition: {
          damping: 40,
        },
      },
      closed: {
        width: "4rem",
        transition: {
          damping: 40,
        },
      },
    };

  const subMenusList = [


    {
      name: "REPORT",
      icon: TbReportAnalytics,
      menus: ["ALLOTMENT", "MASTER REPORT", "HT-COM/CON ADJUSTMENT", "HT LEDGER"],
    },

  ];

  const subMenusList1 = [

    {
      name: "ADMIN",
      icon: TbReportAnalytics,
      menus: ["LINE LOSS", "PLANT TYPE", "CHARGES"],
    },


  ];

  return (
    <div>
      <div
        onClick={() => setOpen(false)}
        className={`md:hidden fixed inset-0 max-h-screen z-[998] bg-black/50 ${open ? "block" : "hidden"
          } `}
      ></div>
      <motion.div
        ref={sidebarRef}
        variants={Nav_animation}
        initial={{ x: isTabletMid ? -250 : 0 }}
        animate={open ? "open" : "closed"}
        className=" bg-sky-900 text-gray border-r-4  border-purple-200 shadow-xl z-[999] max-w-[18rem]  w-[18rem] 
            overflow-hidden md:relative fixed
         h-screen "
      >
        {/* <img
          src="./src/assets/control.png"
          className={`absolute cursor-pointer -right-4 top-4 w-9 border-x-white
           border-4 rounded-full  ${!open && "rotate-180"}`}
          onClick={() => setOpen(!open)}
        /> */}
        <div className="flex gap-x-4 mt-4 mx-2 items-center">
          <img
            src={logo}
            className={`cursor-pointer duration-500 ${open && "rotate-[360deg]"
              }`}
            onClick={() => setOpen(!open)}
          />
          <h1
            className={`text-green-200 origin-left font-medium text-xl duration-200 ${!open && "scale-0"
              }`}
          >
            SMARTWAY POWER
          </h1>
        </div>

        <div className="flex flex-col  h-full ">





          <ul className="whitespace-pre px-2.5 text-white text-[0.9rem] py-5 flex flex-col gap-1  font-medium overflow-x-hidden scrollbar-thin scrollbar-track-white scrollbar-thumb-slate-100   md:h-[68%] h-[70%]">
            <li>
              <NavLink to={"/Dashboard"} className="link">
                <AiOutlineAppstore size={23} className="min-w-max" />
                Dashborad
              </NavLink>
            </li>
            {user1?.utype === "PAdmin" && (
  <li>
    {(open || isTabletMid) && (
      <div className="border-sky-300">
        <small className="pl-2 text-white inline-block mb-0"></small>
        {subMenusList1?.map((menu) => (
          <div key={menu.name} className="flex text-white flex-col gap-1">
            <SubMenu data={menu} />
          </div>
        ))}
      </div>
    )}
  </li>
)}
 {(user1?.utype === "ADMIN" || user1?.utype === "PAdmin") && (
          <li>
              <NavLink to={"/USER"} className="link">
                <FaUsersLine  size={23} className="min-w-max" />
                USER
              </NavLink>
            </li> 

          )}

            <li>
              <NavLink to={"/HT DETAIL"} className="link">
                <GiControlTower size={23} className="min-w-max" />
                HT - COM / CON
              </NavLink>
            </li>

            <li>
              <NavLink to={"/Genplantdetails"} className="link">
                <BsPerson size={23} className="min-w-max" />
                GEN PLANT
              </NavLink>
            </li>
            {(user1?.utype === "ADMIN" || user1?.utype === "PAdmin") && (
  <li>
    <NavLink to={"/Htscnounitprice"} className="link">
      <FaIndianRupeeSign size={23} className="min-w-max" />
      GEN PLANT PRICE
    </NavLink>
  </li>
)}

            <li>
              <NavLink to={"/Htreadentry"} className="link">
                <LiaIndustrySolid size={23} className="min-w-max" />
                HT - COM / CON READING
              </NavLink>
            </li>
            <li>
              <NavLink to={"/Plantreadentry"} className="link">
                <GiPowerGenerator size={23} className="min-w-max" />
                GEN PLANT READING
              </NavLink>
            </li>

            <li>
              <NavLink to={"/readentry"} className="link min-w-max">
                <MdFormatListNumbered size={23} className="min-w-max" />
                HT-COM/CON&GEN PLANT READING
              </NavLink>
            </li>


            {(open || isTabletMid) && (
              <div className="  border-sky-300 ">
                <small className="pl-2 text-white inline-block mb-0"></small>
                {subMenusList?.map((menu) => (
                  <div key={menu.name} className="flex  text-white flex-col gap-1">
                    <SubMenu data={menu} />
                  </div>
                ))}
              </div>
            )}

            {/* <li>
              <NavLink to={"/Stroage"} className="link">
                <SlSettings size={23} className="min-w-max" />
                Stroage
              </NavLink>
            </li> */}

            {/* <li>
              <NavLink to={"/Test"} className="link">
                <GrTestDesktop size={23} className="min-w-max" />
                Test
              </NavLink>
            </li>

            <li>
              <NavLink to={"/LogIn"} className="link">
                <SlSettings size={23} className="min-w-max" />
                LOGIN
              </NavLink>
            </li> */}

            {/* <li>
              <NavLink to={"/Settings"} className="link">
                <TbLogout size={23} className="min-w-max" />
                LOGOUT
              </NavLink>
            </li> */}
          </ul>
          {open && (
            <div className="flex-1 text-sm z-50  max-h-48 my-auto  whitespace-pre   w-full  font-medium  ">
              <div className="flex border-y text-green-100 border-slate-300 p-4 items-center justify-between">
                <div>
                  <p>Sotware Time</p>
                  <small>Valide Upto</small>
                </div>
                <p className="text-green-50 py-1.5 px-3 text-xs bg-slate-700 rounded-xl">
                  {formatDate(currentDate)}

                </p>
              </div>
            </div>
          )}
        </div>

      </motion.div>
      <div className="m-3 md:hidden   " onClick={() => setOpen(true)}>
        <MdMenu size={25} />
      </div>



    </div>
  );
};

export default Sidebar;
