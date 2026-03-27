const { generateFertilizerRecommendation } = require('../services/fertilizerML.service');

exports.getFertilizerRecommendation = async (req, res) => {
  try {
    const { crop, n, p, k, ph, budget } = req.body;

    if (!crop) {
      return res.status(400).json({
        success: false,
        message: 'Crop is required'
      });
    }

    const result = await generateFertilizerRecommendation({
      crop,
      soil: { n, p, k, ph },
      budgetPreference: budget || 'low'
    });

    res.status(200).json({
      success: true,
      data: JSON.parse(result)
    });

  } catch (error) {
    console.error('Fertilizer ML Error:', error.message);
  
    res.status(500).json({
      success: false,
      message: 'Failed to generate fertilizer recommendation',
      error: error.message
    });
  }
  
};