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
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center gap-2 bg-pink-100 text-pink-600 px-4 py-1.5 rounded-full text-sm font-bold mb-6">
            ★ Features
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
            Automation That <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-emerald-400">
              Feels Human
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
            Automate your farm management the smart way safely, intelligently, and designed to scale with your land.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-10 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-50 transition-colors">
                  <Icon size={28} className="text-slate-700 group-hover:text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed font-medium">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Features;