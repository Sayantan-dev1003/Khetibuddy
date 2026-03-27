const mongoose = require('mongoose');

const fertilizerPlanSchema = new mongoose.Schema({
  crop: {
    type: String,
    required: true,
    trim: true
  },
  landArea: {
    type: Number,
    required: true
  },
  areaUnit: {
    type: String,
    enum: ['acre', 'hectare', 'bigha'],
    default: 'acre'
  },
  growthStage: {
    type: String,
    required: true,
    enum: ['pre-sowing', 'germination', 'vegetative', 'flowering', 'fruiting', 'maturity']
  },
  soilType: {
    type: String,
    required: true,
    enum: ['alluvial', 'black', 'red', 'laterite', 'sandy', 'clayey', 'loamy']
  },
  budget: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  issues: {
    type: String,
    default: ''
  },
  recommendation: {
    summary: String,
    primaryFertilizers: [{
      name: String,
      npkRatio: String,
      dosage: String,
      timing: String,
      applicationMethod: String,
      purpose: String,
      estimatedCost: String
    }],
    organicAlternatives: [{
      name: String,
      replaces: String,
      benefit: String,
      howToUse: String,
      preparation: String
    }],
    generalAdvice: [String],
    additionalTips: [String]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('FertilizerPlan', fertilizerPlanSchema);
