import { Routes, Route } from "react-router-dom";
import ScheduleView from "../Student/StudentHome"; // Import ScheduleView
import RequestsList from "../Student/StudentFiles"; // Import RequestsList
import Home from "../faculty/facultyhome"; // Import Home
import Users from "../pages/secondbutton/create"; // Import UserInput
import Files from "../faculty/Files";

const HomeRouting = () => {
  return (
    <Routes>
      {/* Default route for the dashboard */}
      <Route index element={<Home />} /> {/* Default to Home for the root path */}

      {/* Routes for Students */}
      <Route path="studenthome" element={<ScheduleView />} />
      <Route path="studentfiles" element={<RequestsList />} />

      {/* Routes for Faculty */}
      <Route path="home" element={<Home />} />
      <Route path="create" element={< Users/>} />
      <Route path="files" element={<Files />} />
    </Routes>
  );
};

export default HomeRouting;