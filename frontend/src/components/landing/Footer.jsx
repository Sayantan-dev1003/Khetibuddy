import React from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';

function Footer() {
  const quickLinks = [
    { name: 'Home', href: '#' },
    { name: 'Features', href: '#features' },
    { name: 'How it Works', href: '#how-it-works' },
    { name: 'Modules', href: '#modules' },
    { name: 'Testimonials', href: '#testimonials' },
  ];

  const scrollToSection = (href) => {
    if (href === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const id = href.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <footer id="contact" className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-3xl font-bold text-emerald-400 mb-4">KhetiBuddy</h3>
            <p className="text-slate-300 text-lg leading-relaxed mb-4">
              Your AI-powered farming companion for smarter agricultural decisions. Helping farmers grow better, one question at a time.
            </p>
            <p className="text-slate-400">
              Made with ❤️ for farmers
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-slate-300 hover:text-emerald-400 transition-colors text-lg"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xl font-bold mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="text-emerald-400 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="text-slate-300 text-lg">support@khetibuddy.com</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="text-emerald-400 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="text-slate-300 text-lg">+91 1800-123-4567</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="text-emerald-400 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="text-slate-300 text-lg">Kerala, India</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-center md:text-left">
              © {new Date().getFullYear()} KhetiBuddy. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
