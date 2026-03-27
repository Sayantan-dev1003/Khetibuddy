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

  const duplicatedBrands = [...brands, ...brands, ...brands, ...brands];

  return (
    <section className="py-16 bg-[#062c1c] overflow-hidden border-y border-white/5 relative">
      <div className="flex whitespace-nowrap">
        <motion.div
          animate={{
            x: [0, -100 * duplicatedBrands.length / 4 + '%'],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            },
          }}
          className="flex gap-20 items-center px-10"
        >
          {duplicatedBrands.map((brand, index) => {
            const Icon = brand.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-3 text-white/30 hover:text-[#34d399] transition-colors group cursor-default"
              >
                <Icon size={24} />
                <span className="text-xl font-black font-outfit uppercase tracking-tighter">
                  {brand.name}
                </span>
              </div>
            );
          })}
        </motion.div>
      </div>
      {/* Gradients */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#062c1c] to-transparent z-10"></div>
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#062c1c] to-transparent z-10"></div>
    </section>
  );
}

export default TrustStrip;
