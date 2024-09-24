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
} from "lucide-react";

const navLinks = [
  {
    name: "Dashboard",
    icons: LayoutDashboard,
  },
  {
    name: "Stack holder",
    icons: Layers3,
  },
  {
    name: "Jobs",
    icons: BriefcaseBusiness,
  },
  {
    name: "Skills",
    icons: PencilRuler,
  },
  {
    name: "Transaction",
    icons: ArrowRightLeft,
  },
];

const variants = {
  Expanded: { width: "20%" },
  nonExpended: { width: "5%" },
};
const Sidebar = () => {
  const [activeNavIndex, setactiveNavIndex] = useState(0);
  const [isExpended, setIsExpended] = useState(true);

  return (
    <motion.div
      animate={isExpended ? "Expended" : "nonExpended"}
      variants={variants}
      className={
        "py-12 flex flex-col border border-r w-1/5 h-screen relative" +
        (isExpended ? " px-10" : " items-center")
      }
    >
      <div className="flex space-x-3 items-center">
        <img src={Logo} />
        <span className={isExpended ? "block" : "hidden"}>Money Tracker</span>
      </div>

      <div
        onClick={() => setIsExpended(!isExpended)}
        className={"w-5 h-5 rounded-full bg-[#FF8C8C] absolute -right-[10.5px] top-20 flex items-center justify-center" + (isExpended ? " rotate-180" : " rotate-0")}
      >
        <img src={RightArrow} className="w-[5px]" />
      </div>

      <div className="mt-10 flex flex-col space-y-8">
        {navLinks.map((item, index) => (
          <div
            key={index}
            className={
              "flex space-x-3 p-2 rounded" +
              (activeNavIndex === index
                ? " bg-[#FF8C8C] text-white font-semibold"
                : " ")
            }
            onClick={() => setactiveNavIndex(index)}
          >
            <item.icons />
            <span className={isExpended ? "block" : "hidden"}>{item.name}</span>
          </div>
        ))}

        {/* <div className="flex space-x-3 p-2 absolute bottom-12">
          <LogOut />
          <p className={isExpended ? "block" : "hidden"}>Logout</p>
        </div> */}
      </div>
    </motion.div>
  );
};

export default Sidebar;
