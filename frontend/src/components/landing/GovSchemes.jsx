import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HelpCircle, Shield, FlaskConical, CreditCard, Users, ShoppingCart, Leaf, MessageSquare, TrendingUp } from 'lucide-react';

const schemes = [
  {
    title: "PM-KISAN",
    description: "₹6,000 yearly income support for all landholding farmers.",
    icon: Users,
    url: "https://pmkisan.gov.in/"
  },
  {
    title: "PMFBY",
    description: "Affordable crop insurance against natural calamities and pests.",
    icon: Shield,
    url: "https://pmfby.gov.in/"
  },
  {
    title: "Soil Health Card",
    description: "Free soil testing and customized nutrient management advice.",
    icon: FlaskConical,
    url: "https://soilhealth.dac.gov.in/"
  },
  {
    title: "Kisan Credit Card",
    description: "Access to low-interest institutional credit for farming needs.",
    icon: CreditCard,
    url: "https://www.myscheme.gov.in/schemes/kcc"
  },
  {
    title: "e-NAM",
    description: "Digital trading platform for better price discovery of crops.",
    icon: ShoppingCart,
    url: "https://www.enam.gov.in/"
  },
  {
    title: "PM-KMY",
    description: "Social security pension scheme for small and marginal farmers.",
    icon: HelpCircle,
    url: "https://maandhan.in/"
  },
  {
    title: "PKVY",
    description: "Promotion of organic farming through clusters and certification.",
    icon: Leaf,
    url: "https://pgsindia-ncof.dac.gov.in/pkvy/"
  },
  {
    title: "AI Agri Advisory",
    description: "24/7 expert agricultural guidance powered by Khetibuddy AI.",
    icon: MessageSquare,
    url: "/dashboard/chatbot"
  },
  {
    title: "Mandi Prices",
    description: "Real-time updates on crop prices from your nearest markets.",
    icon: TrendingUp,
    url: "/dashboard/nearby-market"
  }
];

// Duplicate for seamless scroll
const extendedSchemes = [...schemes, ...schemes];

function GovSchemes() {
  return (
    <section className="bg-[#040705] py-20 border-y border-emerald-500/20 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-lime-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 mb-12 relative z-20">
        <div className="flex items-center gap-4 mb-2">
          <div className="flex items-center gap-2 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em]">Live Updates</span>
          </div>
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase">
          Government <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-lime-300 italic">Schemes & Aid.</span>
        </h2>
      </div>

      <div className="relative z-10 flex overflow-hidden">
        {/* Gradient Overlays for smooth edges */}
        <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-[#040705] to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-[#040705] to-transparent z-20 pointer-events-none" />

        <div className="flex animate-infinite-scroll pause-on-hover whitespace-nowrap">
          {extendedSchemes.map((scheme, index) => {
            const isExternal = scheme.url.startsWith('http');
            const CardContent = (
              <div 
                className="flex-none inline-flex items-center gap-6 px-10 py-6 mx-4 bg-gradient-to-br from-emerald-900/20 to-transparent border border-emerald-500/20 rounded-[2.5rem] backdrop-blur-xl hover:border-emerald-500/50 hover:bg-emerald-900/30 transition-all duration-500 group cursor-pointer min-w-[380px]"
              >
                <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all duration-500">
                  <scheme.icon size={32} strokeWidth={2.5} />
                </div>
                <div className="flex flex-col text-left">
                  <h4 className="text-white font-black text-xl leading-tight uppercase tracking-tight mb-1">
                    {scheme.title}
                  </h4>
                  <p className="text-emerald-100/50 text-sm font-medium whitespace-normal max-w-[250px] leading-relaxed">
                    {scheme.description}
                  </p>
                </div>
              </div>
            );

            return isExternal ? (
              <a 
                key={index} 
                href={scheme.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="focus:outline-none"
              >
                {CardContent}
              </a>
            ) : (
              <Link 
                key={index} 
                to={scheme.url}
                className="focus:outline-none"
              >
                {CardContent}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default GovSchemes;
