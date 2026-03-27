const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ---------------------------------------------------------------------------
// Script-range → language name map (for log readability only)
// This is NOT used to restrict the LLM. The detection is purely for logging.
// ---------------------------------------------------------------------------
const SCRIPT_PATTERNS = [
  { pattern: /[\u0900-\u097F]/, name: 'Hindi/Devanagari' },
  { pattern: /[\u0D00-\u0D7F]/, name: 'Malayalam' },
  { pattern: /[\u0B80-\u0BFF]/, name: 'Tamil' },
  { pattern: /[\u0C00-\u0C7F]/, name: 'Telugu' },
  { pattern: /[\u0C80-\u0CFF]/, name: 'Kannada' },
  { pattern: /[\u0980-\u09FF]/, name: 'Bengali' },
  { pattern: /[\u0A00-\u0A7F]/, name: 'Gurmukhi/Punjabi' },
  { pattern: /[\u0A80-\u0AFF]/, name: 'Gujarati' },
  { pattern: /[\u0B00-\u0B7F]/, name: 'Odia' },
  { pattern: /[\u0600-\u06FF]/, name: 'Arabic/Urdu' },
  { pattern: /[\u3040-\u30FF\u4E00-\u9FFF]/, name: 'Japanese/Chinese' },
  { pattern: /[\u1100-\u11FF\uAC00-\uD7AF]/, name: 'Korean' },
  { pattern: /[\u0400-\u04FF]/, name: 'Russian/Cyrillic' },
  { pattern: /[\u0370-\u03FF]/, name: 'Greek' },
];

/**
 * Detect the script/language of user input for logging purposes.
 * Returns a human-readable name; used only in console.log().
 * @param {string} text
 * @returns {string} - e.g. 'Malayalam', 'Hindi/Devanagari', 'Latin/English'
 */
function detectLanguage(text) {
  for (const { pattern, name } of SCRIPT_PATTERNS) {
    if (pattern.test(text)) return name;
  }

  // Hinglish heuristic — keep for backwards compatibility
  const hinglishWords = [
    'mujhe', 'mere', 'mera', 'meri', 'kya', 'hai', 'hain', 'tha', 'thi', 'the',
    'kaise', 'kahan', 'kab', 'kyun', 'kaun', 'kis', 'koi', 'kuch',
    'khet', 'kheti', 'fasal', 'beej', 'pani', 'mitti', 'khad',
    'chahiye', 'chahta', 'chahti', 'karna', 'karo', 'kare',
    'acha', 'accha', 'thik', 'theek', 'nahi', 'nahin', 'haan', 'ji'
  ];
  const textLower = text.toLowerCase();
  let hinglishCount = 0;
  for (const word of hinglishWords) {
    if (new RegExp(`\\b${word}\\b`, 'i').test(textLower)) hinglishCount++;
  }
  if (hinglishCount >= 2) return 'Hinglish';

  return 'English/Latin';
}

// ---------------------------------------------------------------------------
// Universal system prompt — works for ALL languages.
// The model is instructed to mirror the user's language automatically.
// ---------------------------------------------------------------------------
const UNIVERSAL_SYSTEM_PROMPT = `You are KhetiBuddy, a helpful agricultural AI assistant for farmers worldwide.

CRITICAL LANGUAGE RULE:
- ALWAYS detect the language of the user's message.
- ALWAYS respond in EXACTLY the same language the user wrote in.
- If the user writes in Hindi, respond in Hindi.
- If the user writes in Tamil, respond in Tamil.
- If the user writes in Spanish, respond in Spanish.
- If the user writes in Bengali, Gujarati, Urdu, Telugu, Kannada, Punjabi, Odia, Arabic, French, Portuguese, Swahili, or ANY other language — respond in that same language.
- If the user mixes Hindi and English in Latin script (Hinglish, e.g. "mujhe crop ke baare mein pata karna tha"), respond in Hinglish — a natural mix of Hindi and English words written in Latin (Roman) script, exactly like the user wrote.
- NEVER switch languages unless the user switches first.
- NEVER say things like "You wrote in English" or "I see you are writing in Hindi" or mention the language at all. Just respond naturally in that language.

YOUR ROLE:
- Provide practical, actionable farming and agriculture advice.
- Be friendly, supportive, and easy to understand.
- Keep responses clear and concise.
- Focus on the local agricultural context relevant to the user.

YOU HELP WITH:
- Crop diseases and pest management
- Fertilizer and soil recommendations
- Irrigation and water management
- Weather-based farming guidance
- Best farming practices
- Crop selection, planning, and harvesting
- Government agricultural schemes and subsidies
- Organic and sustainable farming`;

