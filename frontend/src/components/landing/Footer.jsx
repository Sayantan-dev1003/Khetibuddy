import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Twitter, Github, Linkedin, ArrowUpRight, ArrowRight, Heart } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-[#020503] pb-80 pt-24 px-6 relative overflow-hidden border-t border-white/5">
      
      {/* BACKGROUND: Cinematic Mesh Glow (cite: copy.mp4, 0:01) */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[130px] rounded-full" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-900/10 blur-[110px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-32">
          
          {/* BRAND BLOCK: Luxury Tech Style (cite: s1.png) */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-8 group cursor-pointer w-fit">
              <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:rotate-12 transition-transform duration-500">
                <Leaf className="text-[#020503]" size={28} fill="currentColor" />
              </div>
              <span className="text-4xl font-[900] text-white tracking-[-0.06em] uppercase">
                Kheti<span className="text-emerald-500 italic">Buddy.</span>
              </span>
            </div>
            <p className="text-emerald-100/30 max-w-sm leading-relaxed font-bold text-lg tracking-tight">
              Scale your farming operations with AI-driven automation. Built for the next generation of global agriculture.
            </p>
            
            {/* SOCIALS: Clean Icons (cite: copy.mp4, 0:14) */}
            <div className="flex gap-6 mt-12">
              {[Twitter, Github, Linkedin].map((Icon, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ scale: 1.2, color: "#10b981" }}
                  className="text-emerald-100/20 cursor-pointer transition-colors"
                >
                  <Icon size={24} />
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* NAVIGATION: Bold & Tight (cite: screen.png) */}
          <div>
            <h4 className="text-white font-[900] text-[10px] uppercase tracking-[0.3em] mb-10 opacity-30">Explore</h4>
            <ul className="text-white/60 space-y-5 font-bold text-xl tracking-tighter">
              {['Features', 'Case Studies', 'Pricing', 'API Docs'].map((item) => (
                <li key={item} className="hover:text-emerald-500 cursor-pointer transition-all flex items-center group gap-2">
                  {item}
                  <ArrowUpRight size={18} className="opacity-0 group-hover:opacity-100 transition-all -translate-y-1" />
                </li>
              ))}
            </ul>
          </div>

          {/* ACTION BLOCK: High-Contrast Button (cite: copy.mp4, 0:14) */}
          <div className="flex flex-col">
            <h4 className="text-white font-[900] text-[10px] uppercase tracking-[0.3em] mb-10 opacity-30">Support</h4>
            <button className="group w-full bg-white text-[#020503] px-8 py-5 rounded-[1.5rem] font-[900] text-xl hover:bg-emerald-500 transition-all flex items-center justify-between shadow-2xl">
              Book Demo
              <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />
            </button>
            <p className="mt-8 text-emerald-100/20 text-sm font-black uppercase tracking-widest">
              hello@khetibuddy.com
            </p>
          </div>
        </div>

        {/* BOTTOM BAR: Minimalist & Clean (cite: s1.png) */}
        <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-emerald-100/10 text-[10px] font-black uppercase tracking-[0.3em]">
            © 2026 KhetiBuddy AI • Engineered for Growth
          </p>
          <div className="flex items-center gap-2 text-emerald-100/20 text-[10px] font-black uppercase tracking-widest">
            Made with <Heart size={10} className="fill-emerald-500 text-emerald-500 animate-pulse" /> in India
          </div>
        </div>
      </div>

      {/* MASSIVE WATERMARK: The Luxury Detail (cite: copy.mp4, 0:24) */}
      <div className="absolute -bottom-10 left-0 w-full text-center pointer-events-none select-none z-0">
        <h2 className="text-[17vw]  pb-10 font-[900] text-white/[0.02] tracking-[-0.08em] leading-none uppercase">
          KhetiBuddy
        </h2>
      </div>
    </footer>
  );
}

export default Footer;