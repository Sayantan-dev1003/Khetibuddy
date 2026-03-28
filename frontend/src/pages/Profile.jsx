import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { put, get } from '../services/api';
import { User, Mail, Phone, MapPin, FileText, Lock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('details');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    bio: user?.bio || '',
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleDetailsChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const updateProfileDetails = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await put('/api/profile', formData);
      if (res.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        await updateUser();
      } else {
        setMessage({ type: 'error', text: res.message || 'Failed to update profile' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'An error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  const updatePasswordFlow = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return setMessage({ type: 'error', text: 'New passwords do not match' });
    }

    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await put('/api/profile/password', {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });
      if (res.success) {
        setMessage({ type: 'success', text: 'Password changed successfully!' });
        setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setMessage({ type: 'error', text: res.message || 'Failed to change password' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'An error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses = "w-full px-4 py-3 rounded-xl border border-emerald-100 bg-white/50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none text-emerald-900 placeholder-emerald-300";
  const labelClasses = "block text-sm font-bold text-emerald-800 mb-2 ml-1";

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-10 flex flex-col items-center">
        <div className="relative group">
          <div className="w-32 h-32 rounded-[2rem] bg-gradient-to-br from-emerald-400 to-green-600 p-1 shadow-2xl overflow-hidden mb-4">
             <img 
              src={`https://ui-avatars.com/api/?name=${user?.name}&background=10B981&color=fff&size=200`} 
              alt="Profile" 
              className="w-full h-full object-cover rounded-[1.8rem] bg-white"
            />
          </div>
        </div>
        <h1 className="text-3xl font-black text-emerald-900 tracking-tight">{user?.name}</h1>
        <p className="text-emerald-600 font-medium flex items-center gap-2 mt-1">
          <Mail size={16} /> {user?.email}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 p-2 bg-emerald-100/50 rounded-2xl mb-8">
        <button
          onClick={() => setActiveTab('details')}
          className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'details' ? 'bg-white text-emerald-700 shadow-sm' : 'text-emerald-900/60 hover:text-emerald-900'
          }`}
        >
          <User size={18} /> Details
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'security' ? 'bg-white text-emerald-700 shadow-sm' : 'text-emerald-900/60 hover:text-emerald-900'
          }`}
        >
          <Lock size={18} /> Security
        </button>
      </div>

      {/* Feedback Message */}
      {message.text && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`mb-6 p-4 rounded-xl flex items-center gap-3 font-medium ${
            message.type === 'success' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-red-100 text-red-700 border border-red-200'
          }`}
        >
          {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          {message.text}
        </motion.div>
      )}

      {/* Form Area */}
      <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 border border-white/50 shadow-xl shadow-emerald-900/5">
        {activeTab === 'details' ? (
          <form onSubmit={updateProfileDetails}>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className={labelClasses}>Full Name</label>
                <div className="relative">
                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400">
                    <User size={18} />
                   </div>
                   <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleDetailsChange}
                    className={`${inputClasses} pl-12`}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>
              <div>
                <label className={labelClasses}>Phone Number</label>
                <div className="relative">
                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400">
                    <Phone size={18} />
                   </div>
                   <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleDetailsChange}
                    className={`${inputClasses} pl-12`}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className={labelClasses}>Location / Address</label>
              <div className="relative">
                 <div className="absolute left-4 top-3.5 text-emerald-400">
                  <MapPin size={18} />
                 </div>
                 <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleDetailsChange}
                  className={`${inputClasses} pl-12 min-h-[100px] py-3.5`}
                  placeholder="Enter your village/city, district, state"
                />
              </div>
            </div>

            <div className="mb-8">
              <label className={labelClasses}>About You / Bio</label>
              <div className="relative">
                 <div className="absolute left-4 top-3.5 text-emerald-400">
                  <FileText size={18} />
                 </div>
                 <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleDetailsChange}
                  className={`${inputClasses} pl-12 min-h-[100px] py-3.5`}
                  placeholder="Brief info about yourself or your farm..."
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 text-white font-black uppercase tracking-[0.1em] py-4 rounded-[1.5rem] hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-700/20"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : 'Save Profile Changes'}
            </button>
          </form>
        ) : (
          <form onSubmit={updatePasswordFlow}>
            <div className="mb-6">
              <label className={labelClasses}>Current Password</label>
               <input
                type="password"
                name="oldPassword"
                value={passwordData.oldPassword}
                onChange={handlePasswordChange}
                className={inputClasses}
                placeholder="••••••••"
                required
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className={labelClasses}>New Password</label>
                 <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className={inputClasses}
                  placeholder="••••••••"
                  required
                />
              </div>
              <div>
                <label className={labelClasses}>Confirm New Password</label>
                 <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className={inputClasses}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-900 text-white font-black uppercase tracking-[0.1em] py-4 rounded-[1.5rem] hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : 'Update Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
