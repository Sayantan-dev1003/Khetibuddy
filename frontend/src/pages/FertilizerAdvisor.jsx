import React, { useState } from 'react';
import { Droplets, Sprout, AlertTriangle, Image } from 'lucide-react';
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
    <div className="max-w-5xl mx-auto">
      <PageHeader
        icon="🧪"
        title="Fertilizer Advisor"
        subtitle="Crop + Fertilizer + Low-cost images"
      />

      {/* INPUT FORM */}
      <Card className="mb-6">
        <Select
          label="Select Crop"
          name="crop"
          value={formData.crop}
          onChange={handleChange}
          options={cropOptions}
        />

        <Select
          label="Select Budget"
          name="budget"
          value={formData.budget}
          onChange={handleChange}
          options={budgetOptions}
        />

        <PrimaryButton
          loading={loading}
          icon={<Droplets size={22} />}
          className="w-full mt-4"
          onClick={handleRecommend}
        >
          Get Recommendations
        </PrimaryButton>
      </Card>

      {/* ERROR */}
      {error && (
        <Card className="bg-red-50 border-2 border-red-300 text-red-700">
          {error}
        </Card>
      )}

      {/* 🌾 CROP IMAGES */}
      {images.length > 0 && (
        <Card className="mb-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Image size={22} /> {formData.crop.toUpperCase()} Crop Images
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={formData.crop}
                className="h-40 w-full object-cover rounded-xl shadow"
              />
            ))}
          </div>
        </Card>
      )}

      {/* 🌱 FERTILIZERS */}
      {result?.fertilizers?.length > 0 && (
        <Card className="bg-emerald-50 border-2 border-emerald-300 mb-6">
          <h2 className="text-2xl font-bold mb-4">🌱 Recommended Fertilizers</h2>

          {result.fertilizers.map((fert, idx) => (
            <div
              key={idx}
              className="bg-white p-5 rounded-xl border mb-4 flex gap-4"
            >
              {fert.image && (
                <img
                  src={fert.image}
                  alt={fert.name}
                  className="w-32 h-32 object-cover rounded-lg"
                />
              )}
              <div>
                <h3 className="text-xl font-bold text-emerald-700">
                  {fert.name}
                </h3>
                <p><strong>Nutrient:</strong> {fert.nutrient}</p>
                <p className="text-gray-600">{fert.reason}</p>
              </div>
            </div>
          ))}
        </Card>
      )}

      {/* 💰 LOW COST ALTERNATIVES */}
      {result?.alternatives?.length > 0 && (
        <Card className="bg-amber-50 border-2 border-amber-300 mb-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Sprout size={22} /> Low Cost Alternatives
          </h2>

          {result.alternatives.map((alt, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-lg border mb-2 flex gap-4"
            >
              {alt.image && (
                <img
                  src={alt.image}
                  alt={alt.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
              )}
              <div>
                <h4 className="font-bold">{alt.name}</h4>
                <p><strong>Replaces:</strong> {alt.replaces}</p>
                <p>{alt.whyCheaper}</p>
                <p className="text-sm text-gray-600">{alt.usageTip}</p>
              </div>
            </div>
          ))}
        </Card>
      )}

      {/* ⚠️ GENERAL ADVICE */}
      {result?.advice?.length > 0 && (
        <Card className="bg-blue-50 border-2 border-blue-300">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <AlertTriangle size={22} /> General Advice
          </h2>

          {result.advice.map((tip, idx) => (
            <div
              key={idx}
              className="bg-white p-3 rounded-lg border mb-2"
            >
              {tip}
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}

export default FertilizerAdvisor;
