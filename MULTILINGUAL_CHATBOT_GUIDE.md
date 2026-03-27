# Multilingual Chatbot - Test Guide

## 🌐 Supported Languages

The chatbot now automatically detects and responds in:
- **English** (en)
- **हिंदी Hindi** (hi)
- **മലയാളം Malayalam** (ml)

## How It Works

### 1. Automatic Language Detection
The chatbot detects the language based on the script (characters) used:

- **Devanagari script** (०-९, अ-ह) → Hindi response
- **Malayalam script** (അ-ഹ) → Malayalam response
- **Latin script** (A-Z, a-z) → English response

### 2. Language-Specific System Prompts
Each language has its own system prompt with:
- Role description (KhetiBuddy agricultural assistant)
- Response guidelines
- Agricultural context focus
- Supported topics

### 3. Context-Aware Responses
The chatbot maintains conversation history and responds in the same language throughout the conversation.

## Test Examples

### English 🇬🇧
**User:** "What fertilizer should I use for tomato plants?"

**Expected Response:** (in English)
```
For tomato plants, I recommend using a balanced NPK fertilizer...
```

---

### Hindi 🇮🇳
**User:** "टमाटर के पौधों के लिए कौन सी खाद इस्तेमाल करनी चाहिए?"

**Expected Response:** (in Hindi)
```
टमाटर के पौधों के लिए, मैं संतुलित NPK उर्वरक की सिफारिश करता हूं...
```

---

### Malayalam 🇮🇳
**User:** "തക്കാളി ചെടികൾക്ക് ഏത് വളം ഉപയോഗിക്കണം?"

**Expected Response:** (in Malayalam)
```
തക്കാളി ചെടികൾക്ക്, ഞാൻ സമതുലിതമായ NPK വളം ശുപാർശ ചെയ്യുന്നു...
```

---

## Testing via API

### Create Session
```bash
curl -X POST http://localhost:3000/api/chat/session
```

Response:
```json
{
  "success": true,
  "sessionId": "uuid-here"
}
```

### Send English Message
```bash
curl -X POST http://localhost:3000/api/chat/messages \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "your-session-id",
    "message": "How to grow rice?"
  }'
```

### Send Hindi Message
```bash
curl -X POST http://localhost:3000/api/chat/messages \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "your-session-id",
    "message": "धान कैसे उगाएं?"
  }'
```

### Send Malayalam Message
```bash
curl -X POST http://localhost:3000/api/chat/messages \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "your-session-id",
    "message": "നെല്ല് എങ്ങനെ വളർത്താം?"
  }'
```

## Backend Logs

When a message is received, the backend logs:

```
[Chat] Session abc-123: User asked: धान कैसे उगाएं?...
[Chat] Detected language: Hindi
🌐 Detected language: hi (Hindi)
[Chat] Saved user message with ID: 507f1f77...
[Chat] Saved bot response with ID: 507f191e...
```

## Language Detection Rules

### Hindi Detection
```javascript
// Devanagari Unicode range: U+0900 to U+097F
// Includes: अ आ इ ई उ ऊ... क ख ग घ... 
```

**Examples:**
- "नमस्ते" → Detected as Hindi
- "खेती कैसे करें?" → Detected as Hindi
- "टमाटर" → Detected as Hindi

### Malayalam Detection
```javascript
// Malayalam Unicode range: U+0D00 to U+0D7F
// Includes: അ ആ ഇ ഈ ഉ ഊ... ക ഖ ഗ ഘ...
```

**Examples:**
- "നമസ്കാരം" → Detected as Malayalam
- "കൃഷി എങ്ങനെ?" → Detected as Malayalam
- "തക്കാളി" → Detected as Malayalam

### English Detection
```javascript
// Default: No Hindi or Malayalam characters
// Latin script: A-Z, a-z
```

**Examples:**
- "Hello" → Detected as English
- "How to farm?" → Detected as English
- "Tomato" → Detected as English

## Mixed Language Handling

If a message contains multiple scripts, the first detected script wins:

**Example:**
- "टमाटर के बारे में बताओ (tomato)" → Detected as Hindi
- "Tell me about തക്കാളി" → Detected as English
- "തക്കാളി について tell me" → Detected as Malayalam

## Error Messages

Error messages are also language-specific:

| Language | Error Message |
|----------|--------------|
| English | ⚠️ Chatbot is currently unavailable. Please try again. |
| Hindi | ⚠️ चैटबॉट वर्तमान में अनुपलब्ध है। कृपया पुनः प्रयास करें। |
| Malayalam | ⚠️ ചാറ്റ്ബോട്ട് നിലവിൽ ലഭ്യമല്ല. ദയവായി വീണ്ടും ശ്രമിക്കുക. |

