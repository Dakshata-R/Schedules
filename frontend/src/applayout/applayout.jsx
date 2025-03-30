import React from "react";
import Sidebar from "../components/sidebar";
import HomeRouting from "../applayout/homerouting";

const AppLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 mt-16 p-4">
        <HomeRouting /> {/* This will render the nested routes */}
      </div>
    </div>
  );
};

export default AppLayout;