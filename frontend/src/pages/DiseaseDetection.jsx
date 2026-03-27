import React, { useState } from 'react';
import { Upload, AlertCircle, CheckCircle, Leaf, Search, RefreshCw, Layers } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import PrimaryButton from '../components/ui/PrimaryButton';
import InputField from '../components/ui/InputField';

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
      const cropName = data.data.crop || topDisease?.crop;
      
      if (topDisease && cropName) {
        const img = await fetchDiseasedPlantImage(
          cropName,
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
    <div className="max-w-5xl mx-auto space-y-10">
      <PageHeader
        title="Plant Healer"
        subtitle="Snapshot your crop's trouble, let the earth reveal the remedy."
        icon="🔍"
        className="mb-12"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT: INPUT METHODS */}
        <div className="space-y-8">
          {/* TEXT INPUT */}
          <Card className="!bg-white/80 border-t-4 border-t-[var(--secondary)] overflow-hidden" padding="lg">
             <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-[var(--secondary)]/10 rounded-2xl text-[var(--secondary)]">
                  <Search size={28} strokeWidth={3} />
                </div>
                <h3 className="text-2xl font-black text-[var(--primary)] lowercase tracking-tight">describe the symptoms</h3>
             </div>
             
             <InputField
               label="What is the crop name?"
               name="crop"
               value={crop}
               onChange={(e) => setCrop(e.target.value)}
               placeholder="Tomato, Rice, Wheat..."
               icon={<Leaf size={20} />}
             />

             <div className="group">
                <label className="block text-[var(--primary)] text-lg font-bold mb-2 transition-colors group-focus-within:text-[var(--accent)]">
                  Describe what the leaves look like
                </label>
                <textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  rows={4}
                  className="w-full px-6 py-5 text-lg font-bold border-2 border-[var(--primary-light)]/10 bg-[var(--bg-main)]/50 rounded-3xl focus:outline-none focus:border-[var(--primary)] focus:ring-8 focus:ring-[var(--primary)]/5 transition-all resize-none placeholder:text-[var(--text-muted)]/50 group-hover:bg-white"
                  placeholder="e.g. Yellow spots on bottom leaves, curling edges..."
                />
             </div>
          </Card>

          {/* IMAGE UPLOAD */}
          <Card className="!bg-[var(--primary)] text-white border-none group relative overflow-hidden" padding="lg">
             {/* Texture overlay */}
             <div className="absolute inset-0 opacity-10 pointer-events-none paper-texture"></div>
             
             <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-white/20 rounded-2xl text-[var(--leaf-bright)]">
                    <Upload size={28} strokeWidth={3} />
                  </div>
                  <h3 className="text-2xl font-black lowercase tracking-tight">or upload a leaf photo</h3>
                </div>

                <input type="file" hidden id="file" onChange={handleFileSelect} />
                <label
                  htmlFor="file"
                  className={`block border-4 border-dashed rounded-[3rem] min-h-[300px] cursor-pointer transition-all duration-500 hover:border-white/50 ${preview ? 'border-transparent' : 'border-white/20 bg-black/10'}`}
                >
                  {preview ? (
                    <div className="relative h-full animate-fade-in">
                      <img
                        src={preview}
                        className="h-[300px] w-full object-cover rounded-[2.5rem] shadow-2xl"
                      />
                      <div className="absolute -top-4 -right-4 bg-[var(--leaf-bright)] text-[var(--earth-deep)] px-6 py-2 rounded-full font-black shadow-2xl flex items-center gap-2 scale-110">
                        <CheckCircle size={20} strokeWidth={3} />
                        READY
                      </div>
                    </div>
                  ) : (
                    <div className="h-[300px] flex flex-col justify-center items-center text-white/50 gap-4 group-hover:scale-105 transition-transform">
                      <div className="p-6 bg-white/10 rounded-full animate-pulse">
                        <Layers size={64} strokeWidth={1} />
                      </div>
                      <p className="font-black uppercase tracking-widest text-sm">Drop your plant image here</p>
                    </div>
                  )}
                </label>

                <div className="flex gap-4 mt-10">
                  <PrimaryButton 
                    variant="outline" 
                    onClick={handleReset}
                    className="flex-1 !border-white/30 !text-white hover:!bg-white/10 !rounded-[2rem]"
                    icon={<RefreshCw size={20} />}
                  >
                    CLEAR
                  </PrimaryButton>
                  <PrimaryButton 
                    loading={loading} 
                    onClick={handlePredict}
                    className="flex-1 !bg-[var(--leaf-bright)] !text-[var(--earth-deep)] !rounded-[2rem] font-black group shadow-xl"
                    icon={<AlertCircle size={20} />}
                  >
                    IDENTIFY NOW
                  </PrimaryButton>
                </div>
             </div>
          </Card>
        </div>

        {/* RIGHT: RESULTS DISPLAY */}
        <div className="space-y-8">
           {/* ERROR */}
           {error && (
             <Card className="!bg-red-50 border-2 border-red-200 animate-shake" padding="lg">
               <div className="flex items-center gap-4 text-red-700">
                  <AlertCircle size={32} />
                  <p className="font-bold text-lg">{error}</p>
               </div>
             </Card>
           )}

           {/* IF NO RESULT AND NOT LOADING */}
           {!result && !loading && (
             <Card className="h-full flex flex-col justify-center items-center text-center !bg-transparent !border-4 !border-dashed !border-[var(--primary-light)]/20 py-20" padding="xl">
                <div className="text-8xl mb-8 opacity-20">🌿</div>
                <h3 className="text-3xl font-black text-[var(--primary)] opacity-40">Awaiting your Seeds of Data</h3>
                <p className="text-[var(--text-muted)] mt-4 font-bold max-w-sm">Provide symptoms or a photo to see the diagnosis here.</p>
             </Card>
           )}

           {/* LOADING STATE - Detailed Loader */}
           {loading && (
             <Card className="h-full flex flex-col justify-center items-center text-center py-20 bg-white/50 backdrop-blur-xl" padding="xl">
                <div className="relative">
                  <div className="w-24 h-24 border-8 border-[var(--primary-light)]/10 border-t-[var(--secondary)] rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-4xl animate-bounce">🧬</div>
                </div>
                <h3 className="text-3xl font-black text-[var(--primary)] mt-10">Analyzing Growth Patterns...</h3>
                <p className="text-[var(--text-muted)] mt-2 font-bold uppercase tracking-widest text-xs">Consulting the Earth's wisdom</p>
             </Card>
           )}

           {/* 🌿 PLANT WITH DISEASE IMAGE */}
           {result && (
             <div className="space-y-8 animate-fade-in-up">
                {diseaseImage && mainDisease && (
                  <Card className="!p-0 !bg-transparent !border-none overflow-hidden" padding="none">
                    <div className="relative rounded-[3rem] overflow-hidden border-[10px] border-white shadow-2xl group">
                      <img
                        src={diseaseImage}
                        alt="Diseased plant comparison"
                        className="w-full h-[450px] object-cover transition-transform duration-700 group-hover:scale-110"
                      />

                      {/* Overlays */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                      
                      <div className="absolute top-6 left-6 bg-[var(--primary)] text-white px-6 py-3 rounded-[2rem] font-black shadow-2xl flex items-center gap-2">
                        <span className="text-xs opacity-60">CROP:</span> {result.crop || mainDisease.crop}
                      </div>

                      <div className="absolute top-6 right-6 bg-[var(--accent)] text-white px-6 py-3 rounded-[2rem] font-black shadow-2xl border-2 border-white/20">
                        {result.disease || mainDisease.name}
                      </div>

                      <div className="absolute bottom-6 left-6 right-6">
                        <div className="flex items-center justify-between mb-4">
                           <div className="px-6 py-2 bg-[var(--secondary)] text-white rounded-full font-black text-sm shadow-xl flex items-center gap-2">
                              Confidence: {mainDisease.confidence} ({mainDisease.probability}%)
                           </div>
                           {result.detectionMethod && (
                             <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">via {result.detectionMethod}</span>
                           )}
                        </div>
                        <p className="text-white text-lg font-bold leading-relaxed">{mainDisease.cause}</p>
                      </div>
                    </div>
                  </Card>
                )}

                {/* 📋 TREATMENT DETAILS */}
                <Card className="!bg-[#fefae0] border-2 border-[var(--primary-light)]/20 shadow-2xl relative overflow-hidden" padding="xl">
                  {/* Decorative corner */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-[var(--secondary)]/10 rounded-full blur-2xl"></div>
                  
                  <h2 className="text-4xl font-black text-[var(--primary)] mb-10 flex items-center gap-4">
                    <div className="w-12 h-12 bg-[var(--primary)] text-white rounded-2xl flex items-center justify-center shadow-lg">💊</div>
                    Nature's Remedies
                  </h2>

                  <div className="space-y-10">
                    <section>
                      <h4 className="flex items-center gap-2 font-black text-xl mb-4 text-[var(--primary)] uppercase tracking-tight">
                        <span className="w-2 h-8 bg-[var(--accent)] rounded-full"></span>
                        Chemical Response
                      </h4>
                      <div className="grid grid-cols-1 gap-3">
                        {result.treatment?.chemical?.map((c, i) => (
                          <div key={i} className="flex gap-4 p-5 bg-white/60 rounded-[2rem] border border-[var(--primary-light)]/10 hover:shadow-md transition-all">
                             <span className="text-2xl">🧪</span>
                             <p className="text-[var(--text-main)] font-bold">{c}</p>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section>
                      <h4 className="flex items-center gap-2 font-black text-xl mb-4 text-[var(--secondary)] uppercase tracking-tight">
                        <span className="w-2 h-8 bg-[var(--secondary)] rounded-full"></span>
                        Organic Wisdom
                      </h4>
                      <div className="grid grid-cols-1 gap-3">
                        {result.treatment?.organic?.map((o, i) => (
                          <div key={i} className="flex gap-4 p-5 bg-[var(--secondary)]/5 rounded-[2rem] border border-[var(--secondary)]/10 hover:shadow-md transition-all">
                             <span className="text-2xl">🌿</span>
                             <p className="text-[var(--text-main)] font-bold">{o}</p>
                          </div>
                        ))}
                      </div>
                    </section>

                    {result.fertilizers && result.fertilizers.length > 0 && (
                      <section>
                        <h4 className="font-black text-xl mb-4 text-[#bf360c] flex items-center gap-2 uppercase tracking-tight">
                          <span className="w-2 h-8 bg-[#bf360c] rounded-full"></span>
                          Soil Nourishment
                        </h4>
                        <div className="flex flex-wrap gap-3">
                          {result.fertilizers.map((f, i) => (
                            <span key={i} className="px-6 py-3 bg-[#fff3e0] text-[#e65100] rounded-[1.5rem] font-black text-sm border border-[#ffe0b2] shadow-sm transform hover:scale-105 transition-transform">{f}</span>
                          ))}
                        </div>
                      </section>
                    )}

                    <section className="bg-white/40 p-8 rounded-[3rem] border-2 border-dashed border-[var(--primary-light)]/20">
                      <h4 className="font-black text-xl mb-6 text-blue-800 flex items-center gap-2">
                        🛡️ Fortifying the Farm (Prevention)
                      </h4>
                      <ul className="space-y-4">
                        {result.prevention?.map((p, i) => (
                          <li key={i} className="flex items-start gap-4">
                            <div className="mt-1 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                               <CheckCircle size={14} strokeWidth={3} />
                            </div>
                            <p className="text-[var(--text-main)] font-bold leading-relaxed">{p}</p>
                          </li>
                        ))}
                      </ul>
                    </section>
                  </div>
                </Card>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}

export default DiseaseDetection;
