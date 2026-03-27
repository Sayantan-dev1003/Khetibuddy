const { generateChatResponse } = require('./llm.service');

const detectCropDisease = async ({ crop, symptoms }) => {
  const prompt = `
You are an agriculture plant pathology expert.

Analyze crop disease based on symptoms.
Return ONLY valid JSON.
No explanations outside JSON.

Crop:
${crop}

Observed Symptoms:
${symptoms}

Tasks:
1. Identify most likely disease(s)
2. Explain cause briefly
3. Suggest treatment (chemical + organic)
4. Give prevention tips
5. Mention confidence level

Return JSON in EXACT format:

{
  "possibleDiseases": [
    {
      "name": "",
      "cause": "",
      "confidence": "high | medium | low"
    }
  ],
  "treatment": {
    "chemical": [],
    "organic": []
  },
  "prevention": []
}
`;

  return await generateChatResponse(prompt, []);
};

module.exports = { detectCropDisease };
