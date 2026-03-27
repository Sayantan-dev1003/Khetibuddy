# News Ticker Feature - Implementation Guide

## Overview
Added a real-time "News Highlights" ticker to the KhetiBuddy dashboard that displays farmer-related government updates and agriculture news in an auto-scrolling, mobile-friendly format.

## Features Implemented

### 1. Backend API (`GET /api/news`)
- **Endpoint**: `http://localhost:3000/api/news?state=all|gujarat|kerala`
- **Response Format**:
```json
{
  "source": "rss|cache|stale-cache|fallback",
  "updatedAt": "2026-01-24T10:30:00.000Z",
  "items": [
    {
      "title": "News headline text",
      "link": "https://example.com/news",
      "publishedAt": "2026-01-24T09:00:00.000Z",
      "source": "PIB"
    }
  ]
}
```

### 2. News Service with Smart Caching
**File**: `backend/services/newsService.js`

**Features**:
- RSS feed fetching from PIB (Press Information Bureau) and Ministry of Agriculture
- 15-minute in-memory cache to reduce API calls
- Automatic filtering for agriculture/farming-related keywords
- Graceful fallback system:
  1. Try RSS feeds (PIB → Agriculture Ministry)
  2. Return cached data if RSS fails
  3. Return stale cache if available
  4. Use curated fallback headlines as last resort

**Fallback Headlines** (10 items):
- PM-KISAN scheme
- Soil Health Card Scheme
- Pradhan Mantri Fasal Bima Yojana
- Kisan Credit Card
- e-NAM Portal
- Paramparagat Krishi Vikas Yojana
- National Agriculture Insurance
- Weather-based Crop Insurance
- Kisan Call Centre (1800-180-1551)
- National Horticulture Board

### 3. Frontend NewsTicker Component
**File**: `frontend/src/components/NewsTicker.jsx`

**Features**:
- ✅ Auto-scrolling ticker (right to left)
- ✅ Pause on hover
- ✅ Large, readable text for farmers
- ✅ Mobile-responsive design
- ✅ Click to open news in new tab
- ✅ Loading skeleton while fetching
- ✅ Error handling with retry button
- ✅ Gradient green background matching KhetiBuddy theme
- ✅ Shows news source badge
- ✅ External link icon on hover
- ✅ Seamless infinite loop (duplicates news items)

**Design**:
- Title: "📰 Farmer Updates"
- Color scheme: Green gradient (matches agricultural theme)
- Font size: Large (18-22px) for readability
- Animation: 60s scroll duration (40s on mobile)

### 4. Dashboard Integration
**File**: `frontend/src/pages/Home.jsx`

The ticker is placed at the top of the dashboard, above all other content, ensuring maximum visibility.

## File Structure

```
backend/
├── services/
│   └── newsService.js         # RSS fetching, caching, fallback logic
├── controllers/
│   └── news.controller.js     # API request handlers
├── routes/
│   └── news.routes.js         # Route definitions
└── server.js                  # Updated with news routes

frontend/
└── src/
    ├── components/
    │   └── NewsTicker.jsx     # Ticker component
    └── pages/
        └── Home.jsx           # Dashboard with ticker
```

## API Endpoints

### Get News
```
GET /api/news?state=all
```

**Query Parameters**:
- `state` (optional): `all`, `gujarat`, `kerala` (currently all states return same feed)

**Response**:
```json
{
  "source": "rss",
  "updatedAt": "2026-01-24T10:30:00.000Z",
  "items": [
    {
      "title": "Government announces new MSP for crops",
      "link": "https://pib.gov.in/...",
      "publishedAt": "2026-01-24T09:00:00.000Z",
      "source": "PIB"
    }
  ]
}
```

### Clear Cache (Admin)
```
POST /api/news/clear-cache
```

**Response**:
```json
{
  "message": "Cache cleared successfully"
}
```

## How It Works

### Backend Flow:
1. **Request** → Controller receives GET /api/news
2. **Cache Check** → Service checks if cache is valid (< 15 min old)
3. **RSS Fetch** (if cache invalid) → Attempts to fetch from PIB RSS
4. **Filtering** → Filters items with keywords: farm, agricul, crop, soil, kisan, rural, msp, food
5. **Cache Update** → Stores successful fetch in memory
6. **Fallback** → Returns cached/static items if RSS fails
7. **Response** → Returns JSON with source indicator

### Frontend Flow:
1. **Component Mount** → NewsTicker fetches from `/api/news`
2. **Loading State** → Shows animated skeleton
3. **Data Received** → Duplicates news items for seamless loop
4. **Auto-scroll** → CSS animation moves ticker right to left
5. **Hover Pause** → Animation pauses when user hovers
6. **Click** → Opens news link in new tab
7. **Error Handling** → Shows retry button if fetch fails

## Configuration

