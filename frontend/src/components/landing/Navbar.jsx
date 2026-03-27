import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: 'Home', id: 'hero' },
    { name: 'Features', id: 'features' },
    { name: 'How it Works', id: 'how-it-works' },
    { name: 'Testimonials', id: 'testimonials' },
    { name: 'FAQ', id: 'faq' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'py-4 bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm' : 'py-6 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0 cursor-pointer" onClick={() => scrollToSection('hero')}>
            <div className="flex items-center gap-2">
              <span className="text-3xl">🌾</span>
              <span className="text-2xl font-black text-slate-900 tracking-tight">
                KhetiBuddy
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center flex-1 mx-8">
            <ul className="flex gap-2">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <button 
                    onClick={() => scrollToSection(link.id)}
                    className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                      activeSection === link.id 
                        ? 'bg-pink-100 text-pink-600' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-6">
            <button className="text-slate-600 font-semibold hover:text-emerald-600 transition-colors">
              Login / Signup
            </button>
            <button 
              onClick={() => window.location.href='/dashboard'}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-lg shadow-emerald-600/20 hover:-translate-y-0.5"
            >
              Start Free Trial
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-900 p-2"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

export default Navbar;