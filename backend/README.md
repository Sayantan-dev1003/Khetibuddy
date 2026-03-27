# KhetiBuddy Backend - Chatbot API

A Node.js/Express backend for KhetiBuddy's AI-powered agricultural chatbot using Groq API.

## 🚀 Features

- ✅ AI-powered chatbot using Groq API (Llama 3.1)
- ✅ Bilingual support (English & Malayalam)
- ✅ Farmer-friendly responses with safety warnings
- ✅ Chat history storage in MongoDB
- ✅ Clean architecture with services layer
- ✅ Comprehensive error handling

## 📋 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB Atlas with Mongoose
- **AI API:** Groq (Llama 3.1)
- **Other:** CORS, dotenv

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── models/
│   │   └── ChatQuery.js           # Chat schema
│   ├── routes/
│   │   └── chatRoutes.js          # Chat endpoints
│   ├── controllers/
│   │   └── chatController.js      # Business logic
│   ├── services/
│   │   └── groqService.js         # Groq API integration
│   ├── middleware/
│   │   └── errorHandler.js        # Error handling
│   └── index.js                   # Main server file
├── .env                           # Environment variables (create this)
├── .env.example                   # Environment template
├── package.json
└── README.md
```

## 🛠️ Installation

### Prerequisites

- Node.js v16+
- MongoDB Atlas account
- Groq API key

### Steps

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Setup environment variables:**
   ```bash
   cp .env.example .env
   ```

3. **Configure .env file:**
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=your_mongodb_atlas_connection_string
   CHATBOT_API_KEY=your_groq_api_key
   CHATBOT_MODEL=llama-3.1-8b-instant
   ```

4. **Get your API keys:**

   **MongoDB Atlas (Free):**
   - Visit: https://www.mongodb.com/cloud/atlas/register
   - Create a free cluster
   - Go to Database → Connect → Connect your application
   - Copy the connection string
   - Replace `<password>` with your database password

   **Groq API Key (Free):**
   - Visit: https://console.groq.com/
   - Sign up/Login
   - Go to API Keys section
   - Create a new API key
   - Copy the key

5. **Start the server:**
   ```bash
   # Development mode (auto-reload)
   npm run dev

   # Production mode
   npm start
   ```

6. **Verify it's running:**
   ```bash
   curl http://localhost:5000/health
   ```
   
   Expected response:
   ```json
   {
     "status": "ok",
     "app": "KhetiBuddy"
   }
   ```

## 📡 API Endpoints

### 1. Health Check

```http
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "app": "KhetiBuddy"
}
```

### 2. Ask Question

```http
POST /api/chat/ask
Content-Type: application/json
```

**Request Body:**
```json
{
  "question": "How do I grow tomatoes in summer?",
  "language": "English"
}
```

**Validation:**
- `question`: Required, max 500 characters
- `language`: Required, must be "English" or "Malayalam"

**Response (200 OK):**
```json
{
  "success": true,
  "answer": "To grow tomatoes in summer:\n\n1. Choose heat-tolerant varieties...",
  "language": "English",
  "createdAt": "2026-01-23T10:30:00.000Z",
  "source": "groq"
}
```

**Malayalam Example:**
```json
{
  "question": "എങ്ങനെ തക്കാളി വളർത്താം?",
  "language": "Malayalam"
}
```

**Error Responses:**

Missing question (400):
```json
{
  "success": false,
  "message": "Question is required"
}
```

Question too long (400):
```json
{
  "success": false,
  "message": "Question cannot exceed 500 characters"
}
```

Invalid language (400):
```json
{
  "success": false,
  "message": "Language must be either \"English\" or \"Malayalam\""
}
```

### 3. Get Chat History

```http
GET /api/chat/history
```

**Response (200 OK):**
```json
{
  "success": true,
  "count": 20,
  "data": [
    {
      "_id": "65b1234567890abcdef12345",
      "question": "How do I grow tomatoes in summer?",
      "language": "English",
      "answer": "To grow tomatoes in summer...",
      "model": "llama-3.1-8b-instant",
      "createdAt": "2026-01-23T10:30:00.000Z"
    },
    {
      "_id": "65b1234567890abcdef12346",
      "question": "എങ്ങനെ തക്കാളി വളർത്താം?",
      "language": "Malayalam",
      "answer": "വേനൽക്കാലത്ത് തക്കാളി വളർത്താൻ...",
      "model": "llama-3.1-8b-instant",
      "createdAt": "2026-01-23T10:25:00.000Z"
    }
  ]
}
```

**Features:**
- Returns last 20 chats
- Sorted by newest first
- Includes question, answer, language, model, and timestamp

## 🧪 Testing with Postman/cURL

