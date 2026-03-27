import React from 'react';

function HowItWorks() {
  const steps = [
    { num: '1', title: 'Connect Profile', sub: 'Secure login.' },
    { num: '2', title: 'Upload Photo', sub: 'Crop or Soil.' },
    { num: '3', title: 'Set Language', sub: 'Eng or Mal.' },
    { num: '4', title: 'Get Insights', sub: 'Instant results.' },
  ];

  return (
    <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#1A1A1A] text-white overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center gap-2 bg-white/10 text-pink-400 px-4 py-1.5 rounded-full text-sm font-bold mb-6 backdrop-blur-sm border border-white/5">
            ★ How To Use
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-white">
            Get Started in <span className="text-pink-400">60 Seconds</span>
          </h2>
          <p className="text-slate-400 text-lg">Once live, every query turns into actionable farming data instantly.</p>
        </div>

        {/* Steps Diagram */}
        <div className="relative mb-20">
          {/* Connecting Horizontal Line (Desktop) */}
          <div className="hidden md:block absolute top-6 left-16 right-16 h-0.5 bg-slate-800 -z-10"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center relative z-10">
                <div className="w-12 h-12 bg-[#1A1A1A] border-2 border-pink-400 rounded-full flex items-center justify-center text-xl font-bold mb-6 shadow-[0_0_15px_rgba(244,114,182,0.3)]">
                  {step.num}
                </div>
                <div className="text-xs text-pink-400 font-bold tracking-widest uppercase mb-2">Step</div>
                <h3 className="text-lg font-bold mb-1 text-white">{step.title}</h3>
                <p className="text-sm text-slate-400">{step.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Video Placeholder */}
        <div className="w-full aspect-video bg-slate-800/50 rounded-[2rem] border border-slate-700/50 flex items-center justify-center shadow-2xl relative overflow-hidden group backdrop-blur-sm">
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md cursor-pointer group-hover:scale-110 transition-transform border border-white/10">
                <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[16px] border-l-white border-b-[10px] border-b-transparent ml-2"></div>
            </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;