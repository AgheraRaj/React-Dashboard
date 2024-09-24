import React from "react";
import Dashboard from "./components/Dashboard";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <>
      <Sidebar />
      <Navbar />
      <Dashboard />
    </>
  );
};

export default App;
