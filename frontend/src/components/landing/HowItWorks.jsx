import React from 'react';
import { motion } from 'framer-motion';

function HowItWorks() {
  const steps = [
    { num: '01', title: 'Connect Profile', sub: 'Secure & fast login.' },
    { num: '02', title: 'Upload Photo', sub: 'Snap your crop or soil.' },
    { num: '03', title: 'Set Language', sub: 'English or Malayalam.' },
    { num: '04', title: 'Get Insights', sub: 'Actionable data instantly.' },
  ];

  return (
    <section id="how-it-works" className="min-h-screen flex items-center py-24 px-4 sm:px-6 lg:px-8 bg-[#FAF9F6] text-[#062c1c] overflow-hidden relative">
      <div className="max-w-7xl mx-auto relative z-10 w-full">
        <div className="text-center mb-20 lg:mb-32">
          <div className="inline-flex items-center justify-center gap-2 bg-[#062c1c]/5 text-[#062c1c] px-5 py-2 rounded-full text-xs font-black mb-6 border border-[#062c1c]/10 tracking-[0.2em] uppercase">
            ★ Simple Process
          </div>
          <h2 className="text-5xl lg:text-7xl font-black mb-8 tracking-tighter leading-tight">
            Get Started in <span className="text-emerald-600">60 Seconds</span>
          </h2>
          <p className="text-slate-600 text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            Technology should be easy. We've simplified the complex into four intuitive steps to get your farm running smarter.
          </p>
        </div>

        {/* Steps Diagram */}
        <div className="relative mb-24 lg:mb-32">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-14 left-20 right-20 h-0.5 bg-emerald-100 -z-10"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-28 h-28 bg-white border-4 border-emerald-50/50 rounded-[2.5rem] flex items-center justify-center text-4xl font-black mb-10 shadow-[0_20px_40px_-15px_rgba(6,78,59,0.1)] group-hover:bg-[#062c1c] group-hover:text-white group-hover:scale-110 transition-all duration-700 group-hover:shadow-[0_32px_64px_-16px_rgba(6,78,59,0.3)] relative overflow-hidden group-hover:rotate-3">
                   <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  {step.num}
                </div>
                <div className="text-[10px] text-emerald-600 font-black tracking-[0.3em] uppercase mb-3 opacity-60">Step Guide</div>
                <h3 className="text-2xl font-bold mb-3 text-[#062c1c]">{step.title}</h3>
                <p className="text-slate-500 font-medium">{step.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Video Placeholder / Visual Element */}
        <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full max-w-5xl mx-auto aspect-[21/9] bg-[#062c1c] rounded-[4rem] border-8 border-white shadow-[0_48px_96px_-32px_rgba(6,78,59,0.3)] relative overflow-hidden group"
        >
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=1000')] bg-cover bg-center transition-transform duration-1000 group-hover:scale-110 opacity-70"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#062c1c] via-[#062c1c]/40 to-transparent"></div>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                <div className="w-28 h-28 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-xl cursor-pointer group-hover:scale-110 transition-transform border border-white/30 shadow-2xl relative">
                    <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full"></div>
                    <div className="w-0 h-0 border-t-[16px] border-t-transparent border-l-[26px] border-l-white border-b-[16px] border-b-transparent ml-3 relative z-10"></div>
                </div>
                <h4 className="text-white text-3xl font-black mt-10 tracking-tight">Watch how it works in action</h4>
                <p className="text-emerald-200/80 font-bold mt-3 text-lg">See how our AI analyzes crops in real-time.</p>
            </div>
        </motion.div>
      </div>

      {/* Earthy Decorations */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-100/30 rounded-full blur-3xl -z-10"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl -z-10"></div>
    </section>
  );
}

export default HowItWorks;