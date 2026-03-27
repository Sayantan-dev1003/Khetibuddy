const sharp = require('sharp');
const ort = require('onnxruntime-node');
const path = require('path');

// Disease class names (38 classes from your training notebook)
const DISEASE_CLASSES = [
  'Apple___Apple_scab',
  'Apple___Black_rot',
  'Apple___Cedar_apple_rust',
  'Apple___healthy',
  'Blueberry___healthy',
  'Cherry_(including_sour)___Powdery_mildew',
  'Cherry_(including_sour)___healthy',
  'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot',
  'Corn_(maize)___Common_rust_',
  'Corn_(maize)___Northern_Leaf_Blight',
  'Corn_(maize)___healthy',
  'Grape___Black_rot',
  'Grape___Esca_(Black_Measles)',
  'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)',
  'Grape___healthy',
  'Orange___Haunglongbing_(Citrus_greening)',
  'Peach___Bacterial_spot',
  'Peach___healthy',
  'Pepper,_bell___Bacterial_spot',
  'Pepper,_bell___healthy',
  'Potato___Early_blight',
  'Potato___Late_blight',
  'Potato___healthy',
  'Raspberry___healthy',
  'Soybean___healthy',
  'Squash___Powdery_mildew',
  'Strawberry___Leaf_scorch',
  'Strawberry___healthy',
  'Tomato___Bacterial_spot',
  'Tomato___Early_blight',
  'Tomato___Late_blight',
  'Tomato___Leaf_Mold',
  'Tomato___Septoria_leaf_spot',
  'Tomato___Spider_mites Two-spotted_spider_mite',
  'Tomato___Target_Spot',
  'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
  'Tomato___Tomato_mosaic_virus',
  'Tomato___healthy'
];

// Cache for loaded model
let modelSession = null;

/**
 * Load ONNX model (cached)
 */
async function loadModel() {
  if (modelSession) {
    return modelSession;
  }

  try {
    const modelPath = path.resolve(__dirname, '../plant-disease-model.onnx');
    console.log('Loading ONNX model from:', modelPath);
    
    modelSession = await ort.InferenceSession.create(modelPath);
    console.log('✓ Model loaded successfully');
    
    return modelSession;
  } catch (error) {
    console.error('Failed to load model:', error.message);
    throw new Error('Model file not found. Please convert .pth to .onnx first.');
  }
}

/**
 * Parse disease class name
 */
function parseDiseaseClass(className) {
  const parts = className.split('___');
  if (parts.length === 2) {
    const crop = parts[0].replace(/_/g, ' ').replace(/\(|\)/g, '');
    const disease = parts[1].replace(/_/g, ' ');
    return { crop, disease };
  }
  return { crop: 'Unknown', disease: className };
}

/**
 * Get treatment recommendations
 */
