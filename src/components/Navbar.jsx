import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const Navbar = () => {

  const handleLogin = () => {
    sessionStorage.clear();
    window.location.reload();
  };

  return (
    <nav className="flex justify-end mx-8 my-3">
      <div className="flex items-center space-x-4 w-1/3">
        <Input type="text" placeholder="Search..." />
        <Button 
        onClick={handleLogin}
        >Logout</Button>
      </div>
    </nav>
  );
};

export default Navbar;
