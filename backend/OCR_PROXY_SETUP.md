# KhetiBuddy Backend - OCR Proxy Setup Guide

## Overview
The Express backend now includes an OCR proxy endpoint that forwards file uploads to a Python FastAPI service.

## Architecture
```
Frontend → Express (Node.js) → Python FastAPI (OCR)
```

## Endpoint

### POST /api/soil/ocr
Upload soil test report for OCR processing

**Request:**
- Content-Type: `multipart/form-data`
- Field name: `file`
- Accepted formats: JPG, JPEG, PNG, PDF
- Max file size: 10MB

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    // OCR extracted data from Python service
  }
}
```

**Response (No File - 400):**
```json
{
  "success": false,
  "message": "No file uploaded. Please provide a file."
}
```

**Response (Service Down - 503):**
```json
{
  "success": false,
  "message": "OCR service unavailable. Please try again later."
}
```

## Environment Variables

Add to your `.env` file:

```env
# Python OCR Service URL
PYTHON_OCR_URL=http://localhost:8000/api/soil/ocr
```

## File Structure
```
backend/
├── src/
│   ├── middleware/
│   │   └── upload.js              # Multer configuration
│   ├── services/
│   │   └── pythonOcrService.js    # Axios proxy logic
│   ├── controllers/
│   │   └── soilController.js      # OCR endpoint handler
│   ├── routes/
│   │   └── soilRoutes.js          # Route definitions
│   └── index.js                   # Main app (routes added)
└── .env
```

## Testing with Postman/Thunder Client

1. **Create POST request:**
   - URL: `http://localhost:5000/api/soil/ocr`
   - Method: POST
   - Body Type: form-data

2. **Add file:**
   - Key: `file`
   - Type: File
   - Value: Select a soil test report (JPG/PNG/PDF)

3. **Send request**

## Frontend Integration Example

```javascript
async function uploadSoilReport(file) {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await fetch('http://localhost:5000/api/soil/ocr', {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('OCR Data:', result.data);
    } else {
      console.error('Error:', result.message);
    }
  } catch (error) {
    console.error('Upload failed:', error);
  }
}
```

## Error Handling

The proxy handles these scenarios:
- ✅ Missing file → 400 Bad Request
- ✅ Invalid file type → 400 Bad Request (multer)
- ✅ File too large (>10MB) → 413 Payload Too Large (multer)
- ✅ Python service down → 503 Service Unavailable
- ✅ Python service error → Forward Python's error status

## Development Workflow

1. **Start Python OCR service:**
   ```bash
   cd python-ocr-service
   uvicorn main:app --reload --port 8000
   ```

2. **Start Express backend:**
   ```bash
   cd backend
   npm start
   ```

3. **Start frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

## Notes

- Express doesn't perform OCR itself - it's just a proxy
- Files are stored in memory (not saved to disk)
- CORS is enabled for frontend on localhost:3000 and localhost:5173
- 30-second timeout for Python service requests
- All responses from Python are forwarded exactly to frontend

## Troubleshooting

**Issue: "OCR service unavailable"**
- Solution: Make sure Python FastAPI service is running on port 8000

**Issue: "Invalid file type"**
- Solution: Only JPG, JPEG, PNG, PDF are accepted

**Issue: "Payload too large"**
- Solution: File must be under 10MB

**Issue: CORS error**
- Solution: Frontend must be on localhost:3000 or localhost:5173
