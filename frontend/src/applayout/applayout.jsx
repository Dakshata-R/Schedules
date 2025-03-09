import Sidebar from "../components/sidebar";
import Homerouting from "../applayout/homerouting";

const AppLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 mt-16 p-4">
        <Homerouting /> {/* This will render the nested routes */}
      </div>
    </div>
  );
};

export default AppLayout;