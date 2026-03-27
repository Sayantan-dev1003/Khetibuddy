const { generateChatResponse } = require('./llm.service');

const generateFertilizerRecommendation = async ({
  crop,
  soil,
  budgetPreference = 'low'
}) => {

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
    
    Budget Preference:
    ${budgetPreference}
    
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