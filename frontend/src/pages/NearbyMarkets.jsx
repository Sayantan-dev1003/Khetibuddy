import React, { useState, useEffect, useCallback } from 'react';
import { MapPin, Navigation, Store, ShoppingBag, AlertCircle, Compass, Target, Phone } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
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
    html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 5px 15px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;"><div style="width: 10px; hieght: 10px; background: white; border-radius: 50%;"></div></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  });
};

const userIcon = createCustomIcon('#5d4037'); // Sienna Brown (Earth)
const seedIcon = createCustomIcon('#8da14e'); // Sage Green (Plants)
const marketIcon = createCustomIcon('#bc6c25'); // Terracotta (Harvest)

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
      
      const placesWithDistance = results.map(place => ({
        ...place,
        distance: calculateDistance(
          location.latitude,
          location.longitude,
          place.lat,
          place.lon
        )
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
            setLocation(newLocation);
            setLoading(false);
          } catch (err) {
            setError('Error processing location. Please try again.');
            setLoading(false);
          }
        },
        (error) => {
          let errorMessage = 'Unable to get your location. ';
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += 'Please allow location access.';
              break;
            default:
              errorMessage += 'An unknown error occurred.';
          }
          setError(errorMessage);
          setLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
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
    <div className="max-w-6xl mx-auto space-y-12">
      <PageHeader
        icon="🗺️"
        title="Market Compass"
        subtitle="Chart your path to the nearest seed hubs and trade mandis."
        className="mb-12"
      />

      {/* Error Message */}
      {error && (
        <Card className="mb-8 border-l-8 border-l-red-500 bg-red-50" padding="lg">
          <div className="flex items-center gap-4 text-red-800">
            <AlertCircle size={32} />
            <p className="text-xl font-black">{error}</p>
          </div>
        </Card>
      )}
      
      {/* Location Permission Card */}
      {!location && (
        <Card className="mb-12 text-center !bg-[var(--primary)] text-white border-none relative overflow-hidden" padding="xl">
          <div className="absolute inset-0 opacity-10 pointer-events-none paper-texture"></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="p-6 bg-white/10 rounded-[3rem] shadow-2xl mb-8 animate-bounce">
              <Compass size={80} strokeWidth={1} />
            </div>
            <h2 className="text-5xl font-black lowercase tracking-tighter mb-6">ready to explore?</h2>
            <p className="text-2xl font-bold mb-10 max-w-2xl text-white/80 leading-relaxed">
              Grant us access to your coordinates, and we'll reveal the secret hubs of trade and growth around you.
            </p>
            <PrimaryButton
              onClick={handleGetLocation}
              loading={loading}
              size="lg"
              icon={<Target size={28} className="animate-pulse" />}
              className="!bg-[var(--leaf-bright)] !text-[var(--earth-deep)] !rounded-[2.5rem] !px-12 !py-6 text-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:scale-105 transition-transform font-black"
            >
              PINPOINT MY FARM
            </PrimaryButton>
          </div>
        </Card>
      )}

      {location && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* LEFT: LIST & TABS */}
          <div className="lg:col-span-12 xl:col-span-5 space-y-8 order-2 xl:order-1">
            <div className="flex gap-4 p-2 bg-white/50 backdrop-blur-md rounded-[2.5rem] border-2 border-[var(--primary-light)]/10 shadow-xl">
              <button
                onClick={() => setActiveTab('seeds')}
                className={`flex-1 flex items-center justify-center gap-3 py-5 px-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] transition-all duration-500 ${
                  activeTab === 'seeds'
                    ? 'bg-[var(--primary)] text-white shadow-2xl scale-105'
                    : 'text-[var(--text-muted)] hover:bg-[var(--primary)]/5'
                }`}
              >
                <ShoppingBag size={20} />
                Seed Shop
              </button>
              <button
                onClick={() => setActiveTab('mandi')}
                className={`flex-1 flex items-center justify-center gap-3 py-5 px-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] transition-all duration-500 ${
                  activeTab === 'mandi'
                    ? 'bg-[var(--accent)] text-white shadow-2xl scale-105'
                    : 'text-[var(--text-muted)] hover:bg-[var(--accent)]/5'
                }`}
              >
                <Store size={20} />
                Mandi
              </button>
            </div>

            {/* Loading State */}
            {fetchingPlaces && (
              <Card className="text-center py-20 bg-white/50 backdrop-blur-xl border-none" padding="xl">
                <div className="w-16 h-16 border-4 border-[var(--primary-light)]/10 border-t-[var(--secondary)] rounded-full animate-spin mx-auto mb-6"></div>
                <p className="text-xl font-black text-[var(--primary)] uppercase tracking-widest">Scanning Horizons...</p>
              </Card>
            )}

            {/* Locations List */}
            {!fetchingPlaces && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                   <h2 className="text-3xl font-black text-[var(--primary)] lowercase tracking-tight">
                    {activeTab === 'seeds' ? 'nurturing hubs' : 'trading grounds'}
                  </h2>
                  <span className="px-4 py-1 bg-[var(--primary)]/10 text-[var(--primary)] rounded-full text-[10px] font-black uppercase tracking-widest">{places.length} found</span>
                </div>

                {places.length === 0 ? (
                  <Card className="text-center py-20 border-4 border-dashed border-[var(--primary-light)]/20 !bg-transparent" padding="xl">
                    <div className="text-8xl mb-8 opacity-20">🏜️</div>
                    <h3 className="text-2xl font-black text-[var(--primary)] opacity-40">The horizon is clear</h3>
                    <p className="text-[var(--text-muted)] mt-2 font-bold max-w-xs mx-auto">No trade centers found within 10 km of your coordinates.</p>
                  </Card>
                ) : (
                  <div className="max-h-[800px] overflow-y-auto pr-4 custom-scrollbar space-y-6">
                    {places.map((place) => (
                      <Card 
                        key={place.id} 
                        className={`group border-2 border-[var(--primary-light)]/10 hover:border-[var(--secondary)]/30 !bg-white hover:!bg-[var(--bg-alt)] transition-all duration-500 !p-8 animate-fade-in-up`}
                        padding="none"
                      >
                        <div className="flex flex-col gap-6">
                          <div className="flex justify-between items-start">
                             <div className="p-4 rounded-2xl bg-[var(--bg-main)] text-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-white transition-colors">
                                {activeTab === 'seeds' ? <ShoppingBag size={24} /> : <Store size={24} />}
                             </div>
                             <div className="px-4 py-1.5 bg-[var(--bg-main)] text-[var(--primary)] rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                                {formatDistance(place.distance)} AWAY
                             </div>
                          </div>

                          <div className="space-y-4">
                            <h3 className="text-3xl font-black text-[var(--primary)] tracking-tight group-hover:text-[var(--accent)] transition-colors">{place.name}</h3>
                            
                            {place.address && (
                              <div className="flex items-start gap-3 bg-[var(--bg-main)]/50 p-4 rounded-2xl">
                                <MapPin size={20} className="text-[var(--secondary)] mt-1 flex-shrink-0" />
                                <span className="font-bold text-[var(--text-main)] italic leading-relaxed">{place.address}</span>
                              </div>
                            )}
                            
                            <div className="flex flex-wrap gap-4 pt-4">
                               {place.phone && (
                                <a 
                                  href={`tel:${place.phone}`} 
                                  className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[var(--primary-light)]/20 rounded-full text-xs font-black text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition-all shadow-sm"
                                >
                                  <Phone size={14} /> CALL HUB
                                </a>
                              )}
                              
                              <PrimaryButton
                                onClick={() => handleDirections(place.lat, place.lon)}
                                variant="primary"
                                size="sm"
                                icon={<Navigation size={18} />}
                                className="!rounded-full !px-6 shadow-xl"
                              >
                                GET PATH
                              </PrimaryButton>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT: MAP */}
          <div className="lg:col-span-12 xl:col-span-7 order-1 xl:order-2">
            {location && location.latitude && location.longitude && (
              <div className="sticky top-28">
                <Card className="!p-4 !bg-white shadow-2xl overflow-hidden border-8 border-white !rounded-[4rem] group" padding="none">
                  <div className="h-[500px] md:h-[700px] w-full rounded-[3rem] overflow-hidden">
                    <MapContainer
                      key={`${location.latitude}-${location.longitude}`}
                      center={[location.latitude, location.longitude]}
                      zoom={14}
                      style={{ height: '100%', width: '100%' }}
                      scrollWheelZoom={true}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                    
                    <Marker position={[location.latitude, location.longitude]} icon={userIcon}>
                      <Popup>
                        <div className="p-4 text-center">
                          <h4 className="font-black text-[var(--primary)] uppercase tracking-widest text-xs mb-1">current coordinate</h4>
                          <p className="font-bold">Your Sanctuary</p>
                        </div>
                      </Popup>
                    </Marker>

                    {places.map((place) => (
                      <Marker
                        key={place.id}
                        position={[place.lat, place.lon]}
                        icon={activeTab === 'seeds' ? seedIcon : marketIcon}
                      >
                        <Popup>
                          <div className="min-w-[250px] p-2">
                             <h4 className="font-black text-xs uppercase tracking-widest text-[var(--text-muted)] mb-3">{activeTab === 'seeds' ? 'Seed Merchant' : 'Mandi Grounds'}</h4>
                            <h3 className="font-black text-2xl text-[var(--primary)] tracking-tight mb-4">{place.name}</h3>
                            <div className="flex items-center gap-2 mb-6">
                               <Navigation size={14} className="text-[var(--accent)]" />
                               <span className="font-black text-xs text-[var(--accent)] uppercase">{formatDistance(place.distance)}</span>
                            </div>
                            <button
                              onClick={() => handleDirections(place.lat, place.lon)}
                              className="w-full bg-[var(--primary)] text-white px-6 py-4 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-[var(--accent)] transition-all shadow-xl flex items-center justify-center gap-3"
                            >
                              <Navigation size={18} /> OPEN MAPS
                            </button>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                    </MapContainer>
                  </div>
                </Card>
                
                {/* MAP LEGEND */}
                <div className="flex flex-wrap justify-center gap-8 mt-10 px-8 py-5 bg-white/40 backdrop-blur-sm rounded-full border border-[var(--primary-light)]/10">
                   <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-[#5d4037] border-2 border-white shadow-xl"></div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-[var(--primary)]">Your Farm</span>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-[#8da14e] border-2 border-white shadow-xl"></div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-[var(--primary)]">Seeds Hub</span>
                   </div>
                   <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full bg-[#bc6c25] border-2 border-white shadow-xl"></div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-[var(--primary)]">Harvest Mandi</span>
                   </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NearbyMarkets;
