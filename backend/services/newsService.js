const Parser = require('rss-parser');
const https = require('https');

// Custom parser with browser-like headers and relaxed SSL for govt sites
const parser = new Parser({
  timeout: 8000,
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
      '(KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept': 'application/rss+xml, application/xml, text/xml, */*',
    'Accept-Language': 'en-US,en;q=0.9',
  },
  customFields: {
    item: [['media:content', 'mediaContent'], ['enclosure', 'enclosure']],
  },
  // Allow self-signed/expired certs common on government sites
  requestOptions: {
    agent: new https.Agent({ rejectUnauthorized: false }),
  },
});

// ── In-memory cache ─────────────────────────────────────────────────────────
let newsCache = {
  data: null,
  timestamp: null,
  expiryMinutes: 20,
};

// ── Agriculture keywords for filtering generic feeds ────────────────────────
const AGRI_KEYWORDS = [
  'farm', 'agricul', 'crop', 'soil', 'kisan', 'rural', 'msp',
  'harvest', 'irrigation', 'fertilizer', 'pesticide', 'seed',
  'weather', 'monsoon', 'rainfall', 'drought', 'food', 'grain',
  'wheat', 'rice', 'maize', 'pulse', 'horticulture', 'dairy',
];

function isAgriRelated(item) {
  const text = ((item.title || '') + ' ' + (item.contentSnippet || '') + ' ' + (item.categories?.join(' ') || '')).toLowerCase();
  return AGRI_KEYWORDS.some((kw) => text.includes(kw));
}

// ── RSS Feed sources (ordered by reliability) ────────────────────────────────
const FEED_SOURCES = [
  {
    name: 'Google News – India Agriculture',
    url: 'https://news.google.com/rss/search?q=agriculture+farmer+India+kisan&hl=en-IN&gl=IN&ceid=IN:en',
    filter: false, // already focused
  },
  {
    name: 'The Hindu – Agriculture',
    url: 'https://www.thehindu.com/sci-tech/agriculture/feeder/default.rss',
    filter: false,
  },
  {
    name: 'Down To Earth – Agriculture',
    url: 'https://www.downtoearth.org.in/rss/agriculture',
    filter: false,
  },
  {
    name: 'Krishijagran',
    url: 'https://en.krishijagran.com/feed/',
    filter: false,
  },
  {
    name: 'PIB – Top Stories',
    url: 'https://pib.gov.in/rss/topstories.xml',
    filter: true, // generic feed – filter for agri keywords
  },
];

// ── Fallback headlines (shown only when ALL feeds fail) ──────────────────────
const FALLBACK_HEADLINES = [
  {
    title: 'PM-KISAN: ₹6000 annual benefit for eligible farmers',
    link: 'https://pmkisan.gov.in/',
    publishedAt: new Date().toISOString(),
    source: 'Government of India',
  },
  {
    title: 'Soil Health Card Scheme – Get your soil tested for free',
    link: 'https://soilhealth.dac.gov.in/',
    publishedAt: new Date().toISOString(),
    source: 'Ministry of Agriculture',
  },
  {
    title: 'Pradhan Mantri Fasal Bima Yojana – Crop Insurance Scheme',
    link: 'https://pmfby.gov.in/',
    publishedAt: new Date().toISOString(),
    source: 'PMFBY',
  },
  {
    title: 'Kisan Credit Card – Easy loans for farmers',
    link: 'https://agricoop.nic.in/en/kisan-credit-card',
    publishedAt: new Date().toISOString(),
    source: 'Ministry of Agriculture',
  },
  {
    title: 'e-NAM Portal – National Agriculture Market for better prices',
    link: 'https://www.enam.gov.in/',
    publishedAt: new Date().toISOString(),
    source: 'e-NAM',
  },
  {
    title: 'Paramparagat Krishi Vikas Yojana – Organic farming support',
    link: 'https://agricoop.nic.in/en/Major_Schemes/paramparagat-krishi-vikas-yojana',
    publishedAt: new Date().toISOString(),
    source: 'PKVY',
  },
  {
    title: 'National Agriculture Insurance Scheme – Protect your crops',
    link: 'https://agricoop.nic.in/en/Major_Schemes/crop-insurance',
    publishedAt: new Date().toISOString(),
    source: 'Ministry of Agriculture',
  },
  {
    title: 'Weather-based Crop Insurance – Get protected from weather risks',
    link: 'https://agricoop.nic.in/en/Major_Schemes/weather-based-crop-insurance-scheme-wbcis',
    publishedAt: new Date().toISOString(),
    source: 'WBCIS',
  },
  {
    title: 'Kisan Call Centre – 24/7 helpline at 1800-180-1551',
    link: 'https://mkisan.gov.in/',
    publishedAt: new Date().toISOString(),
    source: 'KCC',
  },
  {
    title: 'National Horticulture Board – Support for horticulture farmers',
    link: 'https://nhb.gov.in/',
    publishedAt: new Date().toISOString(),
    source: 'NHB',
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
function isCacheValid() {
  if (!newsCache.data || !newsCache.timestamp) return false;
  const ageMinutes = (Date.now() - newsCache.timestamp) / 1000 / 60;
  return ageMinutes < newsCache.expiryMinutes;
}

function formatItem(item, sourceName) {
  return {
    title: (item.title || '').trim(),
    link: item.link || item.guid || '',
    publishedAt: item.pubDate || item.isoDate || new Date().toISOString(),
    source: sourceName,
  };
}

// ── Core fetch logic ─────────────────────────────────────────────────────────
async function tryFeed(source) {
  try {
    const feed = await parser.parseURL(source.url);
    if (!feed || !feed.items || feed.items.length === 0) return null;

    const items = feed.items
      .filter((item) => (source.filter ? isAgriRelated(item) : true))
      .filter((item) => item.title && item.title.trim().length > 5)
      .slice(0, 10)
      .map((item) => formatItem(item, feed.title || source.name));

    if (items.length === 0) return null;

    console.log(`✓ News fetched from: ${source.name} (${items.length} items)`);
    return items;
  } catch (err) {
    console.log(`✗ Feed failed [${source.name}]: ${err.message}`);
    return null;
  }
}

async function fetchFromFeeds() {
  for (const source of FEED_SOURCES) {
    const items = await tryFeed(source);
    if (items) return items;
  }
  return null;
}

// ── Public API ───────────────────────────────────────────────────────────────
async function getNews(state = 'all') {
  if (isCacheValid()) {
    return {
      source: 'cache',
      updatedAt: new Date(newsCache.timestamp).toISOString(),
      items: newsCache.data,
    };
  }

  const newsItems = await fetchFromFeeds();

  if (newsItems && newsItems.length > 0) {
    newsCache.data = newsItems;
    newsCache.timestamp = Date.now();
    return {
      source: 'rss',
      updatedAt: new Date().toISOString(),
      items: newsItems,
    };
  }

  // Stale cache is better than nothing
  if (newsCache.data && newsCache.data.length > 0) {
    console.log('All RSS feeds failed – returning stale cache');
    return {
      source: 'stale-cache',
      updatedAt: new Date(newsCache.timestamp).toISOString(),
      items: newsCache.data,
    };
  }

  // Last resort
  console.log('All RSS feeds failed – using static fallback headlines');
  return {
    source: 'fallback',
    updatedAt: new Date().toISOString(),
    items: FALLBACK_HEADLINES,
  };
}

function clearCache() {
  newsCache = { data: null, timestamp: null, expiryMinutes: 20 };
}

module.exports = { getNews, clearCache };
