import React from 'react';
import { motion } from 'framer-motion';
import { Target, Monitor, Layers, Shield, Zap, Circle } from 'lucide-react';

function TrustStrip() {
  const brands = [
    { icon: Target, name: 'FocalPoint' },
    { icon: Monitor, name: 'Screentime' },
    { icon: Layers, name: 'Segment' },
    { icon: Shield, name: 'Shutterhome' },
    { icon: Zap, name: 'Lightspeed' },
    { icon: Circle, name: 'Mastercraft' },
  ];

  return (
    <section className="py-20 bg-[#FAF9F6] border-y border-emerald-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex flex-wrap justify-center gap-12 lg:gap-24 items-center opacity-40 grayscale group">
          {brands.map((brand, index) => {
            const Icon = brand.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-3 text-[#062c1c] hover:text-emerald-600 transition-all duration-500 hover:grayscale-0 cursor-default"
              >
                <Icon size={28} />
                <span className="text-2xl font-black font-outfit uppercase tracking-tighter">
                  {brand.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default TrustStrip;
