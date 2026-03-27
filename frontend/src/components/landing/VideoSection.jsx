import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

const VideoSection = () => {
  return (
    <section className="py-32 px-6 sm:px-10 lg:px-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-20 gap-10">
          <div className="max-w-2xl">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-section-title text-[#062c1c]"
            >
              Where technology meets <br /> 
              <span className="text-[#34d399]/40 italic">The roots of nature</span>
            </motion.h2>
          </div>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-500 max-w-sm font-outfit font-medium leading-relaxed"
          >
            Witness the synthesis of modern tools and traditional wisdom to manage your fields more effectively.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
          className="relative rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(6,44,28,0.3)] aspect-[21/9] group cursor-pointer"
        >
          <img 
            src="/agri_video_bg_1774631658055.png" 
            alt="Terraced rice fields" 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500 flex items-center justify-center">
            <motion.div 
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              className="w-28 h-28 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40 shadow-2xl"
            >
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg transition-transform group-hover:rotate-12">
                <Play className="text-[#062c1c] fill-[#062c1c] ml-1" size={32} />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default VideoSection;
