import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Mail, Lock, User, Loader2, UserPlus, ArrowRight, ShieldCheck, Tractor, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    userType: 'buyer'
  });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    const result = await signup({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      userType: formData.userType
    });
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setFormError(result.message || 'Signup failed. Please try again.');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#040705] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor - Video Style Glassmorphism */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-emerald-900/20 blur-[130px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/5 blur-[100px] rounded-full" />
        
        {/* Farm Texture Overlay */}
        <img 
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2070" 
          alt="Farmland"
          className="w-full h-full object-cover opacity-[0.12] grayscale mix-blend-overlay"
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl bg-white/5 backdrop-blur-2xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl relative z-10"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full mb-8">
            <Sparkles className="text-emerald-400" size={14} />
            <span className="text-emerald-400 font-bold tracking-[0.2em] text-[10px] uppercase">
              AI Agriculture Automation 🌾
            </span>
          </div>
          
          <h1 className="text-4xl font-black text-white mb-2 tracking-tighter leading-none">
            Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-lime-300 italic">Ecosystem.</span>
          </h1>
          <p className="text-emerald-100/40 font-medium">Connect your farm to the future of agriculture.</p>
        </div>

        {formError && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-emerald-100/30 ml-1">Legal Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-emerald-100/20 group-focus-within:text-emerald-400 transition-colors">
                  <User size={18} />
                </div>
                <input
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter name"
                  className="w-full bg-white/5 border border-white/5 text-white pl-11 pr-4 py-4 rounded-2xl outline-none focus:border-emerald-500/30 focus:bg-white/10 transition-all placeholder:text-emerald-100/10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-emerald-100/30 ml-1">Email Node</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-emerald-100/20 group-focus-within:text-emerald-400 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  className="w-full bg-white/5 border border-white/5 text-white pl-11 pr-4 py-4 rounded-2xl outline-none focus:border-emerald-500/30 focus:bg-white/10 transition-all placeholder:text-emerald-100/10"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-emerald-100/30 ml-1">Primary Access Key</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-emerald-100/20 group-focus-within:text-emerald-400 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="w-full bg-white/5 border border-white/5 text-white pl-11 pr-4 py-4 rounded-2xl outline-none focus:border-emerald-500/30 focus:bg-white/10 transition-all placeholder:text-emerald-100/10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-emerald-100/30 ml-1">Validate Key</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-emerald-100/20 group-focus-within:text-emerald-400 transition-colors">
                  <ShieldCheck size={18} />
                </div>
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Enter confirm password"
                  className="w-full bg-white/5 border border-white/5 text-white pl-11 pr-4 py-4 rounded-2xl outline-none focus:border-emerald-500/30 focus:bg-white/10 transition-all placeholder:text-emerald-100/10"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <label className="text-xs font-bold uppercase tracking-widest text-emerald-100/30 ml-1">Platform Role Assignment</label>
            <div className="grid grid-cols-2 gap-4">
              <button 
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, userType: 'buyer' }))}
                className={`flex flex-col items-center justify-center gap-3 p-6 rounded-3xl border transition-all ${
                  formData.userType === 'buyer' 
                    ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.1)]' 
                    : 'bg-white/5 border-white/5 text-emerald-100/30 hover:border-emerald-500/20'
                }`}
              >
                <div className={`p-3 rounded-full ${formData.userType === 'buyer' ? 'bg-emerald-500 text-[#040705]' : 'bg-white/5 text-emerald-100/40'}`}>
                  <Tractor size={20} />
                </div>
                <div className="text-center">
                  <span className="block font-bold text-sm">Agriculture Operator</span>
                  <span className="text-xs opacity-60 uppercase tracking-wide">(Farmer / Buyer)</span>
                </div>
              </button>
              
              <button 
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, userType: 'seller' }))}
                className={`flex flex-col items-center justify-center gap-3 p-6 rounded-3xl border transition-all ${
                  formData.userType === 'seller' 
                    ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.1)]' 
                    : 'bg-white/5 border-white/5 text-emerald-100/30 hover:border-emerald-500/20'
                }`}
              >
                <div className={`p-3 rounded-full ${formData.userType === 'seller' ? 'bg-emerald-500 text-[#040705]' : 'bg-white/5 text-emerald-100/40'}`}>
                  <ShoppingCart size={20} />
                </div>
                <div className="text-center">
                  <span className="block font-bold text-sm">Supply Provider</span>
                  <span className="text-xs opacity-60 uppercase tracking-wide">(Shop / Seller)</span>
                </div>
              </button>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-[#040705] font-black py-5 rounded-2xl shadow-2xl shadow-emerald-500/20 flex items-center justify-center gap-3 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:pointer-events-none group"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Calibrating Metadata...</span>
                </>
              ) : (
                <>
                  <UserPlus size={20} className="group-hover:rotate-12 transition-transform" />
                  <span>Initialize Registration</span>
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-10 pt-8 border-t border-white/5 text-center">
          <p className="text-emerald-100/30 text-sm font-medium">
            Already verified?{' '}
            <Link to="/login" className="text-emerald-400 font-bold hover:text-emerald-300 transition-colors inline-flex items-center gap-1 group">
              Access Dashboard <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </p>
        </div>
      </motion.div>

      {/* Footer Branding */}
      <div className="absolute bottom-6 left-0 right-0 text-center flex items-center justify-center gap-2 text-emerald-100/20 text-[10px] uppercase font-bold tracking-[0.2em] z-10">
        <span>Global Agricultural Network 🌾 Powered by KhetiBuddy</span>
      </div>
    </div>
  );
};

export default Signup;

