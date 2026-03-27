import React from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Bell, 
  HelpCircle, 
  Search 
} from 'lucide-react';

const Header = () => {
  const location = useLocation();

  const getPageTitle = (path) => {
    switch (path) {
      case '/dashboard': return 'Dashboard Overview';
      case '/dashboard/chatbot': return 'KhetiBuddy AI Chat';
      case '/dashboard/disease-detection': return 'Plant Disease Detection';
      case '/dashboard/fertilizer-advisory': return 'Fertilizer Advisor';
      case '/dashboard/nearby-market': return 'Nearby Markets';
      default: return 'Overview';
    }
  };

  return (
    <header className="h-16 ml-64 sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-200 z-20 transition-all duration-300">
      <div className="flex items-center justify-between h-full px-8">
        {/* Left: Page Title */}
        <h1 className="text-xl font-bold text-slate-900 transition-all duration-300">
          {getPageTitle(location.pathname)}
        </h1>

        {/* Center: Search Bar Placeholder */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Search className="w-5 h-5" />
            </span>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-sm"
              placeholder="Search resources, diseases, markets..."
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-4">
          <button className="p-2 text-slate-500 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all">
            <HelpCircle className="w-6 h-6" />
          </button>
          
          <div className="relative">
            <button className="p-2 text-slate-500 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all">
              <Bell className="w-6 h-6" />
            </button>
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </div>

          <div className="h-8 w-px bg-slate-200 mx-2" />
          
          <div className="flex items-center space-x-3 cursor-pointer group">
            <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center text-green-700 font-bold group-hover:bg-green-600 group-hover:text-white transition-all">
              SD
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
