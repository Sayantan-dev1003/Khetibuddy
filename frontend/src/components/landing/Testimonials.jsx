import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Leaf, Sprout, Store, BarChart3 } from 'lucide-react';

const gridData = [
  {
    category: "For Creators",
    title: "Rice Farmers",
    desc: "Automate disease detection and crop monitoring for high-yield paddy fields using our AI-driven visual scanner.",
    icon: Leaf,
    img: "https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?q=80&w=1000",
    span: "md:col-span-2 md:row-span-2"
  },
  {
    category: "For Agencies",
    title: "Soil Experts",
    desc: "Manage multiple soil analysis reports and N-P-K data at scale with automated AI processing.",
    icon: Sprout,
    img: "https://images.unsplash.com/photo-1595009552535-be753447727e?q=80&w=1000",
    span: "md:col-span-1 md:row-span-1"
  },
  {
    category: "For E-commerce",
    title: "Agri-Shops",
    desc: "Connect seed and fertilizer shops directly to local farmers via our market bridge.",
    icon: Store,
    img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000",
    span: "md:col-span-1 md:row-span-1"
  },
  {
    category: "For Coaches",
    title: "Market Insights",
    desc: "Deliver real-time Mandi price updates and expert coaching to farming communities.",
    icon: BarChart3,
    img: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=1000",
    span: "md:col-span-3 md:row-span-1"
  }
];

function InteractiveBento() {
  return (
    <section id="use-cases" className="py-32 px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Header - Video Style (cite: 1) */}
        <div className="mb-20">
          <h2 className="text-6xl md:text-[6.5rem] font-[900] text-[#020503] tracking-tighter leading-[0.85] uppercase">
            Built for Every <br /> <span className="text-emerald-500 italic">Farmer.</span>
          </h2>
        </div>

        {/* The Grid (cite: 1) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[350px]">
          {gridData.map((item, i) => (
            <motion.div
              key={i}
              whileHover="hover"
              initial="initial"
              className={`relative group overflow-hidden rounded-[3rem] border border-slate-100 cursor-pointer ${item.span}`}
            >
              {/* Background Image (Always Visible) (cite: 1) */}
              <motion.img
                variants={{
                  initial: { scale: 1 },
                  hover: { scale: 1.05 }
                }}
                transition={{ duration: 0.6 }}
                src={item.img}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover z-0"
              />

              {/* White Paragraph Box Reveal on Hover (cite: 1) */}
              <motion.div
                variants={{
                  initial: { y: "100%", opacity: 0 },
                  hover: { y: 0, opacity: 1 }
                }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-x-4 bottom-4 z-20 bg-white/95 backdrop-blur-md p-8 rounded-[2.5rem] shadow-2xl border border-white/20"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-emerald-500/10 p-3 rounded-2xl text-emerald-600">
                    <item.icon size={24} strokeWidth={2.5} />
                  </div>
                  <div className="bg-emerald-500 p-2 rounded-full text-white shadow-lg shadow-emerald-500/20">
                    <ArrowUpRight size={20} strokeWidth={3} />
                  </div>
                </div>
                
                <h4 className="text-[#020503] font-[900] text-2xl tracking-tighter uppercase mb-2">
                  {item.title}
                </h4>
                <p className="text-slate-500 text-sm font-bold leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>

              {/* Initial Category Tag (Invisible on hover) (cite: 1) */}
              <motion.div 
                variants={{ initial: { opacity: 1 }, hover: { opacity: 0 } }}
                className="absolute top-8 left-8 z-10 bg-[#020503]/40 backdrop-blur-md px-5 py-2 rounded-full border border-white/20"
              >
                <span className="text-white font-black text-[10px] uppercase tracking-widest">{item.category}</span>
              </motion.div>

              {/* Subtle dark overlay for initial visibility (cite: 1) */}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-0" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default InteractiveBento;