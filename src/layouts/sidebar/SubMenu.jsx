import { useState } from "react";
import { motion } from "framer-motion";
import { IoMdArrowDropdown } from "react-icons/io";
import { NavLink, useLocation } from "react-router-dom";

const SubMenu = ({ data }) => {
  const { pathname } = useLocation();
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  return (
    <>
      <li
        className={`link ${pathname.includes(data.name) && "text-black bg-white"}`}
        onClick={() => setSubMenuOpen(!subMenuOpen)}
      >
        <data.icon size={23} className="min-w-max" />
        <p className="flex-1 capitalize ">{data.name}</p>
        <IoMdArrowDropdown 
          className={` ${subMenuOpen && "rotate-180"} duration-200 `}
        />
      </li>
      <motion.ul
        animate={
          subMenuOpen
            ? {
                height: "fit-content",
              }
            : {
                height: 0,
              }
        }
        className="flex h-0 flex-col pl-16 text-[0.8rem] font-normal  overflow-hidden "
      >
        {data.menus?.map((menu) => (
          <li key={menu}>
            {/* className="hover:text-black hover:font-medium" */}
            <NavLink
  to={`/${data.name}/${menu}`}
  className={({ isActive }) =>
    `link !bg-transparent capitalize ${
      isActive ? "text-green-200 font-semibold" : "text-white"
    }`
  }
>
  {menu}
</NavLink>
          </li>
        ))}
      </motion.ul>
    </>
  );
};

export default SubMenu;
