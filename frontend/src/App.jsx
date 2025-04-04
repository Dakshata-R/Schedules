import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/loginpage';
import AppLayout from './applayout/applayout';
import HomeRouting from './applayout/homerouting';
import ProtectedRoute from './protectedroute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected routes */}
        <Route element={<AppLayout />}>
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <HomeRouting />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/faculty/dashboard/*" 
            element={
              <ProtectedRoute allowedRoles={['faculty']}>
                <HomeRouting />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/dashboard/*" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <HomeRouting />
              </ProtectedRoute>
            } 
          />
        </Route>
        
        {/* Redirects */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;