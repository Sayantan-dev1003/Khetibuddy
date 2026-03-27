import React from 'react';
import { motion } from 'framer-motion';

const StatsSection = () => {
  const stats = [
    {
      label: 'Success Rate',
      value: '98%',
      description: 'Farmers reported significant yield improvements using our AI insights.',
    },
    {
      label: 'Active Fields',
      value: '50k+',
      description: 'Managing vast agricultural lands with real-time monitoring technology.',
    },
    {
      label: 'Regions Covered',
      value: '12+',
      description: 'Expanding our footprint across diverse agricultural landscapes.',
    },
  ];

  return (
    <section id="how-it-works" className="py-32 px-6 sm:px-10 lg:px-16 bg-[#062c1c] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-24 items-center">
          {/* Left Side: Premium Image Stack */}
          <div className="relative w-full lg:w-1/2 flex justify-center lg:justify-start">
            <div className="relative w-full max-w-[500px] aspect-[4/5]">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, rotate: -6 }}
                whileInView={{ opacity: 1, scale: 1, rotate: -6 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="absolute inset-0 rounded-[3rem] overflow-hidden shadow-2xl z-20 border-4 border-white/5"
              >
                <img src="/agri_innovation_1_1774631578856.png" alt="Innovation 1" className="w-full h-full object-cover" />
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, rotate: 6 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 6 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2 }}
                className="absolute inset-0 rounded-[3rem] overflow-hidden shadow-2xl z-10 translate-x-12 translate-y-12 bg-[#34d399]/10 border-4 border-white/5"
              >
                <img src="/agri_innovation_2_1774631605175.png" alt="Innovation 2" className="w-full h-full object-cover opacity-60" />
              </motion.div>
              {/* Floating Badge */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="absolute -top-6 -right-6 bg-[#34d399] p-6 rounded-3xl shadow-2xl z-30"
              >
                <div className="text-[#062c1c] font-black text-3xl font-outfit">Top Rated</div>
                <div className="text-[#062c1c]/60 text-xs font-bold uppercase tracking-widest mt-1">SaaS Solutions</div>
              </motion.div>
            </div>
          </div>

          {/* Right Side: Text and Stats */}
          <div className="w-full lg:w-1/2 space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-section-title text-white">
                Innovating the Future <br /> 
                <span className="text-[#34d399]/40 italic">Of Agriculture</span>
              </h2>
              <p className="text-lg md:text-xl text-white/50 max-w-xl leading-relaxed mt-6">
                KhetiBuddy combines modern technology and sustainable methods to help farmers grow smarter fields and greener futures.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white/5 border border-white/10 p-8 rounded-[2rem] hover:bg-[#34d399]/5 hover:border-[#34d399]/20 transition-all group"
                >
                  <div className="text-5xl font-black text-[#34d399] font-outfit mb-4 group-hover:scale-110 transition-transform origin-left">
                    {stat.value}
                  </div>
                  <h3 className="text-lg font-black text-white uppercase tracking-wider mb-2 font-outfit">
                    {stat.label}
                  </h3>
                  <p className="text-sm text-white/40 leading-relaxed font-medium">
                    {stat.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
