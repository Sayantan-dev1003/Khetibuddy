import React, { useState, useEffect, useCallback } from 'react';
import { MapPin, Navigation, Store, ShoppingBag, AlertCircle } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Card from '../../components/ui/Card';
import PrimaryButton from '../../components/ui/PrimaryButton';
import { searchNearbyPlaces, getDirectionsUrl } from '../../services/overpass';
import { calculateDistance, formatDistance } from '../../utils/distance';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

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

export default function NearbyMapView() {
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
      const placesWithDistance = results.map(place => ({
        ...place,
        distance: calculateDistance(location.latitude, location.longitude, place.lat, place.lon)
      }));
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

  useEffect(() => {
    if (location) fetchNearbyPlaces();
  }, [location, activeTab, fetchNearbyPlaces]);

  const handleGetLocation = () => {
    setLoading(true);
    setError(null);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setLoading(false);
        },
        (error) => {
          let errorMessage = 'Unable to get location. ';
          switch(error.code) {
            case error.PERMISSION_DENIED: errorMessage += 'Please allow location access.'; break;
            case error.POSITION_UNAVAILABLE: errorMessage += 'Location unavailable.'; break;
            case error.TIMEOUT: errorMessage += 'Request timed out.'; break;
            default: errorMessage += 'Unknown error occurred.';
          }
          setError(errorMessage);
          setLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setError('Geolocation not supported');
      setLoading(false);
    }
  };

  const handleDirections = (lat, lon) => {
    window.open(getDirectionsUrl(lat, lon), '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {error && (
        <Card className="bg-red-50 border-2 border-red-300">
          <div className="flex items-center gap-4 text-red-800">
            <AlertCircle size={24} />
            <p className="text-lg">{error}</p>
          </div>
        </Card>
      )}
      
      {!location && (
        <Card className="text-center bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 py-12">
          <Navigation size={64} className="mx-auto text-blue-600 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Enable Location Services</h2>
          <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
            Allow location access to find real markets and shops on the map near you. 
          </p>
          <div className="flex justify-center mt-4">
            <PrimaryButton onClick={handleGetLocation} loading={loading} size="xl" icon={<MapPin size={24} />}>
              Get My Location
            </PrimaryButton>
          </div>
        </Card>
      )}

      {location && (
        <>
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('seeds')}
              className={`flex-1 py-4 px-6 rounded-xl font-bold text-xl transition-all ${
                activeTab === 'seeds'
                  ? 'bg-emerald-600 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-emerald-300'
              }`}
            >
              <ShoppingBag className="inline mr-2" size={24} /> Seed Shops
            </button>
            <button
              onClick={() => setActiveTab('mandi')}
              className={`flex-1 py-4 px-6 rounded-xl font-bold text-xl transition-all ${
                activeTab === 'mandi'
                  ? 'bg-emerald-600 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-emerald-300'
              }`}
            >
              <Store className="inline mr-2" size={24} /> Mandi Markets
            </button>
          </div>

          <Card className="p-0 overflow-hidden shadow-sm border border-gray-200">
            <div className="h-80 md:h-[500px]">
              <MapContainer
                key={`${location.latitude}-${location.longitude}`}
                center={[location.latitude, location.longitude]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
              >
                <TileLayer
                  attribution='&copy; OpenStreetMap'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                <Marker position={[location.latitude, location.longitude]} icon={userIcon}>
                  <Popup><div className="text-center"><strong>You are here</strong></div></Popup>
                </Marker>

                {places.map((place) => (
                  <Marker
                    key={place.id}
                    position={[place.lat, place.lon]}
                    icon={activeTab === 'seeds' ? seedIcon : marketIcon}
                  >
                    <Popup>
                      <div className="min-w-[200px]">
                        <h3 className="font-bold text-base mb-2">{place.name}</h3>
                        {place.address && <p className="text-sm text-gray-600 mb-2">{place.address}</p>}
                        <p className="text-sm text-gray-500 mb-2">📍 {formatDistance(place.distance)} away</p>
                        <button
                          onClick={() => handleDirections(place.lat, place.lon)}
                          className="w-full bg-emerald-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition"
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

          {fetchingPlaces && (
            <Card className="text-center shadow-sm">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
              <p className="text-lg text-gray-600">Searching for nearby places...</p>
            </Card>
          )}

          {!fetchingPlaces && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <h2 className="text-2xl font-bold text-gray-800 mb-2 mt-4">
                  {activeTab === 'seeds' ? '🌱 Seed Shops Near You' : '🏪 Mandi Markets Near You'}
                  <span className="text-lg text-gray-500 font-normal ml-2">({places.length} found)</span>
                </h2>
              </div>
              {places.length === 0 ? (
                <Card className="text-center bg-gray-50 md:col-span-2 py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">No Results Found</h3>
                  <p className="text-gray-500">No places found within 10 km. Data is from OpenStreetMap.</p>
                </Card>
              ) : (
                places.map((place) => (
                  <Card key={place.id} hover className={`border-l-4 ${activeTab === 'seeds' ? 'border-l-emerald-500' : 'border-l-amber-500'} p-4 shadow-sm`}>
                    <h3 className="font-bold text-gray-800 text-lg mb-1">{place.name}</h3>
                    {place.address && (
                      <div className="flex items-start gap-2 text-gray-600 text-sm mb-2">
                        <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2">{place.address}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-sm font-bold bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                        {formatDistance(place.distance)}
                      </span>
                      <button
                        onClick={() => handleDirections(place.lat, place.lon)}
                        className="text-emerald-600 hover:text-emerald-800 text-sm font-bold flex items-center gap-1 transition-colors"
                      >
                        <Navigation size={16} /> Direct
                      </button>
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
