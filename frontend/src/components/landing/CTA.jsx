import React from 'react';
import { useNavigate } from 'react-router-dom';

function CTA() {
  const navigate = useNavigate();

  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8 bg-[#041a11] text-center relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 tracking-tighter leading-none">
          Ready to <span className="text-emerald-400 italic font-serif">Cultivate</span> <br/>
          Your Success?
        </h2>
        <p className="text-emerald-100/60 text-xl md:text-2xl mb-12 max-w-3xl mx-auto font-medium leading-relaxed">
          Join thousands of modern agricultural leaders on KhetiBuddy to boost your yield, reduce waste, and unlock the full potential of your land.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-full sm:w-auto bg-[#34d399] hover:bg-emerald-400 text-[#041a11] px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-2xl shadow-emerald-500/20 hover:-translate-y-1 active:scale-95"
          >
            Start Free Trial
          </button>
          <button className="w-full sm:w-auto bg-transparent border-2 border-emerald-900 hover:bg-white/5 text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl hover:-translate-y-1 active:scale-95">
            See our Plans
          </button>
        </div>
      </div>

      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500 rounded-full blur-[160px]"></div>
      </div>
    </section>
  );
}

export default CTA;