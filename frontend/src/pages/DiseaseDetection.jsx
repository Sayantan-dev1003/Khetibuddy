import React, { useState } from 'react';
import { Upload, AlertCircle, CheckCircle } from 'lucide-react';
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
    <div className="max-w-4xl mx-auto">
      <PageHeader
        icon="🌿"
        title="Disease Detection"
        subtitle="Detect crop disease with real plant images"
      />

      {/* TEXT INPUT */}
      <Card className="mb-6">
        <label className="block font-semibold mb-2">Crop Name</label>
        <input
          value={crop}
          onChange={(e) => setCrop(e.target.value)}
          className="w-full px-4 py-3 border-2 rounded-xl mb-4"
          placeholder="e.g. Tomato, Rice"
        />

        <label className="block font-semibold mb-2">Symptoms</label>
        <textarea
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          rows={4}
          className="w-full px-4 py-3 border-2 rounded-xl"
          placeholder="yellow spots, leaf curling, fungal patches"
        />
      </Card>

      {/* IMAGE UPLOAD */}
      <Card className="mb-6">
        <input type="file" hidden id="file" onChange={handleFileSelect} />
        <label
          htmlFor="file"
          className="block border-2 border-dashed rounded-xl min-h-[260px] cursor-pointer"
        >
          {preview ? (
            <div className="relative">
              <img
                src={preview}
                className="h-[260px] w-full object-contain bg-gray-50"
              />
              <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-lg shadow">
                <CheckCircle className="inline text-emerald-600" size={18} />
                <span className="ml-2 text-sm font-semibold">Image added</span>
              </div>
            </div>
          ) : (
            <div className="h-[260px] flex flex-col justify-center items-center text-gray-500">
              <Upload size={48} />
              <p className="mt-2 font-semibold">Upload plant image</p>
            </div>
          )}
        </label>

        <div className="flex gap-4 mt-4">
          <PrimaryButton variant="secondary" onClick={handleReset}>
            Reset
          </PrimaryButton>
          <PrimaryButton loading={loading} onClick={handlePredict}>
            Detect Disease
          </PrimaryButton>
        </div>
      </Card>

      {/* ERROR */}
      {error && (
        <Card className="bg-red-50 border-2 border-red-300">
          <AlertCircle className="inline mr-2 text-red-600" />
          {error}
        </Card>
      )}

      {/* 🌿 PLANT WITH DISEASE IMAGE */}
      {diseaseImage && mainDisease && (
        <Card className="mb-6">
          <h3 className="text-2xl font-bold mb-4">
            🦠 Disease Detected
          </h3>

          <div className="relative rounded-xl overflow-hidden border-2 border-emerald-400">
            <img
              src={diseaseImage}
              alt="Diseased plant"
              className="w-full h-[360px] object-cover"
            />

            <div className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-2 rounded-full font-bold shadow">
              {result.crop || mainDisease.crop}
            </div>

            <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-full font-bold shadow">
              {result.disease || mainDisease.name}
            </div>

            <div className="absolute bottom-4 left-4 bg-emerald-600 text-white px-4 py-2 rounded-full font-semibold shadow">
              Confidence: {mainDisease.confidence} ({mainDisease.probability}%)
            </div>

            <div className="absolute bottom-0 w-full bg-black/60 text-white p-4">
              {mainDisease.cause}
            </div>
          </div>
          
          {result.detectionMethod && (
            <p className="text-sm text-gray-600 mt-2 text-center">
              Detected using: {result.detectionMethod}
            </p>
          )}
        </Card>
      )}

      {/* 📋 DETAILS */}
      {result && (
        <Card className="bg-green-50 border-2 border-green-300">
          <h2 className="text-2xl font-bold mb-4">💊 Treatment & Prevention</h2>

          <div className="mb-6">
            <h4 className="font-bold text-lg mb-2 text-red-700">🧪 Chemical Treatment</h4>
            <ul className="list-disc ml-6 space-y-1">
              {result.treatment?.chemical?.map((c, i) => (
                <li key={i} className="text-gray-800">{c}</li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <h4 className="font-bold text-lg mb-2 text-green-700">🌱 Organic Treatment</h4>
            <ul className="list-disc ml-6 space-y-1">
              {result.treatment?.organic?.map((o, i) => (
                <li key={i} className="text-gray-800">{o}</li>
              ))}
            </ul>
          </div>

          {result.fertilizers && result.fertilizers.length > 0 && (
            <div className="mb-6">
              <h4 className="font-bold text-lg mb-2 text-amber-700">🧺 Recommended Fertilizers</h4>
              <ul className="list-disc ml-6 space-y-1">
                {result.fertilizers.map((f, i) => (
                  <li key={i} className="text-gray-800">{f}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mb-6">
            <h4 className="font-bold text-lg mb-2 text-blue-700">🛡️ Prevention</h4>
            <ul className="list-disc ml-6 space-y-1">
              {result.prevention?.map((p, i) => (
                <li key={i} className="text-gray-800">{p}</li>
              ))}
            </ul>
          </div>

          {result.additionalCare && result.additionalCare.length > 0 && (
            <div>
              <h4 className="font-bold text-lg mb-2 text-purple-700">💚 Additional Care Tips</h4>
              <ul className="list-disc ml-6 space-y-1">
                {result.additionalCare.map((a, i) => (
                  <li key={i} className="text-gray-800">{a}</li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

export default DiseaseDetection;
