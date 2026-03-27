const { generateChatResponse } = require('./llm.service');
const fs = require('fs');
const path = require('path');

let fertilizerData = [];

// Load CSV into memory
const loadCSV = () => {
  if (fertilizerData.length > 0) return fertilizerData;
  try {
    const filePath = path.join(__dirname, '../fertilizer_recommendation.csv');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const lines = fileContent.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const values = line.split(',');
        const row = {};
        headers.forEach((h, index) => {
            row[h] = values[index];
        });
        fertilizerData.push(row);
    }
    return fertilizerData;
  } catch (err) {
    console.error('Error loading fertilizer CSV:', err);
    return [];
  }
};

const findBestMatch = (crop, soil) => {
    const data = loadCSV();
    if (!data.length) return null;

    // Filter by crop (case insensitive)
    let filtered = data.filter(r => r.Crop_Type && r.Crop_Type.toLowerCase() === crop.toLowerCase());
    
    // If no crop matches exactly, use all data
    if (filtered.length === 0) {
        filtered = data;
    }

    // Evaluate distance based on N, P, K, pH
    let bestMatch = null;
    let minDistance = Infinity;

    filtered.forEach(row => {
        let dist = 0;
        let validFields = 0;
        if (soil.n && row.Nitrogen_Level) {
            dist += Math.pow(Number(soil.n) - Number(row.Nitrogen_Level), 2);
            validFields++;
        }
        if (soil.p && row.Phosphorus_Level) {
            dist += Math.pow(Number(soil.p) - Number(row.Phosphorus_Level), 2);
            validFields++;
        }
        if (soil.k && row.Potassium_Level) {
            dist += Math.pow(Number(soil.k) - Number(row.Potassium_Level), 2);
            validFields++;
        }
        if (soil.ph && row.Soil_pH) {
            // scale pH difference since it's typically 0-14 vs 0-100 for nutrients
            dist += Math.pow((Number(soil.ph) - Number(row.Soil_pH)) * 10, 2); 
            validFields++;
        }

        if (validFields > 0) {
           let avgDist = dist / validFields;
           
           // If soil type matches exactly, reduce distance (bonus)
           if (soil.soilType && row.Soil_Type && soil.soilType.toLowerCase() === row.Soil_Type.toLowerCase()) {
               avgDist = avgDist * 0.8; 
           }

           if (avgDist < minDistance) {
               minDistance = avgDist;
               bestMatch = row;
           }
        }
    });

    if (!bestMatch && filtered.length > 0) {
        bestMatch = filtered[0];
    }

    return bestMatch;
};

const generateFertilizerRecommendation = async ({
  crop,
  soil,
  budgetPreference = 'low'
}) => {

    const bestMatch = findBestMatch(crop, soil);
    let historicalDataText = '';
    if (bestMatch) {
       historicalDataText = `
    Based on a historical agricultural dataset, the best matching scenario for these soil conditions recommends: ${bestMatch.Recommended_Fertilizer}. 
    The dataset row details:
    - Crop: ${bestMatch.Crop_Type}
    - Soil Type: ${bestMatch.Soil_Type}
    - N: ${bestMatch.Nitrogen_Level}, P: ${bestMatch.Phosphorus_Level}, K: ${bestMatch.Potassium_Level}, pH: ${bestMatch.Soil_pH}
    - Recommended Fertilizer: ${bestMatch.Recommended_Fertilizer}
    
    Please utilize this historical recommendation when generating the primary fertilizer suggestion, and adjust the exact advice based on this empirical data.
    `;
    }

    const prompt = `
    You are an agriculture expert AI.
    
    You MUST return ONLY valid JSON.
    DO NOT add explanations, headings, or text outside JSON.
    DO NOT use markdown.
    DO NOT add comments.
    
    If information is missing, make reasonable assumptions.
    
    Crop:
    ${crop}
    
    Soil Test Values:
    - Nitrogen (N): ${soil.n ?? 'unknown'}
    - Phosphorus (P): ${soil.p ?? 'unknown'}
    - Potassium (K): ${soil.k ?? 'unknown'}
    - pH: ${soil.ph ?? 'unknown'}
    - Type: ${soil.soilType ?? 'unknown'}
    
    Budget Preference:
    ${budgetPreference}
    
    ${historicalDataText}
    
    Return JSON in EXACTLY this format:
    
    {
      "primaryFertilizers": [
        {
          "name": "string",
          "nutrient": "string",
          "reason": "string"
        }
      ],
      "lowCostAlternatives": [
        {
          "name": "string",
          "replaces": "string",
          "whyCheaper": "string",
          "usageTip": "string"
        }
      ],
      "generalAdvice": ["string"]
    }
    `;
    

  const response = await generateChatResponse(prompt, []);
  return response;
};

module.exports = { generateFertilizerRecommendation };