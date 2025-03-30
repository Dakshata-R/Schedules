import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AuthPage from "./pages/loginpage";
import AppLayout from "./applayout/applayout"; // Import AppLayout component

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<AuthPage />} />

        {/* Protected Routes */}
        <Route path="/dashboard/*" element={<AppLayout />}>
          {/* Nested routes are handled by HomeRouting inside AppLayout */}
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<div>Page not found</div>} />
      </Routes>
    </Router>
  );
};

export default App;