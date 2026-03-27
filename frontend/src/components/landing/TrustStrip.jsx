import React from 'react';
import { motion } from 'framer-motion';
import { Mic, Globe, Zap, Smile } from 'lucide-react';

function TrustStrip() {
  const highlights = [
    { icon: Mic, text: 'Voice Support', color: 'emerald' },
    { icon: Globe, text: 'Malayalam Ready', color: 'amber' },
    { icon: Zap, text: 'Instant Advisory', color: 'emerald' },
    { icon: Smile, text: 'Farmer-Friendly UI', color: 'amber' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {highlights.map((item, index) => {
          const Icon = item.icon;
          const colorClass = item.color === 'emerald' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600';
          const borderClass = item.color === 'emerald' ? 'border-emerald-200' : 'border-amber-200';

          return (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className={`flex flex-col items-center justify-center p-8 rounded-2xl border-2 ${borderClass} bg-slate-50 shadow-md hover:shadow-lg transition-all`}
            >
              <div className={`${colorClass} p-4 rounded-2xl mb-4`}>
                <Icon size={32} strokeWidth={2.5} />
              </div>
              <p className="text-slate-900 font-semibold text-xl text-center">{item.text}</p>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}

export default TrustStrip;
