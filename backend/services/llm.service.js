const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * Detect the language of user input
 * @param {string} text - User's message
 * @returns {string} - Detected language code (en, hi, ml)
 */
function detectLanguage(text) {
  // Hindi detection: Devanagari script (U+0900 to U+097F)
  const hindiPattern = /[\u0900-\u097F]/;
  
  // Malayalam detection: Malayalam script (U+0D00 to U+0D7F)
  const malayalamPattern = /[\u0D00-\u0D7F]/;
  
  if (hindiPattern.test(text)) {
    return 'hi'; // Hindi
  }
  
  if (malayalamPattern.test(text)) {
    return 'ml'; // Malayalam
  }
  
  // Hinglish detection: Hindi words written in Latin script
  // Common Hindi words that indicate Hinglish
  const hinglishWords = [
    // Common words
    'mujhe', 'mere', 'mera', 'meri', 'kya', 'hai', 'hain', 'tha', 'thi', 'the',
    'kaise', 'kahan', 'kab', 'kyun', 'kaun', 'kis', 'koi', 'kuch',
    // Agricultural terms
    'khet', 'kheti', 'fasal', 'beej', 'pani', 'mitti', 'khad',
    // Verbs
    'chahiye', 'chahta', 'chahti', 'karna', 'karo', 'kare', 'hona', 'ho',
    'aana', 'aao', 'jaana', 'jao', 'dena', 'do', 'lena', 'lo',
    // Question words
    'kaunsi', 'kaunsa', 'kitna', 'kitni', 'kitne',
    // Other common
    'acha', 'accha', 'thik', 'theek', 'nahi', 'nahin', 'haan', 'ji'
  ];
  
  const textLower = text.toLowerCase();
  
  // Check if text contains multiple Hinglish words
  let hinglishWordCount = 0;
  for (const word of hinglishWords) {
    // Use word boundary to match whole words
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    if (regex.test(textLower)) {
      hinglishWordCount++;
    }
  }
  
  // If 2 or more Hinglish words found, treat as Hindi
  if (hinglishWordCount >= 2) {
    return 'hi'; // Hinglish → Hindi response
  }
  
  // Default to English
  return 'en';
}

/**
 * Get language-specific system prompt
 * @param {string} language - Language code (en, hi, ml)
 * @returns {string} - System prompt in the appropriate language
 */
function getSystemPrompt(language) {
  const prompts = {
    en: `You are KhetiBuddy, a helpful agricultural AI assistant for farmers.

IMPORTANT RULES:
1. Respond ONLY in ENGLISH
2. Provide practical farming advice
3. Be friendly and supportive
4. Keep responses clear and concise
5. Focus on Indian agriculture context

You help with:
- Crop diseases and pest management
- Fertilizer recommendations
- Weather and irrigation guidance
- Best farming practices
- Crop selection and planning`,

    hi: `आप KhetiBuddy हैं, किसानों के लिए एक सहायक कृषि AI सहायक हैं।

महत्वपूर्ण नियम:
1. केवल हिंदी में जवाब दें
2. व्यावहारिक खेती की सलाह दें
3. मित्रवत और सहायक बनें
4. जवाब स्पष्ट और संक्षिप्त रखें
5. भारतीय कृषि संदर्भ पर ध्यान दें

आप इनमें मदद करते हैं:
- फसल रोग और कीट प्रबंधन
- उर्वरक सिफारिशें
- मौसम और सिंचाई मार्गदर्शन
- सर्वोत्तम खेती प्रथाएं
- फसल चयन और योजना`,

    ml: `നിങ്ങൾ KhetiBuddy ആണ്, കർഷകർക്കുള്ള സഹായകരമായ കാർഷിക AI സഹായി.

പ്രധാന നിയമങ്ങൾ:
1. മലയാളത്തിൽ മാത്രം മറുപടി നൽകുക
2. പ്രായോഗിക കൃഷി ഉപദേശം നൽകുക
3. സൗഹൃദപരവും സഹായകരവും ആയിരിക്കുക
4. മറുപടികൾ വ്യക്തവും സംക്ഷിപ്തവും ആയിരിക്കണം
5. ഇന്ത്യൻ കാർഷിക സന്ദർഭത്തിൽ ശ്രദ്ധ കേന്ദ്രീകരിക്കുക

നിങ്ങൾ ഇതിൽ സഹായിക്കുന്നു:
- വിള രോഗങ്ങളും കീടനിയന്ത്രണവും
- വളം ശുപാർശകൾ
- കാലാവസ്ഥയും ജലസേചന മാർഗ്ഗനിർദ്ദേശവും
- മികച്ച കൃഷി രീതികൾ
- വിള തിരഞ്ഞെടുപ്പും ആസൂത്രണവും`
  };

  return prompts[language] || prompts.en;
}

