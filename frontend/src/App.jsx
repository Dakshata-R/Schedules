import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/loginpage";
import AppLayout from "./applayout/applayout";
import HomeRouting from "./applayout/homerouting";
import ProtectedRoute from "./protectedroute"; // Import the ProtectedRoute component

function App() {
  return (
    <Router>
      <Routes>
        {/* Login Page */}
        <Route path="/" element={<AuthPage />} />

        {/* Dashboard with AppLayout (includes Sidebar) */}
        <Route path="/dashboard" element={<AppLayout />}>
          <Route index element={<HomeRouting />} /> {/* /dashboard */}

          {/* Protected Route for Faculty */}
          <Route
            path="users"
            element={
              <ProtectedRoute allowedRoles={["faculty"]}>
                <HomeRouting />
              </ProtectedRoute>
            }
          />

          <Route path="files" element={<HomeRouting />} /> {/* /dashboard/files */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;