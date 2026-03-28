import React, { useState } from 'react';
import { Upload, CheckCircle } from 'lucide-react';
import Card from '../../components/ui/Card';
import PrimaryButton from '../../components/ui/PrimaryButton';
import { CATEGORIES } from './dummyData';

export default function SellProductForm({ onAddProduct }) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Fertilizers',
    price: '',
    stock: '',
    description: '',
    seller: 'Current User', // Dummy seller name
    location: '0.0 km', // Dummy location
    rating: 0,
    reviews: 0,
    isDeal: false
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call to upload product
    setTimeout(() => {
      onAddProduct({
        id: `p-${Date.now()}`,
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        // Use a random placeholder image based on category
        image: `https://source.unsplash.com/600x400/?agriculture,${formData.category.toLowerCase()}` 
      });
      setLoading(false);
      setSuccess(true);
      
      // Reset form after short delay
      setTimeout(() => {
        setSuccess(false);
        setFormData({
          ...formData,
          name: '',
          price: '',
          stock: '',
          description: ''
        });
      }, 3000);
    }, 1500);
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-emerald-100 animate-fade-in shadow-sm">
        <CheckCircle size={64} className="text-emerald-500 mb-6" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Listed Successfully!</h2>
        <p className="text-gray-500 mb-6 text-center max-w-sm">
          Your product is now visible on the marketplace for other farmers to purchase.
        </p>
        <PrimaryButton onClick={() => window.dispatchEvent(new CustomEvent('switch-tab', { detail: 'shop' }))}>
          View Marketplace
        </PrimaryButton>
      </div>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Upload className="text-emerald-600" />
        List Your Product
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Product Name *</label>
            <input
              required
              type="text"
              placeholder="E.g., Organic Compost 50kg"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full p-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full p-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
            >
              {CATEGORIES.filter(c => c !== 'All').map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Price (₹) *</label>
            <input
              required
              type="number"
              min="1"
              placeholder="Amount"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              className="w-full p-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Stock Quantity *</label>
            <input
              required
              type="number"
              min="1"
              placeholder="Items available"
              value={formData.stock}
              onChange={(e) => setFormData({...formData, stock: e.target.value})}
              className="w-full p-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-2 border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer group">
          <div className="bg-emerald-100 text-emerald-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <Upload size={32} />
          </div>
          <p className="font-semibold text-gray-700">Click to upload product image</p>
          <p className="text-sm text-gray-500">Supports JPG, PNG (Max 5MB)</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Description</label>
          <textarea
            rows="4"
            placeholder="Describe your product, its features, and benefits..."
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full p-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all resize-none"
          ></textarea>
        </div>

        <PrimaryButton type="submit" loading={loading} className="w-full justify-center" size="xl">
          List Product Now
        </PrimaryButton>
      </form>
    </Card>
  );
}
