import React, { useState, useEffect, useCallback } from 'react';
import { MapPin, Navigation, Store, ShoppingBag, AlertCircle, Search, Map as MapIcon, ChevronRight, Sparkles, Loader2, LocateFixed } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion, AnimatePresence } from 'framer-motion';
import { searchNearbyPlaces, getDirectionsUrl } from '../../services/overpass';
import { calculateDistance, formatDistance } from '../../utils/distance';

// Leaflet marker fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom pulsing CSS for user location
const pulseStyles = `
  @keyframes marker-pulse {
    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
    70% { transform: scale(1); box-shadow: 0 0 0 15px rgba(16, 185, 129, 0); }
    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
  }
  .user-location-marker {
    background-color: #10B981;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 3px solid white;
    box-shadow: 0 2px 5px rgba(0,0,0,0.3);
    animation: marker-pulse 2s infinite;
  }
`;

const createCustomIcon = (color, type = 'default') => {
  return L.divIcon({
    className: 'custom-marker',
    html: type === 'user' 
      ? `<div class="user-location-marker"></div>`
      : `<div style="background-color: ${color}; width: 28px; height: 28px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 2.5px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: center;"></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28]
  });
};

const userIcon = createCustomIcon('#10B981', 'user');
const seedIcon = createCustomIcon('#059669'); // Emerald 600
const marketIcon = createCustomIcon('#D97706'); // Amber 600

// Helper component to center map
function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

export default function NearbyMapView() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('seeds');
  const [places, setPlaces] = useState([]);
  const [fetchingPlaces, setFetchingPlaces] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);

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
      setPlaces(placesWithDistance.slice(0, 12));
    } catch (err) {
      console.error('Error fetching places:', err);
      setError('Geospatial sync failed. Check connection.');
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
          let errorMessage = 'Location access required for live maps.';
          setError(errorMessage);
          setLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setError('Geolocation not supported by this architecture.');
      setLoading(false);
    }
  };

  const handleDirections = (lat, lon) => {
    window.open(getDirectionsUrl(lat, lon), '_blank');
  };

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto animate-in fade-in duration-700">
      <style>{pulseStyles}</style>

      {/* ERROR MESSAGE */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6 bg-red-500/10 border border-red-500/20 backdrop-blur-xl rounded-[2.5rem] flex items-center gap-4 text-red-600 shadow-sm"
          >
            <AlertCircle size={24} />
            <p className="font-black uppercase tracking-widest text-xs">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* INITIAL STATE: GET LOCATION */}
      {/* INITIAL STATE: GET LOCATION */}
      {!location && (
        <div className="relative min-h-[600px] flex items-center justify-center p-6 md:p-12 overflow-hidden">
          {/* ATMOSPHERIC BACKGROUND MESH (INNER) */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/10 blur-[150px] rounded-full" />
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative z-10 w-full max-w-4xl bg-white/60 backdrop-blur-3xl rounded-[4rem] p-12 md:p-24 border border-white shadow-3xl flex flex-col items-center justify-center text-center space-y-12 overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-blue-500/5 pointer-events-none" />
            
            <div className="relative z-10 space-y-8">
              <div className="w-28 h-28 bg-emerald-500 rounded-[2.5rem] shadow-[0_20px_40px_rgba(16,185,129,0.3)] flex items-center justify-center mx-auto text-white group-hover:scale-110 transition-transform duration-700">
                <Navigation size={48} className="animate-pulse" />
              </div>
              <div className="space-y-4">
                <h2 className="text-4xl md:text-7xl font-[950] text-emerald-900 tracking-[-0.05em] uppercase leading-none">
                  LOCATE <span className="text-emerald-500 italic">RESOURCES</span>
                </h2>
                <p className="text-emerald-900/40 font-black text-[11px] uppercase tracking-[0.4em] max-w-lg mx-auto leading-relaxed">
                  ENABLE GEOLOCATION TO SCAN AND REVEAL <br /> 
                  AGRICULTURAL NODES IN YOUR IMMEDIATE PERIMETER.
                </p>
              </div>
              
              <div className="pt-4 flex justify-center">
                <button 
                  onClick={handleGetLocation}
                  disabled={loading}
                  className="bg-emerald-900 text-white px-14 py-7 rounded-[2.5rem] font-black uppercase tracking-[0.25em] text-lg hover:bg-black transition-all shadow-2xl flex items-center gap-4 disabled:opacity-50 hover:scale-105 active:scale-95"
                >
                  {loading ? <Loader2 size={24} className="animate-spin" /> : <LocateFixed size={24} />}
                  {loading ? 'CALIBRATING...' : 'SCAN PERIMETER'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* ACTIVE STATE: MAP & LIST */}
      {location && (
        <div className="grid lg:grid-cols-12 gap-8 h-full">
          
          {/* LEFT: CONTROLS & LIST (5 COLS) */}
          <div className="lg:col-span-5 space-y-8 flex flex-col h-full max-h-[800px]">
            
            {/* TAB SELECTOR */}
            <div className="p-2 bg-white/40 backdrop-blur-xl border border-white rounded-[2.5rem] flex gap-2 shadow-sm">
               {[
                 { id: 'seeds', label: 'SEED STORES', icon: ShoppingBag, color: 'emerald' },
                 { id: 'mandi', label: 'MARKET INFO', icon: Store, color: 'amber' }
               ].map((tab) => (
                 <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[1.8rem] transition-all font-black text-[11px] uppercase tracking-[0.2em] relative overflow-hidden ${
                      activeTab === tab.id 
                        ? 'bg-emerald-900 text-white shadow-xl' 
                        : 'text-emerald-900/40 hover:text-emerald-900 hover:bg-white/50'
                    }`}
                 >
                    <tab.icon size={16} />
                    {tab.label}
                    {activeTab === tab.id && (
                      <motion.div layoutId="tab-bg" className="absolute inset-0 bg-emerald-900 -z-10" />
                    )}
                 </button>
               ))}
            </div>

            {/* PLACES LIST */}
            <div className="flex-1 bg-white/40 backdrop-blur-xl border border-white/60 rounded-[3.5rem] p-8 shadow-sm flex flex-col space-y-6 overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                   <h3 className="text-xl font-[950] text-[#020503] tracking-tight uppercase leading-none mb-1">Detected Facilities</h3>
                   <p className="text-emerald-900/40 font-black text-[10px] uppercase tracking-[0.25em]">{places.length} Nodes Found</p>
                </div>
                {fetchingPlaces && <Loader2 size={18} className="animate-spin text-emerald-500" />}
              </div>

              <div className="overflow-y-auto pr-2 space-y-4 flex-1 custom-scrollbar">
                {fetchingPlaces ? (
                  [1, 2, 3, 4].map(i => (
                    <div key={i} className="h-28 w-full bg-white/20 animate-pulse rounded-[2rem]" />
                  ))
                ) : places.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-emerald-900/20 py-20">
                    <Search size={48} className="mb-4" />
                    <p className="font-black uppercase tracking-widest text-[10px]">No geospatial data detected</p>
                  </div>
                ) : (
                  places.map((place, i) => (
                    <motion.div
                      key={place.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * i }}
                      onClick={() => setSelectedPlace(place)}
                      className={`p-6 rounded-[2rem] border transition-all cursor-pointer group flex flex-col justify-between h-28 ${
                        selectedPlace?.id === place.id 
                          ? 'bg-emerald-900 text-white border-transparent shadow-xl translate-x-1' 
                          : 'bg-white/40 border-white/80 hover:bg-white hover:border-emerald-200'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <h4 className={`font-black uppercase tracking-tight text-sm truncate pr-2 ${selectedPlace?.id === place.id ? 'text-white' : 'text-emerald-900'}`}>{place.name}</h4>
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${selectedPlace?.id === place.id ? 'bg-white/20 text-emerald-300' : 'bg-emerald-500/10 text-emerald-600'}`}>
                          {formatDistance(place.distance)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className={`text-[10px] font-bold uppercase truncate max-w-[80%] ${selectedPlace?.id === place.id ? 'text-white/60 italic' : 'text-emerald-900/40 italic'}`}>
                          {place.address || 'Location Verified'}
                        </p>
                        <ChevronRight size={14} className={selectedPlace?.id === place.id ? 'text-emerald-400' : 'text-emerald-200'} />
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: MAP VIEW (7 COLS) */}
          <div className="lg:col-span-7 h-[600px] lg:h-[700px] rounded-[4rem] border-8 border-white shadow-2xl relative overflow-hidden group">
            <MapContainer
              center={[location.latitude, location.longitude]}
              zoom={13}
              style={{ height: '100%', width: '100%', zIndex: 1 }}
              scrollWheelZoom={true}
              className="z-0"
            >
              {selectedPlace && <ChangeView center={[selectedPlace.lat, selectedPlace.lon]} zoom={15} />}
              
              <TileLayer
                attribution='&copy; OpenStreetMap'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              <Marker position={[location.latitude, location.longitude]} icon={userIcon}>
                <Popup>
                  <div className="p-3 text-center">
                    <span className="font-black text-[10px] uppercase tracking-widest text-emerald-600">Your Deployment</span>
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
                    <div className="min-w-[240px] p-4 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activeTab === 'seeds' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                          {activeTab === 'seeds' ? <ShoppingBag size={20} /> : <Store size={20} />}
                        </div>
                        <div>
                          <h3 className="font-[950] text-emerald-900 text-sm uppercase truncate pr-4">{place.name}</h3>
                          <p className="text-[9px] font-black uppercase text-emerald-900/40 tracking-widest">{formatDistance(place.distance)} AWAY</p>
                        </div>
                      </div>
                      <p className="text-xs text-emerald-900/60 leading-relaxed font-medium line-clamp-2">
                        {place.address || 'Verified Agricultural Resource Point'}
                      </p>
                      <button
                        onClick={() => handleDirections(place.lat, place.lon)}
                        className="w-full bg-emerald-900 text-white px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all flex items-center justify-center gap-2 group"
                      >
                         <Navigation size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                         Get Precise Route
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>

            {/* MAP OVERLAY: ACTIVE DATA HUD */}
            <div className="absolute top-8 left-8 z-10 space-y-2 pointer-events-none">
                <div className="bg-emerald-900/90 backdrop-blur-md px-6 py-3 rounded-full border border-emerald-500/20 text-white flex items-center gap-3 shadow-xl pointer-events-auto">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Live Node Tracking Active</span>
                </div>
            </div>

            <div className="absolute top-8 right-8 z-10 pointer-events-auto">
                <button 
                  onClick={() => setLocation({...location})} 
                  className="bg-white p-4 rounded-2xl shadow-xl hover:bg-emerald-50 text-emerald-900 transition-all border border-emerald-100"
                  title="Recenter"
                >
                  <MapIcon size={24} />
                </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER CTA MOCK */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: location ? 1 : 0 }}
        className="pt-10 flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
            <Sparkles size={22} />
          </div>
          <div>
            <h4 className="font-black text-emerald-900 text-lg uppercase tracking-tight">Geo-Spatial Intelligence</h4>
            <p className="text-emerald-900/40 font-black text-[10px] uppercase tracking-widest leading-none">Powered by KhetiBuddy AI Intelligence</p>
          </div>
        </div>
        <div className="flex gap-4">
           <div className="px-6 py-3 rounded-xl bg-white/50 border border-emerald-100 flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-blue-500" />
             <span className="text-[10px] font-black uppercase tracking-widest text-emerald-900">Satellite Layer: Offline</span>
           </div>
           <div className="px-6 py-3 rounded-xl bg-white/50 border border-emerald-100 flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-emerald-500" />
             <span className="text-[10px] font-black uppercase tracking-widest text-emerald-900">Ground Sensors: Live</span>
           </div>
        </div>
      </motion.div>
    </div>
  );
}
