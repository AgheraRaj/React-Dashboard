import React from "react";
import { Input } from "./ui/input";

const Navbar = () => {

  const handleLogin = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <nav className="flex justify-end mx-8 my-3">
      <div className="flex items-center space-x-4 w-1/3">
        <Input type="text" placeholder="Search..." />
        <button 
        onClick={handleLogin}
        className=" bg-indigo-700 text-white py-2 px-4 rounded">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
