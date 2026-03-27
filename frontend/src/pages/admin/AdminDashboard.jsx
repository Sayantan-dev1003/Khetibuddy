import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ShieldAlert, 
  MessageSquare, 
  TrendingUp, 
  Activity,
  ArrowRight,
  RefreshCcw,
  Calendar,
  Layers,
  FileText
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      
      const [statsRes, activitiesRes] = await Promise.all([
        fetch(`${baseUrl}/admin/stats`, { credentials: 'include' }),
        fetch(`${baseUrl}/admin/activities`, { credentials: 'include' })
      ]);

      const statsData = await statsRes.json();
      const activitiesData = await activitiesRes.json();

      if (statsData.success) setStats(statsData.data);
      if (activitiesData.success) setActivities(activitiesData.data);
      
    } catch (err) {
      console.error('Error fetching admin data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const statCards = [
    { 
      label: 'Total Users', 
      value: stats?.users?.total || 0, 
      change: `+${stats?.users?.growth || 0}%`, 
      icon: Users, 
      color: 'bg-blue-500', 
      lightColor: 'bg-blue-50' 
    },
    { 
      label: 'Disease Scans', 
      value: stats?.scans?.total || 0, 
      change: `Today: ${stats?.scans?.today || 0}`, 
      icon: ShieldAlert, 
      color: 'bg-red-500', 
      lightColor: 'bg-red-50' 
    },
    { 
      label: 'AI Queries', 
      value: stats?.chats?.total || 0, 
      change: `Today: ${stats?.chats?.today || 0}`, 
      icon: MessageSquare, 
      color: 'bg-purple-500', 
      lightColor: 'bg-purple-50' 
    },
    { 
      label: 'Soil Reports', 
      value: stats?.resources?.soilReports || 0, 
      change: 'Active Monitoring', 
      icon: Layers, 
      color: 'bg-orange-500', 
      lightColor: 'bg-orange-50' 
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Admin Command Center</h1>
          <p className="text-slate-500 mt-1">System-wide overview and management for KhetiBuddy.</p>
        </div>
        <button 
          onClick={fetchAdminData}
          className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-all shadow-sm group"
        >
          <RefreshCcw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
          Refresh Data
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-xl ${stat.lightColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${index === 0 ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                {stat.change}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value.toLocaleString()}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between">
            <div className="flex items-center">
              <Activity className="w-5 h-5 text-green-600 mr-2" />
              <h2 className="text-lg font-bold text-slate-900">Recent System Activity</h2>
            </div>
            <button className="text-sm font-semibold text-green-600 hover:text-green-700 flex items-center">
              View Audit Logs <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          <div className="divide-y divide-slate-50">
            {activities.length > 0 ? activities.map((activity, idx) => (
              <div key={idx} className="p-4 hover:bg-slate-50 transition-colors flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  activity.type === 'SCAN' ? 'bg-red-50 text-red-600' : 'bg-purple-50 text-purple-600'
                }`}>
                  {activity.type === 'SCAN' ? <ShieldAlert className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-bold text-slate-800 truncate">{activity.user}</p>
                    <span className="text-xs text-slate-400">
                      {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 truncate">{activity.detail}</p>
                </div>
              </div>
            )) : (
              <div className="p-12 text-center text-slate-500">
                No recent activities found.
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions / System Health */}
        <div className="space-y-8">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
              <RefreshCcw className="w-5 h-5 text-blue-600 mr-2" />
              System Status
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-3 animate-pulse"></div>
                  <span className="text-sm font-medium text-slate-700">Database</span>
                </div>
                <span className="text-xs font-bold text-green-600">CONNECTED</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-3 animate-pulse"></div>
                  <span className="text-sm font-medium text-slate-700">Groq API</span>
                </div>
                <span className="text-xs font-bold text-green-600">ACTIVE</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-3 animate-pulse"></div>
                  <span className="text-sm font-medium text-slate-700">Image ML Server</span>
                </div>
                <span className="text-xs font-bold text-green-600">ONLINE</span>
              </div>
            </div>
            
            <div className="mt-8">
               <button className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  View System Reports
                </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-2">User Management</h3>
              <p className="text-green-100 text-sm mb-6">Manage accounts, roles, and access permissions.</p>
              <button className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-sm font-bold transition-all border border-white/30">
                Open Manager
              </button>
            </div>
            <Users className="absolute -bottom-4 -right-4 w-24 h-24 text-white/10 group-hover:scale-110 transition-transform duration-700" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