/**
 * Get the language instruction appended to every user message.
 * This acts as a hard reinforcement even if the system prompt is ignored by the model.
 * @param {string} detectedScript
 * @returns {string}
 */
function getLanguageInstruction(detectedScript) {
  // For scripts we know, we put an explicit instruction.
  // For everything else, a universal "respond in the same language" instruction.
  const scriptInstructions = {
    'Hindi/Devanagari': '\n\n[INSTRUCTION: Respond only in Hindi (हिंदी में जवाब दें)]',
    'Malayalam':        '\n\n[INSTRUCTION: Respond only in Malayalam (മലയാളത്തിൽ മറുപടി നൽകുക)]',
    'Tamil':            '\n\n[INSTRUCTION: Respond only in Tamil (தமிழில் பதில் அளிக்கவும்)]',
    'Telugu':           '\n\n[INSTRUCTION: Respond only in Telugu (తెలుగులో సమాధానం ఇవ్వండి)]',
    'Kannada':          '\n\n[INSTRUCTION: Respond only in Kannada (ಕನ್ನಡದಲ್ಲಿ ಉತ್ತರಿಸಿ)]',
    'Bengali':          '\n\n[INSTRUCTION: Respond only in Bengali (বাংলায় উত্তর দিন)]',
    'Gurmukhi/Punjabi': '\n\n[INSTRUCTION: Respond only in Punjabi (ਪੰਜਾਬੀ ਵਿੱਚ ਜਵਾਬ ਦਿਓ)]',
    'Gujarati':         '\n\n[INSTRUCTION: Respond only in Gujarati (ગુજરાતીમાં જવાબ આપો)]',
    'Odia':             '\n\n[INSTRUCTION: Respond only in Odia (ଓଡ଼ିଆରେ ଉତ୍ତର ଦିଅ)]',
    'Arabic/Urdu':      '\n\n[INSTRUCTION: Respond only in the same language as the user (Arabic or Urdu)]',
    'Hinglish':         '\n\n[INSTRUCTION: The user is writing in Hinglish — a casual mix of Hindi and English in Latin (Roman) script. Reply in the same Hinglish style: mix Hindi and English words naturally, write everything in Roman/Latin script (do NOT use Devanagari). Example style: "Aapke tomato mein early blight disease ho sakti hai. Iske liye copper fungicide spray karein."]',
  };
  return scriptInstructions[detectedScript] ||
    '\n\n[INSTRUCTION: Detect which language the user wrote in and respond ONLY in that exact same language]';
}

// ---------------------------------------------------------------------------
// Vision model — unchanged, used for plant image validation
// ---------------------------------------------------------------------------
const generateVisionResponse = async (userMessage, content = null) => {
  try {
    console.log('🖼️ Using vision model for image analysis');

    let messageContent;
    if (content && Array.isArray(content)) {
      messageContent = [{ type: 'text', text: userMessage }, ...content];
    } else {
      messageContent = userMessage;
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.2-90b-vision-preview",
      temperature: 0.1,
      max_tokens: 500,
      messages: [{ role: "user", content: messageContent }],
    });

    return completion.choices[0]?.message?.content || "Unable to analyze image";
  } catch (error) {
    console.error("VISION MODEL ERROR:", error.message);
    throw new Error(`Vision analysis failed: ${error.message}`);
  }
};

// ---------------------------------------------------------------------------
// Main chat response generator — now fully multilingual
// ---------------------------------------------------------------------------
const generateChatResponse = async (userMessage, previousMessages = []) => {
  try {
    // Detect script/language (logging only)
    const detectedScript = detectLanguage(userMessage);
    console.log(`🌐 Detected script: ${detectedScript}`);

    // Append language reinforcement instruction to the user's message
    const languageInstruction = getLanguageInstruction(detectedScript);
    const enhancedMessage = userMessage + languageInstruction;

    const messages = [
      { role: "system", content: UNIVERSAL_SYSTEM_PROMPT },
      ...previousMessages,
      { role: "user", content: enhancedMessage }
    ];

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      temperature: 0.5,
      messages,
    });

    return completion.choices[0]?.message?.content ||
      "I'm not sure how to respond to that.";

  } catch (error) {
    console.error("GROQ ERROR:", error.message);
    // Universal error message - the LLM itself would normally translate this,
    // but since the API failed we return a simple English message.
    return "⚠️ The assistant is currently unavailable. Please try again in a moment.";
  }
};

module.exports = {
  generateChatResponse,
  generateVisionResponse,
  detectLanguage,
  getSystemPrompt: () => UNIVERSAL_SYSTEM_PROMPT, // backward compat shim
};
