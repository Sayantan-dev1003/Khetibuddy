import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

function Testimonials() {
  const reviews = [
    { 
      name: 'Sarah Kim', 
      date: 'January 10, 2026', 
      text: 'Setting up AI advisory took 5 minutes. Within a week, my crop yield went from 20% to 90%. Absolute game-changer.' 
    },
    { 
      name: 'John Clayton', 
      date: 'March 15, 2026', 
      text: 'I manually replied to every query. Now, it\'s fully automated. My engagement doubled and I save hours every week.' 
    }
  ];

  return (
    <section id="testimonials" className="py-32 px-6 bg-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header - White Theme with Bold Typography (cite: copy.mp4, 0:01) */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
              <span className="text-emerald-500 font-[900] tracking-[0.3em] text-[10px] uppercase">Wall of Fame</span>
            </div>
            <h2 className="text-6xl md:text-[6.5rem] font-[900] text-[#020503] tracking-[-0.05em] leading-[0.85] uppercase">
              WHY THEY <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-lime-400 italic">LOVE US.</span>
            </h2>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-right"
          >
            <p className="text-6xl font-[900] text-[#020503] tracking-tighter">2k+</p>
            <p className="text-slate-400 font-black text-xs uppercase tracking-[0.2em]">Trusted by Farmers</p>
          </motion.div>
        </div>

        {/* Review Cards (cite: s1.png) */}
        <div className="grid md:grid-cols-2 gap-8">
          {reviews.map((r, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-slate-50 p-12 rounded-[3.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 relative group"
            >
              {/* Star & User Info (cite: copy.mp4, 0:07) */}
              <div className="flex justify-between items-start mb-10">
                <div>
                  <h4 className="text-[#020503] font-[900] text-2xl tracking-tight uppercase">{r.name}</h4>
                  <div className="flex gap-1 mt-2">
                    {[...Array(5)].map((_, starIdx) => (
                      <Star key={starIdx} size={18} className="fill-emerald-500 text-emerald-500" />
                    ))}
                  </div>
                </div>
                <div className="bg-white px-4 py-1.5 rounded-full border border-slate-200 text-slate-400 font-black text-[10px] uppercase tracking-widest">
                  {r.date}
                </div>
              </div>

              {/* Review Text (cite: s1.png) */}
              <p className="text-slate-600 text-xl font-bold leading-[1.6] italic">
                "{r.text}"
              </p>

              {/* Decor Quote (cite: copy.mp4, 0:07) */}
              <div className="absolute -bottom-8 -right-8 text-emerald-500/5 font-black text-[12rem] pointer-events-none select-none">
                ”
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;