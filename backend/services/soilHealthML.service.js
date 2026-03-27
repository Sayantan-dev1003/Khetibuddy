const { generateChatResponse } = require('./llm.service');

const detectSoilHealth = async (soil) => {
  const prompt = `
You are a soil science expert.

Analyze soil health based on the given values.
Return ONLY valid JSON.
No extra text.

Soil Parameters:
- Nitrogen (N): ${soil.n}
- Phosphorus (P): ${soil.p}
- Potassium (K): ${soil.k}
- pH: ${soil.ph}
- Organic Carbon (%): ${soil.organicCarbon}
- Moisture (%): ${soil.moisture}

Rules:
- Identify soil health level (Good / Moderate / Poor)
- Give a soil health score (0–100)
- List major soil problems
- Suggest improvements
- Suggest suitable crops

Return JSON format:

{
  "soilHealth": "",
  "score": 0,
  "issues": [],
  "recommendations": [],
  "cropSuitability": []
}
`;

  return await generateChatResponse(prompt, []);
};

module.exports = { detectSoilHealth };
