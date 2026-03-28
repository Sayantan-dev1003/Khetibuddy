const PestScan = require('../models/PestScan');
const pestMLService = require('../services/pestML.service');
const path = require('path');
const fs = require('fs');

// Extensive database of common pests and treatments
const PEST_METADATA = {
    "Aphids": {
        "treatment": {
            "organic": ["Neem oil spray", "Strong water spray to dislodge", "Introduce ladybugs (natural predators)"],
            "chemical": ["Imidacloprid", "Malathion", "Acetamiprid"]
        },
        "prevention": ["Avoid over-fertilizing with nitrogen", "Reflective mulches", "Monitor plants regularly"]
    },
    "Armyworm": {
        "treatment": {
            "organic": ["Bacillus thuringiensis (Bt)", "Hand-picking larvae", "Spinosad"],
            "chemical": ["Chlorantraniliprole", "Lambda-cyhalothrin"]
        },
        "prevention": ["Deep plowing after harvest", "Removing grassy weeds", "Pheromone traps"]
    },
    "Grasshopper": {
        "treatment": {
            "organic": ["Garlic spray", "Nosema locustae (biological control)", "Physical barriers/netting"],
            "chemical": ["Carbaryl", "Permethrin"]
        },
        "prevention": ["Tilling soil in fall to destroy eggs", "Maintaining tall grass around fields to trap them"]
    },
    "Mites": {
        "treatment": {
            "organic": ["Insecticidal soap", "Sulfur spray", "Miticides"],
            "chemical": ["Abamectin", "Spiromesifen"]
        },
        "prevention": ["Misting plants to increase humidity", "Avoiding water stress", "Quarantine new plants"]
    },
    "Thrips": {
        "treatment": {
            "organic": ["Blue/Yellow sticky traps", "Neem oil", "Spinosad"],
            "chemical": ["Spinetoram", "Thiamethoxam"]
        },
        "prevention": ["Reflective mulches", "Removing plant debris", "Regular monitoring"]
    },
    "Leaf Miner": {
        "treatment": {
            "organic": ["Neem oil", "Spinosad", "Remove infested leaves"],
            "chemical": ["Abamectin", "Spinetoram"]
        },
        "prevention": ["Crop rotation", "Cover soil with plastic mulch"]
    },
    "Whitefly": {
        "treatment": {
            "organic": ["Yellow sticky traps", "Neem oil", "Insecticidal soap"],
            "chemical": ["Imidacloprid", "Spirotetramat"]
        },
        "prevention": ["Clean surroundings", "Avoid excessive nitrogen", "Introduce Encarsia formosa"]
    }
};

exports.detectPest = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image of the pest or affected crop.'
      });
    }

    const imagePath = path.resolve(req.file.path);
    console.log(`🔍 Processing Pest Detection: ${req.file.filename}`);

    // ✅ Step 1: Run ML Inference
    let prediction;
    try {
      prediction = await pestMLService.runPestInference(imagePath);
    } catch (inferenceError) {
      console.error('ML Inference Error:', inferenceError);
      return res.status(500).json({
        success: false,
        message: 'ML engine failed to analyze the image.',
        error: inferenceError.message
      });
    }

    // ✅ Step 2: Formulate Recommendations
    const metadata = PEST_METADATA[prediction.pestName] || {
        "treatment": {
            "organic": ["Consult a local agricultural expert", "Monitor affected area"],
            "chemical": ["Targeted insecticides if necessary"]
        },
        "prevention": ["Maintain crop health", "Regular field scouting"]
    };

    // ✅ Step 3: Save to Database
    const savedScan = await PestScan.create({
      userId: req.user.id,
      pestName: prediction.pestName,
      confidence: prediction.confidence,
      imagePath: req.file.path,
      imageUrl: `/uploads/${req.file.filename}`,
      treatmentTips: metadata.treatment.organic.concat(metadata.treatment.chemical),
      preventionTips: metadata.prevention
    });

    // ✅ Step 4: Return Success Response
    res.status(200).json({
      success: true,
      data: {
        id: savedScan._id,
        pestName: prediction.pestName,
        confidence: prediction.confidence,
        imageUrl: savedScan.imageUrl,
        treatment: metadata.treatment,
        prevention: metadata.prevention,
        detectionMethod: 'PyTorch AI Engine'
      }
    });

  } catch (error) {
    console.error('Pest Detection System Error:', error);
    
    // Clean up file if it exists
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Failed to delete residual file:', err);
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal system failure during pest analysis.',
      error: error.message
    });
  }
};

exports.getPestHistory = async (req, res) => {
    try {
        const history = await PestScan.find({ userId: req.user.id }).sort({ scanDate: -1 });
        res.status(200).json({
            success: true,
            data: history
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch detection history.'
        });
    }
};
