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
  UserCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function Home() {
  const [stats, setStats] = useState({
    totalScans: 142, fertilizerPlans: 12, chatQueries: 840,
    healthyScans: 118, diseasedScans: 24, scansToday: 8
  });
  const [loading, setLoading] = useState(false);

  const quickStats = [
    { label: 'Total Scans', value: stats.totalScans, icon: Leaf, color: 'text-emerald-500', link: '/dashboard/disease-detection' },
    { label: 'AI Advisory', value: stats.fertilizerPlans, icon: Zap, color: 'text-lime-500', link: '/dashboard/fertilizer-advisory' },
    { label: 'Chat Queries', value: stats.chatQueries, icon: MessageCircle, color: 'text-emerald-400', link: '/dashboard/chatbot' },
    { label: 'Health Rate', value: `${((stats.healthyScans / stats.totalScans) * 100).toFixed(0)}%`, icon: CheckCircle2, color: 'text-emerald-600', link: '#' },
  ];

  return (
    <div className="min-h-screen pb-24 relative overflow-hidden font-sans">

      {/* LOCAL ATMOSPHERIC BACKGROUND (Specific to Home) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="w-full mx-auto px-8 relative z-10 pt-12 space-y-12">

        {/* HEADER: GLASSMORPHISM WITH BACKGROUND IMAGE */}
        <header className="flex flex-col md:flex-row justify-between items-center md:items-end gap-10 bg-white/5 backdrop-blur-3xl p-12 rounded-[4rem] border border-white/10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] relative overflow-hidden group">

          {/* THE BACKGROUND IMAGE LAYER (Behind Header Content) */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-[4rem]">
            <img
              src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2000"
              alt="Agri Tech Background"
              className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-all duration-1000 opacity-[0.08]"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-emerald-500/5" />
          </div>

          {/* LEFT CONTENT */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="relative z-10 flex-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
              <span className="text-emerald-400 font-[900] tracking-[0.4em] text-[10px] uppercase">Active Session</span>
            </div>
            <h1 className="text-6xl md:text-[6.5rem] font-[900] text-white tracking-[-0.07em] leading-[0.85] uppercase">
              HELLO, <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-lime-300 italic">NIRMAL.</span>
            </h1>
            <p className="text-emerald-100/50 font-bold text-lg mt-6 max-w-sm leading-tight italic">
              Farm intelligence is synchronized. Your crop health index is 5% higher than last week.
            </p>
          </motion.div>

          {/* THE IMAGE FRAME: FLOATING PROFILE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            className="relative flex-shrink-0 z-10"
          >
            <div className="absolute inset-0 bg-emerald-500/20 blur-[60px] rounded-full group-hover:bg-emerald-500/30 transition-colors pointer-events-none" />

            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-[3.5rem] p-3 bg-white/5 border border-white/10 shadow-2xl transition-all duration-700">
              <div className="w-full h-full rounded-[3rem] overflow-hidden bg-emerald-900/20 relative">

                {/* Fallback Icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                  <UserCircle size={100} className="text-emerald-900" />
                </div>

                {/* User Profile Image */}
                <img
                  src="https://images.unsplash.com/photo-1595009552535-be753447727e?q=80&w=1000"
                  alt="Nirmal Joshi"
                  className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                />

                {/* Integrated Date Info */}
                <div className="absolute bottom-5 right-5 bg-[#020503]/90 backdrop-blur-lg px-6 py-3 rounded-full border border-white/10 text-center shadow-2xl">
                  <p className="text-emerald-400 font-[900] text-[10px] uppercase tracking-widest leading-none mb-1">Status</p>
                  <p className="text-white font-[900] text-3xl tracking-tighter leading-none">28 MAR</p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="absolute -bottom-16 -left-10 text-emerald-900/[0.02] text-[20rem] font-[900] leading-none select-none uppercase pointer-events-none italic">
            BUDDY
          </div>
        </header>

        {/* QUICK STATS SECTION */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {quickStats.map((stat, i) => (
            <motion.div
              key={i} whileHover={{ y: -8, scale: 1.02 }}
              className="bg-white/5 backdrop-blur-xl p-10 rounded-[3rem] border border-white/10 shadow-2xl hover:border-emerald-500/40 transition-all group relative overflow-hidden"
            >
              <div className="relative z-10 text-center lg:text-left">
                <div className="flex justify-between items-center mb-8">
                  <div className={`p-4 rounded-2xl bg-emerald-500/5 ${stat.color}`}>
                    <stat.icon size={24} />
                  </div>
                  <Link to={stat.link}><ArrowUpRight size={20} className="text-slate-200 group-hover:text-emerald-500 transition-colors" /></Link>
                </div>
                <div className="text-6xl font-[900] text-white tracking-tighter leading-none mb-3 uppercase">
                  {stat.value}
                </div>
                <p className="text-emerald-100/40 font-black text-[11px] uppercase tracking-[0.3em]">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* DATA FEED & INTELLIGENCE */}
        <div className="grid lg:grid-cols-3 gap-10">

          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-3xl font-[900] text-white tracking-tight uppercase flex items-center gap-4 px-4">
              <Clock className="text-emerald-500" size={28} /> Live Activity
            </h2>
            <div className="bg-white/5 backdrop-blur-xl rounded-[3.5rem] border border-white/10 shadow-2xl overflow-hidden">
              {[1, 2, 3].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-10 hover:bg-white/5 transition-all border-b border-white/5 last:border-0 group">
                  <div className="flex items-center gap-8">
                    <div className="w-14 h-14 bg-emerald-50 rounded-[1.5rem] flex items-center justify-center text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500">
                      <Leaf size={24} />
                    </div>
                    <div>
                      <h4 className="font-[900] text-white text-2xl tracking-tight uppercase leading-none mb-1">Crop Analysis #0{item}</h4>
                      <p className="text-emerald-100/40 font-bold text-xs uppercase tracking-widest">Sector-B • Verified 100%</p>
                    </div>
                  </div>
                  <ChevronRight size={24} className="text-slate-200 group-hover:text-emerald-500 transition-all" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <h2 className="text-3xl font-[900] text-white tracking-tight uppercase px-4">Insights</h2>
            <div className="bg-[#020503] rounded-[3.5rem] p-12 text-white relative overflow-hidden group shadow-3xl">
              <div className="relative z-10">
                <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center mb-10 shadow-[0_0_30px_rgba(16,185,129,0.5)]">
                  <Zap size={28} fill="currentColor" className="text-black" />
                </div>
                <h3 className="text-4xl font-[900] tracking-tighter uppercase leading-none mb-6 italic">Yield <br /> Optimization</h3>
                <p className="text-emerald-100/40 font-bold text-md mb-12 leading-relaxed italic">Soil moisture is dropping in Sector-A. Schedule irrigation within 4 hours.</p>
                <button className="group bg-emerald-500 text-[#020503] w-full py-6 rounded-2xl font-[900] uppercase tracking-widest text-sm hover:bg-emerald-400 transition-all flex items-center justify-center gap-3">
                  Fix Now <ArrowRight size={18} strokeWidth={3} className="group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* AI ACTION BAR */}
        <div className="bg-emerald-500 rounded-[4rem] p-16 flex flex-col md:flex-row justify-between items-center gap-10 shadow-[0_50px_100px_-20px_rgba(16,185,129,0.4)] group cursor-pointer overflow-hidden relative transition-all active:scale-95">
          <div className="flex items-center gap-10 relative z-10 text-center md:text-left">
            <div className="w-24 h-24 bg-[#020503] rounded-[2.5rem] flex items-center justify-center shadow-3xl group-hover:rotate-[20deg] transition-transform duration-700">
              <MessageCircle size={45} className="text-emerald-400 fill-emerald-400" />
            </div>
            <div>
              <h3 className="text-5xl md:text-6xl font-[900] text-[#020503] tracking-[-0.05em] uppercase leading-none mb-3">Ask AI.</h3>
              <p className="text-[#020503]/50 font-black text-sm uppercase tracking-[0.4em] italic">Instant Support Active</p>
            </div>
          </div>
          <Link to="/dashboard/chatbot" className="relative z-10 w-full md:w-auto">
            <button className="bg-[#020503] text-white w-full px-14 py-7 rounded-3xl font-[900] uppercase tracking-widest text-lg flex items-center justify-center gap-4 hover:scale-105 transition-all shadow-2xl">
              Launch Bot <Zap size={20} fill="currentColor" className="text-emerald-400" />
            </button>
          </Link>
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-white/20 blur-[100px] rounded-full group-hover:bg-white/30 transition-all duration-1000" />
        </div>

      </div>
    </div>
  );
}

export default Home;