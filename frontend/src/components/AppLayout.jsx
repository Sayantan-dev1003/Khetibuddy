import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, MessageCircle, Leaf, Droplets, MapPin, Menu, X, ArrowLeft, Store } from 'lucide-react';
function AppLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
      {/* Top Navbar */}
      <nav className="bg-white border-b-2 border-emerald-100 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Left: Back button (mobile) or Logo */}
            <div className="flex items-center gap-4">
              {location.pathname !== '/dashboard' && (
                <button
                  onClick={() => navigate(-1)}
                  className="lg:hidden p-2 rounded-lg hover:bg-emerald-50 transition-colors"
                  aria-label="Go back"
                >
                  <ArrowLeft size={28} className="text-emerald-600" />
                </button>
              )}
              <Link to="/dashboard" className="flex items-center gap-3">
                <div className="text-4xl">🌾</div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-emerald-700">KhetiBuddy</h1>
                  <p className="text-sm text-gray-600 hidden sm:block">Smart Farming Assistant</p>
                </div>
              </Link>
            </div>

            {/* Right: Menu button (mobile) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-emerald-50 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X size={32} className="text-emerald-600" />
              ) : (
                <Menu size={32} className="text-emerald-600" />
              )}
            </button>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      active
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-emerald-50'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-semibold">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Mobile Dropdown Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden pb-4 pt-2 border-t border-emerald-100 mt-2">
              <div className="grid grid-cols-2 gap-3">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${
                        active
                          ? 'bg-emerald-600 text-white shadow-lg'
                          : 'bg-emerald-50 text-gray-700 hover:bg-emerald-100'
                      }`}
                    >
                      <Icon size={32} />
                      <span className="font-semibold text-sm">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Bottom Navigation (Mobile Only) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-emerald-100 shadow-lg z-40">
        <div className="grid grid-cols-6 gap-1 px-2 py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 py-2 px-1 rounded-lg transition-all ${
                  active
                    ? 'bg-emerald-600 text-white'
                    : 'text-gray-600 hover:bg-emerald-50'
                }`}
              >
                <Icon size={24} />
                <span className="text-xs font-semibold">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom padding to prevent content from being hidden by bottom nav on mobile */}
      <div className="h-24 lg:hidden"></div>
    </div>
  );
}

export default AppLayout;
