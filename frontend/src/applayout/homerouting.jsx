import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/home";
import Users from "../pages/secondbutton/create"; // Correct Users component
import UserInput from "../pages/secondbutton/userinput"; // Nested routing for steps
import Files from "../pages/files";
import Logout from "../pages/logout";

const HomeRouting = () => {
  return (
    <Routes>
      <Route index element={<Dashboard />} />
      <Route path="users" element={<Users />}>
        <Route index element={<UserInput />} />
      </Route>
      <Route path="files" element={<Files />} />
      <Route path="logout" element={<Logout />} />
    </Routes>
  );
};

export default HomeRouting;