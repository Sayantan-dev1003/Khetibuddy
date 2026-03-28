import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Zap, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Simple scroll spy logic
      const sections = ['hero', 'features', 'use-cases'];
      for (const section of sections.reverse()) {
        const element = document.getElementById(section);
        if (element && window.scrollY >= element.offsetTop - 100) {
          setActiveSection(section);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', id: 'hero' },
    { name: 'Features', id: 'features' },
    { name: 'Use Cases', id: 'use-cases' },
  ];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] px-6 py-6 pointer-events-none">
      <nav
        className={`max-w-7xl mx-auto transition-all duration-500 pointer-events-auto rounded-[2.5rem] border overflow-hidden ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-2xl border-slate-200 py-3 px-8 shadow-[0_20px_50px_rgba(0,0,0,0.1)]' 
            : 'bg-transparent border-transparent py-3 px-8'
        }`}
      >
        <div className="flex items-center justify-between w-full">
          {/* Logo Section - Left Column (cite: User Screenshot) */}
          <div className="flex-1 flex justify-start">
            <div 
              className="flex items-center gap-3 group cursor-pointer" 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 text-3xl`}>
                🌾
              </div>
              <div className="flex flex-col">
                <span className={`text-2xl font-[900] tracking-[-0.04em] transition-colors duration-500 leading-none ${
                  isScrolled ? 'text-[#065F46]' : 'text-white'
                }`}>
                  Kheti<span className={isScrolled ? 'text-[#059669]' : 'text-emerald-400 italic'}>Buddy</span>
                </span>
              </div>
            </div>
          </div>

          {/* Nav Links - Center Column (cite: Video 0:01) */}
          <div className="hidden lg:flex flex-[2] justify-center items-center">
            <div className={`flex items-center gap-10 px-8 py-2 rounded-full transition-all duration-500`}>
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => scrollToSection(link.id)}
                    className={`font-[900] text-[11px] uppercase tracking-[0.25em] transition-all hover:scale-110 relative group/link ${
                      isActive 
                        ? 'text-emerald-600' 
                        : (isScrolled ? 'text-[#020503]/70 hover:text-emerald-600' : 'text-white/60 hover:text-emerald-400')
                    }`}
                  >
                    {link.name}
                    <span className={`absolute -bottom-1 left-0 h-[2px] rounded-full transition-all duration-300 ${
                      isActive ? 'w-full bg-emerald-600' : 'w-0 bg-emerald-600 group-hover/link:w-full'
                    }`} />
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Auth Section - Right Column (cite: screen.png) */}
          <div className="hidden md:flex flex-1 justify-end items-center gap-8">
            <Link 
              to="/login"
              className={`font-[900] text-[11px] uppercase tracking-[0.25em] transition-all hover:scale-105 ${
                isScrolled ? 'text-[#020503]/50 hover:text-[#020503]' : 'text-white/50 hover:text-white'
              }`}
            >
              Login
            </Link>
            <Link 
              to="/signup"
              className={`px-8 py-3.5 rounded-full font-[900] text-[11px] uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 flex items-center gap-2 group/btn ${
                isScrolled 
                  ? 'bg-[#020503] text-white shadow-xl shadow-black/20' 
                  : 'bg-emerald-500 text-[#020503] shadow-xl shadow-emerald-500/20'
              }`}
            >
              Get Started 
              <ArrowRight size={14} strokeWidth={3} className="group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button 
            className={`lg:hidden p-3 rounded-2xl transition-all ${
              isScrolled ? 'text-[#020503] bg-black/5' : 'text-white bg-white/5'
            }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay - Obsidian Theme (cite: Video 0:01) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed inset-4 top-24 bg-white/95 backdrop-blur-3xl z-[90] rounded-[3.5rem] border border-slate-200 flex flex-col items-center justify-center gap-10 lg:hidden shadow-[0_50px_100px_rgba(0,0,0,0.2)]"
          >
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="text-6xl font-[900] text-[#020503] tracking-[-0.08em] hover:text-emerald-600 transition-colors uppercase leading-none"
              >
                {link.name}
              </button>
            ))}
            <div className="flex flex-col gap-6 items-center mt-10">
              <Link to="/login" className="text-xl font-black text-slate-400 hover:text-[#020503] transition-colors uppercase tracking-widest" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
              <Link 
                to="/signup"
                className="bg-[#020503] text-white px-14 py-6 rounded-full font-[900] text-2xl shadow-2xl inline-block text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Join Free
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Navbar;
