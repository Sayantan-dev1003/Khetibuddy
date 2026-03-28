import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, MessageCircle, Leaf, Droplets, MapPin, Menu, X, ArrowLeft, Store, ArrowRight, LogOut, User, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

function AppLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Home', color: 'emerald' },
    { path: '/dashboard/chatbot', icon: MessageCircle, label: 'Chatbot', color: 'blue' },
    { path: '/dashboard/disease-detection', icon: Leaf, label: 'Disease', color: 'green' },
    { path: '/dashboard/fertilizer-advisory', icon: Droplets, label: 'Fertilizer', color: 'purple' },
    { path: '/dashboard/nearby-market', icon: Store, label: 'Marketplace', color: 'red' },
    { path: '/dashboard/nearby-map', icon: MapPin, label: 'Map View', color: 'orange' },
  ];

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F0FAF4]">
      {/* Floating Header Container */}
      <div className="fixed top-0 left-0 right-0 z-[100] px-6 py-6 pointer-events-none">
        <nav
          className={`max-w-7xl mx-auto transition-all duration-500 pointer-events-auto rounded-[2.5rem] border ${isScrolled
              ? 'bg-white/95 backdrop-blur-2xl border-emerald-100 py-4 px-8 shadow-[0_20px_50px_rgba(16,185,129,0.1)]'
              : 'bg-white/60 backdrop-blur-md border-emerald-50/20 py-4 px-8 shadow-sm'
            }`}
        >
          <div className="flex items-center justify-between w-full">
            {/* Logo Section - Left Column (cite: Video 0:01) */}
            <div className="flex-1 flex justify-start items-center gap-4">
              <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => navigate('/dashboard')}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 text-3xl">
                  🌾
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-[900] tracking-[-0.04em] text-emerald-900 leading-none">
                    Kheti<span className="text-emerald-600">Buddy</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Desktop Navigation - Center Column */}
            <div className="hidden lg:flex flex-[3] justify-center items-center">
              <div className="flex items-center gap-6 px-4 py-2 rounded-full transition-all duration-500">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`font-[900] text-[11px] uppercase tracking-[0.25em] transition-all hover:scale-110 relative group/link whitespace-nowrap ${active ? 'text-emerald-600' : 'text-emerald-900/60 hover:text-emerald-600'
                        }`}
                    >
                      <span className="flex items-center gap-2">
                        <Icon size={14} strokeWidth={2.5} />
                        {item.label}
                      </span>
                      <span className={`absolute -bottom-1 left-0 w-0 h-[2px] rounded-full transition-all duration-300 group-hover/link:w-full ${active ? 'w-full bg-emerald-600' : 'bg-emerald-600'
                        }`} />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Right Column - Secondary Actions or Empty to balance */}
            <div className="flex-1 flex justify-end items-center gap-4">
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-emerald-50/50 rounded-xl border border-emerald-100/50">
                 <Clock size={14} className="text-emerald-600" />
                 <span className="text-[11px] font-[900] tracking-tight text-emerald-900 uppercase">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                 </span>
              </div>
              <button
                className="lg:hidden p-3 rounded-2xl transition-all text-emerald-900 bg-emerald-50 hover:bg-emerald-100 shadow-sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              {/* Profile/Settings Dropdown */}
              <div className="relative">
                <div 
                  className="w-11 h-11 rounded-full bg-emerald-100 border-2 border-white shadow-sm overflow-hidden cursor-pointer hover:border-emerald-500 transition-all"
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                >
                  <img src={`https://ui-avatars.com/api/?name=${user?.name || 'Farmer'}&background=10B981&color=fff`} alt="Profile" className="w-full h-full object-cover" />
                </div>
                
                <AnimatePresence>
                  {profileMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-40 pointer-events-auto" onClick={() => setProfileMenuOpen(false)}></div>
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-4 w-48 bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden z-50 pointer-events-auto"
                      >
                        <div className="p-2">
                          <Link 
                            to="/dashboard/profile" 
                            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-emerald-900 hover:bg-emerald-50 transition-all font-bold"
                            onClick={() => setProfileMenuOpen(false)}
                          >
                            <User size={18} />
                            Profile
                          </Link>
                          <button 
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-600 hover:bg-red-50 transition-all font-bold text-left"
                          >
                            <LogOut size={18} />
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed inset-4 top-24 bg-white/95 backdrop-blur-3xl z-[150] rounded-[3.5rem] border border-emerald-100 flex flex-col items-center justify-center gap-6 lg:hidden shadow-[0_50px_100px_rgba(6,95,70,0.15)] overflow-y-auto"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex flex-col items-center gap-4 p-8 rounded-[2.5rem] transition-all w-[80%] max-w-[300px] ${active
                      ? 'bg-emerald-600 text-white shadow-2xl shadow-emerald-700/20 scale-110'
                      : 'bg-emerald-50/50 text-emerald-900 hover:bg-emerald-100'
                    }`}
                >
                  <Icon size={48} strokeWidth={2} />
                  <span className="text-2xl font-black uppercase tracking-tight">{item.label}</span>
                </Link>
              );
            })}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="mt-8 p-6 rounded-full bg-red-50 text-red-600 shadow-sm"
            >
              <X size={32} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className={`${location.pathname.includes('/chatbot') ? 'w-full pt-0 pb-0' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12'} h-full transition-all duration-300`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="h-full"
        >
          {children}
        </motion.div>
      </main>

      {/* Extra Bottom Padding for safety, although bottom nav is removed */}
      <div className="h-8 lg:hidden"></div>

      {/* FLOATING CHATBOT FAB */}
      <div className="fixed bottom-10 right-10 z-[200] pointer-events-none">
        <motion.div
           initial={{ opacity: 0, scale: 0.8, y: 20 }}
           animate={{ opacity: 1, scale: 1, y: 0 }}
           whileHover={{ scale: 1.1, rotate: 5 }}
           whileTap={{ scale: 0.9 }}
           className="pointer-events-auto"
        >
          <Link
            to="/dashboard/chatbot"
            className="w-16 h-16 bg-[#020503] text-emerald-400 rounded-[2rem] flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-emerald-500/20 hover:border-emerald-500/50 transition-all group relative"
          >
            <MessageCircle size={28} strokeWidth={2.5} className="group-hover:text-white transition-colors" />
            
            {/* Notification Badge */}
            <span className="absolute top-4 right-4 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
            <span className="absolute top-4 right-4 w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_10px_#10B981]" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default AppLayout;