## System Prompts

### English System Prompt
```
You are KhetiBuddy, a helpful agricultural AI assistant for farmers.

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
- Crop selection and planning
```

### Hindi System Prompt
```
आप KhetiBuddy हैं, किसानों के लिए एक सहायक कृषि AI सहायक हैं।

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
- फसल चयन और योजना
```

### Malayalam System Prompt
```
നിങ്ങൾ KhetiBuddy ആണ്, കർഷകർക്കുള്ള സഹായകരമായ കാർഷിക AI സഹായി.

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
- വിള തിരഞ്ഞെടുപ്പും ആസൂത്രണവും
```

## Sample Conversations

### English Conversation
```
User: Hello, how are you?
Bot: Hello! I'm doing well, thank you. I'm KhetiBuddy, your agricultural assistant. How can I help you with your farming today?

User: I want to grow tomatoes
Bot: Great choice! Tomatoes are a popular crop. Here's what you need to know:
- Season: Best grown in winter-spring (Oct-March)
- Soil: Well-drained loamy soil with pH 6-7
- Spacing: 60cm between rows, 45cm between plants
- Water: Regular irrigation, avoid waterlogging
Would you like more specific guidance?
```

### Hindi Conversation
```
User: नमस्ते, आप कैसे हैं?
Bot: नमस्ते! मैं ठीक हूं, धन्यवाद। मैं KhetiBuddy हूं, आपका कृषि सहायक। मैं आपकी खेती में आज कैसे मदद कर सकता हूं?

User: मैं टमाटर उगाना चाहता हूं
Bot: बढ़िया विकल्प! टमाटर एक लोकप्रिय फसल है। यहाँ जानने योग्य बातें हैं:
- मौसम: सर्दी-वसंत में सबसे अच्छा (अक्टूबर-मार्च)
- मिट्टी: pH 6-7 के साथ अच्छी निकासी वाली दोमट मिट्टी
- दूरी: पंक्तियों के बीच 60 सेमी, पौधों के बीच 45 सेमी
- पानी: नियमित सिंचाई, जल भराव से बचें
क्या आपको अधिक विशिष्ट मार्गदर्शन चाहिए?
```

### Malayalam Conversation
```
User: നമസ്കാരം, സുഖമാണോ?
Bot: നമസ്കാരം! എനിക്ക് സുഖമാണ്, നന്ദി. ഞാൻ KhetiBuddy ആണ്, നിങ്ങളുടെ കാർഷിക സഹായി. ഇന്ന് നിങ്ങളുടെ കൃഷിയിൽ ഞാൻ എങ്ങനെ സഹായിക്കും?

User: ഞാൻ തക്കാളി വളർത്താൻ ആഗ്രഹിക്കുന്നു
Bot: മികച്ച തിരഞ്ഞെടുപ്പ്! തക്കാളി ഒരു ജനപ്രിയ വിളയാണ്. അറിയേണ്ട കാര്യങ്ങൾ ഇതാ:
- സീസൺ: മഞ്ഞുകാലം-വസന്തം (ഒക്ടോബർ-മാർച്ച്)
- മണ്ണ്: pH 6-7 ഉള്ള നല്ല ഡ്രെയിനേജ് ഉള്ള പശിമരാശി മണ്ണ്
- അകലം: വരികൾക്കിടയിൽ 60cm, ചെടികൾക്കിടയിൽ 45cm
- വെള്ളം: പതിവ് ജലസേചനം, വെള്ളക്കെട്ട് ഒഴിവാക്കുക
കൂടുതൽ നിർദ്ദിഷ്ട മാർഗ്ഗനിർദ്ദേശം വേണോ?
```

## Testing from Frontend

Open the Chatbot page and test with:

1. **English**: "What crops grow well in monsoon?"
2. **Hindi**: "बारिश के मौसम में कौन सी फसलें अच्छी होती हैं?"
3. **Malayalam**: "മഴക്കാലത്ത് ഏതൊക്കെ വിളകൾ നന്നായി വളരും?"

Each should get a response in the same language!

## Features

✅ Automatic language detection  
✅ Script-based identification (Devanagari, Malayalam, Latin)  
✅ Language-specific system prompts  
✅ Context-aware responses  
✅ Multilingual error messages  
✅ Conversation history support  
✅ Agricultural focus in all languages  

## Status

✅ Backend server running  
✅ Multilingual support active  
✅ Language detection working  
✅ Ready for testing  

**Test the chatbot now in your preferred language!** 🌐
