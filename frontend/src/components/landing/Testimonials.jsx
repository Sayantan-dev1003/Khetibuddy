import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

function Testimonials() {
  const testimonials = [
    {
      name: 'Raju Kumar',
      role: 'Rice Farmer, Kerala',
      image: '👨‍🌾',
      rating: 5,
      text: 'KhetiBuddy helped me identify rice blast disease early. The Malayalam voice support made it so easy to use. My yield improved by 30%!',
    },
    {
      name: 'Lakshmi Devi',
      role: 'Vegetable Farmer, Karnataka',
      image: '👩‍🌾',
      rating: 5,
      text: 'The fertilizer recommendations saved me money and improved my crop quality. Best farming app I have ever used!',
    },
    {
      name: 'Arun Nair',
      role: 'Agriculture Student',
      image: '🎓',
      rating: 5,
      text: 'As a student, this app is a goldmine of knowledge. The AI chatbot answers all my farming queries instantly. Highly recommended!',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-emerald-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-4">
            Loved by Farmers
          </h2>
          <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto">
            See what farmers are saying about KhetiBuddy
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-slate-100"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={20} className="text-amber-400 fill-amber-400" />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-slate-700 text-lg leading-relaxed mb-6">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center text-3xl">
                  {testimonial.image}
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-lg">{testimonial.name}</p>
                  <p className="text-slate-600">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default Testimonials;
