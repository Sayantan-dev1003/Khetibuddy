import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  const linkClass = (path) => {
    const base = "text-white px-5 py-3 rounded-lg font-semibold text-lg transition-all duration-300 bg-white/10 min-w-[120px] text-center hover:bg-white/25 hover:-translate-y-0.5";
    const active = "!bg-white !text-primary font-bold";
    return isActive(path) ? `${base} ${active}` : base;
  };
  
  return (
    <nav className="bg-gradient-to-br from-primary to-primary-light text-white p-5 shadow-lg sticky top-0 z-[1000]">
      <div className="text-center mb-4">
        <h1 className="text-3xl md:text-4xl font-bold drop-shadow-md">🌾 KhetiBuddy</h1>
        <p className="text-sm md:text-base opacity-90 mt-1">Smart Farming Assistant</p>
      </div>
      <div className="flex flex-wrap justify-center gap-2.5 max-w-7xl mx-auto">
        <Link to="/home" className={linkClass('/home')}>
          🏠 Home
        </Link>
        <Link to="/chatbot" className={linkClass('/chatbot')}>
          💬 Chatbot
        </Link>
        <Link to="/disease" className={linkClass('/disease')}>
          🌿 Disease
        </Link>
        <Link to="/fertilizer" className={linkClass('/fertilizer')}>
          🧪 Fertilizer
        </Link>
        <Link to="/markets" className={linkClass('/markets')}>
          📍 Markets
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