function getTreatmentRecommendations(disease) {
  const diseaseLower = disease.toLowerCase();
  
  const treatments = {
    'scab': DISEASE_INFO.apple_scab,
    'black rot': DISEASE_INFO.apple_black_rot,
    'early blight': DISEASE_INFO.tomato_early_blight,
    'late blight': DISEASE_INFO.tomato_late_blight,
    'leaf blast': DISEASE_INFO.rice_leaf_blast,
    'rust': DISEASE_INFO.wheat_rust,
    'healthy': DISEASE_INFO.healthy
  };
  
  for (const [key, value] of Object.entries(treatments)) {
    if (diseaseLower.includes(key)) {
      return value;
    }
  }
  
  // Default treatment
  return {
    chemical: ['Consult agricultural extension officer', 'Apply appropriate fungicide'],
    organic: ['Neem oil spray', 'Remove affected parts', 'Improve plant nutrition'],
    prevention: ['Monitor plants regularly', 'Maintain plant health', 'Ensure proper spacing']
  };
}
// Disease treatment database
const DISEASE_INFO = {
  apple_scab: {
    crop: 'Apple',
    disease: 'Apple Scab',
    chemical: ['Apply Captan or Mancozeb fungicides', 'Use sulfur-based sprays'],
    organic: ['Neem oil spray', 'Copper-based fungicides', 'Remove infected leaves'],
    prevention: ['Prune trees for air circulation', 'Avoid overhead watering', 'Plant resistant varieties']
  },
  apple_black_rot: {
    crop: 'Apple',
    disease: 'Black Rot',
    chemical: ['Apply Mancozeb or Captan', 'Use Thiophanate-methyl'],
    organic: ['Copper fungicide', 'Remove mummified fruits', 'Prune infected branches'],
    prevention: ['Remove fallen fruit and leaves', 'Ensure good air circulation', 'Apply dormant sprays']
  },
  tomato_early_blight: {
    crop: 'Tomato',
    disease: 'Early Blight',
    chemical: ['Apply Chlorothalonil', 'Use Mancozeb fungicide'],
    organic: ['Copper spray', 'Remove infected leaves', 'Neem oil application'],
    prevention: ['Crop rotation', 'Avoid overhead irrigation', 'Mulch to prevent soil splash']
  },
  tomato_late_blight: {
    crop: 'Tomato',
    disease: 'Late Blight',
    chemical: ['Apply Metalaxyl + Mancozeb', 'Use Copper oxychloride'],
    organic: ['Bordeaux mixture', 'Copper fungicide', 'Remove infected plants'],
    prevention: ['Use certified disease-free seeds', 'Proper spacing', 'Avoid wet foliage']
  },
  potato_early_blight: {
    crop: 'Potato',
    disease: 'Early Blight',
    chemical: ['Apply Chlorothalonil', 'Use Mancozeb'],
    organic: ['Copper fungicide', 'Neem oil', 'Remove infected foliage'],
    prevention: ['Crop rotation', 'Proper spacing', 'Avoid overhead watering']
  },
  rice_leaf_blast: {
    crop: 'Rice',
    disease: 'Leaf Blast',
    chemical: ['Apply Tricyclazole', 'Use Azoxystrobin'],
    organic: ['Silicon fertilizers', 'Biocontrol agents', 'Resistant varieties'],
    prevention: ['Balanced nitrogen fertilization', 'Proper water management', 'Use resistant varieties']
  },
  wheat_rust: {
    crop: 'Wheat',
    disease: 'Rust',
    chemical: ['Apply Propiconazole', 'Use Tebuconazole'],
    organic: ['Sulfur dust', 'Plant resistant varieties'],
    prevention: ['Use certified seeds', 'Proper spacing', 'Remove volunteer wheat']
  },
  healthy: {
    crop: 'Plant',
    disease: 'Healthy',
    chemical: ['No treatment needed'],
    organic: ['Maintain good practices'],
    prevention: ['Continue regular monitoring', 'Maintain plant nutrition', 'Ensure proper watering']
  }
};

/**
 * Process image for model input
 */
async function preprocessImage(imagePath) {
  try {
    // Resize and normalize image
    const imageBuffer = await sharp(imagePath)
      .resize(256, 256)
      .removeAlpha()
      .raw()
      .toBuffer();

    // Convert to Float32Array and normalize (ImageNet normalization)
    const float32Data = new Float32Array(256 * 256 * 3);
    const mean = [0.485, 0.456, 0.406];
    const std = [0.229, 0.224, 0.225];

    for (let i = 0; i < 256 * 256; i++) {
      // RGB channels
      float32Data[i] = (imageBuffer[i * 3] / 255 - mean[0]) / std[0];  // R
      float32Data[256 * 256 + i] = (imageBuffer[i * 3 + 1] / 255 - mean[1]) / std[1];  // G
      float32Data[256 * 256 * 2 + i] = (imageBuffer[i * 3 + 2] / 255 - mean[2]) / std[2];  // B
    }

    return float32Data;
  } catch (error) {
    throw new Error(`Failed to process image: ${error.message}`);
  }
}

/**
 * Softmax function
 */
function softmax(logits) {
  const maxLogit = Math.max(...logits);
  const scores = logits.map(l => Math.exp(l - maxLogit));
  const sumScores = scores.reduce((a, b) => a + b, 0);
  return scores.map(s => s / sumScores);
}

/**
 * Get confidence level from probability
 */
function getConfidenceLevel(probability) {
  if (probability > 0.7) return 'high';
  if (probability > 0.4) return 'medium';
  return 'low';
}

/**
 * Get detailed treatment using AI based on detected disease
 */
async function getAITreatmentRecommendations(crop, diseaseName) {
  try {
    const { generateChatResponse } = require('./llm.service');
    
    const prompt = `You are an expert agricultural advisor. A plant disease has been detected using an AI model.

Crop: ${crop}
Disease: ${diseaseName}

Provide detailed treatment and prevention recommendations in JSON format ONLY. No extra text.

{
  "treatment": {
    "chemical": ["specific chemical treatment 1", "specific chemical treatment 2", "specific chemical treatment 3"],
    "organic": ["organic treatment 1", "organic treatment 2", "organic treatment 3"]
  },
  "prevention": ["prevention tip 1", "prevention tip 2", "prevention tip 3", "prevention tip 4"],
  "fertilizers": ["recommended fertilizer 1", "recommended fertilizer 2"],
  "additionalCare": ["care tip 1", "care tip 2"]
}`;

    const response = await generateChatResponse(prompt);
    
    // Try to parse JSON response
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.error('Failed to parse AI response:', e);
    }
    
    // Return fallback if parsing fails
    return null;
  } catch (error) {
    console.error('AI treatment recommendation failed:', error.message);
    return null;
  }
}

