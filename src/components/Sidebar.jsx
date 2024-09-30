import React, { useState } from "react";
import Logo from "./../assets/Logo.png";
import RightArrow from "./../assets/icons/rightArrow.svg";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Layers3,
  BriefcaseBusiness,
  PencilRuler,
  ArrowRightLeft,
  ChevronDown,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";

const navLinks = [
  {
    name: "Dashboard",
    icons: LayoutDashboard,
    path: "",
  },
  {
    name: "StackHolder",
    icons: Layers3,
    subLinks: [
      { name: "Employee", path: "/StackHolder/employee" },
      { name: "Users", path: "/StackHolder/users" },
    ],
  },
  {
    name: "Jobs",
    icons: BriefcaseBusiness,
    subLinks: [
      { name: "All Jobs", path: "/jobs/alljobs" },
      { name: "Proposals", path: "/jobs/proposals" },
      { name: "Contracts", path: "/jobs/contracts" },
    ],
  },
  {
    name: "Skills",
    icons: PencilRuler,
    path: "/skills",
  },
  {
    name: "Transaction",
    icons: ArrowRightLeft,
    subLinks: [
      { name: "All Transactions", path: "/transaction/alltransactions" },
      { name: "Invoice", path: "/transaction/invoice" },
      { name: "Milestone", path: "/transaction/milestone" },
    ],
  },
];

const variants = {
  Expanded: { width: "20%" },
  nonExpended: { width: "5%" },
};

const Sidebar = () => {
  const [activeNavIndex, setactiveNavIndex] = useState(0);
  const [isExpended, setIsExpended] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = (section) => {
    setIsDropdownOpen((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  return (
    <motion.div
      animate={isExpended ? "Expanded" : "nonExpended"}
      variants={variants}
      className={
        "py-12 flex flex-col border border-r w-1/5 h-screen relative" +
        (isExpended ? " px-5" : " items-center")
      }
    >
      <div className="flex space-x-3 items-center">
        <img src={Logo} alt="Logo" />
        <span className={isExpended ? "block" : "hidden"}>Money Tracker</span>
      </div>

      <div
        onClick={() => {
          setIsExpended(!isExpended);
          if (isExpended) {
            setIsDropdownOpen(false);
          }
        }}
        className={
          "w-5 h-5 rounded-full bg-[#FF8C8C] absolute -right-[10.5px] top-6 flex items-center justify-center" +
          (isExpended ? " rotate-180" : " rotate-0")
        }
      >
        <img src={RightArrow} className="w-[5px]" alt="Toggle Sidebar" />
      </div>

      <ScrollArea className="mt-10 px-5">
        <div className="flex flex-col space-y-8">
          {navLinks.map((item, index) => (
            <div key={index}>
              <NavLink
                to={item.path}
                className={
                  "flex space-x-3 p-2 rounded" +
                  (activeNavIndex === index
                    ? " bg-[#FF8C8C] text-white font-semibold"
                    : " ")
                }
                onClick={() => {
                  setactiveNavIndex(index);
                  if (item.name === "StackHolder") {
                    toggleDropdown("StackHolder");
                  } else if (item.name === "Jobs") {
                    toggleDropdown("Jobs");
                  } else if (item.name === "Transaction") {
                    toggleDropdown("Transaction");
                  }
                }}
              >
                <item.icons aria-hidden="true" />
                <span className={isExpended ? "block" : "hidden"}>
                  {item.name}
                </span>
                {item.subLinks && isExpended && (
                  <ChevronDown className="ml-auto" />
                )}
              </NavLink>

              {/* StackHolder Dropdown */}
              {item.name === "StackHolder" && isDropdownOpen.StackHolder && (
                <div className="ml-6 flex flex-col space-y-2">
                  {item.subLinks.map((subItem, subIndex) => (
                    <NavLink
                      to={subItem.path}
                      key={subIndex}
                      className="flex space-x-2 my-2 p-2 rounded bg-gray-100 text-black"
                      onClick={() => setactiveNavIndex(index)}
                    >
                      <span className={isExpended ? "block" : "hidden"}>
                        {subItem.name}
                      </span>
                    </NavLink>
                  ))}
                </div>
              )}

              {/* Jobs Dropdown */}
              {item.name === "Jobs" && isDropdownOpen.Jobs && (
                <div className="ml-6 flex flex-col space-y-2">
                  {item.subLinks.map((subItem, subIndex) => (
                    <NavLink
                      to={subItem.path}
                      key={subIndex}
                      className="flex space-x-2 my-2 p-2 rounded bg-gray-100 text-black"
                      onClick={() => setactiveNavIndex(index)}
                    >
                      <span className={isExpended ? "block" : "hidden"}>
                        {subItem.name}
                      </span>
                    </NavLink>
                  ))}
                </div>
              )}

              {/* Transaction Dropdown */}
              {item.name === "Transaction" && isDropdownOpen.Transaction && (
                <div className="ml-6 flex flex-col space-y-2">
                  {item.subLinks.map((subItem, subIndex) => (
                    <NavLink
                      to={subItem.path}
                      key={subIndex}
                      className="flex space-x-2 my-2 p-2 rounded bg-gray-100 text-black"
                      onClick={() => setactiveNavIndex(index)}
                    >
                      <span className={isExpended ? "block" : "hidden"}>
                        {subItem.name}
                      </span>
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </motion.div>
  );
};

export default Sidebar;
