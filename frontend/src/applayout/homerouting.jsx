import { Routes, Route } from "react-router-dom";
import Home from "../faculty/facultyhome";
import Users from "../pages/secondbutton/create";
import Files from "../faculty/Files";
import StudentHome from "../Student/StudentHome";
import StudentFiles from "../Student/StudentFiles";

const HomeRouting = () => {
  return (
    <Routes>
      {/* Default route based on role */}
      <Route 
        index 
        element={
          localStorage.getItem("role") === "student" ? 
            <StudentHome /> : 
            <Home /> 
        } 
      />

      {/* Student routes */}
      {localStorage.getItem("role") === "student" && (
        <>
          <Route path="studenthome" element={<StudentHome />} />
          <Route path="files" element={<StudentFiles />} />
        </>
      )}

      {/* Faculty routes */}
      {localStorage.getItem("role") === "faculty" && (
        <>
          <Route path="home" element={<Home />} />
          <Route path="create" element={<Users />} />
          <Route path="files" element={<Files />} />
        </>
      )}
    </Routes>
  );
};

export default HomeRouting;