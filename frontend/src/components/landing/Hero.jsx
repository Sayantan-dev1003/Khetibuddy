import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

function Hero() {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-[#062c1c]">
      {/* Background Image with Darker Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/agri_hero_bg_v2_1774631918338.png" 
          alt="Lush agricultural field" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#062c1c]/80 via-transparent to-[#062c1c]"></div>
        <div className="absolute inset-0 bg-[#062c1c]/20"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col gap-8"
          >
            {/* Feature Pill */}
            <div className="flex">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#34d399] animate-pulse"></div>
                <span className="text-white/90 text-xs font-bold uppercase tracking-widest font-outfit">
                  Investing in Earth
                </span>
              </div>
            </div>

            {/* Heading */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.95] uppercase tracking-tighter font-outfit">
              Grow the future <br /> 
              <span className="text-[#34d399]/80">with sustainable</span> <br />
              agriculture
            </h1>

            {/* Subtext */}
            <p className="text-xl md:text-2xl text-white/70 max-w-2xl leading-relaxed font-medium">
              We discover more with net-zero and low-carbon, market-ready, and tailored solutions driven by data, research, and deep expertise.
            </p>

            {/* CTA */}
            <div className="flex flex-wrap gap-6 items-center mt-4">
              <button className="bg-[#34d399] hover:bg-[#2bc28a] text-[#062c1c] px-10 py-5 rounded-full font-black flex items-center gap-4 transition-all group text-lg shadow-2xl shadow-emerald-900/40">
                <span className="uppercase tracking-widest">Explore Our Service</span>
                <div className="bg-[#062c1c]/10 p-2 rounded-full group-hover:bg-[#062c1c]/20 transition-colors">
                  <ArrowRight size={24} />
                </div>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
