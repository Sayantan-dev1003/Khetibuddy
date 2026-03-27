const FertilizerPlan = require('../models/FertilizerPlan');
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

    const parsedResult = JSON.parse(result);

    // Save to database
    const savedPlan = await FertilizerPlan.create({
      userId: req.user.id,
      crop,
      landArea: req.body.landArea || 1,
      growthStage: req.body.growthStage || 'vegetative',
      soilType: req.body.soilType || 'alluvial',
      budget: budget || 'low',
      recommendation: {
        summary: parsedResult.summary,
        primaryFertilizers: parsedResult.primaryFertilizers,
        organicAlternatives: parsedResult.organicAlternatives,
        generalAdvice: parsedResult.generalAdvice,
        additionalTips: parsedResult.additionalTips
      }
    });

    res.status(200).json({
      success: true,
      data: {
        ...parsedResult,
        id: savedPlan._id
      }
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