### Backend Cache Settings
Edit `backend/services/newsService.js`:

```javascript
let newsCache = {
  data: null,
  timestamp: null,
  expiryMinutes: 15  // Change cache duration here
};
```

### Frontend Animation Speed
Edit `frontend/src/components/NewsTicker.jsx`:

```javascript
animation: isPaused ? 'none' : 'scroll 60s linear infinite'
// Change 60s to adjust speed (lower = faster)
```

### RSS Feed Sources
Edit `backend/services/newsService.js`:

```javascript
const RSS_FEEDS = {
  pib: 'https://pib.gov.in/rss/topstories.xml',
  agriculture: 'https://agricoop.nic.in/rss/latest-news.xml',
  fallback: 'https://pib.gov.in/rss/topstories.xml'
};
```

## Testing

### Test Backend API:
```bash
# Start backend
cd backend
npm start

# Test news endpoint
curl http://localhost:3000/api/news

# Test with state filter
curl http://localhost:3000/api/news?state=gujarat

# Clear cache
curl -X POST http://localhost:3000/api/news/clear-cache
```

### Test Frontend:
```bash
# Start frontend
cd frontend
npm run dev

# Open browser
# Navigate to http://localhost:5173/dashboard
# Ticker should appear at top
```

## Troubleshooting

### Issue: No news items displayed
**Solution**: Check backend logs for RSS fetch errors. The service will automatically fall back to curated headlines.

### Issue: CORS errors
**Solution**: Ensure backend CORS is configured for frontend URL in `backend/server.js`:
```javascript
const corsOptions = {
  origin: ['http://localhost:5173'],
  // ...
};
```

### Issue: Ticker not scrolling
**Solution**: Check browser console for CSS animation errors. Verify Tailwind CSS is loaded.

### Issue: RSS feeds failing
**Solution**: This is normal - government RSS feeds can be unreliable. The fallback system ensures news is always shown.

## Dependencies Added

### Backend:
```json
{
  "rss-parser": "^3.13.0"
}
```

### Frontend:
- Uses existing Tailwind CSS and React
- Uses `lucide-react` for ExternalLink icon (already installed)

## Performance Considerations

1. **Caching**: 15-minute cache reduces RSS requests from ~240/hour to ~4/hour
2. **Memory**: Cache stores only 10 headlines (~2KB) in memory
3. **Network**: RSS fetch only when cache expires or on server restart
4. **Frontend**: CSS animations use GPU acceleration (transform property)

## Future Enhancements

### Potential Improvements:
1. **MongoDB Caching**: Store news in database for persistence across server restarts
2. **State-specific News**: Implement regional filtering based on state parameter
3. **Admin Panel**: Add UI to manage fallback headlines
4. **Categorization**: Tag news by category (schemes, weather, prices, etc.)
5. **Search**: Allow users to search through news history
6. **Notifications**: Alert users about important updates
7. **Multiple Languages**: Translate headlines to Malayalam/Hindi

### Adding More RSS Sources:
Edit `backend/services/newsService.js`:

```javascript
const RSS_FEEDS = {
  pib: 'https://pib.gov.in/rss/topstories.xml',
  agriculture: 'https://agricoop.nic.in/rss/latest-news.xml',
  icar: 'https://icar.org.in/rss/news.xml',  // Add ICAR
  dam: 'https://dam.gov.in/rss/updates.xml',  // Add DAM
};
```

## Mobile Optimization

The ticker is fully responsive:
- **Desktop**: Full-width with 60s scroll duration
- **Tablet**: Adjusted spacing, 50s scroll
- **Mobile**: Larger touch targets, 40s scroll, hides source badges

## Accessibility

- **Keyboard Navigation**: Links are keyboard-accessible
- **Screen Readers**: Proper semantic HTML with meaningful link text
- **Pause Control**: Hover to pause respects user preference
- **High Contrast**: Green on white text meets WCAG AA standards

## Deployment Notes

### Environment Variables:
```env
# Backend (.env)
PORT=3000
MONGODB_URI=your_mongodb_uri

# Frontend (.env)
VITE_API_URL=http://localhost:3000
```

### Production Considerations:
1. Consider using Redis for distributed caching if using multiple backend instances
2. Implement rate limiting on /api/news endpoint
3. Add monitoring for RSS feed health
4. Set up alerting if fallback headlines are used for >1 hour

## Support

For issues or questions:
1. Check backend logs: `cd backend && npm start`
2. Check frontend console: Browser DevTools → Console
3. Test API directly: `curl http://localhost:3000/api/news`
4. Clear cache: `curl -X POST http://localhost:3000/api/news/clear-cache`

---

**Implementation Date**: January 24, 2026  
**Status**: ✅ Complete and Production Ready  
**Testing**: ✅ Backend API tested, Frontend integration verified
