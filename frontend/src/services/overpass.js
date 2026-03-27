/**
 * Overpass API Service
 * Free OpenStreetMap data queries for nearby places
 */

const OVERPASS_API = 'https://overpass-api.de/api/interpreter';

/**
 * Build Overpass QL query for nearby places
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {number} radius - Radius in meters
 * @param {string} type - Type of place: 'seed' or 'market'
 * @returns {string} Overpass QL query
 */
function buildQuery(lat, lon, radius, type) {
  const radiusMeters = radius;
  
  if (type === 'seed') {
    // Query for seed shops, farm stores, agricultural suppliers
    return `
      [out:json][timeout:25];
      (
        node["shop"="agrarian"](around:${radiusMeters},${lat},${lon});
        node["shop"="farm"](around:${radiusMeters},${lat},${lon});
        node["shop"="seeds"](around:${radiusMeters},${lat},${lon});
        node["shop"="garden_centre"](around:${radiusMeters},${lat},${lon});
        node["shop"="hardware"]["agrarian"="yes"](around:${radiusMeters},${lat},${lon});
        way["shop"="agrarian"](around:${radiusMeters},${lat},${lon});
        way["shop"="farm"](around:${radiusMeters},${lat},${lon});
        way["shop"="seeds"](around:${radiusMeters},${lat},${lon});
        way["shop"="garden_centre"](around:${radiusMeters},${lat},${lon});
      );
      out center;
    `;
  } else {
    // Query for markets, mandis, wholesale markets
    return `
      [out:json][timeout:25];
      (
        node["amenity"="marketplace"](around:${radiusMeters},${lat},${lon});
        node["shop"="wholesale"](around:${radiusMeters},${lat},${lon});
        node["name"~"mandi|market|wholesale|sabzi|vegetable",i](around:${radiusMeters},${lat},${lon});
        way["amenity"="marketplace"](around:${radiusMeters},${lat},${lon});
        way["shop"="wholesale"](around:${radiusMeters},${lat},${lon});
        way["landuse"="retail"]["name"~"market|mandi",i](around:${radiusMeters},${lat},${lon});
      );
      out center;
    `;
  }
}

/**
 * Normalize Overpass result to common format
 * @param {Object} element - Overpass element
 * @param {string} type - 'seed' or 'market'
 * @returns {Object} Normalized place object
 */
function normalizeElement(element, type) {
  const lat = element.center?.lat || element.lat;
  const lon = element.center?.lon || element.lon;
  
  const tags = element.tags || {};
  const name = tags.name || tags['name:en'] || tags.brand || 'Unnamed Place';
  
  // Build address from available tags
  const addressParts = [
    tags['addr:street'],
    tags['addr:city'] || tags['addr:district'],
    tags['addr:state']
  ].filter(Boolean);
  
  const address = addressParts.length > 0 
    ? addressParts.join(', ')
    : tags.description || tags.operator || '';
  
  return {
    id: element.id,
    name,
    lat,
    lon,
    tags,
    address,
    type,
    phone: tags.phone || tags['contact:phone'] || null,
    website: tags.website || tags['contact:website'] || null,
    openingHours: tags.opening_hours || null
  };
}

/**
 * Search for nearby places using Overpass API
 * @param {Object} params
 * @param {number} params.latitude - User's latitude
 * @param {number} params.longitude - User's longitude
 * @param {string} params.type - 'seed' or 'market'
 * @param {number} params.radius - Search radius in meters (default 5000)
 * @returns {Promise<Array>} Array of places
 */
export async function searchNearbyPlaces({ latitude, longitude, type, radius = 5000 }) {
  try {
    const query = buildQuery(latitude, longitude, radius, type);
    
    const response = await fetch(OVERPASS_API, {
      method: 'POST',
      body: query,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Overpass API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.elements || data.elements.length === 0) {
      return [];
    }
    
    // Normalize results
    const places = data.elements
      .filter(el => el.lat || el.center?.lat) // Only elements with coordinates
      .map(el => normalizeElement(el, type));
    
    return places;
  } catch (error) {
    console.error('Overpass API error:', error);
    throw error;
  }
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
