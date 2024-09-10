import React from "react";
import NavigationBar from "./components/NavigationBar";
import Dashboard from "./components/Dashboard";

const App = () => {
  return (
    <>
      <div className="flex w-full">
        {/* Navbar */}
        <NavigationBar />
        {/* Main Components */}
        <main className="grow">
          <Dashboard />
        </main>
      </div>
    </>
  );
};

export default App;
