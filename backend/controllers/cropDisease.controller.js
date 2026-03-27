const { detectCropDisease } = require('../services/cropDiseaseML.service');
const { detectDiseaseFromImage, detectDiseaseWithLLM } = require('../services/imageDiseaseML.service');
const { generateChatResponse } = require('../services/llm.service');
const { validatePlantImage } = require('../services/imageValidation.service');
const path = require('path');
const fs = require('fs');

exports.checkCropDisease = async (req, res) => {
  try {
    const { crop, symptoms } = req.body;

    if (!crop || !symptoms) {
      return res.status(400).json({
        success: false,
        message: 'Crop and symptoms are required'
      });
    }

    const result = await detectCropDisease({ crop, symptoms });

    let parsed;
    try {
      parsed = JSON.parse(result);
    } catch {
      console.error('RAW LLM OUTPUT:', result);
      throw new Error('Invalid JSON from crop disease AI');
    }

    res.status(200).json({
      success: true,
      data: parsed
    });

  } catch (error) {
    console.error('Crop Disease Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to detect crop disease',
      error: error.message
    });
  }
};

exports.detectDiseaseFromImage = async (req, res) => {
  try {
    console.log('=== Disease Detection Request ===');
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image'
      });
    }

    console.log('File received:', req.file.filename);
    console.log('File size:', req.file.size, 'bytes');

    const imagePath = path.resolve(req.file.path);

    // ✅ STEP 1: Validate if image contains plant/leaf content
    console.log('==============================================');
    console.log('🔍 VALIDATING IF IMAGE CONTAINS PLANT/LEAF...');
    console.log('==============================================');
    
    const validation = await validatePlantImage(imagePath);
    
    console.log('==============================================');
    console.log('📊 VALIDATION RESULT:');
    console.log('  Is Valid:', validation.isValid);
    console.log('  Confidence:', validation.confidence);
    console.log('  Reason:', validation.reason);
    console.log('==============================================');

    if (!validation.isValid) {
      console.log('❌ IMAGE REJECTED - Not a plant/leaf image');
      
      // Clean up uploaded file
      fs.unlink(imagePath, (err) => {
        if (err) console.error('Failed to delete uploaded file:', err);
      });

      return res.status(400).json({
        success: false,
        message: '🚫 Invalid Image: Not a plant or leaf',
        error: validation.reason,
        data: {
          isPlantImage: false,
          confidence: validation.confidence,
          reason: validation.reason,
          suggestion: '📸 Please upload a clear photo of a plant leaf or crop for disease detection.',
          acceptedImages: [
            '✅ Plant leaves (healthy or diseased)',
            '✅ Crop plants with visible leaves',
            '✅ Close-up photos of plant foliage'
          ],
          rejectedImages: [
            '❌ People, animals, buildings',
            '❌ Food items or products',
            '❌ Objects, phones, screenshots',
            '❌ Blurry or unclear images'
          ]
        }
      });
    }

    console.log('✅ IMAGE ACCEPTED - Proceeding with disease detection...');

    // ✅ STEP 2: Proceed with disease detection using ONNX model
    try {
      console.log('Using ONNX model for disease detection...');
      const result = await detectDiseaseFromImage(imagePath);
      
      console.log('✓ ONNX detection successful');
      
      // Clean up uploaded file
      fs.unlink(imagePath, (err) => {
        if (err) console.error('Failed to delete uploaded file:', err);
      });

      res.status(200).json({
        success: true,
        data: {
          ...result,
          validation: {
            isPlantImage: true,
            confidence: validation.confidence
          }
        }
      });

    } catch (analysisError) {
      console.error('ONNX model error:', analysisError.message);
      console.log('Falling back to LLM-based detection...');
      
      try {
        // Fallback to LLM analysis
        const result = await detectDiseaseWithLLM(imagePath, { generateChatResponse });
        
        console.log('✓ LLM fallback detection successful');
        
        // Clean up uploaded file
        fs.unlink(imagePath, (err) => {
          if (err) console.error('Failed to delete uploaded file:', err);
        });

        res.status(200).json({
          success: true,
          data: {
            ...result,
            validation: {
              isPlantImage: true,
              confidence: validation.confidence
            },
            note: 'Detected using AI assistant (ONNX model unavailable)'
          }
        });
      } catch (llmError) {
        console.error('Both detection methods failed');
        throw new Error('Unable to detect disease. Please try another image.');
      }
    }

  } catch (error) {
    console.error('Disease Detection Error:', error);
    
    // Clean up file if it exists
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Failed to delete file:', err);
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to detect disease from image',
      error: error.message
    });
  }
};
