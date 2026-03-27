import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Leaf, Sprout, MapPin } from 'lucide-react';

function Features() {
  const features = [
    {
      icon: MessageCircle,
      title: 'AI Chatbot Advisory',
      description: 'Ask farming questions in Malayalam or English. Get instant expert advice powered by AI without lifting a finger.',
    },
    {
      icon: Leaf,
      title: 'Plant Disease Detection',
      description: 'Upload crop photos and identify diseases instantly. Receive accurate treatment recommendations to save your yield.',
    },
    {
      icon: Sprout,
      title: 'Fertilizer Recommendation',
      description: 'Turn soil data into actionable insights. Get crop-specific fertilizer plans based on current growth stages.',
    },
    {
      icon: MapPin,
      title: 'Nearby Market Locator',
      description: 'Locate nearby agricultural markets, seed shops, and mandi locations easily to buy or sell at the best times.',
    },
  ];

  return (
    <section id="features" className="min-h-screen flex items-center py-24 px-4 sm:px-6 lg:px-8 bg-[#062c1c] text-white overflow-hidden relative">
      {/* Texture/Decoration */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:40px_40px]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 lg:mb-24">
          <div className="inline-flex items-center justify-center gap-2 bg-[#34d399]/10 text-[#34d399] px-5 py-2 rounded-full text-xs font-black mb-6 border border-[#34d399]/20 tracking-[0.2em] uppercase">
            ★ Core Innovation
          </div>
          <h2 className="text-5xl lg:text-7xl font-black mb-8 tracking-tighter leading-none">
            Precision Farming <br />
            <span className="text-[#34d399]">Rooted in AI.</span>
          </h2>
          <p className="text-xl text-emerald-100/60 max-w-3xl mx-auto font-medium leading-relaxed">
            We've distilled decades of agricultural wisdom into smart, digital tools designed to scale with your land and your ambitions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="bg-white/5 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/10 hover:bg-white/[0.08] hover:border-[#34d399]/30 transition-all duration-700 group flex flex-col h-full hover:-translate-y-4 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.4)]"
              >
                <div className="w-20 h-20 bg-[#34d399] rounded-[1.75rem] flex items-center justify-center mb-10 shadow-[0_12px_24px_-8px_rgba(52,211,153,0.4)] group-hover:scale-110 transition-transform duration-700 group-hover:rotate-6">
                  <Icon size={36} className="text-[#062c1c]" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-5 tracking-tight group-hover:text-[#34d399] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-emerald-100/40 leading-relaxed font-semibold mb-8 group-hover:text-emerald-100/60 transition-colors">
                  {feature.description}
                </p>
                <div className="mt-auto">
                   <div className="w-10 h-1 bg-white/10 group-hover:w-full group-hover:bg-[#34d399] transition-all duration-700 rounded-full"></div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Features;