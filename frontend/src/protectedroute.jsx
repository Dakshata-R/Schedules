import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const location = useLocation();
  const role = localStorage.getItem("role"); // Get the user's role from localStorage

  // Check if the user's role is allowed
  if (!allowedRoles.includes(role)) {
    // Redirect to a safe route (e.g., dashboard) if the role is not allowed
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;