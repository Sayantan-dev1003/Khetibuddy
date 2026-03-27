import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Leaf } from 'lucide-react';

function Hero() {
  return (
    <section className="relative min-h-screen pt-32 pb-20 px-6 bg-[#040705] overflow-hidden flex items-center">
      {/* Background Decor - Video Style Glassmorphism */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-900/30 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/10 blur-[100px] rounded-full" />
        
        {/* Farm Texture Overlay */}
        <img 
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2070" 
          alt="Farmland"
          className="w-full h-full object-cover opacity-[0.17] grayscale mix-blend-overlay"
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-16 items-center w-full">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Tagline - Video Style Badge */}
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full mb-8">
            <Sparkles className="text-emerald-400" size={18} />
            <span className="text-emerald-400 font-bold tracking-[0.2em] text-[10px] uppercase">
              AI Agriculture Automation
            </span>
          </div>

          {/* Massive Typography - Video Style (cite: Video 0:01) */}
          <h1 className="text-6xl md:text-[5.5rem] lg:text-[6.5rem] font-black text-white leading-[0.85] tracking-tighter mb-8">
            Your Crops <br />
            Just Got <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-lime-300 italic">Faster.</span>
          </h1>

          <p className="text-xl text-emerald-100/50 mb-10 max-w-md leading-relaxed font-medium">
            Automated advisory and real-time detection, so you focus on harvesting and growth.
          </p>

          <div className="flex flex-col sm:flex-row gap-5">
            <Link 
              to="/signup"
              className="group bg-emerald-500 hover:bg-emerald-400 text-[#040705] px-10 py-5 rounded-full font-black text-xl transition-all hover:scale-105 flex items-center justify-center gap-3 shadow-2xl shadow-emerald-500/20"
            >
              Start Free Trial
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>

        {/* Floating Mockup - Exact Video Look (cite: Video 0:01) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative flex justify-center lg:justify-end"
        >
          <div className="relative w-full max-w-[450px]">
            {/* The "I'm Interested" Bubble - Green Version (cite: Video 0:01) */}
            <motion.div 
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-8 -left-6 z-20 bg-white text-[#040705] px-6 py-4 rounded-[2rem] rounded-tr-none shadow-3xl font-black text-sm flex items-center gap-3"
            >
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">🌿</div>
              How's my soil?
            </motion.div>

            {/* AI Response Bubble (cite: Video 0:01) */}
            <motion.div 
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-8 -right-6 z-20 bg-emerald-500 text-[#040705] px-6 py-4 rounded-[2rem] rounded-tl-none shadow-3xl font-black text-sm"
            >
              Analyzing... Nitrogen is 82% ⚡
            </motion.div>
            
            {/* Main Mockup Container - Cinematic Green (cite: Video 0:01) */}
            <div className="rounded-[3.5rem] overflow-hidden border-[12px] border-white/5 shadow-[0_0_80px_rgba(16,185,129,0.15)] bg-emerald-900/20 backdrop-blur-sm">
              <img 
                src="/avatars/image_hero.avif" 
                alt="Farmer Dashboard" 
                className="w-full grayscale-[30%] hover:grayscale-0 transition-all duration-700 object-cover min-h-[500px]"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;