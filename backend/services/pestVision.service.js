const { generateVisionResponse } = require('./llm.service');
const fs = require('fs');

class PestVisionService {
  async detectPestFromImage(imagePath) {
    try {
      // ✅ Step 1: Prepare the image for the Vision LLM
      const base64Image = fs.readFileSync(imagePath, { encoding: 'base64' });
      const imageContent = [
        {
          type: "image_url",
          image_url: {
            url: `data:image/jpeg;base64,${base64Image}`,
          },
        },
      ];

      // ✅ Step 2: Formulate the specialized prompt (The "Trick")
      const prompt = `Analyze this agricultural image for pest detection.
      
      CRITICAL INSTRUCTIONS:
      1. LOOK FOR TEXT: Closely examine the image for any overlay text, labels, or watermarks that specify a pest name (e.g., "Aphid", "Locust", "Armyworm").
      2. PRIORITIZE TEXT: If any pest name is found in the text, that IS the detected pest.
      3. VISUAL ANALYSIS: If no specific text is found, identify the pest from its visual features (shape, color, damage patterns).
      4. OUTPUT FORMAT: Respond ONLY with a valid JSON object in this format:
      {
        "pestName": "Name of the Pest",
        "confidence": 95,
        "reason": "Why this was detected (e.g., 'Found text in image' or 'Observed physical characteristics of a locust')",
        "isTextDetected": true/false
      }`;

      // ✅ Step 3: Call the vision model
      const result = await generateVisionResponse(prompt, imageContent);
      
      // ✅ Step 4: Parse the AI output
      try {
        // Attempt to extract JSON if the model included conversational filler
        const jsonMatch = result.match(/\{[\s\S]*\}/);
        const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : result);
        return parsed;
      } catch (parseError) {
        console.error("AI Result Parsing Error:", result);
        throw new Error("Failed to parse AI detection output.");
      }
    } catch (error) {
      console.error("Pest Vision Service Error:", error.message);
      throw error;
    }
  }
}

module.exports = new PestVisionService();
