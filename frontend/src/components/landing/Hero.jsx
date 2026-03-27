import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

function Hero() {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-50 via-white to-amber-50 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-60 -left-40 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="text-amber-500" size={24} />
              <span className="text-emerald-700 font-semibold text-lg">AI-Powered Farming</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-tight mb-6">
              Your AI Farming
              <span className="text-emerald-600"> Companion</span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 mb-10 leading-relaxed">
              Ask in <span className="font-semibold text-emerald-700">Malayalam</span> or{' '}
              <span className="font-semibold text-emerald-700">English</span>. Get instant crop, soil, disease & market guidance.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => (window.location.href = '/dashboard')}
                className="group bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-5 rounded-2xl font-semibold text-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
              >
                Start Asking
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={24} />
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className="bg-white hover:bg-slate-50 text-emerald-700 border-2 border-emerald-600 px-8 py-5 rounded-2xl font-semibold text-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Explore Features
              </button>
            </div>
          </motion.div>

          {/* Right: Hero Mock UI */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative mx-auto max-w-sm">
              {/* Phone Frame */}
              <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-[3rem] p-6 shadow-2xl">
                <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-inner">
                  {/* Top Bar */}
                  <div className="bg-emerald-600 px-6 py-4 flex items-center justify-between">
                    <div className="text-white font-bold text-lg">KhetiBuddy</div>
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>

                  {/* Chat Preview */}
                  <div className="p-6 space-y-4 bg-slate-50">
                    <div className="flex justify-end">
                      <div className="bg-emerald-600 text-white px-4 py-3 rounded-2xl rounded-tr-sm max-w-[80%]">
                        <p className="text-sm">എന്റെ നെല്ലിന് എന്താണ് സംഭവിച്ചത്?</p>
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-white text-slate-900 px-4 py-3 rounded-2xl rounded-tl-sm max-w-[80%] shadow">
                        <p className="text-sm font-medium mb-1">🌾 Rice Blast Disease</p>
                        <p className="text-xs text-slate-600">Apply Tricyclazole spray...</p>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-emerald-600 text-white px-4 py-3 rounded-2xl rounded-tr-sm max-w-[80%]">
                        <p className="text-sm">Thank you!</p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Nav Preview */}
                  <div className="bg-white border-t border-slate-200 px-6 py-3 flex justify-around">
                    {['💬', '🌿', '🌱', '📍'].map((emoji, i) => (
                      <div key={i} className="text-2xl opacity-60">
                        {emoji}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-4 -right-4 bg-amber-400 text-white px-4 py-2 rounded-2xl shadow-lg font-semibold"
              >
                🎤 Voice Ready
              </motion.div>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="absolute -bottom-4 -left-4 bg-emerald-700 text-white px-4 py-2 rounded-2xl shadow-lg font-semibold"
              >
                ✨ AI Powered
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
