import React from 'react';
import { motion } from 'framer-motion';
import { Check, MessageCircle, Sprout, Search, Zap } from 'lucide-react';

function ModulesShowcase() {
  const modules = [
    'AI-Powered Multilingual Chatbot',
    'Voice Input Support (Malayalam & English)',
    'Plant Disease Detection with Image Upload',
    'Soil Health Analysis',
    'Crop Recommendation System',
    'Fertilizer Advisory',
    'Nearby Agricultural Markets',
    'Seed Shop Locator',
    'Historical Query Tracking',
  ];

  return (
    <section id="modules" className="py-32 px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Header - Video Style Typography (cite: copy.mp4, 0:08) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full text-emerald-600 font-[900] text-[10px] uppercase tracking-widest mb-6 italic">
            <Zap size={12} className="fill-emerald-600" /> Our Products
          </div>
          <h2 className="text-6xl md:text-[6.5rem] font-[900] text-[#020503] tracking-[-0.06em] leading-[0.85] uppercase">
            BUILT FOR EVERY <br /> <span className="text-emerald-500 italic">FARMER.</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left: Modules List (High Contrast - s1.png style) */}
          <div className="space-y-4">
            {modules.map((module, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-5 p-5 bg-slate-50 border border-slate-100 rounded-[2rem] hover:bg-white hover:shadow-xl hover:border-emerald-500/30 transition-all group"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                  <Check size={24} className="text-[#020503]" strokeWidth={4} />
                </div>
                <p className="text-xl font-[900] text-[#020503] tracking-tight group-hover:text-emerald-600 transition-colors uppercase leading-none">
                  {module}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Right: UI Preview Cards (Glassmorphism White Theme - cite: copy.mp4, 0:01) */}
          <div className="relative">
            {/* Background Glow */}
            <div className="absolute -inset-10 bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="relative space-y-6">
              {/* Chatbot Card */}
              <motion.div
                whileHover={{ scale: 1.05, y: -10 }}
                className="bg-gradient-to-br from-emerald-500 to-emerald-700 p-10 rounded-[3rem] shadow-3xl border border-white/20"
              >
                <div className="flex items-center gap-5 mb-8">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-4xl shadow-inner">
                    💬
                  </div>
                  <div>
                    <h4 className="text-white font-[900] text-3xl tracking-tighter uppercase leading-none">AI Chatbot</h4>
                    <p className="text-emerald-100 font-bold text-xs uppercase tracking-widest mt-1 opacity-60">24/7 Expert Support</p>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-[1.5rem] p-5 border border-white/10 text-white font-bold italic tracking-tight leading-relaxed">
                  "Namaste Nirmal, your rice field looks a bit dry. Water it soon!"
                </div>
              </motion.div>

              {/* Soil Analysis Card (cite: s1.png style) */}
              <motion.div
                whileHover={{ scale: 1.05, y: -10 }}
                className="bg-slate-50 p-10 rounded-[3rem] shadow-2xl border border-slate-100 relative overflow-hidden group"
              >
                <div className="flex items-center gap-5 mb-8">
                  <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-3xl text-emerald-600">
                    <Sprout size={32} strokeWidth={3} />
                  </div>
                  <div>
                    <h4 className="text-[#020503] font-[900] text-3xl tracking-tighter uppercase leading-none">Soil Analysis</h4>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Real-time N-P-K</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {['N', 'P', 'K'].map((el) => (
                    <div key={el} className="bg-white rounded-[1.5rem] p-4 text-center border border-slate-100 shadow-sm group-hover:border-emerald-500/50 transition-colors">
                      <p className="text-emerald-600 font-[900] text-2xl leading-none mb-1">{el}</p>
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-tighter">Optimized</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ModulesShowcase;