/**
 * Get language instruction for the model
 * @param {string} language - Language code
 * @returns {string} - Instruction text
 */
function getLanguageInstruction(language) {
  const instructions = {
    en: '\n\nIMPORTANT: Respond in ENGLISH only.',
    hi: '\n\nमहत्वपूर्ण: केवल हिंदी में जवाब दें।',
    ml: '\n\nപ്രധാനം: മലയാളത്തിൽ മാത്രം മറുപടി നൽകുക.'
  };

  return instructions[language] || instructions.en;
}

/**
 * Generate chat response with vision model support
 * @param {string} userMessage - Text prompt
 * @param {Array} content - Array of content blocks (text and/or images)
 * @param {Array} previousMessages - Previous conversation messages
 * @returns {Promise<string>} - LLM response
 */
const generateVisionResponse = async (userMessage, content = null) => {
  try {
    console.log('🖼️ Using vision model for image analysis');

    // Build message content
    let messageContent;
    
    if (content && Array.isArray(content)) {
      // Vision request with images
      messageContent = [
        { type: 'text', text: userMessage },
        ...content
      ];
    } else {
      // Text-only request
      messageContent = userMessage;
    }

    const messages = [
      { role: "user", content: messageContent }
    ];

    const completion = await groq.chat.completions.create({
      model: "llama-3.2-90b-vision-preview", // Updated to working vision model
      temperature: 0.1, // Lower temperature for more consistent validation
      max_tokens: 500,
      messages,
    });

    return completion.choices[0]?.message?.content || "Unable to analyze image";
  } catch (error) {
    console.error("VISION MODEL ERROR:", error.message);
    throw new Error(`Vision analysis failed: ${error.message}`);
  }
};

const generateChatResponse = async (
  userMessage,
  previousMessages = []
) => {
  try {
    // Detect language from user's message
    const detectedLanguage = detectLanguage(userMessage);
    console.log(`🌐 Detected language: ${detectedLanguage} (${
      detectedLanguage === 'hi' ? 'Hindi' : 
      detectedLanguage === 'ml' ? 'Malayalam' : 
      'English'
    })`);

    // Get appropriate system prompt
    const systemPrompt = getSystemPrompt(detectedLanguage);
    const languageInstruction = getLanguageInstruction(detectedLanguage);

    // Add language instruction to user message
    const enhancedMessage = userMessage + languageInstruction;

    const messages = [
      { role: "system", content: systemPrompt },
      ...previousMessages,
      { role: "user", content: enhancedMessage }
    ];

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      temperature: 0.5,
      messages,
    });

    return completion.choices[0]?.message?.content || 
      (detectedLanguage === 'hi' ? "मुझे यकीन नहीं है कि इसका जवाब कैसे दूं।" :
       detectedLanguage === 'ml' ? "എങ്ങനെ മറുപടി നൽകണമെന്ന് എനിക്ക് ഉറപ്പില്ല." :
       "I'm not sure how to respond to that.");
  } catch (error) {
    console.error("GROQ ERROR:", error.message);
    const errorMessages = {
      en: "⚠️ Chatbot is currently unavailable. Please try again.",
      hi: "⚠️ चैटबॉट वर्तमान में अनुपलब्ध है। कृपया पुनः प्रयास करें।",
      ml: "⚠️ ചാറ്റ്ബോട്ട് നിലവിൽ ലഭ്യമല്ല. ദയവായി വീണ്ടും ശ്രമിക്കുക."
    };
    
    const detectedLanguage = detectLanguage(userMessage || '');
    return errorMessages[detectedLanguage] || errorMessages.en;
  }
};

module.exports = {
  generateChatResponse,
  generateVisionResponse,
  detectLanguage,
  getSystemPrompt
};
