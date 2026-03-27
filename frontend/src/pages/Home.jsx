import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MessageCircle, Leaf, TestTube, Droplets, MapPin, 
  TrendingUp, Calendar, AlertCircle, CheckCircle2, 
  Activity, BarChart3, Clock, Sprout
} from 'lucide-react';
import Card from '../components/ui/Card';
import NewsTicker from '../components/NewsTicker';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function Home() {
  // Dashboard stats from MongoDB
  const [stats, setStats] = useState({
    totalScans: 0,
    fertilizerPlans: 0,
    chatQueries: 0,
    healthyScans: 0,
    diseasedScans: 0,
    scansToday: 0
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [farmingTips, setFarmingTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load dashboard data on mount
  useEffect(() => {
    loadDashboardData();
    loadFarmingTips();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch stats and recent activity from backend
      const [statsRes, activityRes] = await Promise.all([
        fetch(`${API_BASE}/api/dashboard/stats`),
        fetch(`${API_BASE}/api/dashboard/recent-activity?limit=5`)
      ]);

      if (!statsRes.ok || !activityRes.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const statsData = await statsRes.json();
      const activityData = await activityRes.json();

      if (statsData.success) {
        setStats(statsData.data);
      }

      if (activityData.success) {
        // Map icon names to actual components
        const activitiesWithIcons = activityData.data.map(activity => ({
          ...activity,
          time: new Date(activity.timestamp),
          icon: activity.icon === 'Leaf' ? Leaf : 
                activity.icon === 'TestTube' ? TestTube : 
                activity.icon === 'Droplets' ? Droplets : Activity
        }));
        setRecentActivity(activitiesWithIcons);
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadFarmingTips = () => {
    const tips = [
      { icon: Sprout, text: 'Regular soil testing every 3 months improves crop yield by 20%', priority: 'high' },
      { icon: Leaf, text: 'Early disease detection can save up to 40% of crop loss', priority: 'high' },
      { icon: Droplets, text: 'Apply fertilizers during early morning or evening for best results', priority: 'medium' },
      { icon: Calendar, text: 'Track your planting and harvesting dates for better planning', priority: 'medium' },
    ];
    setFarmingTips(tips);
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  // Quick stats cards
  const quickStats = [
    { label: 'Total Scans', value: stats.totalScans, icon: Leaf, color: 'from-green-500 to-green-600', link: '/dashboard/disease-detection' },
    { label: 'Fertilizer Plans', value: stats.fertilizerPlans, icon: Droplets, color: 'from-purple-500 to-purple-600', link: '/dashboard/fertilizer-advisory' },
    { label: 'Chat Queries', value: stats.chatQueries, icon: MessageCircle, color: 'from-blue-500 to-blue-600', link: '/dashboard/chatbot' },
  ];

  const healthMetrics = [
    { label: 'Healthy Crops', value: stats.healthyScans, icon: CheckCircle2, color: 'text-green-600', bgColor: 'bg-green-50' },
    { label: 'Issues Detected', value: stats.diseasedScans, icon: AlertCircle, color: 'text-red-600', bgColor: 'bg-red-50' },
  ];

  const features = [
    {
      to: '/dashboard/chatbot',
      icon: <MessageCircle size={48} />,
      title: 'Smart Chatbot',
      desc: 'Ask farming questions in Malayalam or English. Voice input supported.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      to: '/dashboard/disease-detection',
      icon: <Leaf size={48} />,
      title: 'Disease Detection',
      desc: 'Upload plant photos to identify diseases and get treatment advice.',
      color: 'from-green-500 to-green-600'
    },
    {
      to: '/dashboard/fertilizer-advisory',
      icon: <Droplets size={48} />,
      title: 'Fertilizer Advisor',
      desc: 'Get personalized fertilizer recommendations for your crops.',
      color: 'from-purple-500 to-purple-600'
    },
    {
      to: '/dashboard/nearby-market',
      icon: <MapPin size={48} />,
      title: 'Nearby Markets',
      desc: 'Find seed shops and mandi markets near you.',
      color: 'from-red-500 to-red-600'
    },
  ];

  return (
    <>
      {/* News Ticker - Positioned outside container for full width, close to navbar */}
      <div className="-mx-6 -mt-10 mb-8">
        <NewsTicker />
      </div>
      
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Loading State */}
        {loading && (
        <Card className="bg-[var(--bg-alt)] border-2 border-[var(--primary-light)]/20" padding="lg">
          <div className="flex items-center gap-4">
            <Activity className="animate-spin text-[var(--primary)]" size={28} />
            <p className="text-[var(--primary)] font-bold text-xl">Nurturing your dashboard data...</p>
          </div>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card className="bg-red-50 border-2 border-red-200" padding="lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <AlertCircle className="text-red-600" size={28} />
              <p className="text-red-800 font-bold text-lg">{error}</p>
            </div>
            <PrimaryButton
              onClick={loadDashboardData}
              variant="accent"
              size="md"
            >
              Try Again
            </PrimaryButton>
          </div>
        </Card>
      )}

      {/* Welcome Header */}
      <div className="page-header !mb-0 !p-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative z-10">
          <div className="flex-1">
            <h1 className="text-4xl md:text-6xl font-black mb-4 drop-shadow-xl text-white">
              Sowing Success, <span className="text-[var(--leaf-bright)]">Farmer!</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 flex items-center gap-3 font-medium">
              <Sprout size={28} className="text-[var(--leaf-bright)]" />
              Your farm's digital heartbeat is looking strong today.
            </p>
            {stats.scansToday > 0 && (
              <div className="inline-block mt-6 px-4 py-2 bg-white/20 rounded-full text-sm font-bold backdrop-blur-sm border border-white/10">
                🌱 {stats.scansToday} scan{stats.scansToday > 1 ? 's' : ''} completed today
              </div>
            )}
          </div>
          <div className="flex flex-col items-end gap-6 text-right">
            <div className="bg-white/10 p-6 rounded-[2.5rem] backdrop-blur-md border border-white/10 shadow-2xl">
              <div className="text-sm font-black uppercase tracking-widest text-white/60 mb-1">Today's Harvest Date</div>
              <div className="text-3xl font-black text-white">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
            </div>
            <button
              onClick={loadDashboardData}
              disabled={loading}
              className="px-6 py-3 bg-[var(--leaf-bright)] hover:bg-white text-[var(--earth-deep)] rounded-2xl font-black transition-all flex items-center gap-2 shadow-xl hover:scale-105 disabled:opacity-50"
            >
              <Activity size={20} className={loading ? 'animate-spin' : ''} />
              Sync Farm Data
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, idx) => {
          const Icon = stat.icon;
          const gradientColors = idx % 3 === 0 ? 'from-[#5d4037] to-[#3e2723]' : 
                                idx % 3 === 1 ? 'from-[#8da14e] to-[#6b8e23]' : 
                                'from-[#bc6c25] to-[#a45c1e]';
          return (
            <Link key={idx} to={stat.link} className="no-underline group">
              <Card hover={true} className="h-full border-b-4 border-b-[var(--primary)] group-hover:border-b-[var(--accent)]" padding="lg">
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${gradientColors} text-white mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon size={32} />
                </div>
                <div className="text-4xl font-black text-[var(--primary)] mb-1">{stat.value}</div>
                <div className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-widest">{stat.label}</div>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {healthMetrics.map((metric, idx) => {
          const Icon = metric.icon;
          const isHealthy = metric.label.toLowerCase().includes('healthy');
          return (
            <Card key={idx} className={`${isHealthy ? 'bg-[#f1f8e9]' : 'bg-[#fff3e0]'} border-2 ${isHealthy ? 'border-[#c5e1a5]' : 'border-[#ffe0b2]'}`} padding="lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-black text-[var(--text-muted)] uppercase tracking-widest mb-2">{metric.label}</div>
                  <div className={`text-5xl font-black ${isHealthy ? 'text-[#33691e]' : 'text-[#e65100]'}`}>{metric.value}</div>
                </div>
                <div className={`${isHealthy ? 'bg-white/50' : 'bg-white/50'} p-4 rounded-[2.5rem] shadow-sm`}>
                  <Icon size={56} className={isHealthy ? 'text-[#33691e]' : 'text-[#e65100]'} strokeWidth={3} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card padding="lg" shadow="lg" className="h-full">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-black text-[var(--primary)] flex items-center gap-3">
                <Clock size={32} className="text-[var(--accent)]" />
                Recent Yields & Activity
              </h2>
              <div className="p-2 bg-[var(--bg-alt)] rounded-xl">
                <BarChart3 size={24} className="text-[var(--primary)]" />
              </div>
            </div>
            
            {recentActivity.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-7xl mb-6 opacity-30">🚜</div>
                <p className="text-[var(--text-muted)] text-xl font-bold">Your farm is waiting for action!</p>
                <p className="text-[var(--text-muted)]/60 text-sm mt-2">Services you use will appear here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((activity, idx) => {
                  const Icon = activity.icon;
                  return (
                    <div key={idx} className="flex items-start gap-6 p-5 rounded-3xl bg-[var(--bg-alt)]/50 hover:bg-white transition-all border border-transparent hover:border-[var(--primary-light)]/20 hover:shadow-xl group">
                      <div className={`p-4 rounded-2xl bg-white shadow-sm group-hover:bg-[var(--primary)] group-hover:text-white transition-colors`}>
                        <Icon size={28} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-black text-[var(--primary)]">{activity.title}</h3>
                        <p className="text-[var(--text-muted)] font-medium">{activity.description}</p>
                      </div>
                      <div className="text-xs font-black text-[var(--accent)] uppercase tracking-tighter self-center px-3 py-1 bg-white rounded-full border border-[var(--primary-light)]/10">
                        {getTimeAgo(activity.time)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Farming Tips & Insights */}
        <div className="lg:col-span-1">
          <Card padding="lg" shadow="lg" className="h-full bg-[var(--primary)] border-none relative overflow-hidden group">
            {/* Texture overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none paper-texture"></div>
            
            <h2 className="text-3xl font-black text-white mb-8 flex items-center gap-3 relative z-10">
              <TrendingUp size={32} className="text-[var(--leaf-bright)]" />
              Season's Best Tips
            </h2>
            <div className="space-y-6 relative z-10">
              {farmingTips.map((tip, idx) => {
                const Icon = tip.icon;
                return (
                  <div key={idx} className={`p-6 rounded-3xl bg-white/10 backdrop-blur-md border-l-8 transition-transform hover:translate-x-2 ${tip.priority === 'high' ? 'border-[var(--leaf-bright)]' : 'border-[var(--accent)]'}`}>
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-white/10 rounded-lg">
                        <Icon size={24} className="text-[var(--leaf-bright)]" />
                      </div>
                      <p className="text-base text-white font-medium leading-relaxed">{tip.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-10 p-6 bg-white/5 rounded-3xl border border-white/10 relative z-10 text-center">
              <p className="text-white/60 text-sm font-bold uppercase tracking-widest mb-2">Sustainable Choice</p>
              <p className="text-white text-lg font-bold">Use organic mulch to retain 30% more soil moisture.</p>
            </div>
          </Card>
        </div>
      </div>

      {/* All Services Grid */}
      <Card padding="xl" shadow="xl" className="!bg-[var(--bg-alt)] border-2 border-[var(--primary-light)]/10">
        <h2 className="text-4xl font-black text-[var(--primary)] mb-10 text-center tracking-tight">
          Cultivate Your Excellence
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => {
             const featureColors = idx === 0 ? 'from-[#5d4037] to-[#8d6e63]' : 
                                  idx === 1 ? 'from-[#8da14e] to-[#a4be5c]' : 
                                  idx === 2 ? 'from-[#bc6c25] to-[#d4a373]' : 
                                  'from-[#3e2723] to-[#5d4037]';
            return (
              <Link 
                key={idx}
                to={feature.to} 
                className="no-underline group"
              >
                <Card 
                  hover={true}
                  className="h-full text-center group-hover:shadow-[0_20px_50px_rgba(93,64,55,0.2)]"
                  padding="lg"
                >
                  <div className={`inline-flex p-5 rounded-[2rem] bg-gradient-to-br ${featureColors} text-white mb-6 shadow-xl group-hover:scale-110 transition-transform`}>
                    {React.cloneElement(feature.icon, { size: 48 })}
                  </div>
                  <h3 className="text-[var(--primary)] font-black text-xl mb-3 tracking-tight">{feature.title}</h3>
                  <p className="text-[var(--text-muted)] text-base leading-relaxed font-medium">{feature.desc}</p>
                </Card>
              </Link>
            )
          })}
        </div>
      </Card>

      {/* Quick Actions */}
      <Card padding="xl" className="bg-gradient-to-r from-[var(--earth-deep)] to-[var(--primary)] text-white border-none relative overflow-hidden">
         {/* Texture overlay */}
         <div className="absolute inset-0 opacity-10 pointer-events-none paper-texture"></div>
         <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[var(--leaf-bright)] rounded-full blur-3xl opacity-10"></div>
         
        <div className="text-center relative z-10 py-6">
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Need a Hand on the Farm?</h2>
          <p className="text-xl md:text-2xl mb-10 opacity-90 font-medium max-w-2xl mx-auto">Get instant AI-powered guidance in Malayalam or English. We're here for you 24/7.</p>
          <Link to="/dashboard/chatbot">
            <button className="bg-[var(--leaf-bright)] text-[var(--earth-deep)] px-12 py-5 rounded-[2rem] font-black text-xl shadow-[0_15px_30px_rgba(164,190,92,0.4)] hover:shadow-[0_20px_40px_rgba(164,190,92,0.6)] hover:scale-105 transition-all flex items-center gap-3 mx-auto">
              <MessageCircle size={32} />
              Talk to your KhetiBuddy
            </button>
          </Link>
        </div>
      </Card>
      </div>
    </>
  );
}

export default Home;
