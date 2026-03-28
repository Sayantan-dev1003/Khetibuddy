import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Leaf,
  Droplets,
  CheckCircle2,
  Activity,
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
  CalendarDays,
  UserCircle,
  Cloud,
  Wind,
  Thermometer,
  Shield,
  Loader2,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  LayoutDashboard,
  Bell,
  Search,
  Plus,
  Store,
  MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { get } from '../services/api';

const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-emerald-900/10 rounded-2xl ${className}`} />
);

function Home() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);

  // Mock Marketplace Insights
  const marketplaceInsights = [
    { name: 'Organic Bio-Fertilizer', category: 'Nutrients', orders: '1.2k', growth: '+12%', icon: '🍃' },
    { name: 'Premium Neem Oil', category: 'Protection', orders: '980', growth: '+8%', icon: '🌿' },
    { name: 'Vayal AI Soil Probe', category: 'Hardware', orders: '850', growth: '+25%', icon: '🧪' },
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsRes, activityRes] = await Promise.all([
          get('/api/dashboard/stats'),
          get('/api/dashboard/recent-activity')
        ]);

        if (statsRes.success) setStats(statsRes.data);
        if (activityRes.success) setActivities(activityRes.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to sync system intelligence');
      } finally {
        setLoading(false);
      }
    };

    const fetchWeather = async (lat, lon) => {
      try {
        setWeatherLoading(true);
        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relativehumidity_2m`
        );
        const res = await weatherRes.json();
        
        // Reverse Geocoding for location name
        let locationName = "Current Location";
        try {
          const geoRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`
          );
          const geoData = await geoRes.json();
          locationName = geoData.address.city || geoData.address.town || geoData.address.village || geoData.address.state || "Active Zone";
        } catch (geoErr) {
          console.warn("Reverse geocoding failed.");
        }

        if (res && res.current_weather) {
          setWeatherData({
            temp: res.current_weather.temperature,
            wind: res.current_weather.windspeed,
            code: res.current_weather.weathercode,
            humidity: res.hourly?.relativehumidity_2m?.[0] || 45,
            location: locationName
          });
        }
      } catch (err) {
        console.error('Error fetching weather:', err);
      } finally {
        setWeatherLoading(false);
      }
    };

    // Initialize data fetching
    fetchDashboardData();

    // Geolocation handling
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.warn("Geolocation denied/failed.");
          setWeatherLoading(false);
          // We can optionally set a status message here if needed
        },
        { timeout: 10000 }
      );
    } else {
      console.warn("Geolocation not supported.");
      setWeatherLoading(false);
    }
  }, []);


  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <AlertCircle size={48} className="text-red-500" />
        <h2 className="text-2xl font-black text-emerald-900 uppercase tracking-tighter">{error}</h2>
        <button 
          onClick={() => window.location.reload()}
          className="px-8 py-3 bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-emerald-600 transition-all"
        >
          Retry Calibration
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 relative overflow-hidden font-sans">
      
      {/* ATMOSPHERIC BACKGROUND */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[10%] right-[10%] w-[50%] h-[50%] bg-emerald-500/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[10%] left-[10%] w-[40%] h-[40%] bg-lime-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-[1600px] mx-auto px-6 relative z-10 pt-8 space-y-10">
        {/* TOP SECTION: WELCOME & WEATHER */}
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          {/* HERO BANNER - DYNAMIC GREETING */}
          <header className="lg:col-span-8 relative h-[200px] md:h-[350px] rounded-[3.5rem] bg-[#020503] overflow-hidden group shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2000" 
              className="absolute inset-0 w-full h-full object-cover opacity-30 scale-105 group-hover:scale-100 transition-transform duration-[3000ms]"
              alt="Field"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#020503] via-[#020503]/20 to-transparent" />
            
            <div className="relative h-full flex flex-col justify-end p-6 md:p-10 space-y-4">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 backdrop-blur-xl border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Sparkles size={16} />
                  </div>
                  <span className="text-emerald-400 font-extrabold text-[11px] uppercase tracking-[0.4em]">Agricultural Intelligence Active</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-[950] text-white tracking-[-0.06em] leading-tight uppercase">
                  Welcome, <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-lime-300 italic">
                    {user?.name?.split(' ')[0] || 'Partner'}
                  </span>
                </h2>
              </motion.div>
            </div>

            <div className="absolute top-8 right-8 hidden md:flex items-center gap-4">
               <div className="flex flex-col items-end">
                  <span className="text-white/40 font-black text-[11px] uppercase tracking-widest">Global Index</span>
                  <span className="text-2xl font-[950] text-white tracking-tighter">84.2%</span>
               </div>
               <div className="w-12 h-12 rounded-full border-2 border-emerald-500/30 border-t-emerald-500 flex items-center justify-center">
                  <TrendingUp size={18} className="text-emerald-500" />
               </div>
            </div>
          </header>

          {/* WEATHER WIDGET (Real Data Integrated) */}
          <div className="lg:col-span-4 p-8 md:p-10 rounded-[3.5rem] bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-2xl relative overflow-hidden group flex flex-col justify-between">
            <Cloud className="absolute -top-10 -right-10 w-64 h-64 text-white/10 group-hover:translate-x-10 group-hover:-translate-y-10 transition-transform duration-[5000ms]" />
            
            <div className="relative z-10 space-y-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="font-black text-sm uppercase tracking-[0.4em] opacity-80 decoration-emerald-300 underline underline-offset-4">
                    {weatherLoading ? 'Updating Location...' : (weatherData?.location || 'Local Forecast')}
                  </p>
                  <h3 className="text-2xl font-[950] tracking-tighter uppercase italic">
                    {weatherLoading ? 'Syncing...' : 'Live Conditions'}
                  </h3>
                </div>
                <div className="bg-white/20 backdrop-blur-xl p-2.5 rounded-xl border border-white/20">
                   <Cloud size={20} />
                </div>
              </div>

              <div className="flex items-end gap-2">
                <span className="text-5xl font-[950] tracking-tighter">
                  {weatherLoading ? '—' : `${Math.round(weatherData?.temp || 0)}°`}
                </span>
                <div className="flex flex-col pb-2">
                  <span className="text-white/80 font-black text-[11px] uppercase tracking-widest leading-none mb-1">Celsius</span>
                  <span className="text-sm font-bold text-emerald-100 flex items-center gap-1">
                    {weatherLoading ? '...' : 'Optimal'} 
                    <TrendingUp size={12} />
                  </span>
                </div>
              </div>
            </div>

            <div className="relative z-10 grid grid-cols-3 pt-6 border-t border-white/10 gap-2">
              {[
                { icon: Wind, label: 'Wind', value: `${weatherData?.wind || 0}km/h` },
                { icon: Droplets, label: 'Humid', value: `${weatherData?.humidity || 12}%` },
                { icon: Thermometer, label: 'UV', value: 'Moderate' }
              ].map((item, i) => (
                <div key={i} className="space-y-1 text-center">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-2">
                    <item.icon size={18} />
                  </div>
                  <p className="text-[13px] font-bold uppercase opacity-80 tracking-wider font-sans">{item.label}</p>
                  <p className="text-[15px] font-[900] tracking-tight">
                    {weatherLoading ? '—' : item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* INSIGHTS GRID */}
        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
            {/* RECENT ACTIVITY */}
            <div className="bg-white rounded-[2rem] border border-emerald-100 shadow-sm overflow-hidden p-8 flex flex-col h-full">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-sm">
                    <Activity size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-emerald-950 uppercase tracking-tight">Recent Insights</h3>
                    <p className="text-emerald-900/40 font-bold text-[12px] uppercase tracking-widest leading-none">Latest reports</p>
                  </div>
                </div>
                <Link to="#" className="px-5 py-2 bg-white border border-emerald-100 text-emerald-600 rounded-full hover:bg-emerald-50 transition-all uppercase font-black text-[11px] tracking-widest flex items-center gap-1.5 shadow-sm">
                  View All
                  <ChevronRight size={12} />
                </Link>
              </div>
              <div className="space-y-4 flex-1">
                {loading ? (
                  [1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full" />)
                ) : activities.length > 0 ? (
                  activities.slice(0, 3).map((activity, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{ backgroundColor: 'rgb(240 253 244)' }}
                      transition={{ delay: 0.05 * i }}
                      className="group flex items-center justify-between p-4 rounded-[1.5rem] transition-all border border-transparent hover:border-emerald-50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 bg-white border border-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shadow-sm group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                          {activity.type === 'disease' ? <Leaf size={18} /> : activity.type === 'soil' ? <AlertCircle size={18} /> : <Droplets size={18} />}
                        </div>
                        <div>
                          <h4 className="font-bold text-emerald-950 text-md tracking-tight uppercase leading-none mb-1">{activity.title}</h4>
                          <p className="text-emerald-900/50 font-bold text-[11px] uppercase tracking-wider">{activity.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-[11px] font-black text-emerald-900/30 uppercase tracking-widest hidden md:block">
                          {new Date(activity.timestamp).toLocaleDateString()}
                        </span>
                        <ChevronRight size={16} className="text-emerald-900/20 group-hover:text-emerald-500 transition-all" />
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="py-8 flex flex-col items-center justify-center text-emerald-900/20">
                    <Search size={40} className="mb-2" />
                    <p className="font-black uppercase tracking-widest text-[10px]">No activity recorded yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* MARKETPLACE INSIGHTS */}
            <div className="bg-white rounded-[2rem] border border-emerald-100 shadow-sm overflow-hidden p-8 flex flex-col h-full relative">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white border border-emerald-100 flex items-center justify-center text-emerald-500 rounded-xl shadow-sm">
                    <Store size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-emerald-950 uppercase tracking-tight">Marketplace</h3>
                    <p className="text-emerald-900/40 font-bold text-[12px] uppercase tracking-widest leading-none">Top trends</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 shadow-sm">
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse mr-1" />
                   <span className="text-[11px] font-black uppercase tracking-widest">Live</span>
                </div>
              </div>

              <div className="space-y-3 flex-1">
                {marketplaceInsights.map((product, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{ backgroundColor: 'rgb(240 253 244)' }}
                      transition={{ delay: 0.05 * i }}
                      className="group flex items-center justify-between p-4 rounded-[1.5rem] transition-all border border-transparent hover:border-emerald-50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 bg-white border border-emerald-50 rounded-xl flex items-center justify-center text-lg group-hover:scale-110 transition-all duration-300">
                          {product.icon}
                        </div>
                        <div>
                          <h4 className="font-bold text-emerald-950 text-md tracking-tight uppercase leading-none mb-1">{product.name}</h4>
                          <span className="text-emerald-900/40 text-[10px] font-black uppercase tracking-widest">{product.category}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-xl text-emerald-950 leading-none tracking-tighter mb-1">{product.orders}</p>
                        <div className="flex items-center gap-1 text-emerald-600">
                           <TrendingUp size={10} />
                           <span className="font-bold text-[10px] uppercase tracking-widest">{product.growth}</span>
                        </div>
                      </div>
                    </motion.div>
                ))}
              </div>
            </div>
        </div>
        {/* RIGHT COLUMN: PREVIOUSLY WEATHER (REMOVED/MOVED) */}
      </div>
    </div>
  );
}

export default Home;