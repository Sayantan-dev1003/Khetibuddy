import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Search, Mic, Smartphone, Sparkles, ArrowUpRight } from 'lucide-react';

const features = [
  { 
    title: 'Keyword-Auto DMs', 
    desc: 'Instantly reply to "price" or "pest" queries with AI-driven automation.', 
    icon: MessageCircle,
  },
  { 
    title: 'Disease Scanner', 
    desc: 'Identify crop issues instantly via high-res image uploads and scanning.', 
    icon: Search,
  },
  { 
    title: 'Voice Support', 
    desc: 'Malayalam & English voice-to-data automation for every farmer.', 
    icon: Mic,
  },
  { 
    title: 'Smart Follow-ups', 
    desc: 'Nudge users who haven\'t checked their soil reports automatically.', 
    icon: Smartphone,
  },
];

const FeatureCard = ({ f, i }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.1, duration: 0.6 }}
      whileHover={{ y: -15, scale: 1.02 }}
      className="group relative bg-white/70 backdrop-blur-xl p-12 rounded-[4rem] border border-emerald-500/10 overflow-hidden cursor-pointer transition-all duration-500 hover:bg-white hover:border-emerald-500/40 hover:shadow-[0_40px_80px_-15px_rgba(16,185,129,0.15)]"
    >
      {/* Interactive Icon (cite: s1.png) */}
      <motion.div 
        animate={isHovered ? { scale: 1.1, rotate: [0, -10, 10, 0] } : { scale: 1, rotate: 0 }}
        className="relative z-20 w-20 h-20 bg-emerald-500/10 text-emerald-600 rounded-3xl flex items-center justify-center mb-10 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500 shadow-sm"
      >
        <f.icon size={38} strokeWidth={2.5} />
        <AnimatePresence>
          {isHovered && (
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.5, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute inset-0 bg-emerald-400/20 rounded-full blur-xl"
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Text Content (cite: screen.png) */}
      <div className="relative z-20">
        <div className="flex items-center gap-3 mb-4">
          <h3 className="text-4xl font-[900] text-[#020503] tracking-tighter uppercase leading-none transition-colors group-hover:text-emerald-600">
            {f.title}
          </h3>
          <motion.div animate={isHovered ? { x: 5, opacity: 1 } : { x: -10, opacity: 0 }}>
            <ArrowUpRight className="text-emerald-500" size={24} />
          </motion.div>
        </div>
        <p className="text-slate-600 text-xl font-bold leading-relaxed max-w-sm group-hover:text-slate-700 transition-colors">
          {f.desc}
        </p>
      </div>

      {/* Card Internal Glow (cite: copy.mp4, 0:02) */}
      <motion.div 
        animate={isHovered ? { opacity: 0.4, scale: 1.2 } : { opacity: 0, scale: 0.8 }}
        className="absolute -bottom-20 -right-20 w-80 h-80 bg-emerald-500/20 blur-[100px] rounded-full transition-all duration-700 pointer-events-none"
      />

      {/* Luxury Number Decor */}
      <span className="absolute top-10 right-10 text-emerald-900/5 font-[900] text-8xl select-none pointer-events-none uppercase">
        0{i + 1}
      </span>
    </motion.div>
  );
};

function Features() {
  return (
    <section id="features" className="py-40 px-6 bg-white overflow-hidden relative">
      
      {/* THE MESH GRADIENT BACKGROUND (cite: copy.mp4, 0:01) */}
      <div className="absolute inset-0 z-0">
        {/* Main Soft Green Base */}
        <div className="absolute inset-0 bg-[#f0fff4]" />
        
        {/* Moving Mesh Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-emerald-100 blur-[120px] rounded-full opacity-60" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-lime-100 blur-[100px] rounded-full opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] h-[50%] bg-white blur-[150px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Section (cite: copy.mp4, 0:02) */}
        <div className="text-center mb-32">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 px-6 py-2 rounded-full mb-10 shadow-sm backdrop-blur-md"
          >
            <Sparkles size={16} className="text-emerald-600 fill-emerald-600" />
            <span className="text-emerald-600 font-[900] tracking-[0.3em] text-[11px] uppercase italic">Core Intelligence</span>
          </motion.div>
          
          <h2 className="text-7xl md:text-[7.5rem] font-[900] text-[#020503] tracking-[-0.07em] leading-[0.8] uppercase">
            Automation That <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-800 italic px-2">Feels Human.</span>
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-10 lg:gap-14">
          {features.map((f, i) => (
            <FeatureCard key={i} f={f} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;