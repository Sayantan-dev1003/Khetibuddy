# 🚀 Quick Start Guide - KhetiBuddy Chatbot Backend

## Installation (2 minutes)

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Environment is already configured!**
   - ✅ `.env` file exists with Groq API key
   - ✅ MongoDB URI is set
   - ✅ All required variables are configured

3. **Start the server:**
   ```bash
   npm run dev
   ```

4. **Verify it's running:**
   Open browser: http://localhost:5000/health
   
   You should see:
   ```json
   {
     "status": "ok",
     "app": "KhetiBuddy"
   }
   ```

## 🧪 Test the API

### Test 1: Health Check
```bash
curl http://localhost:5000/health
```

### Test 2: Ask a Question (English)
```bash
curl -X POST http://localhost:5000/api/chat/ask \
  -H "Content-Type: application/json" \
  -d "{\"question\":\"How to grow rice?\",\"language\":\"English\"}"
```

### Test 3: Ask a Question (Malayalam)
```bash
curl -X POST http://localhost:5000/api/chat/ask \
  -H "Content-Type: application/json" \
  -d "{\"question\":\"നെല്ല് എങ്ങനെ കൃഷി ചെയ്യാം?\",\"language\":\"Malayalam\"}"
```

### Test 4: Get Chat History
```bash
curl http://localhost:5000/api/chat/history
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/db.js              ✅ MongoDB connection
│   ├── models/ChatQuery.js       ✅ Database schema
│   ├── services/groqService.js   ✅ Groq API integration
│   ├── controllers/chatController.js  ✅ Business logic
│   ├── routes/chatRoutes.js      ✅ API routes
│   ├── middleware/errorHandler.js ✅ Error handling
│   └── index.js                  ✅ Main server
├── .env                          ✅ Environment variables
├── .env.example                  ✅ Template
├── package.json                  ✅ Dependencies
└── README.md                     ✅ Full documentation
```

## 📡 Available Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/api/chat/ask` | Ask AI a question |
| GET | `/api/chat/history` | Get last 20 chats |

## 🎯 What's Working

✅ Groq API integration (Llama 3.1)  
✅ Bilingual support (English & Malayalam)  
✅ Farmer-friendly responses  
✅ MongoDB chat history  
✅ Error handling with fallback  
✅ Input validation  
✅ Clean architecture  

## 🔧 Environment Variables

Already configured in `.env`:
- ✅ PORT=5000
- ✅ NODE_ENV=development
- ✅ MONGODB_URI (connected)
- ✅ CHATBOT_API_KEY (Groq)
- ✅ CHATBOT_MODEL=llama-3.1-8b-instant

## 🎓 Using with Postman

1. **Import endpoints:**
   - GET http://localhost:5000/health
   - POST http://localhost:5000/api/chat/ask
   - GET http://localhost:5000/api/chat/history

2. **For POST /api/chat/ask:**
   - Set Header: `Content-Type: application/json`
   - Body (raw JSON):
     ```json
     {
       "question": "How to grow tomatoes?",
       "language": "English"
     }
     ```

## 🐛 Troubleshooting

### Server won't start
```bash
# Make sure you're in the backend directory
cd backend

# Reinstall dependencies
npm install

# Start server
npm run dev
```

### Port already in use
- Change PORT in `.env` to 5001 or another available port

### MongoDB connection error
- Your MongoDB URI is already configured
- If issues persist, check internet connection
- Verify MongoDB Atlas cluster is running

## 📚 Next Steps

1. ✅ Server is running
2. 🧪 Test all endpoints
3. 📖 Read full [README.md](README.md) for detailed docs
4. 🎨 Connect your frontend
5. 🚀 Deploy when ready

## 💡 Pro Tips

- Use `npm run dev` for development (auto-reload)
- Use `npm start` for production
- Check logs for error messages
- Test with simple questions first
- Both English and Malayalam work out of the box

## 🎉 You're All Set!

The backend is ready to serve AI-powered agricultural advice to farmers!

**Start coding! 🌾**
