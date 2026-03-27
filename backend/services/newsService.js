const Parser = require('rss-parser');
const parser = new Parser();

// In-memory cache
let newsCache = {
  data: null,
  timestamp: null,
  expiryMinutes: 15
};

// Fallback headlines if RSS feeds fail
const fallbackHeadlines = [
  {
    title: "PM-KISAN: ₹6000 annual benefit for eligible farmers",
    link: "https://pmkisan.gov.in/",
    publishedAt: new Date().toISOString(),
    source: "PIB"
  },
  {
    title: "Soil Health Card Scheme - Get your soil tested for free",
    link: "https://soilhealth.dac.gov.in/",
    publishedAt: new Date().toISOString(),
    source: "Ministry of Agriculture"
  },
  {
    title: "Pradhan Mantri Fasal Bima Yojana - Crop Insurance Scheme",
    link: "https://pmfby.gov.in/",
    publishedAt: new Date().toISOString(),
    source: "PMFBY"
  },
  {
    title: "Kisan Credit Card - Easy loans for farmers",
    link: "https://agricoop.nic.in/en/kisan-credit-card",
    publishedAt: new Date().toISOString(),
    source: "Ministry of Agriculture"
  },
  {
    title: "e-NAM Portal - National Agriculture Market for better prices",
    link: "https://www.enam.gov.in/",
    publishedAt: new Date().toISOString(),
    source: "e-NAM"
  },
  {
    title: "Paramparagat Krishi Vikas Yojana - Organic farming support",
    link: "https://agricoop.nic.in/en/Major_Schemes/paramparagat-krishi-vikas-yojana",
    publishedAt: new Date().toISOString(),
    source: "PKVY"
  },
  {
    title: "National Agriculture Insurance Scheme - Protect your crops",
    link: "https://agricoop.nic.in/en/Major_Schemes/crop-insurance",
    publishedAt: new Date().toISOString(),
    source: "Ministry of Agriculture"
  },
  {
    title: "Weather-based Crop Insurance - Get protected from weather risks",
    link: "https://agricoop.nic.in/en/Major_Schemes/weather-based-crop-insurance-scheme-wbcis",
    publishedAt: new Date().toISOString(),
    source: "WBCIS"
  },
  {
    title: "Kisan Call Centre - 24/7 helpline at 1800-180-1551",
    link: "https://mkisan.gov.in/",
    publishedAt: new Date().toISOString(),
    source: "KCC"
  },
  {
    title: "National Horticulture Board - Support for horticulture farmers",
    link: "https://nhb.gov.in/",
    publishedAt: new Date().toISOString(),
    source: "NHB"
  }
];

// RSS Feed URLs for government agriculture news
const RSS_FEEDS = {
  pib: 'https://pib.gov.in/rss/topstories.xml',
  agriculture: 'https://agricoop.nic.in/rss/latest-news.xml',
  // Fallback to a general news feed
  fallback: 'https://pib.gov.in/rss/topstories.xml'
};

/**
 * Check if cache is valid
 */
function isCacheValid() {
  if (!newsCache.data || !newsCache.timestamp) {
    return false;
  }
  
  const now = Date.now();
  const cacheAge = (now - newsCache.timestamp) / 1000 / 60; // in minutes
  
  return cacheAge < newsCache.expiryMinutes;
}

/**
 * Fetch news from RSS feeds
 */
async function fetchFromRSS() {
  try {
    console.log('Fetching news from RSS feeds...');
    
    // Try PIB RSS feed first
    let feed = null;
    try {
      feed = await parser.parseURL(RSS_FEEDS.pib);
    } catch (err) {
      console.log('PIB RSS failed, trying fallback...');
      try {
        feed = await parser.parseURL(RSS_FEEDS.fallback);
      } catch (fallbackErr) {
        console.log('All RSS feeds failed');
        return null;
      }
    }
    
    if (!feed || !feed.items || feed.items.length === 0) {
      return null;
    }
    
    // Filter and format items related to farming/agriculture
    const items = feed.items
      .filter(item => {
        const text = (item.title + ' ' + (item.contentSnippet || '')).toLowerCase();
        return text.includes('farm') || 
               text.includes('agricul') || 
               text.includes('crop') || 
               text.includes('soil') ||
               text.includes('kisan') ||
               text.includes('rural') ||
               text.includes('msp') ||
               text.includes('food');
      })
      .slice(0, 10)
      .map(item => ({
        title: item.title,
        link: item.link,
        publishedAt: item.pubDate || item.isoDate || new Date().toISOString(),
        source: 'PIB'
      }));
    
    if (items.length === 0) {
      return null;
    }
    
    return items;
    
  } catch (error) {
    console.error('Error fetching RSS:', error.message);
    return null;
  }
}

/**
 * Get news with caching
 */
async function getNews(state = 'all') {
  // Check cache first
  if (isCacheValid()) {
    console.log('Returning cached news');
    return {
      source: 'cache',
      updatedAt: new Date(newsCache.timestamp).toISOString(),
      items: newsCache.data
    };
  }
  
  // Try to fetch fresh news
  let newsItems = await fetchFromRSS();
  
  // If RSS fetch succeeded, cache it
  if (newsItems && newsItems.length > 0) {
    newsCache.data = newsItems;
    newsCache.timestamp = Date.now();
    
    return {
      source: 'rss',
      updatedAt: new Date().toISOString(),
      items: newsItems
    };
  }
  
  // If RSS failed, try to return old cache if available
  if (newsCache.data && newsCache.data.length > 0) {
    console.log('RSS failed, returning stale cache');
    return {
      source: 'stale-cache',
      updatedAt: new Date(newsCache.timestamp).toISOString(),
      items: newsCache.data
    };
  }
  
  // Last resort: return fallback headlines
  console.log('Using fallback headlines');
  return {
    source: 'fallback',
    updatedAt: new Date().toISOString(),
    items: fallbackHeadlines
  };
}

/**
 * Clear cache (for testing/admin purposes)
 */
function clearCache() {
  newsCache = {
    data: null,
    timestamp: null,
    expiryMinutes: 15
  };
}

module.exports = {
  getNews,
  clearCache
};
