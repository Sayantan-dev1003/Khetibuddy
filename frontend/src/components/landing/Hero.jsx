import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle, CheckCircle2 } from 'lucide-react';

function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-[#FAF9F6]">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.img 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.25 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src="file:///C:/Users/HP/.gemini/antigravity/brain/c112e651-9f6e-475d-82f7-635d5a331231/hero_bg_farm_1774641273434.png" 
          alt="Modern Farm Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#FAF9F6] via-[#FAF9F6]/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF9F6] via-transparent to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-8 text-left"
          >
            <div className="inline-flex items-center gap-2 bg-emerald-100/60 text-emerald-800 px-4 py-2 rounded-full text-sm font-bold w-fit border border-emerald-200/50 uppercase tracking-widest backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
              </span>
              Smart Farming Assistant
            </div>

            <h1 className="text-6xl lg:text-9xl font-black text-[#064e3b] leading-[0.9] tracking-tight">
              Grow the <br />
              <span className="text-[#854d0e] italic font-serif serif-font">Future</span> <br />
              <span className="bg-gradient-to-r from-emerald-700 to-emerald-900 bg-clip-text text-transparent">Sustainably.</span>
            </h1>

            <p className="text-xl text-slate-700 max-w-lg leading-relaxed font-medium">
              Turn your soil data into gold. We handle the complex analysis—from disease detection to fertilizer plans—rooted in science, grown for results.
            </p>

            <div className="flex flex-wrap gap-5 items-center mt-4">
              <button 
                onClick={() => window.location.href='/dashboard'}
                className="bg-[#064e3b] hover:bg-[#065f46] text-white px-10 py-5 rounded-2xl font-bold flex items-center gap-3 transition-all shadow-[0_20px_40px_-10px_rgba(6,78,59,0.3)] hover:-translate-y-1 active:scale-95"
              >
                Start Free Trial
                <ArrowRight size={22} />
              </button>
              <button className="bg-white/50 backdrop-blur-md hover:bg-white text-[#064e3b] border border-emerald-100 px-10 py-5 rounded-2xl font-bold transition-all shadow-sm hover:border-emerald-200">
                See How It Works
              </button>
            </div>
            
            <div className="flex flex-wrap items-center gap-8 mt-6 text-sm font-bold text-slate-500">
              <span className="flex items-center gap-2.5"><CheckCircle2 size={18} className="text-emerald-600"/> No credit card required</span>
              <span className="flex items-center gap-2.5"><CheckCircle2 size={18} className="text-emerald-600"/> Set up in 60 seconds</span>
            </div>
          </motion.div>

          {/* Right: Visuals */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative flex items-center justify-center p-4 lg:p-0"
          >
            {/* Main Image Container */}
            <div className="relative w-full max-w-xl aspect-square rounded-[3rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(6,78,59,0.2)] border-8 border-white group">
              <img 
                src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1000&auto=format&fit=crop" 
                alt="Farmer in field" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#064e3b]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>

            {/* Floating UI Element 1 */}
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="absolute -top-6 -left-10 bg-white/70 backdrop-blur-2xl p-6 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-white/50 flex items-center gap-5 w-80 group hover:bg-white transition-colors duration-500"
            >
              <div className="w-14 h-14 bg-emerald-600 rounded-[1.25rem] flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-200 transition-transform group-hover:rotate-12">
                <MessageCircle size={28} />
              </div>
              <div>
                <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest mb-1 opacity-60">AI Assistant</p>
                <p className="text-sm font-bold text-slate-800 leading-tight">"Your soil needs more nitrogen for the next cycle."</p>
              </div>
            </motion.div>

            {/* Floating UI Element 2 */}
            <motion.div 
              animate={{ y: [0, 15, 0] }}
              transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-6 -right-10 bg-[#064e3b]/90 backdrop-blur-2xl p-6 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(6,78,59,0.3)] border border-emerald-400/20 flex items-center gap-5 w-72"
            >
              <div className="w-14 h-14 bg-emerald-400/20 rounded-[1.25rem] flex items-center justify-center text-emerald-400 shrink-0 text-3xl shadow-inner backdrop-blur-md">
                🌿
              </div>
              <div>
                <p className="text-[10px] text-emerald-300 font-black uppercase tracking-widest mb-1 opacity-40">Scan Complete</p>
                <p className="text-sm font-bold text-white tracking-tight">Healthy Crop Detected</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Decorative background elements */}
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-100/50 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute top-24 -right-24 w-64 h-64 bg-amber-100/40 rounded-full blur-3xl -z-10"></div>
    </section>
  );
}

export default Hero;