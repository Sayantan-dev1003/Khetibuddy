# Quick Start Guide - Nearby Markets Google Maps Integration

## 🚀 Quick Setup (5 minutes)

### Step 1: Get Your API Key
1. Visit: https://console.cloud.google.com/
2. Create/select a project
3. Enable: **Maps JavaScript API** + **Places API**
4. Create API Key from Credentials

### Step 2: Add API Key
Edit `frontend/.env`:
```env
VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

### Step 3: Run
```bash
cd frontend
npm run dev
```

Visit: http://localhost:5173/app/nearby-market

---

## ✅ What's Included

- ✅ **Live Google Map** - Interactive, zoomable, responsive
- ✅ **User Location** - Blue "You are here" marker  
- ✅ **Nearby Search** - Automatic within 5km radius
- ✅ **Two Tabs**:
  - 🌱 Seed Shops (green markers)
  - 🏪 Mandi Markets (orange markers)
- ✅ **Place Details** - Name, rating, distance, address, open/closed
- ✅ **Directions** - One-click Google Maps directions
- ✅ **Map Markers** - Click for info window with details
- ✅ **Error Handling** - Location denied, no results, API errors

---

## 📁 Files Created/Updated

```
✅ frontend/src/pages/NearbyMarkets.jsx        (UPDATED - Main component)
✅ frontend/src/utils/distance.js              (NEW - Haversine distance)
✅ frontend/src/services/googlePlaces.js       (EXISTS - Places API)
✅ frontend/.env                                (UPDATED - Added API key)
✅ frontend/GOOGLE_MAPS_SETUP.md               (NEW - Full documentation)
✅ frontend/QUICKSTART.md                      (NEW - This file)
```

---

## 🎯 User Flow

1. User opens `/app/nearby-market`
2. Clicks "Get My Location" → Browser asks permission
3. Map centers on user location (blue marker)
4. Automatically fetches nearby seed shops (default tab)
5. Shows green markers + list with distances
6. User can switch to "Mandi Markets" tab
7. Click marker → Info window with details
8. Click "Get Directions" → Opens in Google Maps

---

## 🔧 Troubleshooting

**Map not showing?**
- Check `.env` has correct API key
- Restart dev server after adding key
- Enable Maps JavaScript API in console

**No places found?**
- Enable Places API in Google Cloud
- Check console for errors
- Try different location

**Location button not working?**
- Allow location in browser
- Must be HTTPS or localhost
- Check browser console

---

## 💰 Costs

- **FREE**: $200/month credit from Google
- Typical usage: ~10,000 searches/month free
- Monitor at: https://console.cloud.google.com/

---

## 🎨 Customization

Edit keywords in `src/services/googlePlaces.js`:
```javascript
// Line 34-39: Seed shop keywords
keywords = ['seed store', 'agriculture shop', 'fertilizer shop'];

// Line 41-46: Mandi market keywords  
keywords = ['market', 'mandi', 'vegetable market', 'farmers market'];
```

Change search radius:
```javascript
// In NearbyMarkets.jsx, line ~65
radius: 5000  // Change to meters (e.g., 10000 for 10km)
```

---

## 📚 Need More Help?

See `GOOGLE_MAPS_SETUP.md` for:
- Detailed API setup
- Feature documentation
- Cost breakdown
- Advanced troubleshooting
- Optional enhancements

---

**Ready to test!** 🎉
