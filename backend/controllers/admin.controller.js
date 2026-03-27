const User = require('../models/user.model');
const DiseaseScan = require('../models/DiseaseScan');
const ChatQuery = require('../models/ChatQuery');
const FertilizerPlan = require('../models/FertilizerPlan');
const SoilReport = require('../models/SoilReport');

// @desc    Get overall system statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getAdminStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalScans,
      totalChatQueries,
      totalFertilizerPlans,
      totalSoilReports
    ] = await Promise.all([
      User.countDocuments(),
      DiseaseScan.countDocuments(),
      ChatQuery.countDocuments(),
      FertilizerPlan.countDocuments(),
      SoilReport.countDocuments()
    ]);

    const stats = {
      users: {
        total: totalUsers,
        growth: 0 // Placeholder for real growth logic
      },
      scans: {
        total: totalScans,
        today: await DiseaseScan.countDocuments({
          createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
        })
      },
      chats: {
        total: totalChatQueries,
        today: await ChatQuery.countDocuments({
          createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
        })
      },
      resources: {
        fertilizers: totalFertilizerPlans,
        soilReports: totalSoilReports
      }
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('getAdminStats error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching admin stats' });
  }
};

// @desc    Get all users with pagination
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    res.status(200).json({
      success: true,
      count: users.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      },
      data: users
    });
  } catch (error) {
    console.error('getAllUsers error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching users' });
  }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Prevent deleting self
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own admin account' });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User removed successfully'
    });
  } catch (error) {
    console.error('deleteUser error:', error);
    res.status(500).json({ success: false, message: 'Server error deleting user' });
  }
};

// @desc    Get recent system activities
// @route   GET /api/admin/activities
// @access  Private/Admin
exports.getRecentActivities = async (req, res) => {
  try {
    // Combine recent scans and chat queries as "activities"
    const [recentScans, recentChats] = await Promise.all([
      DiseaseScan.find().sort({ createdAt: -1 }).limit(5).populate('userId', 'name email'),
      ChatQuery.find().sort({ createdAt: -1 }).limit(5).populate('userId', 'name email')
    ]);

    const activities = [
      ...recentScans.map(scan => ({
        type: 'SCAN',
        user: scan.userId?.name || 'Unknown',
        detail: `Detected ${scan.disease} on ${scan.crop}`,
        timestamp: scan.createdAt
      })),
      ...recentChats.map(chat => ({
        type: 'CHAT',
        user: chat.userId?.name || 'Unknown',
        detail: `Asked: "${chat.content.substring(0, 50)}..."`,
        timestamp: chat.createdAt
      }))
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));


    res.status(200).json({
      success: true,
      data: activities.slice(0, 10)
    });
  } catch (error) {
    console.error('getRecentActivities error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching activities' });
  }
};
