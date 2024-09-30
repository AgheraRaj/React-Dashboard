import React from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Footer from "./components/ui/Footer";
import { Outlet } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";

const App = () => {

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-col w-4/5 h-screen grow">
        <Navbar />

        {/* Content Area with Scroll */}

        <ScrollArea>
          <div className="border-y-[1px]">
            <Outlet />
          </div>
          {/* Footer */}
          <Footer />
        </ScrollArea>
      </div>
    </div>
  );
};

export default App;
