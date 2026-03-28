import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageCircle,
  Leaf,
  Droplets,
  CheckCircle2,
  Activity,
  Clock,
  Zap,
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
  const [healthOverview, setHealthOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsRes, activityRes, healthRes] = await Promise.all([
          get('/api/dashboard/stats'),
          get('/api/dashboard/recent-activity'),
          get('/api/dashboard/crop-health')
        ]);

        if (statsRes.success) setStats(statsRes.data);
        if (activityRes.success) setActivities(activityRes.data);
        if (healthRes.success) setHealthOverview(healthRes.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to sync system intelligence');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const metaStats = [
    { 
      label: 'Last Sync', 
      value: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
      status: 'info',
      icon: Clock
    }
  ];

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
        
        {/* DASHBOARD TOP BAR */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-emerald-600/60 font-black text-[10px] uppercase tracking-[0.3em] mb-2">
              <LayoutDashboard size={14} />
              <span>Network Console</span>
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse ml-2 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            </div>
            <h1 className="text-4xl md:text-5xl font-[950] text-[#020503] tracking-[-0.05em] leading-[0.9]">
              CORE <span className="text-emerald-500 italic">DASHBOARD</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-6 px-4 py-2 bg-white/40 backdrop-blur-xl border border-white/60 rounded-full shadow-sm">
              {metaStats.map((stat, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600`}>
                    <stat.icon size={14} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase font-black text-emerald-900/40 leading-none">{stat.label}</span>
                    <span className="text-[11px] font-black text-emerald-900 leading-tight">{stat.value}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button className="p-3 bg-white/60 border border-white/80 rounded-2xl text-emerald-900 hover:bg-emerald-50 transition-all shadow-sm group">
                <Bell size={20} className="group-hover:rotate-12 transition-transform" />
              </button>
              <button className="p-3 bg-white/60 border border-white/80 rounded-2xl text-emerald-900 hover:bg-emerald-50 transition-all shadow-sm">
                <Search size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* HERO BANNER - DYNAMIC GREETING */}
        <header className="relative h-[240px] md:h-[320px] rounded-[3.5rem] bg-[#020503] overflow-hidden group shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2000" 
            className="absolute inset-0 w-full h-full object-cover opacity-30 scale-105 group-hover:scale-100 transition-transform duration-[3000ms]"
            alt="Field"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#020503] via-[#020503]/20 to-transparent" />
          
          <div className="relative h-full flex flex-col justify-end p-8 md:p-14 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 backdrop-blur-xl border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Sparkles size={20} />
                </div>
                <span className="text-emerald-400 font-black text-[10px] uppercase tracking-[0.4em]">Agricultural Intelligence Active</span>
              </div>
              <h2 className="text-5xl md:text-8xl font-[950] text-white tracking-[-0.06em] leading-tight uppercase">
                Welcome, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-lime-300 italic">
                  {user?.name?.split(' ')[0] || 'Partner'}
                </span>
              </h2>
            </motion.div>
          </div>

          <div className="absolute top-10 right-10 hidden md:flex items-center gap-6">
             <div className="flex flex-col items-end">
                <span className="text-white/40 font-black text-[10px] uppercase tracking-widest">Global Index</span>
                <span className="text-3xl font-[950] text-white tracking-tighter">84.2%</span>
             </div>
             <div className="w-16 h-16 rounded-full border-4 border-emerald-500/30 border-t-emerald-500 flex items-center justify-center">
                <TrendingUp size={24} className="text-emerald-500" />
             </div>
          </div>
        </header>

        {/* MAIN DASHBOARD GRID */}
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: STATS & ACTIVITY (8 COLS) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* STATS STRIP */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'Total Scans', value: stats?.totalScans, icon: Leaf, color: 'emerald' },
                { label: 'Soil Reports', value: stats?.soilTests, icon: Zap, color: 'lime' },
                { label: 'AI Advisory', value: stats?.fertilizerPlans, icon: Droplets, color: 'blue' },
                { label: 'Chat Access', value: stats?.chatQueries, icon: MessageCircle, color: 'indigo' },
              ].map((stat, i) => (
                <motion.div 
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="bg-white p-8 rounded-[2.5rem] border border-emerald-100/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group"
                >
                  <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-500/10 text-${stat.color}-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <stat.icon size={22} />
                  </div>
                  {loading ? (
                    <Skeleton className="h-10 w-20 mb-2" />
                  ) : (
                    <div className="text-4xl font-[950] text-[#020503] tracking-tighter mb-1">
                      {stat.value || 0}
                    </div>
                  )}
                  <p className="text-emerald-900/40 font-black text-[10px] uppercase tracking-widest">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* RECENT ACTIVITY */}
            <div className="bg-white rounded-[3.5rem] border border-emerald-100/50 shadow-sm overflow-hidden p-8 md:p-12 space-y-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <Activity size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-[950] text-emerald-900 tracking-tight uppercase">Recent Insights</h3>
                    <p className="text-emerald-900/40 font-black text-[11px] uppercase tracking-[0.25em]">Live activity feed</p>
                  </div>
                </div>
                <Link to="#" className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-100 transition-colors uppercase font-black text-[10px] tracking-widest">
                  View All
                </Link>
              </div>

              <div className="space-y-4">
                {loading ? (
                  [1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full" />)
                ) : activities.length > 0 ? (
                  activities.map((activity, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * i }}
                      className="group flex items-center justify-between p-6 bg-emerald-50/20 hover:bg-emerald-50 rounded-3xl transition-all border border-transparent hover:border-emerald-100"
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500">
                          {activity.type === 'disease' ? <Leaf size={20} /> : activity.type === 'soil' ? <AlertCircle size={20} /> : <Droplets size={20} />}
                        </div>
                        <div>
                          <h4 className="font-black text-emerald-900 text-lg tracking-tight uppercase leading-none mb-1">{activity.title}</h4>
                          <p className="text-emerald-900/40 font-bold text-xs uppercase tracking-widest italic">{activity.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest hidden md:block">
                          {new Date(activity.timestamp).toLocaleDateString()}
                        </span>
                        <ChevronRight size={18} className="text-emerald-900/20 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="py-12 flex flex-col items-center justify-center text-emerald-900/20">
                    <Search size={48} className="mb-4" />
                    <p className="font-black uppercase tracking-widest text-sm">No activity recorded yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: ANALYTICS & TOOLS (4 COLS) */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* WEATHER WIDGET (Pro Mock) */}
            <div className="p-10 rounded-[3.5rem] bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-2xl relative overflow-hidden group">
              <Cloud className="absolute -top-10 -right-10 w-64 h-64 text-white/10 group-hover:translate-x-10 group-hover:-translate-y-10 transition-transform duration-[5000ms]" />
              
              <div className="relative z-10 space-y-10">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="font-black text-[10px] uppercase tracking-[0.4em] opacity-60">Local Forecast</p>
                    <h3 className="text-3xl font-[950] tracking-tighter uppercase italic">Perfect Conditions</h3>
                  </div>
                  <div className="bg-white/20 backdrop-blur-xl p-3 rounded-2xl border border-white/20">
                     <Cloud size={24} />
                  </div>
                </div>

                <div className="flex items-end gap-2">
                  <span className="text-7xl font-[950] tracking-tighter">24°</span>
                  <div className="flex flex-col pb-2">
                    <span className="text-white/60 font-black text-[10px] uppercase tracking-widest">Celsius</span>
                    <span className="text-md font-bold text-emerald-100 flex items-center gap-1">Sunny <TrendingUp size={14} /></span>
                  </div>
                </div>

                <div className="grid grid-cols-3 pt-6 border-t border-white/10 gap-4">
                  {[
                    { icon: Wind, label: 'Wind', value: '12km/h' },
                    { icon: Droplets, label: 'Humid', value: '42%' },
                    { icon: Thermometer, label: 'UV', value: 'High' }
                  ].map((item, i) => (
                    <div key={i} className="space-y-1 text-center">
                      <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-2">
                        <item.icon size={14} />
                      </div>
                      <p className="text-[8px] font-black uppercase opacity-40">{item.label}</p>
                      <p className="text-[10px] font-black">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CROP HEALTH OVERVIEW */}
            <div className="bg-white rounded-[3.5rem] border border-emerald-100/50 shadow-sm p-10 space-y-8">
               <div>
                  <h3 className="text-2xl font-[950] text-[#020503] tracking-tight uppercase mb-1">Health Shield</h3>
                  <p className="text-emerald-900/40 font-black text-[10px] uppercase tracking-[0.3em]">Network vulnerability scan</p>
               </div>
               
               <div className="space-y-6">
                  <div className="relative h-4 w-full bg-emerald-50 rounded-full overflow-hidden">
                     <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: loading ? '30%' : `${healthOverview?.avgConfidence || 0}%` }}
                        className="absolute h-full bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.4)]" 
                      />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-emerald-50 rounded-[2.5rem] text-center border border-emerald-100/50">
                       <p className="text-2xl font-[950] text-emerald-600 tracking-tighter">{healthOverview?.healthyCount || 0}</p>
                       <p className="text-[9px] font-black uppercase tracking-widest text-emerald-900/40">Healthy</p>
                    </div>
                    <div className="p-6 bg-red-50 rounded-[2.5rem] text-center border border-red-100/50">
                       <p className="text-2xl font-[950] text-red-600 tracking-tighter">{healthOverview?.diseasedCount || 0}</p>
                       <p className="text-[9px] font-black uppercase tracking-widest text-red-900/40">Alerts</p>
                    </div>
                  </div>
                  
                  <button className="w-full py-5 bg-emerald-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-black transition-all shadow-xl flex items-center justify-center gap-3">
                    Deep Scan <Zap size={14} fill="white" className="text-emerald-400" />
                  </button>
               </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="space-y-4">
              <h4 className="px-6 text-emerald-900/30 font-black text-[10px] uppercase tracking-[0.3em]">Quick Utilities</h4>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Chat AI', path: '/dashboard/chatbot', icon: MessageCircle },
                  { label: 'Detect', path: '/dashboard/disease-detection', icon: Leaf },
                  { label: 'Market', path: '/dashboard/nearby-market', icon: Store },
                  { label: 'Maps', path: '/dashboard/nearby-map', icon: MapPin },
                ].map((action, i) => (
                  <Link 
                    key={i} 
                    to={action.path}
                    className="flex flex-col items-center justify-center p-6 bg-white border border-emerald-100/50 rounded-[2.5rem] hover:bg-emerald-50 hover:border-emerald-200 transition-all shadow-sm group"
                  >
                    <action.icon size={20} className="text-emerald-600 mb-2 group-hover:scale-125 transition-transform" />
                    <span className="text-[10px] font-[900] text-emerald-900 uppercase tracking-widest">{action.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM ACTION CTA */}
        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="bg-emerald-500 rounded-[4rem] p-12 md:p-16 flex flex-col md:flex-row justify-between items-center gap-10 shadow-3xl group cursor-pointer overflow-hidden relative"
        >
          <div className="flex items-center gap-10 relative z-10 text-center md:text-left">
            <div className="w-24 h-24 bg-[#020503] rounded-[2.5rem] flex items-center justify-center shadow-[0_30px_60px_rgba(0,0,0,0.3)] group-hover:rotate-[15deg] transition-transform duration-700">
              <Sparkles size={40} className="text-emerald-400" />
            </div>
            <div>
              <h3 className="text-4xl md:text-6xl font-[950] text-[#020503] tracking-[-0.05em] uppercase leading-none mb-3 italic">Upgrade <br /> Yield.</h3>
              <p className="text-[#020503]/50 font-black text-[11px] uppercase tracking-[0.4em]">Get Premium AI Precision</p>
            </div>
          </div>
          <button className="relative z-10 bg-[#020503] text-white px-14 py-7 rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-lg flex items-center gap-4 hover:scale-105 transition-all shadow-2xl">
            Go Enterprise <Plus size={24} />
          </button>
          
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 blur-[120px] rounded-full pointer-events-none" />
        </motion.div>

      </div>
    </div>
  );
}

export default Home;