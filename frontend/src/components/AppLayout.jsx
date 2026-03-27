import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, MessageCircle, Leaf, Droplets, MapPin, Menu, X, ArrowLeft } from 'lucide-react';

function AppLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Home', color: 'emerald' },
    { path: '/dashboard/chatbot', icon: MessageCircle, label: 'Chatbot', color: 'blue' },
    { path: '/dashboard/disease-detection', icon: Leaf, label: 'Disease', color: 'green' },
    { path: '/dashboard/fertilizer-advisory', icon: Droplets, label: 'Fertilizer', color: 'purple' },
    { path: '/dashboard/nearby-market', icon: MapPin, label: 'Market', color: 'red' },
  ];

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen paper-texture text-[var(--text-main)] transition-all duration-500">
      {/* Top Navbar */}
      <nav className="bg-white/90 backdrop-blur-md border-b-2 border-[var(--primary-light)]/10 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            {/* Left: Back button (mobile) or Logo */}
            <div className="flex items-center gap-6">
              {location.pathname !== '/dashboard' && (
                <button
                  onClick={() => navigate(-1)}
                  className="lg:hidden p-3 rounded-2xl bg-[var(--bg-alt)] hover:bg-[var(--primary-light)]/10 text-[var(--primary)] transition-all"
                  aria-label="Go back"
                >
                  <ArrowLeft size={28} />
                </button>
              )}
              <Link to="/dashboard" className="flex items-center gap-4 group">
                <div className="text-5xl transition-transform group-hover:scale-110 drop-shadow-sm">🌾</div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-black text-[var(--primary)] tracking-tight">KhetiBuddy</h1>
                  <p className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-widest hidden sm:block">Earth-Powered Assistant</p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${
                      active
                        ? 'bg-[var(--primary)] text-white shadow-xl -translate-y-1'
                        : 'text-[var(--text-muted)] hover:bg-[var(--primary-light)]/10 hover:text-[var(--primary)]'
                    }`}
                  >
                    <Icon size={22} strokeWidth={active ? 3 : 2} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Right: Menu button (mobile) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-3 rounded-2xl bg-[var(--primary)] text-white shadow-lg transition-all active:scale-95"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
            </button>
          </div>

          {/* Mobile Dropdown Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden pb-6 pt-4 border-t border-[var(--primary-light)]/10 animate-fade-in-down">
              <div className="grid grid-cols-2 gap-4">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex flex-col items-center gap-3 p-6 rounded-3xl transition-all ${
                        active
                          ? 'bg-[var(--primary)] text-white shadow-2xl scale-105'
                          : 'bg-white/80 text-[var(--text-muted)] border border-[var(--primary-light)]/10'
                      }`}
                    >
                      <Icon size={36} strokeWidth={active ? 3 : 2} />
                      <span className="font-bold text-sm tracking-wide">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {children}
      </main>

      {/* Bottom Navigation (Mobile Only) */}
      <nav className="lg:hidden fixed bottom-6 left-6 right-6 bg-[var(--primary)] text-white/90 rounded-[2.5rem] shadow-2xl z-40 border border-white/10 overflow-hidden">
        <div className="grid grid-cols-5 gap-0 px-2 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1.5 py-1 px-1 transition-all ${
                  active
                    ? 'text-white scale-110'
                    : 'text-white/60'
                }`}
              >
                <div className={`${active ? 'bg-white/20 p-2 rounded-xl transition-all' : ''}`}>
                  <Icon size={24} strokeWidth={active ? 3 : 2} />
                </div>
                <span className={`text-[10px] font-black uppercase tracking-tighter ${active ? 'opacity-100' : 'opacity-60'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom padding to prevent content from being hidden by bottom nav on mobile */}
      <div className="h-28 lg:hidden"></div>
    </div>
  );
}

export default AppLayout;
