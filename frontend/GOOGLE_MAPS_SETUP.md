# Google Maps + Places API Integration Setup

## Overview
Complete integration of Google Maps JavaScript API and Places API for the Nearby Markets feature.

## Prerequisites
- Google Cloud Console account
- Credit card (required for API activation, but free tier available)
- Node.js and npm installed

## Setup Instructions

### 1. Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Enable the following APIs:
   - **Maps JavaScript API**
   - **Places API**
4. Go to **Credentials** → **Create Credentials** → **API Key**
5. Copy your API key
6. **Recommended**: Restrict your API key:
   - Application restrictions: HTTP referrers
   - Add your domain: `localhost:5173/*` for development
   - API restrictions: Select Maps JavaScript API and Places API

### 2. Configure Environment Variables

Open `frontend/.env` file and add your API key:

```env
VITE_API_URL=http://localhost:3000
VITE_GOOGLE_MAPS_API_KEY=YOUR_ACTUAL_API_KEY_HERE
```

Replace `YOUR_ACTUAL_API_KEY_HERE` with your actual Google Maps API key.

### 3. Install Dependencies

The required package is already installed:
```bash
cd frontend
npm install
# @react-google-maps/api is already in package.json
```

### 4. Start the Development Server

```bash
npm run dev
```

Navigate to: `http://localhost:5173/app/nearby-market`

## Features Implemented

### ✅ Live Google Map
- Interactive map with zoom and pan
- Responsive height: 320px (mobile), 420px (desktop)
- Full screen control

### ✅ Geolocation
- "Get My Location" button
- Browser geolocation API
- User location marker (blue dot)
- Auto-centers map on user location

### ✅ Nearby Places Search
- **Seed Shops Tab**: Searches for seed stores, agriculture shops, fertilizer shops
- **Mandi Markets Tab**: Searches for markets, mandi, vegetable markets, farmers markets
- Radius: 5000 meters (5 km)
- Shows top 10 results
- Auto-fetches when location is set or tab changes

### ✅ Place Information Display
- Place name
- Rating with star visualization
- Total number of ratings
- Address/vicinity
- Distance (calculated using Haversine formula)
- Open/Closed status (if available)
- "Get Directions" button

### ✅ Map Markers
- User location: Blue marker
- Seed shops: Green markers
- Mandi markets: Orange markers
- Clickable markers with info windows
- Info window shows: name, rating, address, directions button

### ✅ Error Handling
- Location permission denied
- API key missing warning
- No results found state
- Map loading errors
- Places API errors

### ✅ UI/UX
- Farmer-friendly large text and buttons
- Loading states for map and data
- Clean card-based layout
- Color-coded tabs (emerald for seeds, amber for mandi)
- Responsive design

## File Structure

```
frontend/
├── .env                                    # Environment variables (API key)
├── src/
│   ├── pages/
│   │   └── NearbyMarkets.jsx              # Main component (UPDATED)
│   ├── services/
│   │   └── googlePlaces.js                # Places API service (EXISTS)
│   └── utils/
│       └── distance.js                     # Distance calculation helpers (NEW)
```

## API Usage & Costs

### Free Tier
- $200 free credit per month
- Maps JavaScript API: $7 per 1,000 loads
- Places API: $17 per 1,000 requests

### Typical Usage
- Each page load: 1 map load + 1 places search
- With free tier: ~10,000 searches/month free

### Best Practices
- Restrict API key to your domain
- Monitor usage in Google Cloud Console
- Set up billing alerts
- Cache results when possible

## Troubleshooting

### Map not loading
1. Check console for errors
2. Verify API key is correct in `.env`
3. Ensure Maps JavaScript API is enabled
4. Check browser console for CORS issues

### No places showing
1. Verify Places API is enabled
2. Check console for API errors
3. Ensure location permission is granted
4. Try different search radius

### "API Key Missing" warning
1. Make sure `.env` file exists in frontend folder
2. Restart dev server after adding API key
3. Check that variable name is exactly: `VITE_GOOGLE_MAPS_API_KEY`

### Geolocation not working
1. Ensure HTTPS or localhost (required for geolocation)
2. Check browser location permission settings
3. Try different browser

## Development Notes

- The map uses `@react-google-maps/api` v2.20.8
- Distance calculation uses Haversine formula
- Results are sorted by distance automatically
- Maximum 10 results displayed per search
- Search keywords can be customized in `googlePlaces.js`

## Next Steps (Optional Enhancements)

- [ ] Add filter by rating
- [ ] Add search radius selector
- [ ] Cache recent searches
- [ ] Add place photos
- [ ] Add phone number display (requires place details API)
- [ ] Add route planning
- [ ] Save favorite locations
- [ ] Share location links

## Support

For issues or questions:
1. Check Google Maps Platform documentation
2. Review browser console for errors
3. Verify API quotas in Google Cloud Console
4. Check that all APIs are enabled

## License
MIT
