import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    question: 'What kind of farming solutions do you offer?',
    answer: 'We provide AI-powered crop disease detection, personalized fertilizer recommendations, soil health analysis, and real-time market insights in both Malayalam and English.',
  },
  {
    question: 'How can I start using KhetiBuddy\'s platform?',
    answer: 'Simply sign up on our website or mobile app, upload a photo of your crop or ask a question via voice/text to get instant expert guidance.',
  },
  {
    question: 'Are your technologies eco-friendly?',
    answer: 'Yes, our recommendations focus on sustainable and regenerative farming practices that reduce chemical waste and improve long-term soil health.',
  },
  {
    question: 'Do you provide support and training?',
    answer: 'We offer extensive documentation, video tutorials, and direct support via our AI chatbot and customer service team to help you make the most of our tools.',
  },
  {
    question: 'Can I integrate KhetiBuddy tools with my existing system?',
    answer: 'KhetiBuddy is designed to be flexible. We offer APIs and easy data export options for integration with other farm management systems.',
  },
];

const FAQItem = ({ faq, index }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-slate-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-8 text-left group transition-all"
      >
        <span className={`text-2xl font-bold transition-all ${isOpen ? 'text-emerald-600' : 'text-slate-900 group-hover:text-emerald-600'}`}>
          {faq.question}
        </span>
        <div className={`p-2 rounded-full border-2 transition-all ${isOpen ? 'bg-emerald-600 border-emerald-600 text-white rotate-0' : 'bg-white border-slate-200 text-slate-400 rotate-90'}`}>
          {isOpen ? <Minus size={24} /> : <Plus size={24} />}
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="pb-8 text-xl text-slate-600 leading-relaxed max-w-4xl">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQSection = () => {
  return (
    <section id="faq" className="py-32 px-6 sm:px-10 lg:px-16 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-20 gap-10">
          <div className="max-w-2xl">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-section-title text-[#062c1c]"
            >
              Got Questions? <br /> 
              <span className="text-[#34d399]/40 italic">We’ve got you covered</span>
            </motion.h2>
          </div>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-500 max-w-sm font-outfit font-medium leading-relaxed"
          >
            Find answers to common questions about our solutions and farming technology.
          </motion.p>
        </div>

        <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-xl">
          {faqs.map((faq, index) => (
            <FAQItem key={index} faq={faq} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
