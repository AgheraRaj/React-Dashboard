import React, { useState } from "react";
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
    path: "/",
  },
  {
    name: "StackHolder",
    icons: Layers3,
    path: "#",
    subLinks: [
      { name: "Employee", path: "StackHolder/employee" },
      { name: "Users", path: "StackHolder/users" },
    ],
  },
  {
    name: "Jobs",
    icons: BriefcaseBusiness,
    path: "#",
    subLinks: [
      { name: "All Jobs", path: "jobs/alljobs" },
      { name: "Proposals", path: "jobs/proposals" },
      { name: "Contracts", path: "jobs/contracts" },
    ],
  },
  {
    name: "Skills",
    icons: PencilRuler,
    path: "skills",
  },
  {
    name: "Transaction",
    icons: ArrowRightLeft,
    path: "#",
    subLinks: [
      { name: "All Transactions", path: "transaction/alltransactions" },
      { name: "Invoice", path: "transaction/invoice" },
      { name: "Milestone", path: "transaction/milestone" },
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
      <div className="flex space-x-3 items-center px-3">
        <svg
          id="logo-85"
          width="30px"
          height="30px"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            class="ccustom"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M10 0C15.5228 0 20 4.47715 20 10V0H30C35.5228 0 40 4.47715 40 10C40 15.5228 35.5228 20 30 20C35.5228 20 40 24.4772 40 30C40 32.7423 38.8961 35.2268 37.1085 37.0334L37.0711 37.0711L37.0379 37.1041C35.2309 38.8943 32.7446 40 30 40C27.2741 40 24.8029 38.9093 22.999 37.1405C22.9756 37.1175 22.9522 37.0943 22.9289 37.0711C22.907 37.0492 22.8852 37.0272 22.8635 37.0051C21.0924 35.2009 20 32.728 20 30C20 35.5228 15.5228 40 10 40C4.47715 40 0 35.5228 0 30V20H10C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0ZM18 10C18 14.4183 14.4183 18 10 18V2C14.4183 2 18 5.58172 18 10ZM38 30C38 25.5817 34.4183 22 30 22C25.5817 22 22 25.5817 22 30H38ZM2 22V30C2 34.4183 5.58172 38 10 38C14.4183 38 18 34.4183 18 30V22H2ZM22 18V2L30 2C34.4183 2 38 5.58172 38 10C38 14.4183 34.4183 18 30 18H22Z"
            fill="#212121"
          ></path>
        </svg>
        <span
          className={
            "font-medium text-base" + (isExpended ? " block" : " hidden")
          }
        >
          ProGig
        </span>
      </div>

      <div
        onClick={() => {
          setIsExpended(!isExpended);
          if (isExpended) {
            setIsDropdownOpen(false);
          }
        }}
        className={
          "w-5 h-5 rounded-full bg-black absolute -right-[10.5px] top-6 flex items-center justify-center" +
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
                    ? " bg-black text-white font-semibold"
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
                      className={"flex space-x-2 my-2 p-2 rounded bg-gray-100 text-black"}
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
