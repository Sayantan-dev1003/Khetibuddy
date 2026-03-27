import React, { useState } from 'react';
import { Droplets, Sprout, AlertTriangle, AlertCircle, Image as ImageIcon, Wind, Beaker, Coins, Shovel } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import PrimaryButton from '../components/ui/PrimaryButton';
import Select from '../components/ui/Select';
import InputField from '../components/ui/InputField';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_KEY;

function FertilizerAdvisor() {
  const [formData, setFormData] = useState({
    crop: '',
    budget: '',
    soilType: '',
    n: '',
    p: '',
    k: '',
    ph: '',
  });

  const [result, setResult] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cropOptions = [
    // 🌾 Cereals
    { value: 'rice', label: '🌾 Rice' },
    { value: 'wheat', label: '🌾 Wheat' },
    { value: 'corn', label: '🌽 Maize (Corn)' },
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

  const soilTypeOptions = [
    { value: 'Sandy', label: '🏖️ Sandy' },
    { value: 'Loamy', label: '🟤 Loamy' },
    { value: 'Clay', label: '🧱 Clay' },
    { value: 'Silt', label: '🌊 Silt' },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* ================= IMAGE HELPERS ================= */

  // 🔹 Crop images (multiple)
  const fetchCropImages = async (crop) => {
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
          image: await fetchSingleImage(`${fert.name} fertilizer agriculture`),
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
    <div className="max-w-6xl mx-auto space-y-12">
      <PageHeader
        icon="💎"
        title="Soil Nourisher"
        subtitle="Optimize your crop's growth with precise, budget-friendly nourishment."
        className="mb-12"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* INPUT FORM - LEFT COLUMN */}
        <div className="lg:col-span-1 space-y-8 sticky top-28">
          <Card className="!bg-[var(--primary)] text-white border-none relative overflow-hidden shadow-2xl" padding="xl">
            {/* Texture overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none paper-texture"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-white/20 rounded-2xl">
                  <Beaker size={28} />
                </div>
                <h3 className="text-2xl font-black lowercase tracking-tight">set the criteria</h3>
              </div>

              <div className="space-y-6">
                <Select
                  label="Which crop are you nurturing?"
                  name="crop"
                  value={formData.crop}
                  onChange={handleChange}
                  options={cropOptions}
                  className="!mb-0"
                />

                <Select
                  label="Soil Type"
                  name="soilType"
                  value={formData.soilType}
                  onChange={handleChange}
                  options={soilTypeOptions}
                  className="!mb-0"
                />

                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="Nitrogen (N)"
                    name="n"
                    type="number"
                    value={formData.n}
                    onChange={handleChange}
                    placeholder="e.g. 100"
                    className="!mb-0"
                  />
                  <InputField
                    label="Phosphorus (P)"
                    name="p"
                    type="number"
                    value={formData.p}
                    onChange={handleChange}
                    placeholder="e.g. 50"
                    className="!mb-0"
                  />
                  <InputField
                    label="Potassium (K)"
                    name="k"
                    type="number"
                    value={formData.k}
                    onChange={handleChange}
                    placeholder="e.g. 50"
                    className="!mb-0"
                  />
                  <InputField
                    label="Soil pH"
                    name="ph"
                    type="number"
                    step="0.1"
                    value={formData.ph}
                    onChange={handleChange}
                    placeholder="e.g. 6.5"
                    className="!mb-0"
                  />
                </div>

                <Select
                  label="What is your budget plan?"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  options={budgetOptions}
                  className="!mb-0"
                />
              </div>

              <PrimaryButton
                loading={loading}
                icon={<Wind size={22} className="group-hover:rotate-45 transition-transform" />}
                className="w-full mt-10 !bg-[var(--leaf-bright)] !text-[var(--earth-deep)] !rounded-[2rem] font-black group shadow-xl"
                onClick={handleRecommend}
              >
                PROPOSE RECIPIE
              </PrimaryButton>
            </div>
          </Card>

          {/* HELP TIP */}
          <Card className="!bg-[#fff3e0] border-2 border-[#ffe0b2] p-6" padding="md">
             <div className="flex gap-4">
                <div className="p-3 bg-white rounded-2xl text-[#e65100]">
                  <Coins size={24} />
                </div>
                <div>
                   <h4 className="font-black text-[var(--primary)] uppercase text-xs tracking-widest mb-1">Budget Optimization</h4>
                   <p className="text-sm font-bold text-[#e65100]/80">We suggest organic alternatives to save costs by up to 40%.</p>
                </div>
             </div>
          </Card>
        </div>

        {/* RESULTS - RIGHT COLUMN */}
        <div className="lg:col-span-2 space-y-10">
           {/* ERROR */}
           {error && (
             <Card className="!bg-red-50 border-2 border-red-200 animate-shake" padding="lg">
               <div className="flex items-center gap-4 text-red-700">
                  <AlertCircle size={32} />
                  <p className="font-bold text-lg">{error}</p>
               </div>
             </Card>
           )}

           {!result && !loading && (
             <Card className="h-full flex flex-col justify-center items-center text-center !bg-transparent !border-4 !border-dashed !border-[var(--primary-light)]/20 py-32" padding="xl">
                <div className="text-9xl mb-10 opacity-20">🧪</div>
                <h3 className="text-4xl font-black text-[var(--primary)] opacity-40 lowercase tracking-tighter">no recipe drafted yet</h3>
                <p className="text-[var(--text-muted)] mt-4 font-bold max-w-sm">Select your crop and budget to see the science of growth.</p>
             </Card>
           )}

           {loading && (
             <Card className="h-full flex flex-col justify-center items-center text-center py-32 bg-white/50 backdrop-blur-xl border-none" padding="xl">
                <div className="relative">
                  <div className="w-28 h-28 border-8 border-[var(--primary-light)]/10 border-t-[var(--accent)] rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-5xl animate-bounce">🔬</div>
                </div>
                <h3 className="text-4xl font-black text-[var(--primary)] mt-12 lowercase tracking-tighter">calculating nutritional balance...</h3>
                <p className="text-[var(--text-muted)] mt-2 font-bold uppercase tracking-widest text-xs">Mixing science with the earth's needs</p>
             </Card>
           )}

           {result && (
             <div className="space-y-12 animate-fade-in-up">
                {/* 🌾 CROP CONTEXT */}
                {images.length > 0 && (
                  <Card className="!bg-white/80 border-t-8 border-t-[var(--secondary)]" padding="lg">
                    <div className="flex items-center justify-between mb-8">
                       <h2 className="text-3xl font-black text-[var(--primary)] flex items-center gap-3">
                        <ImageIcon size={32} className="text-[var(--secondary)]" /> 
                        The <span className="text-[var(--secondary)]">{formData.crop}</span> environment
                      </h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      {images.map((img, idx) => (
                        <div key={idx} className="relative rounded-3xl overflow-hidden shadow-xl group aspect-square">
                          <img
                            src={img}
                            alt={formData.crop}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[var(--primary)]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* 🌱 PRIMARY FERTILIZERS */}
                <div className="space-y-6">
                   <div className="flex items-center gap-4 mb-4">
                      <div className="h-0.5 flex-1 bg-[var(--primary-light)]/20"></div>
                      <h2 className="text-2xl font-black text-[var(--primary)] uppercase tracking-[0.2em] px-4">The Feed</h2>
                      <div className="h-0.5 flex-1 bg-[var(--primary-light)]/20"></div>
                   </div>

                   {result.fertilizers.map((fert, idx) => (
                    <Card 
                      key={idx}
                      className="group flex flex-col md:flex-row gap-8 !bg-white hover:!bg-[var(--bg-alt)] border-2 border-[var(--primary-light)]/10"
                      padding="lg"
                    >
                      {fert.image && (
                        <div className="w-full md:w-56 h-56 rounded-[2.5rem] overflow-hidden shadow-2xl flex-shrink-0 relative group">
                          <img
                            src={fert.image}
                            alt={fert.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute top-4 left-4 bg-[var(--primary)] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-white/20 shadow-xl">
                            verified
                          </div>
                        </div>
                      )}
                      <div className="flex-1 flex flex-col justify-center">
                        <div className="flex items-center justify-between mb-4">
                           <h3 className="text-3xl font-black text-[var(--primary)] tracking-tight group-hover:text-[var(--accent)] transition-colors">
                            {fert.name}
                          </h3>
                          <span className="px-4 py-1.5 bg-[var(--primary)]/10 text-[var(--primary)] rounded-full text-xs font-black uppercase tracking-widest">{fert.nutrient}</span>
                        </div>
                        <div className="space-y-4">
                           <p className="text-xl font-bold text-[var(--text-main)] leading-relaxed">{fert.reason}</p>
                           <div className="flex items-center gap-2 text-[var(--text-muted)] font-black text-xs uppercase tracking-widest bg-white/50 w-fit px-4 py-2 rounded-xl">
                              <Shovel size={14} /> application needed soon
                           </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* 💰 LOW COST ALTERNATIVES */}
                <Card className="!bg-[var(--accent)] border-none relative overflow-hidden shadow-2xl" padding="xl">
                   {/* Texture overlay */}
                   <div className="absolute inset-0 opacity-10 pointer-events-none paper-texture"></div>
                   
                   <div className="relative z-10 flex flex-col gap-10">
                      <div className="text-white">
                        <h2 className="text-4xl font-black mb-2 flex items-center gap-4">
                          <div className="p-3 bg-white/20 rounded-[1.5rem] shadow-xl">
                            <Coins size={36} />
                          </div>
                          Budget Gold (Alternatives)
                        </h2>
                        <p className="text-white/80 font-bold max-w-xl">Deep wisdom on how to replace costly synthetic feeds with organic earth-matter.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {result.alternatives.map((alt, idx) => (
                          <div
                            key={idx}
                            className="bg-white/10 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/10 flex flex-col gap-6 hover:bg-white/20 transition-all group"
                          >
                            <div className="flex gap-6 items-center">
                               {alt.image && (
                                <img
                                  src={alt.image}
                                  alt={alt.name}
                                  className="w-24 h-24 object-cover rounded-[1.5rem] shadow-2xl border-4 border-white/10"
                                />
                              )}
                              <div className="flex-1">
                                <h4 className="text-2xl font-black text-white mb-1 group-hover:text-[var(--leaf-bright)] transition-colors">{alt.name}</h4>
                                <div className="inline-block px-3 py-1 bg-white/10 rounded-full text-[10px] font-black tracking-widest text-white/60">REPLACES {alt.replaces.toUpperCase()}</div>
                              </div>
                            </div>
                            <div className="space-y-4">
                               <p className="text-white font-bold leading-relaxed">{alt.whyCheaper}</p>
                               <div className="p-4 bg-black/10 rounded-2xl border-l-4 border-[var(--leaf-bright)]">
                                  <p className="text-sm font-black text-[var(--leaf-bright)] uppercase tracking-widest mb-1 items-center flex gap-2">
                                    <Sprout size={12} /> expert tip
                                  </p>
                                  <p className="text-xs font-bold text-white/80 leading-relaxed">{alt.usageTip}</p>
                               </div>
                            </div>
                          </div>
                        ))}
                      </div>
                   </div>
                </Card>

                {/* ⚠️ GENERAL ADVICE */}
                <Card className="!bg-[#e0f2f1] border-2 border-[#b2dfdb] shadow-xl" padding="xl">
                   <h2 className="text-3xl font-black text-[var(--primary)] mb-8 flex items-center gap-4">
                    <div className="p-3 bg-white rounded-2xl text-[var(--secondary)] shadow-md">
                      <AlertTriangle size={32} />
                    </div>
                    Growth Wisdom (Advice)
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.advice.map((tip, idx) => (
                      <div
                        key={idx}
                        className="bg-white/80 p-6 rounded-[2rem] border border-[var(--primary-light)]/10 font-bold text-[var(--text-main)] italic hover:shadow-md transition-shadow flex items-start gap-4"
                      >
                         <div className="mt-1 w-2 h-2 rounded-full bg-[var(--secondary)] flex-shrink-0"></div>
                         "{tip}"
                      </div>
                    ))}
                  </div>
                </Card>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}

export default FertilizerAdvisor;
