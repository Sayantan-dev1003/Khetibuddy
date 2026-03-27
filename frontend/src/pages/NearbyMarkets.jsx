import React, { useState, useEffect, useCallback } from 'react';
import { MapPin, Navigation, Store, ShoppingBag, AlertCircle } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import PrimaryButton from '../components/ui/PrimaryButton';
import { searchNearbyPlaces, getDirectionsUrl } from '../services/overpass';
import { calculateDistance, formatDistance } from '../utils/distance';

// Fix Leaflet default marker icon issue with Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for different marker types
const createCustomIcon = (color) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 25px; height: 25px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
    iconSize: [25, 25],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24]
  });
};

const userIcon = createCustomIcon('#3B82F6'); // Blue
const seedIcon = createCustomIcon('#10B981'); // Green
const marketIcon = createCustomIcon('#F59E0B'); // Orange

function NearbyMarkets() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('seeds');
  const [places, setPlaces] = useState([]);
  const [fetchingPlaces, setFetchingPlaces] = useState(false);
  const [error, setError] = useState(null);

  const fetchNearbyPlaces = useCallback(async () => {
    if (!location) return;
    
    setFetchingPlaces(true);
    setError(null);
    
    try {
      const type = activeTab === 'seeds' ? 'seed' : 'market';
      const results = await searchNearbyPlaces({
        latitude: location.latitude,
        longitude: location.longitude,
        type: type,
        radius: 10000
      });
      
      // Add distance to each place
      const placesWithDistance = results.map(place => ({
        ...place,
        distance: calculateDistance(
          location.latitude,
          location.longitude,
          place.lat,
          place.lon
        )
      }));
      
      // Sort by distance and limit to top 10
      placesWithDistance.sort((a, b) => a.distance - b.distance);
      setPlaces(placesWithDistance.slice(0, 10));
    } catch (err) {
      console.error('Error fetching places:', err);
      setError('Failed to fetch nearby places. Please try again.');
      setPlaces([]);
    } finally {
      setFetchingPlaces(false);
    }
  }, [location, activeTab]);

  // Fetch nearby places when location or tab changes
  useEffect(() => {
    if (location) {
      fetchNearbyPlaces();
    }
  }, [location, activeTab, fetchNearbyPlaces]);

  const handleGetLocation = () => {
    setLoading(true);
    setError(null);
    
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          try {
            const newLocation = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            };
            console.log('Location obtained:', newLocation);
            setLocation(newLocation);
            setLoading(false);
          } catch (err) {
            console.error('Error setting location:', err);
            setError('Error processing location. Please try again.');
            setLoading(false);
          }
        },
        (error) => {
          console.error('Location error:', error);
          let errorMessage = 'Unable to get your location. ';
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += 'Please allow location access in your browser settings.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage += 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage += 'Location request timed out. Please try again.';
              break;
            default:
              errorMessage += 'An unknown error occurred.';
          }
          setError(errorMessage);
          setLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
    }
  };

  const handleDirections = (lat, lon) => {
    window.open(getDirectionsUrl(lat, lon), '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        icon="📍"
        title="Nearby Markets"
        subtitle="Find seed shops and mandi markets near you (Free OpenStreetMap)"
      />

      {/* Error Message */}
      {error && (
        <Card className="mb-6 bg-red-50 border-2 border-red-300">
          <div className="flex items-center gap-4 text-red-800">
            <AlertCircle size={24} />
            <p className="text-lg">{error}</p>
          </div>
        </Card>
      )}
      
      {/* Location Permission Card */}
      {!location && (
        <Card className="mb-6 text-center bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300">
          <Navigation size={64} className="mx-auto text-blue-600 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Enable Location Services</h2>
          <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
            Allow location access to find markets and shops near you. 
            Your location is only used to show nearby results.
          </p>
          <div className="flex justify-center mt-4">
          <PrimaryButton
            onClick={handleGetLocation}
            loading={loading}
            size="xl"
            icon={<MapPin size={24} />}
          >
            Get My Location
          </PrimaryButton>
          </div>
        </Card>
      )}

      {/* Tabs */}
      {location && (
        <>
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab('seeds')}
              className={`flex-1 py-4 px-6 rounded-xl font-bold text-xl transition-all ${
                activeTab === 'seeds'
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-emerald-300'
              }`}
            >
              <ShoppingBag className="inline mr-2" size={24} />
              Seed Shops
            </button>
            <button
              onClick={() => setActiveTab('mandi')}
              className={`flex-1 py-4 px-6 rounded-xl font-bold text-xl transition-all ${
                activeTab === 'mandi'
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-emerald-300'
              }`}
            >
              <Store className="inline mr-2" size={24} />
              Mandi Markets
            </button>
          </div>

          {/* OpenStreetMap with Leaflet */}
          {location && location.latitude && location.longitude && (
            <Card className="mb-6 p-0 overflow-hidden ">
              <div className="h-80 md:h-96">
                <MapContainer
                  key={`${location.latitude}-${location.longitude}`}
                  center={[location.latitude, location.longitude]}
                  zoom={13}
                  style={{ height: '100%', width: '100%' }}
                  scrollWheelZoom={true}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                
                {/* User Location Marker */}
                <Marker 
                  position={[location.latitude, location.longitude]}
                  icon={userIcon}
                >
                  <Popup>
                    <div className="text-center">
                      <strong>You are here</strong>
                    </div>
                  </Popup>
                </Marker>

                {/* Place Markers */}
                {places.map((place) => (
                  <Marker
                    key={place.id}
                    position={[place.lat, place.lon]}
                    icon={activeTab === 'seeds' ? seedIcon : marketIcon}
                  >
                    <Popup>
                      <div className="min-w-[200px]">
                        <h3 className="font-bold text-base mb-2">{place.name}</h3>
                        {place.address && (
                          <p className="text-sm text-gray-600 mb-2">{place.address}</p>
                        )}
                        <p className="text-sm text-gray-500 mb-2">
                          📍 {formatDistance(place.distance)} away
                        </p>
                        <button
                          onClick={() => handleDirections(place.lat, place.lon)}
                          className="w-full bg-emerald-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors"
                        >
                          Get Directions
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </Card>
          )}

          {/* Loading State */}
          {fetchingPlaces && (
            <Card className="mb-6 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
              <p className="text-lg text-gray-600">Searching for nearby places...</p>
            </Card>
          )}

          {/* Locations List */}
          {!fetchingPlaces && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {activeTab === 'seeds' ? '🌱 Seed Shops Near You' : '🏪 Mandi Markets Near You'}
                <span className="text-lg text-gray-600 ml-2">({places.length} found)</span>
              </h2>

              {places.length === 0 ? (
                <Card className="text-center bg-gray-50">
                  <div className="py-12">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">No Results Found</h3>
                    <p className="text-lg text-gray-600">
                      No {activeTab === 'seeds' ? 'seed shops' : 'mandi markets'} found within 5 km.
                      Try searching in a different area or check back later.
                    </p>
                    <p className="text-sm text-gray-500 mt-4">
                      Note: Data is from OpenStreetMap. Some places may not be listed yet.
                    </p>
                  </div>
                </Card>
              ) : (
                places.map((place) => (
                  <Card 
                    key={place.id} 
                    hover 
                    className={`border-2 ${
                      activeTab === 'seeds' ? 'border-emerald-200' : 'border-amber-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">{place.name}</h3>
                        
                        <div className="space-y-2 text-lg text-gray-700 mb-4">
                          {place.address && (
                            <div className="flex items-start gap-2">
                              <MapPin size={20} className={activeTab === 'seeds' ? 'text-emerald-600 mt-1' : 'text-amber-600 mt-1'} />
                              <span>{place.address}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2">
                            <Navigation size={20} className="text-blue-600" />
                            <span className={`px-3 py-1 rounded-full font-bold text-sm ${
                              activeTab === 'seeds' 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {formatDistance(place.distance)} away
                            </span>
                          </div>
                          
                          {place.phone && (
                            <div className="flex items-center gap-2 text-base">
                              <span>📞</span>
                              <a href={`tel:${place.phone}`} className="hover:underline text-blue-600">
                                {place.phone}
                              </a>
                            </div>
                          )}
                          
                          {place.openingHours && (
                            <div className="flex items-start gap-2 text-sm text-gray-600">
                              <span>🕐</span>
                              <span>{place.openingHours}</span>
                            </div>
                          )}
                        </div>

                        <PrimaryButton
                          onClick={() => handleDirections(place.lat, place.lon)}
                          variant="primary"
                          size="md"
                          icon={<Navigation size={20} />}
                        >
                          Get Directions
                        </PrimaryButton>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default NearbyMarkets;
