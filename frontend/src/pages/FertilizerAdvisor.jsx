import React, { useState } from 'react';
import { Droplets, Sprout, AlertTriangle, Image as ImageIcon, Sparkles, ChevronRight, Zap, Info, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import PrimaryButton from '../components/ui/PrimaryButton';
import Select from '../components/ui/Select';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_KEY;

function FertilizerAdvisor() {
  const [formData, setFormData] = useState({
    crop: '',
    budget: '',
    issues: '',
  });

  const [result, setResult] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cropOptions = [
    // 🌾 Cereals
    { value: 'rice', label: '🌾 Rice' },
    { value: 'wheat', label: '🌾 Wheat' },
    { value: 'maize', label: '🌽 Maize (Corn)' },
    { value: 'barley', label: '🌾 Barley' },
    { value: 'sorghum', label: '🌾 Sorghum (Jowar)' },
    { value: 'millet', label: '🌾 Millet (Bajra)' },
  
    // 🥔 Vegetables
    { value: 'potato', label: '🥔 Potato' },
    { value: 'tomato', label: '🍅 Tomato' },
    { value: 'onion', label: '🧅 Onion' },
    { value: 'garlic', label: '🧄 Garlic' },
    { value: 'cabbage', label: '🥬 Cabbage' },
    { value: 'cauliflower', label: '🥦 Cauliflower' },
    { value: 'carrot', label: '🥕 Carrot' },
    { value: 'brinjal', label: '🍆 Brinjal (Eggplant)' },
    { value: 'okra', label: '🌱 Okra (Lady Finger)' },
  
    // 🍌 Fruits
    { value: 'banana', label: '🍌 Banana' },
    { value: 'mango', label: '🥭 Mango' },
    { value: 'apple', label: '🍎 Apple' },
    { value: 'grapes', label: '🍇 Grapes' },
    { value: 'orange', label: '🍊 Orange' },
    { value: 'papaya', label: '🍈 Papaya' },
  
    // 🌱 Pulses / Legumes
    { value: 'chickpea', label: '🌱 Chickpea (Chana)' },
    { value: 'lentil', label: '🌱 Lentil (Masoor)' },
    { value: 'pigeonpea', label: '🌱 Pigeon Pea (Arhar)' },
    { value: 'soybean', label: '🌱 Soybean' },
    { value: 'groundnut', label: '🥜 Groundnut (Peanut)' },
  
    // 🌿 Cash / Commercial Crops
    { value: 'sugarcane', label: '🎋 Sugarcane' },
    { value: 'cotton', label: '☁️ Cotton' },
    { value: 'tea', label: '🍃 Tea' },
    { value: 'coffee', label: '☕ Coffee' },
    { value: 'mustard', label: '🌼 Mustard' },
  ];
  

  const budgetOptions = [
    { value: 'low', label: '💰 Low Budget (₹500-2000/acre)' },
    { value: 'medium', label: '💵 Medium Budget (₹2000-5000/acre)' },
    { value: 'high', label: '💎 Premium (₹5000+/acre)' },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* ================= IMAGE HELPERS ================= */

  // 🔹 Crop images (multiple)
  const fetchCropImages = async (crop) => {
    if (!UNSPLASH_KEY) {
      console.error("Missing VITE_UNSPLASH_KEY in .env");
      setImages([]);
      return;
    }
    try {
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${crop} farming agriculture&per_page=3`,
        {
          headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` },
        }
      );
      const data = await res.json();
      setImages(data.results?.map((img) => img.urls.small) || []);
    } catch {
      setImages([]);
    }
  };

  // 🔹 Single image for fertilizer / alternative
  const fetchSingleImage = async (query) => {
    if (!UNSPLASH_KEY) {
      console.error("Missing VITE_UNSPLASH_KEY in .env");
      return null;
    }
    try {
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${query}&per_page=1`,
        {
          headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` },
        }
      );
      const data = await res.json();
      return data.results?.[0]?.urls?.small || null;
    } catch {
      return null;
    }
  };

  /* ================= API CALL ================= */

  const handleRecommend = async () => {
    if (!formData.crop || !formData.budget) {
      alert('Please select crop and budget');
      return;
    }

    setLoading(true);
    setResult(null);
    setImages([]);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/api/fertilizer/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data?.success === false) {
        throw new Error('API failed');
      }

      const payload = data.data || {};

      // 🌱 Fertilizers with images
      const fertilizersWithImages = await Promise.all(
        (payload.primaryFertilizers || []).map(async (fert) => ({
          ...fert,
          image: await fetchSingleImage(`${fert.name} fertilizer`),
        }))
      );

      // 🌿 Low-cost alternatives with images
      const alternativesWithImages = await Promise.all(
        (payload.lowCostAlternatives || []).map(async (alt) => ({
          ...alt,
          image: await fetchSingleImage(`${alt.name} organic fertilizer`),
        }))
      );

      setResult({
        fertilizers: fertilizersWithImages,
        alternatives: alternativesWithImages,
        advice: payload.generalAdvice || [],
      });

      // 🌾 Crop images
      fetchCropImages(formData.crop);
    } catch (err) {
      console.error(err);
      setError('Unable to fetch fertilizer recommendations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-24 relative overflow-hidden font-sans">
      
      {/* ATMOSPHERIC BACKGROUND */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[10%] right-[10%] w-[50%] h-[50%] bg-emerald-500/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[10%] left-[10%] w-[40%] h-[40%] bg-amber-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <PageHeader
            icon="🧪"
            title="Fertilizer Advisor"
            subtitle="Optimize your yield with precision nutrient protocols and cost-effective alternatives."
            variant="cinematic"
          />
        </motion.div>

        {/* INPUT FORM - CAPSULE STYLE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-3xl mx-auto mb-16"
        >
          <Card className="rounded-[3rem] border border-emerald-100 shadow-2xl bg-white/70 backdrop-blur-xl p-10 md:p-14 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full -mr-16 -mt-16" />
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-1">
                <label className="block font-black uppercase tracking-widest text-[11px] text-emerald-900/40 mb-3 ml-1">Target Crop</label>
                <Select
                  name="crop"
                  value={formData.crop}
                  onChange={handleChange}
                  options={cropOptions}
                  className="mb-0 [&>label]:hidden" // Hiding default label as we use our own styled one
                />
              </div>

              <div className="space-y-1">
                <label className="block font-black uppercase tracking-widest text-[11px] text-emerald-900/40 mb-3 ml-1">Investment Tier</label>
                <Select
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  options={budgetOptions}
                  className="mb-0 [&>label]:hidden"
                />
              </div>
            </div>

            <PrimaryButton
              loading={loading}
              icon={<Sparkles size={20} />}
              className="w-full rounded-[2rem] py-6 bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-600/20 text-lg font-black uppercase tracking-widest"
              onClick={handleRecommend}
            >
              Analyze & Recommend
            </PrimaryButton>
          </Card>
        </motion.div>

        <AnimatePresence>
          {/* ERROR */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-3xl mx-auto mb-8"
            >
              <Card className="bg-red-50 border border-red-100 rounded-3xl py-6 flex items-center gap-4 text-red-900">
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h4 className="font-black uppercase tracking-tight leading-none text-red-950 mb-1">System Obstruction</h4>
                  <p className="text-xs font-bold opacity-70">{error}</p>
                </div>
              </Card>
            </motion.div>
          )}

          {/* RESULTS FLOW */}
          {result && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-12"
            >
              {/* 🌾 CROP INSIGHTS */}
              {images.length > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white border border-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">
                       <ImageIcon size={22} />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-emerald-950 uppercase tracking-tight">Agricultural Visualization</h2>
                      <p className="text-emerald-900/40 font-bold text-[11px] uppercase tracking-widest leading-none">{formData.crop} perspective</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {images.map((img, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 * idx }}
                        className="group relative h-48 md:h-64 rounded-[2rem] overflow-hidden shadow-xl"
                      >
                        <img
                          src={img}
                          alt={formData.crop}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* 🌱 PRECISION FERTILIZERS */}
              {result.fertilizers?.length > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
                       <Droplets size={22} />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-emerald-950 uppercase tracking-tight">Precision Nutrients</h2>
                      <p className="text-emerald-900/40 font-bold text-[11px] uppercase tracking-widest leading-none">High efficiency protocols</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {result.fertilizers.map((fert, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * idx }}
                      >
                        <Card className="p-0 overflow-hidden border border-emerald-100 rounded-[2.5rem] bg-white group hover:shadow-2xl transition-all duration-500">
                          <div className="flex flex-col sm:flex-row h-full">
                            {fert.image && (
                              <div className="sm:w-40 h-40 sm:h-auto overflow-hidden">
                                <img
                                  src={fert.image}
                                  alt={fert.name}
                                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                              </div>
                            )}
                            <div className="p-8 flex-1 flex flex-col justify-center">
                              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 mb-2">{fert.nutrient}</span>
                              <h3 className="text-2xl font-black text-emerald-950 mb-3 tracking-tight leading-tight">
                                {fert.name}
                              </h3>
                              <p className="text-sm font-bold text-emerald-900/60 leading-relaxed italic line-clamp-2">
                                {fert.reason}
                              </p>
                              <div className="mt-4 flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest">
                                 Optimize Yield <ChevronRight size={12} />
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* 💰 ECONOMIC DEFENSE (Alternatives) */}
              {result.alternatives?.length > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                       <Sprout size={22} />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-emerald-950 uppercase tracking-tight">Economic Defense</h2>
                      <p className="text-emerald-900/40 font-bold text-[11px] uppercase tracking-widest leading-none">Sustainable low-cost alternatives</p>
                    </div>
                  </div>

                  <div className="grid lg:grid-cols-3 gap-6">
                    {result.alternatives.map((alt, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 * idx }}
                      >
                        <Card className="p-6 md:p-8 rounded-[2.5rem] border border-amber-100 bg-amber-50/10 hover:bg-white hover:shadow-xl transition-all h-full flex flex-col">
                          {alt.image && (
                             <img
                               src={alt.image}
                               alt={alt.name}
                               className="w-full h-32 object-cover rounded-2xl mb-6 shadow-sm"
                             />
                          )}
                          <h4 className="font-black text-lg text-emerald-950 uppercase tracking-tight mb-2">{alt.name}</h4>
                          <div className="flex items-center gap-2 mb-4 bg-amber-100/50 px-3 py-1 rounded-full w-fit">
                             <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                             <span className="text-[10px] font-black uppercase text-amber-700 tracking-widest">Replaces: {alt.replaces}</span>
                          </div>
                          <p className="text-sm font-bold text-slate-600 mb-4 flex-1">{alt.whyCheaper}</p>
                          <div className="pt-4 border-t border-amber-100 flex items-start gap-2">
                             <Zap size={14} className="text-amber-500 mt-1 flex-shrink-0" />
                             <p className="text-[11px] font-black text-amber-700 uppercase tracking-wider leading-relaxed">{alt.usageTip}</p>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* ⚠️ ADVISORY CONSOLE */}
              {result.advice?.length > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                       <Info size={22} />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-emerald-950 uppercase tracking-tight">Advisory Console</h2>
                      <p className="text-emerald-900/40 font-bold text-[11px] uppercase tracking-widest leading-none">System-generated insights</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {result.advice.map((tip, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ y: -5 }}
                        className="bg-white border border-blue-50 p-6 rounded-[2rem] shadow-sm flex items-start gap-4 hover:shadow-lg transition-all"
                      >
                         <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                            <CheckCircle2 size={18} />
                         </div>
                         <p className="text-sm font-bold text-slate-700 leading-relaxed tracking-tight">{tip}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default FertilizerAdvisor;
