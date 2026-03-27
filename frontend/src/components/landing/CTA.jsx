import React from 'react';
import { useNavigate } from 'react-router-dom';

function CTA() {
  const navigate = useNavigate();

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#1A1A1A] text-center border-b border-white/5">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight">
          Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-500">Automate</span> Your<br/>
          Farming Operations?
        </h2>
        <p className="text-slate-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
          Join thousands of farmers and brands on KhetiBuddy to confidently boost engagement, forge lasting connections, and unlock the full potential of your land.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full sm:w-auto bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all"
          >
            Start Free Trial
          </button>
          <button className="w-full sm:w-auto bg-transparent border-2 border-slate-700 hover:bg-slate-800 text-white px-8 py-4 rounded-full font-bold text-lg transition-all">
            See our Plans
          </button>
        </div>
      </div>
    </section>
  );
}

export default CTA;