import Sidebar from "../components/sidebar";
import HomeRouting from "./homerouting";
import TopNavbar from "../components/topnavbar";
import { Outlet } from "react-router-dom"; 

const AppLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <TopNavbar />

        {/* Page Content */}
        <div className="flex-1 mt-16 p-4">
          <HomeRouting />
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
