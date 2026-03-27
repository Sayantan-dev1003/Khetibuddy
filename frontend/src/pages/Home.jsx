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
      <div className="-mx-6 -mt-6 mb-6">
        <NewsTicker />
      </div>
      
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Loading State */}
        {loading && (
        <Card className="bg-blue-50 border-2 border-blue-300" padding="lg">
          <div className="flex items-center gap-3">
            <Activity className="animate-spin text-blue-600" size={24} />
            <p className="text-blue-800 font-medium">Loading dashboard data...</p>
          </div>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card className="bg-red-50 border-2 border-red-300" padding="lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="text-red-600" size={24} />
              <p className="text-red-800 font-medium">{error}</p>
            </div>
            <button
              onClick={loadDashboardData}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </Card>
      )}

      {/* Welcome Header */}
      <Card className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white" padding="xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 drop-shadow-lg">
              Welcome to Your Farm Dashboard
            </h1>
            <p className="text-lg md:text-xl opacity-90 flex items-center gap-2">
              <Activity size={20} />
              Track, Analyze, and Optimize Your Farming
            </p>
            {stats.scansToday > 0 && (
              <p className="text-sm opacity-75 mt-1">
                {stats.scansToday} scan{stats.scansToday > 1 ? 's' : ''} completed today
              </p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={loadDashboardData}
              disabled={loading}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-semibold transition-colors flex items-center gap-2 disabled:opacity-50"
              title="Refresh data"
            >
              <Activity size={18} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
            <div className="text-right">
              <div className="text-sm opacity-75">Today's Date</div>
              <div className="text-2xl font-bold">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Link key={idx} to={stat.link} className="no-underline group">
              <Card hover={true} className="h-full border-2 border-transparent hover:border-emerald-500 group-hover:scale-105" padding="lg">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white mb-3`}>
                  <Icon size={28} />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {healthMetrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <Card key={idx} className={`${metric.bgColor} border-2 border-gray-200`} padding="lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600 font-medium mb-1">{metric.label}</div>
                  <div className="text-4xl font-bold text-gray-900">{metric.value}</div>
                </div>
                <Icon size={48} className={metric.color} strokeWidth={2} />
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card padding="lg" shadow="lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Clock size={28} className="text-emerald-600" />
                Recent Activity
              </h2>
              <BarChart3 size={24} className="text-gray-400" />
            </div>
            
            {recentActivity.length === 0 ? (
              <div className="text-center py-12">
                <Activity size={64} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">No recent activity</p>
                <p className="text-gray-400 text-sm">Start using services to see your activity here</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((activity, idx) => {
                  const Icon = activity.icon;
                  return (
                    <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className={`p-2 rounded-lg bg-white ${activity.color}`}>
                        <Icon size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{activity.title}</h3>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                      </div>
                      <div className="text-xs text-gray-500 whitespace-nowrap">
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
          <Card padding="lg" shadow="lg" className="h-full bg-gradient-to-br from-blue-50 to-emerald-50">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <TrendingUp size={28} className="text-emerald-600" />
              Farming Tips
            </h2>
            <div className="space-y-4">
              {farmingTips.map((tip, idx) => {
                const Icon = tip.icon;
                return (
                  <div key={idx} className={`p-4 rounded-xl bg-white border-l-4 ${tip.priority === 'high' ? 'border-emerald-500' : 'border-blue-400'}`}>
                    <div className="flex items-start gap-3">
                      <Icon size={20} className="text-emerald-600 flex-shrink-0 mt-1" />
                      <p className="text-sm text-gray-700 leading-relaxed">{tip.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      {/* All Services Grid */}
      <Card padding="xl" shadow="lg">
        <h2 className="text-3xl font-bold text-emerald-700 mb-6 text-center">
          All Services
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {features.map((feature, idx) => (
            <Link 
              key={idx}
              to={feature.to} 
              className="no-underline group"
            >
              <Card 
                hover={true}
                className="h-full text-center border-2 border-transparent hover:border-emerald-500 group-hover:scale-105"
                padding="md"
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} text-white mb-3`}>
                  {feature.icon}
                </div>
                <h3 className="text-emerald-700 font-bold text-sm mb-1">{feature.title}</h3>
                <p className="text-gray-600 text-xs leading-relaxed">{feature.desc}</p>
              </Card>
            </Link>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <Card padding="lg" className="bg-gradient-to-r from-emerald-600 to-green-600 text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Need Help with Your Farm?</h2>
          <p className="text-lg mb-6 opacity-90">Get instant AI-powered guidance in Malayalam or English</p>
          <Link to="/dashboard/chatbot">
            <button className="bg-white text-emerald-600 px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2 mx-auto">
              <MessageCircle size={24} />
              Start Chat Now
            </button>
          </Link>
        </div>
      </Card>
      </div>
    </>
  );
}

export default Home;
