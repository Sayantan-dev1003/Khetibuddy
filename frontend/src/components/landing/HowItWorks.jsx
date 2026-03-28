import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Cpu, Lightbulb, CheckCircle2, Sparkles } from 'lucide-react';

function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const steps = [
    {
      icon: Upload,
      title: 'Ask / Upload',
      description: 'Voice input or crop photos.',
    },
    {
      icon: Cpu,
      title: 'AI Analysis',
      description: 'Advanced neural processing.',
    },
    {
      icon: Lightbulb,
      title: 'Get Advice',
      description: 'Actionable farming tips.',
    },
    {
      icon: CheckCircle2,
      title: 'Growth',
      description: 'Maximize your harvest.',
    },
  ];

  return (
    <section id="how-it-works" className="relative py-32 px-6 bg-[#020503] overflow-hidden">
      
      {/* THE BACKGROUND: Mesh Gradient like Hero (cite: copy.mp4, 0:01) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Mirroring Hero Glows */}
        <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] bg-emerald-900/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[70%] h-[70%] bg-emerald-500/5 blur-[130px] rounded-full animate-pulse" />
        
        {/* Grid Texture for Tech feel */}
        <div className="absolute inset-0 opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Section (cite: copy.mp4, 0:24) */}
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-emerald-500/5 border border-emerald-500/10 px-4 py-1.5 rounded-full mb-8 backdrop-blur-sm"
          >
            <Sparkles size={14} className="text-emerald-400" />
            <span className="text-emerald-400 font-[900] tracking-[0.2em] text-[10px] uppercase italic">The Process</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-[5rem] font-[900] text-white tracking-[-0.04em] leading-[1] uppercase">
            Your Smart Farming <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-lime-300 italic px-2">Path Simplified.</span>
          </h2>
        </div>

        {/* Steps Connection Bar (cite: copy.mp4, 0:24) */}
        <div className="relative mb-32 max-w-5xl mx-auto">
          {/* Progress Line - Glowing Emerald */}
          <div className="absolute top-[28px] left-0 w-full h-[2px] bg-white/5 hidden md:block z-0">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${((activeStep + 1) / 4) * 100}%` }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="h-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.6)]"
            />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="flex flex-col items-center group"
              >
                {/* Step Number Circle */}
                <div className="relative mb-12">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center font-[900] text-xl transition-all duration-500 relative
                    ${index <= activeStep 
                      ? 'bg-emerald-500 text-[#020503] shadow-[0_0_30px_rgba(16,185,129,0.2)]' 
                      : 'bg-[#020503] text-emerald-100/20 border border-white/10'}
                    ${index === activeStep 
                      ? 'scale-125 shadow-[0_0_40px_rgba(16,185,129,0.4)] ring-8 ring-[#020503] z-30' 
                      : 'z-20'}
                  `}>
                    {index + 1}
                  </div>
                </div>
                
                <h3 className={`text-white font-[900] text-xl tracking-tighter mb-2 uppercase text-center transition-all duration-500 ${index === activeStep ? 'text-emerald-400 scale-110' : 'opacity-60'}`}>
                  {step.title}
                </h3>
                <p className={`text-emerald-100/30 text-xs font-black text-center uppercase tracking-widest leading-relaxed px-4 transition-all duration-500 ${index === activeStep ? 'opacity-100' : 'opacity-40'}`}>
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

export default HowItWorks;