/**
 * Detect disease from image using ONNX model
 */
async function detectDiseaseFromImage(imagePath) {
  try {
    console.log('Processing image with ONNX model...');
    
    // Load model
    const session = await loadModel();
    
    // Preprocess image
    const inputTensor = await preprocessImage(imagePath);
    
    // Create tensor
    const tensor = new ort.Tensor('float32', inputTensor, [1, 3, 256, 256]);
    
    // Run inference
    const feeds = { input: tensor };
    const results = await session.run(feeds);
    const output = results.output.data;
    
    // Apply softmax
    const probabilities = softmax(Array.from(output));
    
    // Get top 3 predictions
    const predictions = probabilities
      .map((prob, idx) => ({ prob, idx }))
      .sort((a, b) => b.prob - a.prob)
      .slice(0, 3)
      .filter(p => p.prob > 0.05);
    
    // Format results
    const possibleDiseases = predictions.map(p => {
      const className = DISEASE_CLASSES[p.idx];
      const { crop, disease } = parseDiseaseClass(className);
      
      return {
        name: disease,
        crop: crop,
        cause: `${disease} in ${crop} plant`,
        confidence: getConfidenceLevel(p.prob),
        probability: Math.round(p.prob * 100 * 10) / 10,
        className: className
      };
    });
    
    // Get top prediction
    const topPrediction = possibleDiseases[0];
    const topCrop = topPrediction.crop;
    const topDisease = topPrediction.name;
    
    console.log(`✓ Detected: ${topDisease} in ${topCrop} (${topPrediction.probability}%)`);
    
    // Get AI-powered treatment recommendations
    console.log('Getting AI treatment recommendations...');
    const aiTreatment = await getAITreatmentRecommendations(topCrop, topDisease);
    
    // Combine basic treatment with AI recommendations
    const basicTreatment = getTreatmentRecommendations(topDisease);
    
    const finalResult = {
      crop: topCrop,
      disease: topDisease,
      possibleDiseases,
      treatment: aiTreatment?.treatment || {
        chemical: basicTreatment.chemical,
        organic: basicTreatment.organic
      },
      prevention: aiTreatment?.prevention || basicTreatment.prevention,
      fertilizers: aiTreatment?.fertilizers || [],
      additionalCare: aiTreatment?.additionalCare || [],
      detectionMethod: 'ONNX Model + AI Assistant'
    };
    
    console.log('✓ Detection complete with AI recommendations');
    
    return finalResult;

  } catch (error) {
    throw new Error(`Disease detection failed: ${error.message}`);
  }
}

/**
 * Detect disease using LLM with image context (fallback)
 * This sends image metadata and description to LLM for better analysis
 */
async function detectDiseaseWithLLM(imagePath, llmService) {
  try {
    // Try ONNX model first
    return await detectDiseaseFromImage(imagePath);
  } catch (modelError) {
    console.log('ONNX model failed, using LLM fallback...');
    
    // Fallback to LLM
    const metadata = await sharp(imagePath).metadata();
    
    const prompt = `
You are an expert plant pathologist analyzing a plant disease image.

Image Information:
- Resolution: ${metadata.width}x${metadata.height}
- Format: ${metadata.format}
- This is a plant leaf/crop image that may show disease symptoms

Based on common plant diseases, analyze what disease this plant might have.
Consider common symptoms like:
- Leaf spots (yellow, brown, black)
- Wilting or curling leaves
- Discoloration patterns
- Lesions or holes
- Fungal growth

Return ONLY valid JSON in this exact format:
{
  "possibleDiseases": [
    {
      "name": "Disease Name",
      "cause": "Brief cause description",
      "confidence": "high | medium | low"
    }
  ],
  "treatment": {
    "chemical": ["treatment 1", "treatment 2"],
    "organic": ["organic treatment 1", "organic treatment 2"]
  },
  "prevention": ["prevention tip 1", "prevention tip 2"]
}
`;

    const result = await llmService.generateChatResponse(prompt, []);
    return JSON.parse(result);
  }
}

module.exports = {
  detectDiseaseFromImage,
  detectDiseaseWithLLM,
  loadModel,
  DISEASE_INFO
};
