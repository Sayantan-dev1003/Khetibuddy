const SoilReport = require('../models/SoilReport');
const { detectSoilHealth } = require('../services/soilHealthML.service');


exports.checkSoilHealth = async (req, res) => {
  try {
    const soil = req.body;

    const result = await detectSoilHealth(soil);

    let parsed;
    try {
      parsed = JSON.parse(result);
    } catch {
      throw new Error('Invalid JSON from soil health AI');
    }

    // Save to database
    const savedReport = await SoilReport.create({
      userId: req.user.id,
      n: soil.n,
      p: soil.p,
      k: soil.k,
      ph: soil.ph,
      moisture: soil.moisture || 0,
      soilStatus: parsed.soil_status || parsed.soilStatus,
      cropRecommendations: parsed.recommended_crops || parsed.cropRecommendations,
      suggestions: parsed.improvement_suggestions || parsed.suggestions
    });

    res.status(200).json({
      success: true,
      data: {
        ...parsed,
        id: savedReport._id
      }
    });


  } catch (error) {
    console.error('Soil Health Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze soil health',
      error: error.message
    });
  }
};
