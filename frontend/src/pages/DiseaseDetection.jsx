import React, { useState } from 'react';
import { Upload, AlertCircle, CheckCircle, Sparkles, RotateCcw, Leaf, Droplets, Shield, Zap, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import PrimaryButton from '../components/ui/PrimaryButton';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_KEY;

function DiseaseDetection() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [crop, setCrop] = useState('');
  const [symptoms, setSymptoms] = useState('');

  const [result, setResult] = useState(null);
  const [diseaseImage, setDiseaseImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* ================= IMAGE FETCH ================= */

  const fetchDiseasedPlantImage = async (cropName, diseaseName) => {
    try {
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${cropName} ${diseaseName} plant leaf disease&per_page=1`,
        {
          headers: {
            Authorization: `Client-ID ${UNSPLASH_KEY}`,
          },
        }
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
      setError('File size must be less than 10MB');
      return;
    }

    setSelectedFile(file);
    setError(null);

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  /* ================= TEXT BASED DETECTION ================= */

  const handlePredict = async () => {
    if (selectedFile) return handleImagePredict();

    if (!crop.trim() || !symptoms.trim()) {
      alert('Please enter crop name and symptoms, or upload an image');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setDiseaseImage(null);

    try {
      const res = await fetch(`${API_BASE}/api/crop-disease/detect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ crop, symptoms }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      setResult(data.data);

      const topDisease = data.data.possibleDiseases?.[0];
      if (topDisease) {
        const img = await fetchDiseasedPlantImage(crop, topDisease.name);
        setDiseaseImage(img);
      }
    } catch {
      setError('Failed to detect disease. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /* ================= IMAGE BASED DETECTION ================= */

  const handleImagePredict = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setDiseaseImage(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const res = await fetch(`${API_BASE}/api/crop-disease/detect-image`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      setResult(data.data);

      const topDisease = data.data.possibleDiseases?.[0];
      if (topDisease && data.data.crop) {
        const img = await fetchDiseasedPlantImage(
          data.data.crop,
          topDisease.name
        );
        setDiseaseImage(img);
      }
    } catch (err) {
      setError(err.message || 'Failed to detect disease from image.');
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
        <div className="absolute top-[10%] right-[10%] w-[50%] h-[50%] bg-emerald-500/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[10%] left-[10%] w-[40%] h-[40%] bg-lime-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <PageHeader
            icon="🌿"
            title="Disease Detection"
            subtitle="Harness deep learning to identify crop illnesses and get instantly actionable treatment protocols."
            variant="cinematic"
          />
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* INPUT FORM SIDE */}
          <div className="lg:col-span-12 space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* TEXT INPUT */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="h-full border border-emerald-100 shadow-sm rounded-[2.5rem] bg-white/70 backdrop-blur-md">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <Zap size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-emerald-950 uppercase tracking-tight">Manual Diagnosis</h3>
                      <p className="text-emerald-900/40 font-bold text-[11px] uppercase tracking-widest leading-none">Describe observations</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block font-black uppercase tracking-widest text-[11px] text-emerald-900/40 mb-2 ml-1">Crop Variety</label>
                      <input
                        value={crop}
                        onChange={(e) => setCrop(e.target.value)}
                        className="w-full px-5 py-4 bg-emerald-50/30 border border-emerald-100 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none font-medium placeholder:text-emerald-900/20"
                        placeholder="e.g. Tomato, Rice"
                      />
                    </div>

                    <div>
                      <label className="block font-black uppercase tracking-widest text-[11px] text-emerald-900/40 mb-2 ml-1">Observed Symptoms</label>
                      <textarea
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                        rows={4}
                        className="w-full px-5 py-4 bg-emerald-50/30 border border-emerald-100 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none font-medium placeholder:text-emerald-900/20 resize-none"
                        placeholder="e.g. Yellow spots, leaf curling, fungal patches"
                      />
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* IMAGE UPLOAD */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="h-full border border-emerald-100 shadow-sm rounded-[2.5rem] bg-white/70 backdrop-blur-md">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                      <Upload size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-emerald-950 uppercase tracking-tight">Visual Analysis</h3>
                      <p className="text-emerald-900/40 font-bold text-[11px] uppercase tracking-widest leading-none">Upload scan image</p>
                    </div>
                  </div>

                  <input type="file" hidden id="file" onChange={handleFileSelect} />
                  <label
                    htmlFor="file"
                    className="block border-2 border-dashed border-emerald-100 rounded-[2rem] min-h-[220px] cursor-pointer hover:bg-emerald-50/50 hover:border-emerald-300 transition-all group overflow-hidden relative"
                  >
                    {preview ? (
                      <div className="relative h-[220px]">
                        <img
                          src={preview}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                          <button className="bg-white/90 backdrop-blur text-emerald-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl">
                            Change Image
                          </button>
                        </div>
                        <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-lg shadow-lg flex items-center gap-2">
                          <CheckCircle size={14} />
                          <span className="text-[10px] font-black uppercase tracking-widest">Selected</span>
                        </div>
                      </div>
                    ) : (
                      <div className="h-[220px] flex flex-col justify-center items-center text-emerald-900/30">
                        <div className="w-16 h-16 rounded-3xl bg-emerald-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <Upload size={32} />
                        </div>
                        <p className="font-black uppercase tracking-[0.2em] text-[10px]">Drop scan here or tap to upload</p>
                        <p className="text-[9px] mt-1 font-bold opacity-60">Max size 10MB • JPG/PNG</p>
                      </div>
                    )}
                  </label>
                </Card>
              </motion.div>
            </div>

            {/* ACTION BUTTONS */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <PrimaryButton 
                variant="outline" 
                onClick={handleReset}
                className="rounded-2xl border-emerald-100 text-emerald-900/60 hover:text-emerald-600 px-10"
                icon={<RotateCcw size={18} />}
              >
                Reset Workshop
              </PrimaryButton>
              <PrimaryButton 
                loading={loading} 
                onClick={handlePredict}
                className="rounded-2xl bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-600/20 px-12"
                icon={<Sparkles size={18} />}
              >
                Initiate Diagnosis
              </PrimaryButton>
            </motion.div>
          </div>
        </div>

        <AnimatePresence>
          {/* ERROR */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mt-8"
            >
              <Card className="bg-red-50 border border-red-100 rounded-3xl py-6 flex items-center gap-4 text-red-900">
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
                  <AlertCircle size={20} />
                </div>
                <div>
                  <h4 className="font-black uppercase tracking-tight leading-none text-red-950 mb-1">Detection Aborted</h4>
                  <p className="text-xs font-bold opacity-70">{error}</p>
                </div>
              </Card>
            </motion.div>
          )}

          {/* 🌿 PLANT WITH DISEASE IMAGE */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 space-y-8"
            >
              {diseaseImage && mainDisease && (
                <Card className="overflow-hidden border border-emerald-100 shadow-2xl rounded-[3rem] p-0 bg-white">
                  <div className="grid md:grid-cols-2">
                    <div className="relative h-[300px] md:h-auto overflow-hidden">
                      <img
                        src={diseaseImage}
                        alt="Diseased plant"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                        <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
                          <p className="text-[10px] font-black uppercase tracking-widest text-white/70 mb-1">Confidence Score</p>
                          <p className="text-xl font-black text-white">{mainDisease.confidence}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-8 md:p-12 flex flex-col justify-center">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                        <AlertCircle size={12} />
                        Active Pathology Detected
                      </div>
                      <h3 className="text-4xl md:text-5xl font-black text-emerald-950 uppercase tracking-tighter leading-[0.9] mb-4">
                        {mainDisease.name}
                      </h3>
                      <p className="text-emerald-900/60 font-medium text-lg leading-relaxed mb-8">
                        {mainDisease.cause}
                      </p>
                      
                      <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-100">
                        <div className="flex items-center gap-3 mb-2">
                          <Info size={16} className="text-emerald-600" />
                          <span className="text-[11px] font-black text-emerald-900/40 uppercase tracking-widest">Expert Note</span>
                        </div>
                        <p className="text-sm font-bold text-emerald-950 tracking-tight">
                          Immediate isolation of the affected plants is recommended to prevent horizontal transmission within the crop zone.
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {/* 📋 DETAILS GRID */}
              <div className="grid lg:grid-cols-3 gap-6">
                {/* CHEMICAL */}
                <Card className="rounded-[2.5rem] border border-blue-100 bg-white shadow-sm flex flex-col h-full">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                      <Droplets size={24} />
                    </div>
                    <div>
                      <h4 className="font-black text-emerald-950 uppercase tracking-tight">Chemical Remediation</h4>
                      <p className="text-emerald-900/40 font-bold text-[10px] uppercase tracking-widest">Protocol C-1</p>
                    </div>
                  </div>
                  <ul className="space-y-3 flex-1">
                    {result.treatment?.chemical?.map((c, i) => (
                      <li key={i} className="flex gap-3 text-sm font-bold text-slate-700">
                        <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex-shrink-0 flex items-center justify-center text-[10px]">
                          {i + 1}
                        </div>
                        {c}
                      </li>
                    ))}
                  </ul>
                </Card>

                {/* ORGANIC */}
                <Card className="rounded-[2.5rem] border border-emerald-100 bg-white shadow-sm flex flex-col h-full">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                      <Leaf size={24} />
                    </div>
                    <div>
                      <h4 className="font-black text-emerald-950 uppercase tracking-tight">Organic Defense</h4>
                      <p className="text-emerald-900/40 font-bold text-[10px] uppercase tracking-widest">Biological Plan</p>
                    </div>
                  </div>
                  <ul className="space-y-3 flex-1">
                    {result.treatment?.organic?.map((o, i) => (
                      <li key={i} className="flex gap-3 text-sm font-bold text-slate-700">
                        <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex-shrink-0 flex items-center justify-center text-[10px]">
                          {i + 1}
                        </div>
                        {o}
                      </li>
                    ))}
                  </ul>
                </Card>

                {/* PREVENTION */}
                <Card className="rounded-[2.5rem] border border-orange-100 bg-white shadow-sm flex flex-col h-full">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
                      <Shield size={24} />
                    </div>
                    <div>
                      <h4 className="font-black text-emerald-950 uppercase tracking-tight">Future Mitigation</h4>
                      <p className="text-emerald-900/40 font-bold text-[10px] uppercase tracking-widest">Prevention Strategy</p>
                    </div>
                  </div>
                  <ul className="space-y-3 flex-1">
                    {result.prevention?.map((p, i) => (
                      <li key={i} className="flex gap-3 text-sm font-bold text-slate-700">
                        <div className="w-5 h-5 rounded-full bg-orange-50 text-orange-600 flex-shrink-0 flex items-center justify-center text-[10px]">
                          <CheckCircle size={10} />
                        </div>
                        {p}
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default DiseaseDetection;
