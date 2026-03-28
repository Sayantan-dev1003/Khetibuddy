import React from 'react';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import Card from '../../components/ui/Card';
import PrimaryButton from '../../components/ui/PrimaryButton';

export default function Cart({ items, total, onCheckout, onRemove, onUpdateQuantity }) {
  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border-2 border-dashed border-gray-200">
        <ShoppingCart size={80} className="text-gray-300 mb-6" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 max-w-sm">Looks like you haven't added anything to your cart yet. Explore the marketplace to find seed, fertilizer and more.</p>
        <PrimaryButton size="lg" onClick={() => window.dispatchEvent(new CustomEvent('switch-tab', { detail: 'shop' }))}>Start Shopping</PrimaryButton>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Cart Items List */}
      <div className="flex-1 space-y-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <ShoppingCart className="text-emerald-600" />
            Your Cart
          </h2>
          <span className="text-gray-500 font-medium">{items.length} {items.length === 1 ? 'item' : 'items'}</span>
        </div>
        
        {items.map(item => (
          <Card key={item.id} className="flex gap-4 p-4 border border-gray-100 shadow-sm relative pr-12 group transition-all hover:border-emerald-200">
            <img 
              src={item.image} 
              alt={item.name} 
              className="w-24 h-24 object-cover rounded-xl"
            />
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-gray-800 line-clamp-1">{item.name}</h3>
                <p className="text-sm text-gray-500 truncate mb-2">{item.seller}</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <button 
                      onClick={() => onUpdateQuantity(item.id, item.cartQuantity - 1)}
                      className="w-6 h-6 flex items-center justify-center text-gray-600 hover:bg-white hover:text-red-500 rounded shadow-sm transition-all text-lg font-bold"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-10 text-center font-semibold">{item.cartQuantity}</span>
                    <button 
                      onClick={() => onUpdateQuantity(item.id, item.cartQuantity + 1)}
                      className="w-6 h-6 flex items-center justify-center text-gray-600 hover:bg-white hover:text-emerald-500 rounded shadow-sm transition-all"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end justify-between">
              <span className="font-bold text-lg text-emerald-700 block">₹{item.price * item.cartQuantity}</span>
              <button 
                onClick={() => onRemove(item.id)}
                className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors p-2"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Order Summary Checkout Panel */}
      <div className="lg:w-96">
        <div className="bg-white rounded-2xl p-6 border-2 border-emerald-100 sticky top-24 shadow-sm">
          <h3 className="text-xl font-bold mb-6 border-b pb-4">Order Summary</h3>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-medium">₹{total}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery Fee</span>
              <span className="font-medium text-emerald-600">Free</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Service Tax</span>
              <span className="font-medium">₹{(total * 0.05).toFixed(0)}</span>
            </div>
          </div>
          
          <div className="border-t pt-4 mb-6">
            <div className="flex justify-between items-end">
              <span className="font-bold text-gray-800">Total</span>
              <span className="font-black text-2xl text-emerald-600 tracking-tight">
                ₹{total + Number((total * 0.05).toFixed(0))}
              </span>
            </div>
          </div>
          
          <PrimaryButton 
            className="w-full justify-center group" 
            size="xl" 
            onClick={onCheckout}
          >
             Proceed to Checkout
             <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
          </PrimaryButton>
          
          <div className="mt-4 flex flex-col items-center flex-wrap gap-2 justify-center opacity-60 text-xs text-gray-500">
            <span>Secure checkout handled safely.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
