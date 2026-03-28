import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Twitter, Github, Linkedin, ArrowRight, Heart } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-[#020503] pb-80 pt-32 px-6 relative overflow-hidden border-t border-white/5">
      
      {/* BACKGROUND: Cinematic Mesh Glow */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[130px] rounded-full" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-900/10 blur-[110px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">
          
          {/* BRAND BLOCK */}
          <div className="col-span-1 md:col-span-12 lg:col-span-5">
            <div className="flex items-center gap-3 mb-8 group cursor-pointer w-fit">
              <span className="text-4xl group-hover:rotate-12 transition-transform duration-500">🌾</span>
              <span className="text-4xl font-[900] text-white tracking-[-0.06em] uppercase">
                Kheti<span className="text-emerald-500">Buddy.</span>
              </span>
            </div>
            <p className="text-slate-400 max-w-sm leading-relaxed font-medium text-lg tracking-tight">
              Scale your farming operations with AI-driven automation. Built for the next generation of global agriculture.
            </p>
            
            {/* SOCIALS */}
            <div className="flex gap-6 mt-12">
              {[Twitter, Github, Linkedin].map((Icon, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ scale: 1.2, color: "#10b981" }}
                  className="text-slate-500 cursor-pointer transition-colors hover:text-emerald-500"
                >
                  <Icon size={22} />
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* PRODUCT NAVIGATION */}
          <div className="col-span-1 md:col-span-4 lg:col-span-2">
            <h4 className="text-emerald-500 font-black text-[11px] uppercase tracking-[0.25em] mb-8">Useful Links</h4>
            <ul className="text-slate-300 space-y-4 font-bold text-base tracking-tight">
              {['Features', 'Disease Scan', 'Soil Analysis', 'Pricing', 'Contact'].map((item) => (
                <li key={item} className="hover:text-emerald-400 cursor-pointer transition-all">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* FOLLOW US */}
          <div className="col-span-1 md:col-span-4 lg:col-span-2">
            <h4 className="text-emerald-500 font-black text-[11px] uppercase tracking-[0.25em] mb-8">Follow Us</h4>
            <ul className="text-slate-300 space-y-4 font-bold text-base tracking-tight">
              {['Twitter', 'LinkedIn', 'GitHub', 'Instagram'].map((item) => (
                <li key={item} className="hover:text-emerald-400 cursor-pointer transition-all">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* ACTION BLOCK */}
          <div className="col-span-1 md:col-span-4 lg:col-span-3 flex flex-col">
            <h4 className="text-emerald-500 font-black text-[11px] uppercase tracking-[0.25em] mb-8">Ready to grow?</h4>
            <button className="group w-full bg-white text-[#020503] px-6 py-4 rounded-2xl font-[900] text-lg hover:bg-emerald-500 transition-all flex items-center justify-between shadow-2xl">
              Book Demo
              <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </button>
            <p className="mt-6 text-slate-500 text-xs font-black uppercase tracking-widest">
              hello@khetibuddy.com
            </p>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.3em]">
            © 2026 KhetiBuddy AI • Engineered for Growth
          </p>
          <div className="flex items-center gap-2 text-slate-600 text-[10px] font-black uppercase tracking-widest">
            Made with <Heart size={10} className="fill-emerald-500 text-emerald-500 animate-pulse" /> in India
          </div>
        </div>
      </div>

      {/* MASSIVE WATERMARK: Bright Top, Fading Bottom */}
      <div className="absolute bottom-0 left-0 w-full text-center pointer-events-none select-none z-0">
        <h2 className="text-[17vw] pb-10 font-[900] tracking-[-0.08em] leading-none uppercase bg-gradient-to-b from-white/[0.15] via-white/[0.05] to-transparent bg-clip-text text-transparent">
          KhetiBuddy
        </h2>
      </div>
    </footer>
  );
}

export default Footer;