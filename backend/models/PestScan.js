const mongoose = require('mongoose');

const PestScanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pestName: {
    type: String,
    required: true
  },
  confidence: {
    type: Number,
    required: true
  },
  imagePath: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'resolved', 'ignored'],
    default: 'active'
  },
  treatmentTips: [String],
  preventionTips: [String],
  scanDate: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('PestScan', PestScanSchema);
