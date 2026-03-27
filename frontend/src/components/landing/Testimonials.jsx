import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Thomas Rijan',
    role: 'Vegetable Grower',
    image: '/farmer_testimonial_1_1774631975278.png',
    quote: '"The Smart Irrigation System Has Completely Changed How We Manage Our Fields. It\'s Efficient, Sustainable, And Easy To Use."',
  },
  {
    name: 'Manoi Agra',
    role: 'Rice Farmer',
    image: '/farmer_testimonial_2_1774632028283.png',
    quote: 'KhetiBuddy helped me identify crop path in real-time. My yield increased by 30% while using less water.',
  },
  {
    name: 'Devi Patil',
    role: 'Orchard Owner',
    image: '/farmer_testimonial_3_1774632076989.png',
    quote: '"Thanks to AgriGrow, I can make data-driven decisions that save time and money every season."',
  },
  {
    name: 'Sarah Chen',
    role: 'Agri-Tech Investor',
    image: '/farmer_testimonial_1_1774631975278.png',
    quote: '"The most intuitive agricultural SaaS platform I\'ve seen. It bridges the gap between data and actual field results."',
  },
  {
    name: 'Rajesh Kumar',
    role: 'Wheat Farmer',
    image: '/farmer_testimonial_2_1774632028283.png',
    quote: '"Finally, a tool that speaks the language of farmers while giving us the power of Silicon Valley technology."',
  },
];

const Testimonials = () => {
  // Triple the testimonials for a seamless loop
  const duplicatedTestimonials = [...testimonials, ...testimonials, ...testimonials];

  return (
    <section id="testimonials" className="py-32 bg-[#f8fafc] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-20 text-center lg:text-left">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col lg:flex-row justify-between items-end gap-10"
        >
          <div className="max-w-2xl">
            <h2 className="text-section-title text-[#062c1c]">
              What farmers are <br /> 
              <span className="text-[#34d399]/40 italic">Saying about us</span>
            </h2>
          </div>
          <p className="text-lg text-slate-500 max-w-sm leading-relaxed font-outfit font-medium">
            Join 50,000+ growers who are transforming their farms with our platform.
          </p>
        </motion.div>
      </div>

      {/* Infinite Scroll Container */}
      <div className="relative flex overflow-hidden group">
        <motion.div
          animate={{
            x: [0, -100 * duplicatedTestimonials.length / 3 + '%'],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 40,
              ease: "linear",
            },
          }}
          className="flex gap-8 whitespace-nowrap py-10 px-8"
        >
          {duplicatedTestimonials.map((t, index) => (
            <div
              key={index}
              className="inline-block w-[450px] bg-white rounded-[3rem] p-6 shadow-xl hover:shadow-2xl transition-all duration-500 border border-slate-100 group/card"
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-[150px] aspect-square rounded-[2rem] overflow-hidden shrink-0">
                  <img 
                    src={t.image} 
                    alt={t.name} 
                    className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700" 
                  />
                </div>
                <div className="flex flex-col justify-center min-w-0">
                  <Quote className="text-[#34d399]/20 mb-4" size={32} />
                  <p className="text-lg text-[#062c1c] leading-relaxed font-bold italic mb-6 break-words whitespace-normal">
                    {t.quote}
                  </p>
                  <div>
                    <h4 className="text-xl font-black text-[#062c1c] uppercase tracking-tight font-outfit">{t.name}</h4>
                    <p className="text-[#34d399] font-bold uppercase tracking-widest text-[10px] mt-0.5">{t.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
        
        {/* Gradient Overlays for Fade Effect */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#f8fafc] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#f8fafc] to-transparent z-10 pointer-events-none"></div>
      </div>
    </section>
  );
};

export default Testimonials;
