const ChatQuery = require('../models/ChatQuery');
const DiseaseScan = require('../models/DiseaseScan');
const SoilReport = require('../models/SoilReport');
const FertilizerPlan = require('../models/FertilizerPlan');

// Generate summary for each history item
const generateSummary = (item, type) => {
  switch(type) {
    case 'chat':
      return item.question.length > 60 
        ? item.question.substring(0, 60) + '...' 
        : item.question;
    case 'disease':
      return `Disease detected: ${item.disease} (${item.confidence}% confidence)`;
    case 'soil':
      return `Soil Analysis: ${item.soilStatus}`;
    case 'fertilizer':
      return `Fertilizer plan for ${item.crop}`;
    default:
      return 'Unknown entry';
  }
};

// GET /api/history
exports.getHistory = async (req, res) => {
  try {
    // Fetch last 30 entries from each collection
    const [chatQueries, diseaseScans, soilReports, fertilizerPlans] = await Promise.all([
      ChatQuery.find().sort({ createdAt: -1 }).limit(30).lean(),
      DiseaseScan.find().sort({ createdAt: -1 }).limit(30).lean(),
      SoilReport.find().sort({ createdAt: -1 }).limit(30).lean(),
      FertilizerPlan.find().sort({ createdAt: -1 }).limit(30).lean()
    ]);
    
    // Transform and add metadata to each entry
    const history = [
      ...chatQueries.map(item => ({
        type: 'chat',
        createdAt: item.createdAt,
        summary: generateSummary(item, 'chat'),
        data: item
      })),
      ...diseaseScans.map(item => ({
        type: 'disease',
        createdAt: item.createdAt,
        summary: generateSummary(item, 'disease'),
        data: item
      })),
      ...soilReports.map(item => ({
        type: 'soil',
        createdAt: item.createdAt,
        summary: generateSummary(item, 'soil'),
        data: item
      })),
      ...fertilizerPlans.map(item => ({
        type: 'fertilizer',
        createdAt: item.createdAt,
        summary: generateSummary(item, 'fertilizer'),
        data: item
      }))
    ];
    
    // Sort by createdAt (newest first) and limit to 30
    history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const recentHistory = history.slice(0, 30);
    
    res.status(200).json({
      success: true,
      count: recentHistory.length,
      data: recentHistory
    });
    
  } catch (error) {
    console.error('History fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching history',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
