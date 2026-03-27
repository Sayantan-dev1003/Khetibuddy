import React from 'react';
import { Github, Twitter, Mail } from 'lucide-react';

const Footer = () => {
  const footerLinks = [
    {
      title: 'Platform',
      links: ['Features', 'Solutions', 'Integrations', 'Pricing']
    },
    {
      title: 'Company',
      links: ['About Us', 'Our Mission', 'Careers', 'Contact']
    },
    {
      title: 'Resources',
      links: ['Documentation', 'Help Center', 'API Reference', 'Community']
    },
    {
      title: 'Legal',
      links: ['Privacy Policy', 'Terms of Use', 'Cookie Policy', 'Security']
    }
  ];

  return (
    <footer className="bg-[#062c1c] pt-32 pb-12 px-6 sm:px-10 lg:px-16 border-t border-white/5 relative overflow-hidden">
      {/* Decorative Gradient */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#34d399]/5 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-16 mb-24">
          {/* Brand & Newsletter Section */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#34d399] rounded-xl flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#062c1c] fill-current">
                  <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z" />
                </svg>
              </div>
              <span className="text-2xl font-black text-white uppercase tracking-tighter font-outfit">
                KhetiBuddy
              </span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed max-w-sm font-medium">
              Empowering the next generation of farmers with data-driven insights and sustainable technology.
            </p>
            <div className="space-y-4">
              <h4 className="text-white font-black uppercase tracking-widest text-[10px]">
                Subscribe to our newsletter
              </h4>
              <div className="flex gap-2 max-w-sm">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm w-full focus:outline-none focus:border-[#34d399]/30"
                />
                <button className="bg-[#34d399] hover:bg-white text-[#062c1c] px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all">
                  Join
                </button>
              </div>
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-12">
            {footerLinks.map((column, idx) => (
              <div key={idx} className="space-y-6">
                <h4 className="text-white font-black uppercase tracking-widest text-[11px]">
                  {column.title}
                </h4>
                <ul className="space-y-3">
                  {column.links.map((link, lIdx) => (
                    <li key={lIdx}>
                      <a 
                        href="#" 
                        className="text-white/30 hover:text-[#34d399] transition-all text-xs font-bold uppercase tracking-wider inline-block"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex gap-6">
            {[Github, Twitter, Mail].map((Icon, i) => (
              <a 
                key={i} 
                href="#" 
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40 hover:text-[#34d399] hover:bg-[#34d399]/10 transition-all"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
          
          <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em]">
            © 2024 KhetiBuddy. Agriculture SaaS for the Future.
          </p>

          <div className="flex gap-8">
            <a href="#" className="text-white/20 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest">Privacy</a>
            <a href="#" className="text-white/20 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
