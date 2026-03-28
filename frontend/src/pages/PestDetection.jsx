import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Bug, AlertCircle, CheckCircle, Search, Shield, Zap, Sparkles, Navigation, ChevronRight, Loader2, Leaf } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import { postFile, API_BASE } from '../services/api';

export default function PestDetection() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError('Geospatial payload exceeds 10MB limit.');
      return;
    }

    setSelectedFile(file);
    setError(null);
    setResult(null);

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleDetection = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const res = await postFile('/api/pest/detect', formData);

      if (!res.success) {
        throw new Error(res.message || 'Detection failed.');
      }

      setResult(res.data);
    } catch (err) {
      setError(err.message || 'System failed to analyze geospatial node.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen pb-24 relative overflow-hidden font-sans">
      {/* ATMOSPHERIC BACKGROUND */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[10%] right-[10%] w-[50%] h-[50%] bg-red-500/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[10%] left-[10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-[1200px] mx-auto px-6 relative z-10 pt-8 space-y-12">
        <PageHeader 
          icon="🪲"
          title="PEST CONTROL"
          subtitle="AUTONOMOUS DETECTION: IDENTIFY INFESTATIONS AND ACCESS TARGETED MITIGATION STRATEGIES."
          variant="cinematic"
        />

        <div className="grid lg:grid-cols-12 gap-8">
          {/* UPLOAD SECTION (5 COLS) */}
          <div className="lg:col-span-5 space-y-8 animate-in slide-in-from-left duration-700">
            <div className="bg-white/60 backdrop-blur-3xl border border-white rounded-[3.5rem] p-10 shadow-sm space-y-8">
               <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <Bug size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-[950] text-[#020503] tracking-tight uppercase">Upload Target</h3>
                    <p className="text-emerald-900/40 font-black text-[11px] uppercase tracking-[0.25em]">Precision scan active</p>
                  </div>
               </div>

               <div className="relative">
                  <input type="file" id="pestFile" hidden onChange={handleFileSelect} accept="image/*" />
                  <label 
                    htmlFor="pestFile"
                    className="block border-4 border-dashed border-emerald-100 rounded-[2.5rem] min-h-[340px] cursor-pointer group hover:border-emerald-300 transition-all overflow-hidden"
                  >
                    {preview ? (
                      <div className="relative h-full">
                        <img src={preview} className="w-full h-[340px] object-cover" alt="Preview" />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 font-black text-white uppercase tracking-widest text-sm">
                           Change Image
                        </div>
                      </div>
                    ) : (
                      <div className="h-[340px] flex flex-col items-center justify-center text-emerald-900/20 group-hover:text-emerald-500 transition-colors">
                         <Upload size={64} className="mb-4" />
                         <p className="font-black uppercase tracking-[0.2em] text-sm">Deploy Visual Data</p>
                      </div>
                    )}
                  </label>
               </div>

               <div className="flex gap-4 pt-4">
                  <button 
                    onClick={handleReset}
                    className="flex-1 py-5 rounded-2xl font-black uppercase tracking-widest text-xs border border-emerald-100 text-emerald-900 hover:bg-emerald-50 transition-all"
                  >
                    Clear Node
                  </button>
                  <button 
                    onClick={handleDetection}
                    disabled={!selectedFile || loading}
                    className="flex-[2] py-5 bg-emerald-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} fill="white" className="text-emerald-400" />}
                    {loading ? 'Analyzing...' : 'Execute Analysis'}
                  </button>
               </div>

               {error && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 flex items-center gap-3 font-bold text-sm">
                   <AlertCircle size={18} /> {error}
                 </motion.div>
               )}
            </div>
          </div>

          {/* RESULTS SECTION (7 COLS) */}
          <div className="lg:col-span-7 space-y-8 animate-in slide-in-from-right duration-700">
             <AnimatePresence mode="wait">
                {result ? (
                  <motion.div 
                    key="result"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="space-y-8"
                  >
                    {/* CONFIDENCE HEADER */}
                    <div className="bg-[#020503] rounded-[3.5rem] p-12 text-white shadow-2xl relative overflow-hidden group">
                       <Bug className="absolute -top-10 -right-10 w-64 h-64 text-emerald-500/10 group-hover:rotate-12 transition-transform duration-[3000ms]" />
                       
                       <div className="relative z-10 space-y-10">
                          <div className="flex justify-between items-start">
                             <div className="space-y-1">
                                <p className="font-black text-[10px] uppercase tracking-[0.4em] text-emerald-400">Detection Confirmed</p>
                                <h3 className="text-4xl md:text-6xl font-[950] tracking-tighter uppercase italic leading-none">{result.pestName}</h3>
                                {result.reason && (
                                  <div className="pt-2 flex items-center gap-2">
                                     <Sparkles size={14} className="text-emerald-400" />
                                     <p className="text-[10px] font-bold uppercase tracking-widest text-white/60 italic">{result.reason}</p>
                                  </div>
                                )}
                             </div>
                          </div>
                       </div>
                    </div>

                    {/* TREATMENT STRATEGIES */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="bg-white/60 backdrop-blur-3xl border border-white rounded-[3rem] p-8 space-y-6">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
                                <Leaf size={18} />
                             </div>
                             <h4 className="font-black uppercase tracking-widest text-sm text-emerald-900 leading-none">Organic Control</h4>
                          </div>
                          <ul className="space-y-3">
                             {result.treatment.organic.map((item, i) => (
                               <li key={i} className="flex items-start gap-3 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/50 text-emerald-900 text-sm font-bold italic leading-tight uppercase tracking-tight">
                                  <ChevronRight size={14} className="mt-0.5 text-emerald-500 shrink-0" />
                                  {item}
                               </li>
                             ))}
                          </ul>
                       </div>

                       <div className="bg-white/60 backdrop-blur-3xl border border-white rounded-[3rem] p-8 space-y-6 text-red-900">
                          <div className="flex items-center gap-4 text-red-600">
                             <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center text-white">
                                <Shield size={18} />
                             </div>
                             <h4 className="font-black uppercase tracking-widest text-sm leading-none">Chemical Defense</h4>
                          </div>
                          <ul className="space-y-3">
                             {result.treatment.chemical.map((item, i) => (
                               <li key={i} className="flex items-start gap-3 p-4 bg-red-50/50 rounded-2xl border border-red-100/50 text-red-900 text-sm font-bold italic leading-tight uppercase tracking-tight">
                                  <Navigation size={14} className="mt-0.5 text-red-500 rotate-45 shrink-0" />
                                  {item}
                               </li>
                             ))}
                          </ul>
                       </div>
                    </div>

                    {/* PREVENTION PANEL */}
                    <div className="bg-emerald-500 rounded-[3.5rem] p-12 text-[#020503] relative overflow-hidden group shadow-xl">
                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                           <div className="w-24 h-24 bg-[#020503] rounded-[2.5rem] flex items-center justify-center shadow-2xl shrink-0">
                              <Sparkles size={40} className="text-emerald-400" />
                           </div>
                           <div className="space-y-4">
                              <h3 className="text-3xl font-[950] tracking-tighter uppercase leading-none">Strategic Prevention</h3>
                              <div className="flex flex-wrap gap-3">
                                 {result.prevention.map((item, i) => (
                                   <span key={i} className="px-5 py-2 bg-white/20 backdrop-blur-xl border border-white/20 rounded-full font-black text-[10px] uppercase tracking-widest">
                                      {item}
                                   </span>
                                 ))}
                              </div>
                           </div>
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] rounded-full" />
                    </div>
                  </motion.div>
                ) : (
                  <div key="placeholder" className="h-[600px] flex flex-col items-center justify-center space-y-6 text-center">
                     <div className="w-32 h-32 rounded-[3.5rem] bg-white border border-emerald-100 shadow-xl flex items-center justify-center text-emerald-900/10">
                        <Search size={64} />
                     </div>
                     <div>
                        <h4 className="text-2xl font-[950] text-emerald-900/20 tracking-tight uppercase leading-none">Waiting for Geo-Visual Node</h4>
                        <p className="text-emerald-900/10 font-bold uppercase tracking-widest text-xs mt-2 italic">Awaiting upload to begin deep analysis</p>
                     </div>
                  </div>
                )}
             </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
