import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans selection:bg-green-100 selection:text-green-800 transition-all duration-300">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 transition-all duration-300">
        {/* Header */}
        <Header />

        {/* Dynamic Route Content */}
        <main className="ml-64 p-8 transition-all duration-300">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Outlet />
          </div>
        </main>

        {/* Footer Placeholder (Optional) */}
        <footer className="ml-64 py-6 px-8 border-t border-slate-200">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm">
            <p>© 2026 KhetiBuddy. Empowering Sustainable Agriculture.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-green-600 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-green-600 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-green-600 transition-colors">Support</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;
