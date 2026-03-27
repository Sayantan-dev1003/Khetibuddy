import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout.jsx';
import Landing from './pages/Landing.jsx';
import Home from './pages/Home.jsx';
import Chatbot from './pages/Chatbot.jsx';
import DiseaseDetection from './pages/DiseaseDetection.jsx';
import FertilizerAdvisor from './pages/FertilizerAdvisor.jsx';
import NearbyMarkets from './pages/NearbyMarkets.jsx';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing page without app layout */}
        <Route path="/" element={<Landing />} />
        
        {/* Main app routes with modern SaaS layout */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Home />} />
          <Route path="chatbot" element={<Chatbot apiUrl={API_URL} />} />
          <Route path="disease-detection" element={<DiseaseDetection apiUrl={API_URL} />} />
          <Route path="fertilizer-advisory" element={<FertilizerAdvisor apiUrl={API_URL} />} />
          <Route path="nearby-market" element={<NearbyMarkets />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
