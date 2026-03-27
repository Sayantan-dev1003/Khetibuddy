const ChatQuery = require('../models/ChatQuery');
const DiseaseScan = require('../models/DiseaseScan');
const SoilReport = require('../models/SoilReport');
const FertilizerPlan = require('../models/FertilizerPlan');

// GET /api/dashboard/stats - Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    // Get counts from each collection
    const [
      totalScans,
      soilTests,
      fertilizerPlans,
      chatSessions
    ] = await Promise.all([
      DiseaseScan.countDocuments(),
      SoilReport.countDocuments(),
      FertilizerPlan.countDocuments(),
      ChatQuery.distinct('sessionId').then(sessions => sessions.length)
    ]);

    // Get healthy vs diseased counts
    const diseaseScans = await DiseaseScan.find().lean();
    const healthyScans = diseaseScans.filter(scan => 
      scan.disease.toLowerCase().includes('healthy') || 
      scan.confidence > 85
    ).length;
    const diseasedScans = totalScans - healthyScans;

    // Get today's stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const scansToday = await DiseaseScan.countDocuments({
      createdAt: { $gte: today }
    });

    res.json({
      success: true,
      data: {
        totalScans,
        soilTests,
        fertilizerPlans,
        chatQueries: chatSessions,
        healthyScans,
        diseasedScans,
        scansToday
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// GET /api/dashboard/recent-activity - Get recent activities across all services
exports.getRecentActivity = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    // Fetch recent entries from each collection
    const [diseaseScans, soilReports, fertilizerPlans] = await Promise.all([
      DiseaseScan.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .select('disease confidence createdAt')
        .lean(),
      SoilReport.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .select('healthScore healthStatus createdAt')
        .lean(),
      FertilizerPlan.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .select('crop createdAt')
        .lean()
    ]);

    // Transform into unified activity format
    const activities = [
      ...diseaseScans.map(scan => ({
        type: 'disease',
        title: 'Disease Detection',
        description: `Detected: ${scan.disease}`,
        timestamp: scan.createdAt,
        icon: 'Leaf',
        color: 'text-green-600'
      })),
      ...soilReports.map(report => ({
        type: 'soil',
        title: 'Soil Test',
        description: `Health Score: ${report.healthScore || 'N/A'}`,
        timestamp: report.createdAt,
        icon: 'TestTube',
        color: 'text-amber-600'
      })),
      ...fertilizerPlans.map(plan => ({
        type: 'fertilizer',
        title: 'Fertilizer Plan',
        description: `For ${plan.crop}`,
        timestamp: plan.createdAt,
        icon: 'Droplets',
        color: 'text-purple-600'
      }))
    ];

    // Sort by timestamp and take most recent
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const recentActivities = activities.slice(0, limit);

    res.json({
      success: true,
      data: recentActivities
    });
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent activity',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// GET /api/dashboard/crop-health - Get crop health overview
exports.getCropHealthOverview = async (req, res) => {
  try {
    const diseaseScans = await DiseaseScan.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const healthyCount = diseaseScans.filter(scan => 
      scan.disease.toLowerCase().includes('healthy') || 
      scan.confidence > 85
    ).length;
    
    const diseasedCount = diseaseScans.length - healthyCount;

    // Calculate average confidence
    const avgConfidence = diseaseScans.length > 0
      ? (diseaseScans.reduce((sum, scan) => sum + scan.confidence, 0) / diseaseScans.length).toFixed(1)
      : 0;

    // Get disease distribution
    const diseaseDistribution = {};
    diseaseScans.forEach(scan => {
      const disease = scan.disease;
      diseaseDistribution[disease] = (diseaseDistribution[disease] || 0) + 1;
    });

    res.json({
      success: true,
      data: {
        totalScans: diseaseScans.length,
        healthyCount,
        diseasedCount,
        avgConfidence: parseFloat(avgConfidence),
        diseaseDistribution
      }
    });
  } catch (error) {
    console.error('Error fetching crop health overview:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch crop health overview',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

