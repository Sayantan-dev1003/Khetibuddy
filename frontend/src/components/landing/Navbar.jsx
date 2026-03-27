import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: 'Features', id: 'features' },
    { name: 'How it Works', id: 'how-it-works' },
    { name: 'Modules', id: 'modules' },
    { name: 'Testimonials', id: 'testimonials' },
    { name: 'Contact', id: 'contact' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'py-4 bg-[#062c1c]/90 backdrop-blur-xl border-b border-white/5' : 'py-8 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-3 group"
            >
              <div className="relative w-12 h-12 flex items-center justify-center">
                <div className="absolute inset-0 bg-[#34d399] rounded-2xl rotate-6 group-hover:rotate-12 transition-transform duration-500 opacity-20"></div>
                <div className="absolute inset-0 bg-[#34d399] rounded-2xl -rotate-3 group-hover:rotate-0 transition-transform duration-500"></div>
                <svg 
                  viewBox="0 0 24 24" 
                  className="w-7 h-7 text-[#062c1c] relative z-10 fill-current"
                >
                  <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z" />
                </svg>
              </div>
              <div className="flex flex-col items-start leading-none">
                <span className="text-2xl font-black text-white uppercase tracking-tighter font-outfit">
                  KhetiBuddy
                </span>
                <span className="text-[10px] font-bold text-[#34d399] uppercase tracking-[0.2em] mt-0.5">
                  Agriculture SaaS
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-12">
            <ul className="flex gap-10">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <button 
                    onClick={() => scrollToSection(link.id)}
                    className="text-[13px] font-black text-white/60 hover:text-[#34d399] transition-all uppercase tracking-widest font-outfit relative group"
                  >
                    {link.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#34d399] transition-all group-hover:w-full"></span>
                  </button>
                </li>
              ))}
            </ul>
            
            <button 
              onClick={() => scrollToSection('contact')}
              className="bg-[#34d399] hover:bg-white text-[#062c1c] px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-[0_10px_20px_-5px_rgba(52,211,153,0.3)] hover:shadow-[0_15px_30px_-5px_rgba(52,211,153,0.4)] hover:-translate-y-0.5 active:translate-y-0"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-white border-t border-slate-200"
        >
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="block w-full text-left text-slate-700 hover:text-emerald-600 font-medium text-lg py-2 transition-colors"
              >
                {link.name}
              </button>
            ))}
            <button
              onClick={() => scrollToSection('cta')}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-semibold text-lg shadow-md transition-colors"
            >
              Try Demo
            </button>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}

export default Navbar;
