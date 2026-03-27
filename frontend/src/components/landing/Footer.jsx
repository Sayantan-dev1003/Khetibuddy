import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#1A1A1A] pt-20 px-6 sm:px-10 lg:px-16 relative overflow-hidden text-slate-300 font-sans">
      <div className="max-w-7xl mx-auto relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20">
          
          {/* Col 1: Brand & Description */}
          <div className="lg:pr-8">
            <div className="flex items-center gap-2 mb-6 text-white">
               {/* Minimalist Tech Logo Placeholder */}
              <div className="w-6 h-6 bg-white rounded-r-full rounded-tl-full flex items-center justify-center shrink-0"></div>
              <span className="text-2xl font-bold tracking-tight lowercase">khetibuddy</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400 font-medium max-w-sm">
              KhetiBuddy helps businesses simplify farm management with an intuitive, scalable SaaS platform built for growing enterprises.
            </p>
          </div>

          {/* Col 2: Useful Links */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-6">Useful Link</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Col 3: Follow Us */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-6">Follow Us</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-white transition-colors">X</a></li>
            </ul>
          </div>

          {/* Col 4: CTA */}
          <div>
            <h4 className="text-white text-xl font-medium mb-6 leading-snug">
              Let's Talk About<br/>Your Growth!
            </h4>
            <button className="bg-white hover:bg-slate-100 text-black px-6 py-3 rounded-full text-sm font-bold transition-colors">
              Book a Call
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm font-medium text-slate-400 pb-8 z-20 relative">
          <p>Made with <span className="text-pink-500">❤️</span> in India.</p>
          <p className="mt-4 md:mt-0">Copyright © 2026, All rights reserved.</p>
        </div>
      </div>

      {/* Giant Faded Watermark Text */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden flex justify-center pointer-events-none select-none translate-y-[20%]">
        <h1 className="text-[14vw] font-black text-white/[0.03] tracking-tighter uppercase whitespace-nowrap leading-none">
          KHETIBUDDY
        </h1>
      </div>
    </footer>
  );
};

export default Footer;