import React from 'react';
import { motion } from 'framer-motion';

function Testimonials() {
  const testimonials = [
    {
      name: 'Sarah Kim',
      date: 'January 10, 2026',
      text: 'Setting up the automated disease detection took 5 minutes. Within a week, my yield response rate went from 20% to 90%. Absolutely game-changing.',
      image: 'https://i.pravatar.cc/150?u=1'
    },
    {
      name: 'Marcus Webb',
      date: 'February 2, 2026',
      text: 'The follow-to-unlock funnel alone saved my farm thousands of dollars in a month. KhetiBuddy pays for itself in the first week.',
      image: 'https://i.pravatar.cc/150?u=2'
    },
    {
      name: 'Elena Rostova',
      date: 'March 15, 2026',
      text: 'The Malayalam chatbot is incredible. It understands local farming terms perfectly and gives advice that actually makes sense for our soil.',
      image: 'https://i.pravatar.cc/150?u=3'
    }
  ];

  return (
    <section id="testimonials" className="py-24 bg-white px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Summary */}
          <div className="lg:col-span-4 sticky top-32">
             <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-600 px-4 py-1.5 rounded-full text-sm font-bold mb-6">
              ★ Testimonials
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
              Why They <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-emerald-400">
                Love Us.
              </span>
            </h2>
            <p className="text-slate-600 mb-8 font-medium leading-relaxed">
              Thousands of creators, coaches, and brands use KhetiBuddy to automate conversations, capture leads, and drive more sales.
            </p>
            <div className="text-5xl font-black text-slate-900 mb-1">2k+</div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Trusted by users</p>
          </div>

          {/* Right Grid */}
          <div className="lg:col-span-8 grid sm:grid-cols-2 gap-6">
            {testimonials.map((t, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`bg-slate-50 p-8 rounded-3xl border border-slate-100 ${i === 1 ? 'sm:mt-12' : ''}`}
              >
                <div className="flex items-center gap-4 mb-6">
                  <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <h4 className="font-bold text-slate-900">{t.name}</h4>
                    <div className="flex text-amber-400 text-xs mt-1">★★★★★</div>
                  </div>
                </div>
                <p className="text-slate-700 font-medium leading-relaxed mb-6">
                  {t.text}
                </p>
                <p className="text-xs text-slate-400 font-bold">{t.date}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;