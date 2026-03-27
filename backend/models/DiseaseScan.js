const mongoose = require('mongoose');

const diseaseScanSchema = new mongoose.Schema({
  imagePath: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  disease: {
    type: String,
    required: true
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  treatmentTips: [{
    type: String
  }],
  preventionTips: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('DiseaseScan', diseaseScanSchema);
