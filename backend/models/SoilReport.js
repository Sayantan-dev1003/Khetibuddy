const mongoose = require('mongoose');

const soilReportSchema = new mongoose.Schema({
  n: {
    type: Number,
    required: true,
    min: 0
  },
  p: {
    type: Number,
    required: true,
    min: 0
  },
  k: {
    type: Number,
    required: true,
    min: 0
  },
  ph: {
    type: Number,
    required: true,
    min: 0,
    max: 14
  },
  moisture: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  soilStatus: {
    type: String,
    required: true
  },
  cropRecommendations: [{
    type: String
  }],
  suggestions: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SoilReport', soilReportSchema);
