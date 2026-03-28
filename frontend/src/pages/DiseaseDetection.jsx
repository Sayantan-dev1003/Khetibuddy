import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, AlertCircle, CheckCircle, Sparkles, RotateCcw, Leaf, Droplets, Shield, Zap, Info, Search, FlaskConical, Navigation, ChevronRight, Loader2 } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import { post, postFile, API_BASE } from '../services/api';

const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_KEY;

export default function DiseaseDetection() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [crop, setCrop] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [diseaseImage, setDiseaseImage] = useState(null);
  const [error, setError] = useState(null);

  /* ================= IMAGE FETCH (UNSPLASH) ================= */
  const fetchDiseasedPlantImage = async (cropName, diseaseName) => {
    try {
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${cropName} ${diseaseName} plant leaf disease&per_page=1`,
        { headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` } }
      );
      const data = await res.json();
      return data.results?.[0]?.urls?.regular || null;
    } catch {
      return null;
    }
  };

  /* ================= FILE SELECT ================= */
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError('Visual payload exceeds 10MB limit.');
      return;
    }

    setSelectedFile(file);
    setError(null);
    setResult(null);

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  /* ================= MANUAL DIAGNOSIS (TEXT) ================= */
  const handleManualPredict = async () => {
    if (!crop.trim() || !symptoms.trim()) {
      setError('Please provide both crop name and symptom observations.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setDiseaseImage(null);

    try {
      const res = await post('/api/crop-disease/detect', { crop, symptoms });

      if (!res.success) throw new Error(res.message);

      setResult(res.data);

      const topDisease = res.data.possibleDiseases?.[0];
      if (topDisease) {
        const img = await fetchDiseasedPlantImage(crop, topDisease.name);
        setDiseaseImage(img);
      }
    } catch (err) {
      setError(err.message || 'Manual diagnosis engine offline.');
    } finally {
      setLoading(false);
    }
  };

  /* ================= VISUAL ANALYSIS (IMAGE) ================= */
  const handleVisualPredict = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setDiseaseImage(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const res = await postFile('/api/crop-disease/detect-image', formData);

      if (!res.success) throw new Error(res.message);

      setResult(res.data);

      const topDisease = res.data.possibleDiseases?.[0];
      if (topDisease && res.data.crop) {
        const img = await fetchDiseasedPlantImage(res.data.crop, topDisease.name);
        setDiseaseImage(img);
      }
    } catch (err) {
      setError(err.message || 'Visual analysis engine offline.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreview(null);
    setCrop('');
    setSymptoms('');
    setResult(null);
    setDiseaseImage(null);
    setError(null);
  };

  const mainDisease = result?.possibleDiseases?.[0];

  return (
    <div className="min-h-screen pb-24 relative overflow-hidden font-sans">
      {/* ATMOSPHERIC BACKGROUND */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-[50%] h-[50%] bg-emerald-500/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-[1200px] mx-auto px-6 relative z-10 pt-8 space-y-12">
        <PageHeader 
          icon="🌿"
          title="DISEASE DETECTION"
          subtitle="AUTONOMOUS PATHOLOGY: DESCRIBE OBSERVATIONS OR UPLOAD SCANS FOR INSTANT DIAGNOSIS."
          variant="cinematic"
        />

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* OPTION 1: MANUAL DIAGNOSIS */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <div className="bg-white/60 backdrop-blur-3xl border border-white rounded-[3.5rem] p-10 shadow-sm space-y-8">
               <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">
                    <FlaskConical size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-[950] text-[#020503] tracking-tight uppercase">Manual Diagnosis</h3>
                    <p className="text-emerald-900/40 font-black text-[11px] uppercase tracking-[0.25em]">Describe observations</p>
                  </div>
               </div>

               <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-emerald-900/40 ml-4">Target Crop</label>
                    <input 
                      value={crop}
                      onChange={(e) => setCrop(e.target.value)}
                      className="w-full px-8 py-5 bg-white border border-emerald-100 rounded-[2rem] font-bold text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm"
                      placeholder="e.g. Tomato, Rice"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-emerald-900/40 ml-4">Observed Symptoms</label>
                    <textarea 
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                      rows={4}
                      className="w-full px-8 py-5 bg-white border border-emerald-100 rounded-[2rem] font-bold text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm"
                      placeholder="e.g. Yellow spots on lower leaves, curling stem..."
                    />
                  </div>
               </div>

               <button 
                  onClick={handleManualPredict}
                  disabled={loading}
                  className="w-full py-5 bg-emerald-900 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-black transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
               >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} fill="white" className="text-emerald-400" />}
                  {loading ? 'Analyzing Data...' : 'Analyze Symptoms'}
               </button>
            </div>
          </motion.div>

          {/* OPTION 2: VISUAL ANALYSIS */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <div className="bg-[#020503] border border-white/10 rounded-[3.5rem] p-10 shadow-2xl space-y-8">
               <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <Navigation size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-[950] text-white tracking-tight uppercase">Visual Analysis</h3>
                    <p className="text-white/40 font-black text-[11px] uppercase tracking-[0.25em]">Upload scan image</p>
                  </div>
               </div>

               <div className="relative">
                  <input type="file" id="diseaseFile" hidden onChange={handleFileSelect} accept="image/*" />
                  <label 
                    htmlFor="diseaseFile"
                    className="block border-4 border-dashed border-white/5 rounded-[2.5rem] min-h-[300px] cursor-pointer group hover:border-emerald-500/50 transition-all overflow-hidden bg-white/5"
                  >
                    {preview ? (
                      <div className="relative h-full">
                        <img src={preview} className="w-full h-[300px] object-cover" alt="Preview" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 font-black text-white uppercase tracking-widest text-sm transition-opacity">
                           Change Image
                        </div>
                      </div>
                    ) : (
                      <div className="h-[300px] flex flex-col items-center justify-center text-white/10 group-hover:text-emerald-500 transition-colors">
                         <Upload size={64} className="mb-4" />
                         <p className="font-black uppercase tracking-[0.2em] text-sm text-white/40">Drop Visual Node</p>
                      </div>
                    )}
                  </label>
               </div>

               <button 
                  onClick={handleVisualPredict}
                  disabled={!selectedFile || loading}
                  className="w-full py-5 bg-emerald-500 text-[#020503] rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-white transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
               >
                  {loading ? <Loader2 size={18} className="animate-spin text-[#020503]" /> : <Search size={18} strokeWidth={3} />}
                  {loading ? 'Processing Scan...' : 'Execute Scan'}
               </button>
            </div>
          </motion.div>
        </div>

        {/* ERROR MESSAGE */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full p-6 bg-red-50 border border-red-100 rounded-[2.5rem] text-red-600 flex items-center gap-4 font-bold">
              <AlertCircle size={24} />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 📋 CINEMATIC RESULTS */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
               {/* MAIN RESULT CARD */}
               <div className="bg-white/60 backdrop-blur-3xl border border-white rounded-[4rem] p-12 shadow-sm grid lg:grid-cols-2 gap-12 overflow-hidden relative">
                  <div className="space-y-8 relative z-10">
                     <div className="space-y-2">
                        <p className="font-black text-[12px] uppercase tracking-[0.4em] text-emerald-500">Diagnosis Confirmed</p>
                        <h2 className="text-5xl lg:text-7xl font-[1000] text-[#020503] tracking-tighter uppercase italic leading-none">{mainDisease?.name}</h2>
                        <div className="flex items-center gap-3 pt-4">
                           <span className="bg-emerald-100 text-emerald-600 px-5 py-2 rounded-full font-black text-[10px] uppercase tracking-widest border border-emerald-200">Confidence: {mainDisease?.confidence || 'High'}</span>
                        </div>
                     </div>

                     <div className="p-8 bg-emerald-50 rounded-[2.5rem] border border-emerald-100/50 space-y-4">
                        <div className="flex items-center gap-3 text-emerald-900">
                           <Info size={20} />
                           <h4 className="font-black uppercase tracking-widest text-sm">Case Summary</h4>
                        </div>
                        <p className="text-emerald-900/60 font-medium leading-relaxed italic">{mainDisease?.cause}</p>
                     </div>
                  </div>

                  <div className="relative h-[400px] lg:h-auto rounded-[3.5rem] overflow-hidden border-8 border-white shadow-2xl">
                     {diseaseImage ? (
                        <img src={diseaseImage} className="w-full h-full object-cover" alt="Disease" />
                     ) : (
                        <div className="w-full h-full bg-emerald-50 flex flex-col items-center justify-center text-emerald-900/10">
                           <Leaf size={120} />
                           <p className="font-black uppercase tracking-widest text-[10px]">Reference Image Unavailable</p>
                        </div>
                     )}
                     <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                  </div>
               </div>

               {/* TREATMENT TILES */}
               <div className="grid lg:grid-cols-3 gap-8">
                  <Card className="rounded-[3rem] p-10 space-y-6 bg-white/60">
                     <div className="flex items-center gap-4 text-emerald-600">
                        <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                           <Zap size={20} />
                        </div>
                        <h4 className="font-black uppercase tracking-widest text-sm">Chemical Control</h4>
                     </div>
                     <ul className="space-y-4">
                        {result.treatment?.chemical?.map((item, i) => (
                           <li key={i} className="flex items-start gap-4 p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100/50 text-emerald-900 text-xs font-black uppercase tracking-tight italic">
                              <Navigation size={14} className="mt-0.5 text-emerald-500 rotate-45 shrink-0" />
                              {item}
                           </li>
                        ))}
                     </ul>
                  </Card>

                  <Card className="rounded-[3rem] p-10 space-y-6 bg-white/60">
                     <div className="flex items-center gap-4 text-emerald-500">
                        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                           <Leaf size={20} />
                        </div>
                        <h4 className="font-black uppercase tracking-widest text-sm">Organic Therapy</h4>
                     </div>
                     <ul className="space-y-4">
                        {result.treatment?.organic?.map((item, i) => (
                           <li key={i} className="flex items-start gap-4 p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100/50 text-emerald-900 text-xs font-black uppercase tracking-tight italic">
                              <ChevronRight size={14} className="mt-0.5 text-emerald-500 shrink-0" />
                              {item}
                           </li>
                        ))}
                     </ul>
                  </Card>

                  <Card className="rounded-[3rem] p-10 space-y-6 bg-white border border-emerald-100">
                     <div className="flex items-center gap-4 text-emerald-600">
                        <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                           <Shield size={20} />
                        </div>
                        <h4 className="font-black uppercase tracking-widest text-sm">Global Prevention</h4>
                     </div>
                     <ul className="space-y-4">
                        {result.prevention?.map((item, i) => (
                           <li key={i} className="flex items-start gap-4 p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100/50 text-emerald-900 text-xs font-black uppercase tracking-tight italic">
                              <Sparkles size={14} className="mt-0.5 text-emerald-500 shrink-0" />
                              {item}
                           </li>
                        ))}
                     </ul>
                  </Card>
               </div>

               <div className="flex justify-center pt-8">
                  <button onClick={handleReset} className="flex items-center gap-3 px-12 py-6 bg-white rounded-full font-black uppercase tracking-widest text-xs shadow-xl border border-emerald-100 hover:bg-emerald-50 transition-all text-emerald-900">
                     <RotateCcw size={16} />
                     Reset Intelligence Node
                  </button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
