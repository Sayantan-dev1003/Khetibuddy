import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Sprout, Search, Zap, MapPin, Mic, ArrowUpRight } from 'lucide-react';

const FEATURE_CARDS = [
  {
    title: "AI Chatbot & Voice Support",
    label: "24/7 Smart Assistant",
    description: "Multi-lingual support in Malayalam & English with instant voice-to-text capabilities.",
    icon: <MessageCircle className="w-8 h-8 text-[#020503]" />,
    extraIcon: <Mic className="w-5 h-5 opacity-50 text-white/50" />,
    className: "lg:col-span-2 bg-[#020503] text-white min-h-[400px]",
    preview: (
      <div className="mt-auto pt-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 italic text-lg text-emerald-100/90 shadow-2xl">
          "Namaste Nirmal, your rice field looks a bit dry. Water it soon!"
          <div className="mt-4 flex gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse delay-75" />
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse delay-150" />
          </div>
        </div>
      </div>
    )
  },
  {
    title: "Soil Health Analysis",
    label: "Precision Metrics",
    description: "Real-time N-P-K level monitoring for optimal crop health.",
    icon: <Sprout className="w-8 h-8 text-emerald-600" />,
    className: "bg-emerald-50 border border-emerald-100",
    preview: (
      <div className="mt-auto pt-6 grid grid-cols-3 gap-3">
        {['N', 'P', 'K'].map(el => (
          <div key={el} className="bg-white p-3 rounded-2xl text-center border border-slate-100 shadow-sm group-hover:border-emerald-500/50 transition-colors">
            <p className="text-emerald-600 font-black text-xl">{el}</p>
            <p className="text-[10px] uppercase font-bold text-slate-400 mt-1">Optimal</p>
          </div>
        ))}
      </div>
    )
  },
  {
    title: "Plant Disease Detection",
    label: "Visual AI",
    description: "Identify plant diseases instantly via image uploads.",
    icon: <Search className="w-8 h-8 text-white" />,
    className: "bg-emerald-600 text-white border border-emerald-500",
    preview: (
      <div className="mt-auto pt-6">
        <div className="aspect-video bg-white/10 backdrop-blur-sm rounded-2xl border border-dashed border-white/20 flex items-center justify-center group-hover:border-white/50 transition-colors">
          <div className="text-center">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2 text-white">
              <ArrowUpRight size={20} />
            </div>
            <p className="text-[10px] uppercase font-bold text-emerald-100/80">Upload Image</p>
          </div>
        </div>
      </div>
    )
  },
  {
    title: "Crop Recommendation",
    label: "Smart Yields",
    description: "Algorithm-based suggestions for your soil profile.",
    icon: <Zap className="w-8 h-8 text-emerald-600" />,
    className: "bg-emerald-50 border border-emerald-100",
    preview: (
      <div className="mt-auto pt-6">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm group-hover:translate-x-1 transition-transform">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">98%</div>
            <div>
              <p className="text-xs font-black text-[#020503] uppercase">Basmati Rice</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Best Match</p>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    title: "Agri Markets",
    label: "Economic Insights",
    description: "Real-time pricing trends and nearby insights.",
    icon: <MapPin className="w-8 h-8 text-[#020503]" />,
    className: "bg-[#020503] text-white border border-white/5",
    preview: (
      <div className="mt-auto pt-6 space-y-2">
        {[1, 2].map(i => (
          <div key={i} className={`h-2 rounded-full bg-white/10 overflow-hidden`}>
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: i === 1 ? '70%' : '40%' }}
              className="h-full bg-emerald-500"
            />
          </div>
        ))}
        <p className="text-[10px] text-emerald-500/50 font-bold uppercase mt-2">Market Price Trends</p>
      </div>
    )
  }
];


function ModulesShowcase() {
  return (
    <section id="use-cases" className="py-32 px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Header - Video Style Typography */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full text-emerald-600 font-[900] text-[10px] uppercase tracking-widest mb-6 italic">
            <Zap size={12} className="fill-emerald-600" /> Our Core Offerings
          </div>
          <h2 className="text-4xl md:text-[4.5rem] font-[900] text-[#020503] tracking-[-0.05em] leading-[1] uppercase">
            BUILT FOR EVERY <br /> <span className="text-emerald-500 italic">FARMER.</span>
          </h2>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr text-left">
          {FEATURE_CARDS.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className={`group relative p-10 rounded-[3rem] flex flex-col overflow-hidden transition-all duration-500 ${card.className} hover:shadow-2xl hover:shadow-emerald-500/10`}
            >
              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-8">
                  <div className={`p-5 rounded-2xl ${card.className.includes('bg-[#020503]') || card.className.includes('bg-emerald-600') ? 'bg-emerald-500' : 'bg-white shadow-xl shadow-slate-200/50'} flex items-center justify-center transition-transform group-hover:scale-110 duration-500`}>
                    {card.icon}
                  </div>
                  <div className="flex gap-3">
                    {card.extraIcon}
                    <div className={`w-10 h-10 rounded-full border ${card.className.includes('bg-[#020503]') || card.className.includes('bg-emerald-600') ? 'border-white/20' : 'border-slate-200'} flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500`}>
                      <ArrowUpRight className={`w-5 h-5 ${card.className.includes('bg-[#020503]') || card.className.includes('bg-emerald-600') ? 'text-white' : 'text-[#020503]'}`} />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <span className={`text-[11px] font-black uppercase tracking-[0.25em] ${card.className.includes('bg-[#020503]') ? 'text-emerald-400' : card.className.includes('bg-emerald-600') ? 'text-emerald-100' : 'text-emerald-600'}`}>
                    {card.label}
                  </span>
                  <h3 className={`text-3xl md:text-[2.5rem] font-[900] uppercase tracking-tighter leading-[0.85] ${card.className.includes('bg-[#020503]') || card.className.includes('bg-emerald-600') ? 'text-white' : 'text-[#020503]'}`}>
                    {card.title}
                  </h3>
                  <p className={`text-sm mt-6 font-medium leading-relaxed max-w-[95%] ${card.className.includes('bg-[#020503]') || card.className.includes('bg-emerald-600') ? 'text-emerald-100/70' : 'text-slate-500'}`}>
                    {card.description}
                  </p>
                </div>

                {card.preview}
              </div>


              {/* Decorative background element for large card */}
              {card.className.includes('lg:col-span-2') && (
                <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ModulesShowcase;