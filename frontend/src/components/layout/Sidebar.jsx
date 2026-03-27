import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  MessageSquare, 
  ShieldAlert, 
  FlaskConical, 
  Store,
  UserCircle
} from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home, end: true },
    { name: 'AI Chatbot', path: '/dashboard/chatbot', icon: MessageSquare },
    { name: 'Disease Detection', path: '/dashboard/disease-detection', icon: ShieldAlert },
    { name: 'Fertilizer Advisor', path: '/dashboard/fertilizer-advisory', icon: FlaskConical },
    { name: 'Nearby Markets', path: '/dashboard/nearby-market', icon: Store },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200 z-30 transition-all duration-300">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mr-3">
            <span className="text-white font-bold text-xl">K</span>
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
            KhetiBuddy
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.end}
              className={({ isActive }) => `
                flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group
                ${isActive 
                  ? 'bg-green-50 text-green-700' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
              `}
            >
              <item.icon className="w-5 h-5 mr-3 transition-colors duration-200" />
              {item.name}
              {({ isActive }) => isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-green-600" />
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer / User Profile */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-green-100 group-hover:text-green-600 transition-colors">
              <UserCircle className="w-6 h-6" />
            </div>
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-semibold text-slate-900 truncate">Sayan Das</p>
              <p className="text-xs text-slate-500 truncate">Farmer Assistant</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
