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
    <div className="border border-slate-100 rounded-2xl mb-4 overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left"
      >
        <span className="text-lg font-semibold text-slate-800">
          {faq.question}
        </span>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
            isOpen ? 'bg-pink-500 text-white' : 'bg-slate-100 text-slate-400'
        }`}>
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
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
            <p className="px-6 pb-6 text-slate-600 font-medium leading-relaxed">
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
    <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center gap-2 bg-slate-200/50 text-slate-600 px-4 py-1.5 rounded-full text-sm font-bold mb-6">
            ★ FAQ
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
            Got Questions? <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-emerald-400">
              We've Got Answers
            </span>
          </h2>
          <p className="text-slate-600 font-medium">
            Choose a plan that fits your business needs and budget. No hidden fees, no surprises—just straightforward pricing.
          </p>
        </div>

        <div>
          {faqs.map((faq, index) => (
            <FAQItem key={index} faq={faq} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQSection;