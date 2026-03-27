import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function CTA() {
  const navigate = useNavigate();

  return (
    <section id="cta" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-900 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Make smarter farming
            <br />
            decisions today.
          </h2>

          <p className="text-xl md:text-2xl text-emerald-100 mb-12 max-w-3xl mx-auto">
            Join thousands of farmers using AI to improve their yields, detect diseases early, and make data-driven decisions.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/dashboard')}
              className="group bg-white hover:bg-slate-50 text-emerald-700 px-10 py-5 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl transition-all flex items-center gap-3"
            >
              Get Started Free
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={24} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const element = document.getElementById('contact');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className="bg-transparent hover:bg-white/10 text-white border-2 border-white px-10 py-5 rounded-2xl font-bold text-xl transition-all flex items-center gap-3"
            >
              <Mail size={24} />
              Contact Team
            </motion.button>
          </div>

          <p className="text-emerald-200 text-lg mt-8">
            No credit card required • Free forever • Mobile & Desktop
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default CTA;
