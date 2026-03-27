const newsService = require('../services/newsService');

/**
 * Get news headlines
 * GET /api/news?state=all|gujarat|kerala
 */
exports.getNews = async (req, res) => {
  try {
    const { state } = req.query;
    
    // Get news from service
    const newsData = await newsService.getNews(state || 'all');
    
    res.json(newsData);
    
  } catch (error) {
    console.error('Error in news controller:', error);
    res.status(500).json({
      error: 'Failed to fetch news',
      message: error.message
    });
  }
};

/**
 * Clear news cache (admin endpoint)
 * POST /api/news/clear-cache
 */
exports.clearCache = (req, res) => {
  try {
    newsService.clearCache();
    res.json({ message: 'Cache cleared successfully' });
  } catch (error) {
    console.error('Error clearing cache:', error);
    res.status(500).json({
      error: 'Failed to clear cache',
      message: error.message
    });
  }
};
