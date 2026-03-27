import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const articles = [
  {
    title: 'Sustainable Farming in the Age of Climate Change',
    description: 'Explore how regenerative agriculture is adapting to rising temperatures and erratic weather patterns for resilient harvests.',
    image: '/agri_article_1_1774631734958.png',
  },
  {
    title: 'How Smart Technology is Transforming Modern Agriculture',
    description: 'Discover how AI-powered tools and automation are helping farmers increase yields and reduce waste through precision agriculture.',
    image: '/agri_article_2_1774631772531.png',
  },
  {
    title: 'Building a Greener Future Through Regenerative Farming',
    description: 'Learn how regenerative farming restores soil health, increases biodiversity, and captures carbon for generations to come.',
    image: '/agri_article_3_1774631803175.png',
  },
  {
    title: 'Precision Irrigation for Water-Scarce Regions',
    description: 'How modern irrigation systems are optimizing water usage and ensuring crop health in challenging environments.',
    image: '/agri_article_4_1774631831664.png',
  },
];

const ArticlesGrid = () => {
  return (
    <section id="features" className="py-32 px-6 sm:px-10 lg:px-16 bg-[#062c1c]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-20 gap-10">
          <div className="max-w-2xl">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-section-title text-white"
            >
              Deep Insights <br /> 
              <span className="text-[#34d399]/40 italic">& Farmer Stories</span>
            </motion.h2>
          </div>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-white/50 max-w-sm leading-relaxed font-outfit font-medium"
          >
            Harnessing the power of modern tools for a more resilient, efficient, and greener agricultural future.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {articles.map((article, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem] mb-8 shadow-2xl border border-white/5">
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#062c1c]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-[#34d399] transition-colors leading-tight">
                {article.title}
              </h3>
              <p className="text-lg text-white/50 leading-relaxed mb-8 line-clamp-2">
                {article.description}
              </p>
              <button className="flex items-center gap-3 text-[#34d399] font-black uppercase tracking-widest group-hover:gap-5 transition-all text-sm">
                Read More
                <ChevronRight size={20} className="bg-[#34d399]/10 p-1 rounded-full" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArticlesGrid;
