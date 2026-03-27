import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

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
    <section id="modules" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-4">
            Powerful Modules
          </h2>
          <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto">
            All the tools you need in one comprehensive platform
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Modules List */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-4">
              {modules.map((module, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl hover:bg-emerald-50 transition-colors"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                    <Check size={20} className="text-white" strokeWidth={3} />
                  </div>
                  <p className="text-lg font-semibold text-slate-900 pt-1">{module}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: UI Preview Cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative space-y-6">
              {/* Chatbot Preview */}
              <motion.div
                whileHover={{ scale: 1.05, rotate: -1 }}
                className="bg-gradient-to-br from-emerald-600 to-emerald-700 p-6 rounded-3xl shadow-2xl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-2xl">
                    💬
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg">AI Chatbot</p>
                    <p className="text-emerald-100 text-sm">24/7 Farming Assistant</p>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                  <p className="text-white text-sm">Ask me anything about farming...</p>
                </div>
              </motion.div>

              {/* Disease Detection Preview */}
              <motion.div
                whileHover={{ scale: 1.05, rotate: 1 }}
                className="bg-gradient-to-br from-amber-500 to-amber-600 p-6 rounded-3xl shadow-2xl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-2xl">
                    🌿
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg">Disease Scanner</p>
                    <p className="text-amber-100 text-sm">Upload & Detect</p>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 flex items-center justify-center">
                  <div className="w-full h-24 bg-white/20 rounded-xl flex items-center justify-center">
                    <span className="text-white text-3xl">📸</span>
                  </div>
                </div>
              </motion.div>

              {/* Soil Test Preview */}
              <motion.div
                whileHover={{ scale: 1.05, rotate: -1 }}
                className="bg-gradient-to-br from-lime-600 to-lime-700 p-6 rounded-3xl shadow-2xl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-2xl">
                    🌱
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg">Soil Analysis</p>
                    <p className="text-lime-100 text-sm">Get Crop Recommendations</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {['N', 'P', 'K'].map((element) => (
                    <div key={element} className="bg-white/10 backdrop-blur-sm rounded-xl p-2 text-center">
                      <p className="text-white font-bold">{element}</p>
                      <p className="text-lime-100 text-xs">Level</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default ModulesShowcase;
