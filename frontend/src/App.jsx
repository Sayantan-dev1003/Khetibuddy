import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout.jsx';
import Landing from './pages/Landing.jsx';
import Home from './pages/Home.jsx';
import Chatbot from './pages/Chatbot.jsx';
import DiseaseDetection from './pages/DiseaseDetection.jsx';
import FertilizerAdvisor from './pages/FertilizerAdvisor.jsx';
import NearbyMarkets from './pages/NearbyMarkets.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import UserManagement from './pages/admin/UserManagement.jsx';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/auth';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Landing page */}
          <Route path="/" element={<Landing />} />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected Main app routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Home />} />
            <Route path="chatbot" element={<Chatbot apiUrl={API_URL} />} />
            <Route path="disease-detection" element={<DiseaseDetection apiUrl={API_URL} />} />
            <Route path="fertilizer-advisory" element={<FertilizerAdvisor apiUrl={API_URL} />} />
            <Route path="nearby-market" element={<NearbyMarkets />} />

            {/* Admin Routes */}
            <Route 
              path="admin" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="admin/users" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <UserManagement />
                </ProtectedRoute>
              } 
            />
          </Route>

          {/* Fallback to dashboard (will redirect to login if needed) */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