### Test Health Endpoint

```bash
curl http://localhost:5000/health
```

### Test Ask Question (English)

```bash
curl -X POST http://localhost:5000/api/chat/ask \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What is the best time to plant rice?",
    "language": "English"
  }'
```

### Test Ask Question (Malayalam)

```bash
curl -X POST http://localhost:5000/api/chat/ask \
  -H "Content-Type: application/json" \
  -d '{
    "question": "നെല്ല് നടാനുള്ള ഏറ്റവും നല്ല സമയം ഏതാണ്?",
    "language": "Malayalam"
  }'
```

### Test Chat History

```bash
curl http://localhost:5000/api/chat/history
```

### Postman Collection

1. **Create new collection**: "KhetiBuddy Chatbot"
2. **Add requests:**
   - GET Health Check
   - POST Ask Question (English)
   - POST Ask Question (Malayalam)
   - GET Chat History
3. **Set base URL**: `http://localhost:5000`

## 🎯 Key Features

### Farmer-Friendly Responses

The chatbot is configured to provide:
- ✅ Simple, easy-to-understand language
- ✅ Step-by-step instructions
- ✅ Short, actionable advice
- ✅ Safety warnings for pesticides/chemicals
- ✅ Recommendations to consult local experts for serious issues
- ✅ Context-aware responses for Indian agriculture

### Error Handling

- Automatic fallback responses if Groq API fails
- Comprehensive input validation
- User-friendly error messages
- Detailed error logs for debugging

### Database

All chat interactions are stored in MongoDB with:
- Question and answer
- Language preference
- Model used
- Timestamp

## 🔧 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | 5000 |
| `NODE_ENV` | Environment mode | No | development |
| `MONGODB_URI` | MongoDB connection string | Yes | - |
| `CHATBOT_API_KEY` | Groq API key | Yes | - |
| `CHATBOT_MODEL` | Groq model name | No | llama-3.1-8b-instant |

## 🐛 Troubleshooting

### Server won't start

1. Check if MongoDB URI is correct
2. Verify Groq API key is set
3. Ensure port 5000 is not in use
4. Run: `npm install` to install dependencies

### MongoDB connection error

- Verify MongoDB Atlas cluster is running
- Check IP whitelist (add 0.0.0.0/0 for testing)
- Ensure database user has read/write permissions
- Confirm password in connection string is correct

### Groq API errors

- Verify `CHATBOT_API_KEY` is correct
- Check API quota/limits in Groq console
- Server will use fallback responses automatically
- Review error logs for details

### Cannot get responses

- Check if `.env` file exists
- Verify all environment variables are set
- Ensure MongoDB is connected
- Test with simple questions first

## 📊 Database Schema

### ChatQuery Model

```javascript
{
  question: String (required, max 500 chars),
  language: String (required, enum: ['English', 'Malayalam']),
  answer: String (required),
  model: String (required, default: 'llama-3.1-8b-instant'),
  createdAt: Date (default: now)
}
```

**Indexes:**
- `createdAt: -1` for efficient history queries

## 🚀 Deployment

### Environment Setup

For production deployment:
1. Set `NODE_ENV=production`
2. Use production MongoDB cluster
3. Secure API keys
4. Enable HTTPS
5. Add rate limiting (recommended)

### Supported Platforms

- Heroku
- Railway
- Render
- AWS EC2
- DigitalOcean
- Any Node.js hosting

## 🔐 Security Notes

- Never commit `.env` file
- Keep API keys secure
- Enable MongoDB authentication
- Use HTTPS in production
- Implement rate limiting
- Add authentication if needed

## 📝 Available Scripts

```bash
# Install dependencies
npm install

# Run in development mode (auto-reload)
npm run dev

# Run in production mode
npm start
```

## 🎓 Code Structure

### Services Layer

The `groqService.js` handles all AI interactions:
- System prompt generation
- API calls to Groq
- Fallback responses
- Error handling

### Controllers

The `chatController.js` handles:
- Input validation
- Calling AI service
- Saving to database
- Response formatting

### Middleware

The `errorHandler.js` provides:
- Centralized error handling
- Validation error formatting
- User-friendly error messages

## 🔄 Future Enhancements

- [ ] Rate limiting
- [ ] User authentication
- [ ] Message pagination
- [ ] Search in history
- [ ] Export chat history
- [ ] Multiple model support
- [ ] Response caching

## 📞 Support

For issues or questions:
- Check this README
- Review error logs
- Verify environment variables
- Test with Postman/cURL

## 📄 License

MIT

---

**Built with ❤️ for Indian Farmers**

*Empowering farmers with AI-powered agricultural advice in their native language.*
