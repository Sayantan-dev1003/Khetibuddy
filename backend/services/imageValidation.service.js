const sharp = require('sharp');
const { generateVisionResponse } = require('./llm.service');
const fs = require('fs').promises;

/**
 * Validate if an image contains plant/leaf content using LLM vision analysis
 * @param {string} imagePath - Path to the uploaded image
 * @returns {Promise<{isValid: boolean, reason: string, confidence: string}>}
 */
async function validatePlantImage(imagePath) {
  console.log('🔍 Starting plant image validation...');
  
  try {
    // First try LLM-based validation
    const llmResult = await llmBasedValidation(imagePath);
    console.log('LLM validation result:', llmResult);
    return llmResult;
  } catch (llmError) {
    console.error('LLM validation failed:', llmError.message);
    console.log('Falling back to heuristic validation...');
    
    // Fallback to heuristic validation
    const heuristicResult = await heuristicPlantValidation(imagePath);
    console.log('Heuristic validation result:', heuristicResult);
    return heuristicResult;
  }
}

/**
 * LLM-based plant image validation
 */
async function llmBasedValidation(imagePath) {
  try {
    // Convert image to base64 for LLM analysis
    const imageBuffer = await fs.readFile(imagePath);
    const base64Image = imageBuffer.toString('base64');
    
    const prompt = `You are a strict image classifier. Your ONLY job is to detect if this image contains a PLANT LEAF or PLANT.

ACCEPT ONLY these:
✅ Plant leaf (any type, healthy or diseased)
✅ Multiple plant leaves
✅ Plant with leaves visible
✅ Crop leaves (rice, wheat, tomato, corn, potato, etc.)
✅ Agricultural crop plants

REJECT everything else:
❌ People (even holding plants)
❌ Animals
❌ Buildings or structures  
❌ Food items (fruits, vegetables as food)
❌ Objects (phones, computers, furniture)
❌ Flowers only (without leaves)
❌ Grass/lawn (without clear plant structure)
❌ Trees from far away
❌ Screenshots or text
❌ Abstract patterns

BE ACCEPTING of actual plant/leaf images. When in doubt with a leaf, ACCEPT.

Respond with ONLY this JSON format (no markdown, no extra text):
{"isPlant": true, "mainObject": "description", "confidence": "high"}

Examples:
{"isPlant": true, "mainObject": "tomato leaf with disease spots", "confidence": "high"}
{"isPlant": true, "mainObject": "green crop leaves", "confidence": "high"}
{"isPlant": false, "mainObject": "person's face", "confidence": "high"}
{"isPlant": false, "mainObject": "phone screen", "confidence": "high"}`;

    // Call vision LLM with the image
    const response = await generateVisionResponse(prompt, [
      {
        type: 'image_url',
        image_url: {
          url: `data:image/jpeg;base64,${base64Image}`
        }
      }
    ]);

    console.log('Raw LLM response:', response);

    // Parse LLM response
    let parsed;
    try {
      // Remove markdown code blocks if present
      let cleanResponse = response.replace(/```json\s*/g, '').replace(/```\s*/g, '');
      
      // Try to extract JSON from response
      const jsonMatch = cleanResponse.match(/\{[\s\S]*?\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        // Try parsing the whole response
        parsed = JSON.parse(cleanResponse);
      }
    } catch (parseError) {
      console.error('Failed to parse LLM response:', response);
      console.error('Parse error:', parseError.message);
      throw new Error('LLM returned invalid format');
    }

    // Validate response structure
    if (typeof parsed.isPlant !== 'boolean') {
      throw new Error('Invalid LLM response structure');
    }

    const isValid = parsed.isPlant === true;
    const mainObject = parsed.mainObject || 'Unknown object';
    const confidence = parsed.confidence || 'medium';

    return {
      isValid,
      confidence,
      reason: isValid 
        ? `Plant detected: ${mainObject}` 
        : `Not a plant image. Detected: ${mainObject}`
    };

  } catch (error) {
    console.error('LLM validation error:', error.message);
    throw error; // Re-throw to trigger fallback
  }
}

/**
 * Heuristic-based plant image validation (fallback method)
 * This is stricter now - only accepts images with significant green content
 * @param {string} imagePath - Path to the uploaded image
 * @returns {Promise<{isValid: boolean, reason: string, confidence: string}>}
 */
async function heuristicPlantValidation(imagePath) {
  try {
    const metadata = await sharp(imagePath).metadata();
    
    console.log('Image metadata:', {
      width: metadata.width,
      height: metadata.height,
      format: metadata.format
    });

    // Check dimensions
    const minWidth = 100;
    const minHeight = 100;
    const maxWidth = 10000;
    const maxHeight = 10000;

    if (metadata.width < minWidth || metadata.height < minHeight) {
      return {
        isValid: false,
        confidence: 'high',
        reason: 'Image resolution too low. Please upload a clear photo (minimum 100x100 pixels).'
      };
    }

    if (metadata.width > maxWidth || metadata.height > maxHeight) {
      return {
        isValid: false,
        confidence: 'high',
        reason: 'Image resolution too high. Please upload a reasonably sized image.'
      };
    }

    // Analyze color distribution
    const { data, info } = await sharp(imagePath)
      .resize(200, 200, { fit: 'cover' })
      .raw()
      .toBuffer({ resolveWithObject: true });

    let greenPixels = 0;
    let brownPixels = 0;
    let whitePixels = 0;
    let darkPixels = 0;
    let totalPixels = 0;
    
    // Count different pixel types
    for (let i = 0; i < data.length; i += info.channels) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      totalPixels++;
      
      // Green pixels (plant leaves)
      if (g > r + 10 && g > b + 10 && g > 40) {
        greenPixels++;
      }
      // Brown/yellow pixels (diseased leaves, soil)
      else if (r > 100 && g > 80 && b < 100 && Math.abs(r - g) < 50) {
        brownPixels++;
      }
      // Very white pixels (overexposed, background)
      else if (r > 200 && g > 200 && b > 200) {
        whitePixels++;
      }
      // Very dark pixels (shadows, black background)
      else if (r < 50 && g < 50 && b < 50) {
        darkPixels++;
      }
    }

    const greenRatio = greenPixels / totalPixels;
    const brownRatio = brownPixels / totalPixels;
    const plantColorRatio = greenRatio + brownRatio;
    const whiteRatio = whitePixels / totalPixels;
    const darkRatio = darkPixels / totalPixels;

    console.log('Color analysis:', {
      greenRatio: greenRatio.toFixed(3),
      brownRatio: brownRatio.toFixed(3),
      plantColorRatio: plantColorRatio.toFixed(3),
      whiteRatio: whiteRatio.toFixed(3),
      darkRatio: darkRatio.toFixed(3)
    });

    // RELAXED CRITERIA: Accept diseased/brown leaves
    // At least 8% green OR 12% brown/yellow OR combined 15% plant colors
    const hasSignificantGreen = greenRatio >= 0.08;
    const hasSignificantBrown = brownRatio >= 0.12; // Diseased leaves
    const hasMixedPlantColors = plantColorRatio >= 0.15;
    
    // Reject if too much white or dark (likely not a plant photo)
    const tooMuchWhite = whiteRatio > 0.50;
    const tooMuchDark = darkRatio > 0.65;

    if (hasSignificantGreen || hasSignificantBrown || hasMixedPlantColors) {
      if (tooMuchWhite) {
        return {
          isValid: false,
          confidence: 'medium',
          reason: 'Image is overexposed or mostly white background. Please upload a clear plant photo.'
        };
      }
      if (tooMuchDark) {
        return {
          isValid: false,
          confidence: 'medium',
          reason: 'Image is too dark. Please upload a well-lit photo of a plant leaf.'
        };
      }
      
      return {
        isValid: true,
        confidence: 'medium',
        reason: `Plant-like colors detected (${(plantColorRatio * 100).toFixed(1)}% plant colors)`
      };
    }

    // Not enough plant colors
    return {
      isValid: false,
      confidence: 'high',
      reason: `No plant detected. This appears to be a ${
        whiteRatio > 0.4 ? 'white/bright object' :
        darkRatio > 0.4 ? 'dark object or screenshot' :
        'non-plant object'
      }. Please upload a photo of a plant leaf.`
    };

  } catch (error) {
    console.error('Heuristic validation error:', error.message);
    
    // On error, REJECT by default (fail-safe)
    return {
      isValid: false,
      confidence: 'low',
      reason: 'Unable to validate image. Please ensure you uploaded a clear photo of a plant leaf.'
    };
  }
}

module.exports = {
  validatePlantImage,
  heuristicPlantValidation,
  llmBasedValidation
};
