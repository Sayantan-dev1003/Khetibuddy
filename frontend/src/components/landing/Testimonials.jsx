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
    <section id="testimonials" className="min-h-screen flex items-center py-24 bg-[#062c1c] px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Summary */}
          <div className="lg:col-span-5">
             <div className="inline-flex items-center gap-2 bg-[#34d399]/10 text-[#34d399] px-5 py-2 rounded-full text-xs font-black mb-8 border border-[#34d399]/20 tracking-[0.2em] uppercase">
              ★ Testimonials
            </div>
            <h2 className="text-5xl lg:text-7xl font-black text-white mb-8 tracking-tighter leading-none">
              Trusted by <br />
              <span className="text-[#34d399]">Progressive Farmers.</span>
            </h2>
            <p className="text-emerald-100/60 mb-12 text-xl font-medium leading-relaxed max-w-md">
              Join thousands of agricultural leaders who are transforming their land with KhetiBuddy's intelligent automation.
            </p>
            <div className="flex items-center gap-12">
                <div>
                   <div className="text-5xl font-black text-white mb-2">2k+</div>
                   <p className="text-[10px] text-emerald-400 font-black uppercase tracking-[0.2em]">Active Users</p>
                </div>
                <div className="w-px h-16 bg-white/10"></div>
                <div>
                   <div className="text-5xl font-black text-white mb-2">98%</div>
                   <p className="text-[10px] text-emerald-400 font-black uppercase tracking-[0.2em]">Satisfaction</p>
                </div>
            </div>
          </div>

          {/* Right Grid */}
          <div className="lg:col-span-7 grid gap-6">
            {testimonials.map((t, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10 hover:bg-white/10 transition-all duration-500 group"
              >
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-5">
                      <img src={t.image} alt={t.name} className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-500/20" />
                      <div>
                        <h4 className="font-bold text-white text-lg">{t.name}</h4>
                        <p className="text-xs text-emerald-400/60 font-bold">{t.date}</p>
                      </div>
                    </div>
                    <div className="flex text-emerald-400 text-xs gap-1">
                        {[...Array(5)].map((_, i) => <span key={i}>★</span>)}
                    </div>
                </div>
                <p className="text-emerald-50/80 text-lg font-medium leading-relaxed italic">
                  "{t.text}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#34d399]/5 to-transparent pointer-events-none"></div>
    </section>
  );
}

export default Testimonials;