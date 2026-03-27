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

    res.status(200).json({
      success: true,
      data: parsed
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
