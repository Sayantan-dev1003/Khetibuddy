import React, { useState, useEffect } from 'react';
import { Menu, X, Zap, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'Features', id: 'features' },
    { name: 'Pricing', id: 'pricing' },
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
            ? 'bg-white/80 backdrop-blur-2xl border-slate-200 py-3 px-8 shadow-[0_20px_50px_rgba(0,0,0,0.1)]' 
            : 'bg-transparent border-transparent py-4 px-2'
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Logo Section - Theme Switch (cite: Video 0:01) */}
          <div 
            className="flex items-center gap-3 group cursor-pointer" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-lg ${
              isScrolled ? 'bg-[#020503] shadow-black/10' : 'bg-emerald-500 shadow-emerald-500/30'
            }`}>
              <Zap size={24} className={isScrolled ? 'text-emerald-400 fill-emerald-400' : 'text-[#020503] fill-[#020503]'} />
            </div>
            <span className={`text-2xl font-[900] tracking-[-0.06em] uppercase transition-colors duration-500 ${
              isScrolled ? 'text-[#020503]' : 'text-white'
            }`}>
              kheti<span className="text-emerald-500 italic">buddy</span>
            </span>
          </div>

          {/* Desktop Links - Theme Switch (cite: screen.png) */}
          <div className="hidden md:flex items-center gap-10">
            <div className={`flex items-center gap-10 px-8 py-2.5 rounded-full border transition-all duration-500 ${
              isScrolled ? 'bg-black/5 border-black/5' : 'bg-white/5 border-white/5'
            }`}>
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className={`font-[900] text-[11px] uppercase tracking-[0.25em] transition-all hover:scale-105 ${
                    isScrolled ? 'text-[#020503]/60 hover:text-emerald-600' : 'text-white/50 hover:text-emerald-400'
                  }`}
                >
                  {link.name}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-6">
              <button className={`font-[900] text-[11px] uppercase tracking-[0.25em] transition-colors ${
                isScrolled ? 'text-[#020503]/40 hover:text-[#020503]' : 'text-white/40 hover:text-white'
              }`}>
                Login
              </button>
              <button 
                className={`px-8 py-3.5 rounded-full font-[900] text-[11px] uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 flex items-center gap-2 ${
                  isScrolled 
                    ? 'bg-[#020503] text-white shadow-xl shadow-black/20' 
                    : 'bg-emerald-500 text-[#020503] shadow-xl shadow-emerald-500/20'
                }`}
              >
                Get Started <ArrowRight size={14} strokeWidth={3} />
              </button>
            </div>
          </div>

          {/* Mobile Toggle */}
          <button 
            className={`md:hidden p-3 rounded-2xl transition-all ${
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
            className="fixed inset-4 top-24 bg-white/95 backdrop-blur-3xl z-[90] rounded-[3.5rem] border border-slate-200 flex flex-col items-center justify-center gap-10 md:hidden shadow-[0_50px_100px_rgba(0,0,0,0.2)]"
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
            <button className="bg-[#020503] text-white px-14 py-6 rounded-full font-[900] text-2xl mt-10 shadow-2xl">
              Join Free
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Navbar;