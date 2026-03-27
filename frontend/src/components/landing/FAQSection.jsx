import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  { question: 'Is this safe for my account?', answer: 'Yes. We operate within platforms guidelines. No mass spam. No risky automation patterns.' },
  { question: 'What results can I expect?', answer: 'Users see improvements in response speed, engagement rate, and lead capture within the first few days.' },
  { question: 'Is there a free trial?', answer: 'Yes. You can test the platform before committing to any premium features.' },
  { question: 'Can I cancel anytime?', answer: 'Absolutely. No long term contracts. You manage your subscription from your dashboard.' },
];

const FAQItem = ({ faq }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`border rounded-[2rem] mb-4 overflow-hidden transition-all duration-500 ${
        isOpen ? 'bg-white border-emerald-100 shadow-xl shadow-emerald-900/5' : 'bg-white/50 border-slate-100 hover:border-emerald-100 hover:bg-white'
    }`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-8 text-left"
      >
        <span className="text-xl font-bold text-[#062c1c] tracking-tight">
          {faq.question}
        </span>
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 ${
            isOpen ? 'bg-[#064e3b] text-white rotate-180' : 'bg-emerald-50 text-emerald-600'
        }`}>
          <ChevronDown size={20} />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="px-8 pb-8 text-slate-600 text-lg font-medium leading-relaxed max-w-2xl">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function FAQSection() {
  return (
    <section id="faq" className="py-32 px-4 sm:px-6 lg:px-8 bg-[#FAF9F6] relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-20 lg:mb-24">
          <div className="inline-flex items-center justify-center gap-2 bg-[#062c1c]/5 text-[#062c1c] px-5 py-2 rounded-full text-xs font-black mb-6 border border-[#062c1c]/10 tracking-[0.2em] uppercase">
            ★ Common Queries
          </div>
          <h2 className="text-5xl lg:text-7xl font-black text-[#062c1c] mb-8 tracking-tighter leading-tight">
            Got Questions? <br />
            <span className="text-emerald-600">We've Got Answers.</span>
          </h2>
          <p className="text-slate-600 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about getting started with KhetiBuddy and how we're revolutionizing farm management.
          </p>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, index) => (
            <FAQItem key={index} faq={faq} />
          ))}
        </div>
      </div>
      
      {/* Decorative patterns */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100/30 rounded-full blur-[100px] -z-10 translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-100/20 rounded-full blur-[120px] -z-10 -translate-x-1/2 translate-y-1/2"></div>
    </section>
  );
}

export default FAQSection;