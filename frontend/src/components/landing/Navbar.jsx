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
      const offset = 80; // height of navbar
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: 'Home', id: 'hero' },
    { name: 'Features', id: 'features' },
    { name: 'How it Works', id: 'how-it-works' },
    { name: 'Testimonials', id: 'testimonials' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        isScrolled ? 'py-4 bg-white/70 backdrop-blur-3xl border-b border-emerald-100/20 shadow-[0_20px_80px_-20px_rgba(6,78,59,0.1)]' : 'py-8 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0 cursor-pointer group" onClick={() => scrollToSection('hero')}>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-[#064e3b] rounded-[1.25rem] flex items-center justify-center shadow-[0_12px_24px_-8px_rgba(6,78,59,0.4)] group-hover:scale-110 transition-transform duration-500 group-hover:rotate-6">
                  <span className="text-2xl">🌿</span>
              </div>
              <span className="text-2xl font-black text-[#064e3b] tracking-tighter lowercase">
                KhetiBuddy
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center flex-1 mx-8 text-[#064e3b]">
            <ul className="flex gap-4 p-1.5 bg-emerald-100/20 rounded-full border border-emerald-200/20 backdrop-blur-xl">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <button 
                    onClick={() => scrollToSection(link.id)}
                    className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-500 ${
                      activeSection === link.id 
                        ? 'bg-[#064e3b] text-white shadow-xl shadow-emerald-900/20' 
                        : 'text-[#064e3b]/50 hover:text-[#064e3b] hover:bg-emerald-200/30'
                    }`}
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-10">
            <button className="text-[#064e3b] font-black text-xs uppercase tracking-[0.2em] hover:translate-x-1 transition-transform opacity-70 hover:opacity-100">
              Login
            </button>
            <button 
              onClick={() => window.location.href='/dashboard'}
              className="bg-[#064e3b] hover:bg-[#065f46] text-white px-9 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-[0_20px_40px_-10px_rgba(6,78,59,0.3)] hover:-translate-y-1 active:scale-95"
            >
              Start Trial
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-[#064e3b] p-3 bg-emerald-50 rounded-2xl shadow-sm"
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