import React, { useState } from 'react';
import { CreditCard, Smartphone, Banknote, ShieldCheck, CheckCircle, ArrowLeft } from 'lucide-react';
import Card from '../../components/ui/Card';
import PrimaryButton from '../../components/ui/PrimaryButton';

export default function CheckoutPayment({ cartTotal, onComplete, onCancel }) {
  const [method, setMethod] = useState('upi');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [contactData, setContactData] = useState({
    email: '',
    phone: '',
    address: ''
  });
  const finalTotal = cartTotal + (cartTotal * 0.05);

  const handlePay = () => {
    if (!contactData.email || !contactData.phone || !contactData.address) {
      alert("Please fill in all contact and delivery details.");
      return;
    }
    setProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
      
      // Simulate confirmation screen delay before redirect
      setTimeout(() => {
        onComplete(finalTotal, contactData);
      }, 2500);
    }, 2000);
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <CheckCircle size={48} className="text-green-500" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
        <p className="text-gray-500 mb-8 max-w-sm text-center">Your order has been placed successfully and will be delivered within 2-3 working days.</p>
        <div className="animate-pulse bg-emerald-50 text-emerald-800 px-4 py-2 rounded-lg font-medium">
          Redirecting to Order Details...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <button 
        onClick={onCancel}
        className="flex items-center gap-2 text-gray-500 hover:text-emerald-600 mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        Back to Cart
      </button>

      <div className="bg-white rounded-3xl shadow-sm border border-emerald-100 overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Side: Order Stats */}
        <div className="bg-emerald-50 p-8 md:w-1/3 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-emerald-800 mb-6 uppercase tracking-wider text-sm flex items-center gap-2">
              <ShieldCheck size={18} /> Secure Payment
            </h3>
            
            <p className="text-sm text-gray-600 mb-1">Total to pay</p>
            <p className="text-4xl font-black text-gray-900 mb-8 tracking-tighter">₹{finalTotal.toFixed(0)}</p>
            
            <div className="space-y-4 text-sm text-gray-600">
              <div className="flex justify-between border-b border-emerald-200/50 pb-2">
                <span>Subtotal</span>
                <span>₹{cartTotal}</span>
              </div>
              <div className="flex justify-between border-b border-emerald-200/50 pb-2">
                <span>Tax (5%)</span>
                <span>₹{(cartTotal * 0.05).toFixed(0)}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-800 pt-2">
                <span>Total</span>
                <span>₹{finalTotal.toFixed(0)}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-12">
            <p className="text-xs text-center text-gray-500">Encrypted transmission via 256-bit SSL</p>
          </div>
        </div>

        {/* Right Side: Delivery & Payment */}
        <div className="p-8 md:w-2/3">
          
          <h2 className="text-xl font-bold text-gray-800 mb-4">Delivery Details</h2>
          <div className="space-y-4 mb-8">
            <div>
              <label className="text-sm font-semibold text-gray-700">Email Address *</label>
              <input 
                type="email" 
                required
                value={contactData.email}
                onChange={e => setContactData({...contactData, email: e.target.value})}
                className="w-full mt-1 p-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">Phone Number *</label>
              <input 
                type="tel" 
                required
                value={contactData.phone}
                onChange={e => setContactData({...contactData, phone: e.target.value})}
                className="w-full mt-1 p-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                placeholder="+91 98765 43210"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">Delivery Address *</label>
              <textarea 
                required
                rows="3"
                value={contactData.address}
                onChange={e => setContactData({...contactData, address: e.target.value})}
                className="w-full mt-1 p-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all resize-none"
                placeholder="Full delivery address including pincode..."
              />
            </div>
          </div>

          <h2 className="text-xl font-bold text-gray-800 mb-4 pt-4 border-t">Select Payment Method</h2>
          
          <div className="space-y-4 mb-8">
            <label 
              className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                method === 'upi' ? 'border-emerald-500 bg-emerald-50/50 shadow-sm' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input 
                type="radio" 
                name="payment" 
                value="upi" 
                checked={method === 'upi'} 
                onChange={(e) => setMethod(e.target.value)}
                className="w-5 h-5 text-emerald-600"
              />
              <div className="ml-4 flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><Smartphone size={24} /></div>
                <div>
                  <h4 className="font-bold text-gray-800">UPI</h4>
                  <p className="text-sm text-gray-500">Google Pay, PhonePe, Paytm</p>
                </div>
              </div>
            </label>

            <label 
              className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                method === 'card' ? 'border-emerald-500 bg-emerald-50/50 shadow-sm' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input 
                type="radio" 
                name="payment" 
                value="card" 
                checked={method === 'card'} 
                onChange={(e) => setMethod(e.target.value)}
                className="w-5 h-5 text-emerald-600"
              />
              <div className="ml-4 flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-lg text-purple-600"><CreditCard size={24} /></div>
                <div>
                  <h4 className="font-bold text-gray-800">Credit / Debit Card</h4>
                  <p className="text-sm text-gray-500">Visa, MasterCard, RuPay</p>
                </div>
              </div>
            </label>

            <label 
              className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                method === 'cod' ? 'border-emerald-500 bg-emerald-50/50 shadow-sm' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input 
                type="radio" 
                name="payment" 
                value="cod" 
                checked={method === 'cod'} 
                onChange={(e) => setMethod(e.target.value)}
                className="w-5 h-5 text-emerald-600"
              />
              <div className="ml-4 flex items-center gap-3">
                <div className="bg-amber-100 p-2 rounded-lg text-amber-600"><Banknote size={24} /></div>
                <div>
                  <h4 className="font-bold text-gray-800">Cash on Delivery</h4>
                  <p className="text-sm text-gray-500">Pay at the time of delivery</p>
                </div>
              </div>
            </label>
          </div>

          <PrimaryButton 
            onClick={handlePay} 
            loading={processing} 
            className="w-full justify-center" 
            size="xl"
          >
            {processing ? 'Processing Payment...' : `Pay ₹${finalTotal.toFixed(0)}`}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
