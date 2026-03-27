import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Leaf, Sprout, Beaker, MapPin } from 'lucide-react';

function Features() {
  const features = [
    {
      icon: MessageCircle,
      title: 'AI Chatbot Advisory',
      description: 'Ask farming questions in Malayalam or English. Get instant expert advice powered by AI.',
      gradient: 'from-emerald-500 to-emerald-600',
    },
    {
      icon: Leaf,
      title: 'Plant Disease Detection',
      description: 'Upload crop photos and identify diseases instantly. Receive treatment recommendations.',
      gradient: 'from-green-500 to-green-600',
    },
    {
      icon: Sprout,
      title: 'Soil Health & Crop Guide',
      description: 'Test your soil parameters and get personalized crop recommendations for better yields.',
      gradient: 'from-lime-500 to-lime-600',
    },
    {
      icon: Beaker,
      title: 'Fertilizer Recommendation',
      description: 'Get crop-specific fertilizer plans based on soil analysis and growth stage.',
      gradient: 'from-amber-500 to-amber-600',
    },
    {
      icon: MapPin,
      title: 'Nearby Mandi & Seed Shops',
      description: 'Locate nearby agricultural markets, seed shops, and mandi locations easily.',
      gradient: 'from-emerald-600 to-emerald-700',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-4">
            Everything You Need
          </h2>
          <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto">
            Comprehensive AI-powered tools to help you make smarter farming decisions
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-slate-100"
              >
                <div className={`bg-gradient-to-br ${feature.gradient} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-md`}>
                  <Icon size={32} className="text-white" strokeWidth={2} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-lg text-slate-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

export default Features;
