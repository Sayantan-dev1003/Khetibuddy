/**
 * Google Places API Service
 * Handles fetching nearby places using Google Places API
 */

/**
 * Search for nearby places using Google Places API
 * @param {Object} params
 * @param {number} params.latitude - User's latitude
 * @param {number} params.longitude - User's longitude
 * @param {string} params.type - Type of place to search (seed_shops or mandi_markets)
 * @param {number} params.radius - Search radius in meters (default 5000)
 * @returns {Promise<Array>} Array of places
 */
export async function searchNearbyPlaces({ latitude, longitude, type, radius = 5000 }) {
  // This function will be called by the Google Maps Places Service
  // We return a promise that will be resolved by the Places Service callback
  return new Promise((resolve, reject) => {
    // Check if google maps is loaded
    if (!window.google || !window.google.maps) {
      reject(new Error('Google Maps not loaded'));
      return;
    }

    const map = new window.google.maps.Map(document.createElement('div'));
    const service = new window.google.maps.places.PlacesService(map);
    
    const location = new window.google.maps.LatLng(latitude, longitude);
    
    // Determine search keywords based on type
    let keywords = [];
    if (type === 'seed_shops') {
      keywords = ['seed store', 'agriculture shop', 'fertilizer shop', 'farm supplies'];
    } else if (type === 'mandi_markets') {
      keywords = ['market', 'mandi', 'vegetable market', 'farmers market', 'wholesale market'];
    }
    
    // Build search request
    const request = {
      location: location,
      radius: radius,
      keyword: keywords.join(' OR '),
    };
    
    // Perform nearby search
    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        // Process results
        const places = results.slice(0, 10).map(place => ({
          id: place.place_id,
          name: place.name,
          latitude: place.geometry.location.lat(),
          longitude: place.geometry.location.lng(),
          vicinity: place.vicinity || place.formatted_address || '',
          rating: place.rating || null,
          userRatingsTotal: place.user_ratings_total || null,
          openNow: place.opening_hours?.open_now ?? null,
          icon: place.icon || '',
          types: place.types || [],
          photos: place.photos || [],
        }));
        resolve(places);
      } else if (status === window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
        resolve([]);
      } else {
        reject(new Error(`Places search failed: ${status}`));
      }
    });
  });
}

/**
 * Get place details (for more information)
 * @param {string} placeId - Google Place ID
 * @returns {Promise<Object>} Place details
 */
export async function getPlaceDetails(placeId) {
  return new Promise((resolve, reject) => {
    if (!window.google || !window.google.maps) {
      reject(new Error('Google Maps not loaded'));
      return;
    }

    const map = new window.google.maps.Map(document.createElement('div'));
    const service = new window.google.maps.places.PlacesService(map);
    
    const request = {
      placeId: placeId,
      fields: ['name', 'formatted_address', 'formatted_phone_number', 'opening_hours', 'website', 'rating', 'user_ratings_total']
    };
    
    service.getDetails(request, (place, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        resolve({
          name: place.name,
          address: place.formatted_address,
          phone: place.formatted_phone_number,
          website: place.website,
          rating: place.rating,
          userRatingsTotal: place.user_ratings_total,
          openingHours: place.opening_hours?.weekday_text || [],
          openNow: place.opening_hours?.open_now ?? null,
        });
      } else {
        reject(new Error(`Place details failed: ${status}`));
      }
    });
  });
}

/**
 * Generate Google Maps directions URL
 * @param {number} lat - Destination latitude
 * @param {number} lng - Destination longitude
 * @returns {string} Google Maps URL
 */
export function getDirectionsUrl(lat, lng) {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}
