import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle, CheckCircle2 } from 'lucide-react';

function Hero() {
  return (
    <section id="hero" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6 text-left"
          >
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-sm font-bold w-fit border border-emerald-100 uppercase tracking-wide">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Smart Farming Assistant
            </div>

            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight">
              Grow the Future <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-400">
                Sustainably.
              </span>
            </h1>

            <p className="text-xl text-slate-600 max-w-lg leading-relaxed font-medium">
              We handle the complex analysis—from disease detection to fertilizer plans—so you can focus on growing better crops.
            </p>

            <div className="flex flex-wrap gap-4 items-center mt-2">
              <button 
                onClick={() => window.location.href='/dashboard'}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-full font-bold flex items-center gap-3 transition-all shadow-xl shadow-emerald-600/20 hover:-translate-y-1"
              >
                Start Free Trial
                <ArrowRight size={20} />
              </button>
              <button className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-8 py-4 rounded-full font-bold transition-all">
                See How It Works
              </button>
            </div>
            
            <div className="flex items-center gap-6 mt-4 text-sm font-semibold text-slate-500">
              <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500"/> No credit card required</span>
              <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-500"/> Set up in 60 seconds</span>
            </div>
          </motion.div>

          {/* Right: Visuals */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative lg:h-[600px] flex items-center justify-center"
          >
            <div className="relative w-full max-w-lg aspect-[4/3] md:aspect-square rounded-[2rem] overflow-hidden shadow-2xl shadow-emerald-900/10 border border-slate-100">
              <img 
                src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1000&auto=format&fit=crop" 
                alt="Farmer in field" 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Floating UI Element 1 */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute top-10 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4 w-64"
            >
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shrink-0">
                <MessageCircle size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1">AI Assistant</p>
                <p className="text-sm font-bold text-slate-800 leading-tight">"Your soil needs more nitrogen for the next cycle."</p>
              </div>
            </motion.div>

            {/* Floating UI Element 2 */}
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-10 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4 w-56"
            >
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 shrink-0 text-xl">
                🌿
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1">Scan Complete</p>
                <p className="text-sm font-bold text-slate-800">Healthy Crop Detected</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Hero;