import React, { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';

const NewsTicker = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/news?state=all`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }
      
      const data = await response.json();
      setNews(data.items || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('Unable to load news updates');
      // Set fallback news items
      setNews([
        {
          title: "PM-KISAN: ₹6000 annual benefit for eligible farmers",
          link: "https://pmkisan.gov.in/",
          source: "PIB"
        },
        {
          title: "Soil Health Card Scheme - Get your soil tested for free",
          link: "https://soilhealth.dac.gov.in/",
          source: "Ministry of Agriculture"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 text-white py-2 overflow-hidden shadow-md border-b w-full border-green-800">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-3">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-sm animate-pulse">📰</span>
            <span className="text-sm md:text-base font-semibold">Farmer Updates</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="animate-pulse flex gap-4">
              <div className="h-5 bg-white/20 rounded w-48"></div>
              <div className="h-5 bg-white/20 rounded w-40"></div>
              <div className="h-5 bg-white/20 rounded w-56"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 text-white py-2 overflow-hidden shadow-md border-b border-green-800">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-3">
        {/* Compact Title */}
        <div className="flex items-center gap-2 whitespace-nowrap">
          <span className="text-sm">📰</span>
          <span className="text-sm md:text-base font-semibold">Farmer Updates</span>
          <span className="hidden md:inline text-green-200 text-xs">•</span>
        </div>

        {/* Ticker Container with gradient fade edges */}
        <div className="flex-1 relative overflow-hidden">
          {/* Left fade */}
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-green-600 to-transparent z-10 pointer-events-none"></div>
          
          {/* Right fade */}
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-green-700 to-transparent z-10 pointer-events-none"></div>
          
          <div 
            className="overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div 
              className={`flex gap-6 ${!isPaused ? 'animate-scroll' : ''}`}
              style={{
                animation: isPaused ? 'none' : 'scroll 35s linear infinite'
              }}
            >
              {/* Duplicate news items for seamless loop */}
              {[...news, ...news].map((item, index) => (
                <a
                  key={index}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 whitespace-nowrap hover:scale-105 transition-all duration-300 cursor-pointer"
                >
                  <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                  <span className="text-sm md:text-base font-medium text-white">
                    {item.title}
                  </span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 text-yellow-300" />
                  <span className="text-xs text-green-200 hidden md:inline">
                    ({item.source})
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for faster scrolling animation */}
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 35s linear infinite;
          will-change: transform;
        }

        /* Pause animation on hover */
        .animate-scroll:hover {
          animation-play-state: paused;
        }

        /* Mobile optimization - even faster */
        @media (max-width: 768px) {
          .animate-scroll {
            animation: scroll 25s linear infinite;
          }
        }
      `}</style>
    </div>
  );
};

export default NewsTicker;
