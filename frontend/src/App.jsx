import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["student", "faculty"]}>
              <AppLayout />
            </ProtectedRoute>
          }
        >
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

        {/* Fallback route for invalid paths */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;