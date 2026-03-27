import React from 'react';
import { motion } from 'framer-motion';
import { Upload, Cpu, Lightbulb } from 'lucide-react';

function HowItWorks() {
  const steps = [
    {
      icon: Upload,
      title: 'Ask / Upload',
      description: 'Type your question, use voice input, or upload a photo of your crop issue.',
      color: 'emerald',
    },
    {
      icon: Cpu,
      title: 'AI Understands',
      description: 'Our advanced AI analyzes your query and processes data in seconds.',
      color: 'amber',
    },
    {
      icon: Lightbulb,
      title: 'Get Actionable Advice',
      description: 'Receive clear, practical recommendations you can implement immediately.',
      color: 'emerald',
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

  const stepVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-50 to-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto">
            Get expert farming advice in three simple steps
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="relative"
        >
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-emerald-200 via-amber-200 to-emerald-200 transform -translate-y-1/2 z-0"></div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const colorClasses = step.color === 'emerald' 
                ? 'bg-emerald-600 border-emerald-600' 
                : 'bg-amber-500 border-amber-500';

              return (
                <motion.div
                  key={index}
                  variants={stepVariants}
                  className="relative"
                >
                  <div className="bg-white p-8 rounded-2xl shadow-xl border-2 border-slate-100 hover:shadow-2xl transition-shadow">
                    {/* Step Number */}
                    <div className="flex items-center justify-center mb-6">
                      <div className={`${colorClasses} w-20 h-20 rounded-full flex items-center justify-center shadow-lg`}>
                        <Icon size={36} className="text-white" strokeWidth={2.5} />
                      </div>
                      <div className="absolute -top-4 -right-4 bg-slate-900 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shadow-lg">
                        {index + 1}
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-slate-900 mb-3 text-center">
                      {step.title}
                    </h3>
                    <p className="text-lg text-slate-600 leading-relaxed text-center">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default HowItWorks;
