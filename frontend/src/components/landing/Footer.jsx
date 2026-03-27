import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#041a11] pt-24 px-6 sm:px-10 lg:px-20 relative overflow-hidden text-emerald-100/40 font-sans">
      <div className="max-w-7xl mx-auto relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-12 mb-24">
          
          {/* Col 1: Brand & Description */}
          <div className="lg:pr-12">
            <div className="flex items-center gap-3 mb-8 text-white">
              <div className="w-8 h-8 bg-[#34d399] rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
                  <div className="w-2 h-4 bg-[#041a11] rounded-full"></div>
              </div>
              <span className="text-3xl font-black tracking-tighter lowercase">khetibuddy</span>
            </div>
            <p className="text-base leading-relaxed font-medium max-w-sm">
              Empowering global agriculture through intelligent data analysis and automated growth strategies. Rooted in soil, grown in the cloud.
            </p>
          </div>

          {/* Col 2: Useful Links */}
          <div>
            <h4 className="text-white text-lg font-bold mb-8 uppercase tracking-widest text-xs opacity-60">Company</h4>
            <ul className="space-y-4 text-base font-semibold">
              <li><a href="#" className="hover:text-[#34d399] transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-[#34d399] transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-[#34d399] transition-colors">Pricing Plans</a></li>
              <li><a href="#" className="hover:text-[#34d399] transition-colors">Career</a></li>
            </ul>
          </div>

          {/* Col 3: Follow Us */}
          <div>
            <h4 className="text-white text-lg font-bold mb-8 uppercase tracking-widest text-xs opacity-60">Connect</h4>
            <ul className="space-y-4 text-base font-semibold">
              <li><a href="#" className="hover:text-[#34d399] transition-colors">Twitter (X)</a></li>
              <li><a href="#" className="hover:text-[#34d399] transition-colors">LinkedIn</a></li>
              <li><a href="#" className="hover:text-[#34d399] transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-[#34d399] transition-colors">Facebook</a></li>
            </ul>
          </div>

          {/* Col 4: Reach Out */}
          <div>
            <h4 className="text-white text-2xl font-bold mb-8 leading-tight tracking-tight">
              Ready to grow your<br/>farm's potential?
            </h4>
            <button className="bg-[#34d399] hover:bg-emerald-400 text-[#041a11] px-8 py-4 rounded-2xl text-sm font-black transition-all shadow-xl shadow-emerald-500/10 hover:-translate-y-1 active:scale-95">
              Get Started Now
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs font-black uppercase tracking-[0.2em] border-t border-white/5 py-12 z-20 relative">
          <p>Made with <span className="text-emerald-500">🌿</span> in India.</p>
          <div className="flex gap-8 mt-6 md:mt-0">
             <a href="#" className="hover:text-white">Privacy Policy</a>
             <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
          <p className="mt-6 md:mt-0">© 2026 KhetiBuddy Analytics</p>
        </div>
      </div>

      {/* Giant Interior Branding */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden flex justify-center pointer-events-none select-none translate-y-[10%] opacity-40">
        <h1 
          className="text-[18vw] font-black text-slate-500/10 tracking-tighter uppercase whitespace-nowrap leading-none"
          style={{ 
            maskImage: 'linear-gradient(to bottom, black 40%, transparent 90%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 40%, transparent 90%)'
          }}
        >
          KHETIBUDDY
        </h1>
      </div>
    </footer>
  );
};

export default Footer;