import React, { useState, useEffect } from 'react';
import { ShoppingCart, Store, Navigation, ListPlus, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import PageHeader from '../components/ui/PageHeader';

// Marketplace Components
import ProductList from './marketplace/ProductList';
import Cart from './marketplace/Cart';
import CheckoutPayment from './marketplace/CheckoutPayment';
import SellProductForm from './marketplace/SellProductForm';
import OrderHistory from './marketplace/OrderHistory';

// Mock Data
import { INITIAL_PRODUCTS, INITIAL_ORDERS } from './marketplace/dummyData';

export default function NearbyMarkets() {
  const [activeTab, setActiveTab] = useState('shop');
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('kb_marketplace_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('kb_marketplace_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('kb_marketplace_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  // Calculate cart totals
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.cartQuantity), 0);
  const cartItemCount = cart.reduce((total, item) => total + item.cartQuantity, 0);

  // Persist state
  useEffect(() => {
    localStorage.setItem('kb_marketplace_products', JSON.stringify(products));
    localStorage.setItem('kb_marketplace_cart', JSON.stringify(cart));
    localStorage.setItem('kb_marketplace_orders', JSON.stringify(orders));
  }, [products, cart, orders]);

  // Listen for custom tab switch events (e.g., from empty cart to shop)
  useEffect(() => {
    const handleSwitchTab = (e) => setActiveTab(e.detail);
    window.addEventListener('switch-tab', handleSwitchTab);
    return () => window.removeEventListener('switch-tab', handleSwitchTab);
  }, []);

  // Handlers
  const handleAddToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, cartQuantity: item.cartQuantity + 1 } : item
        );
      }
      return [...prev, { ...product, cartQuantity: 1 }];
    });
  };

  const handleUpdateCartQuantity = (id, quantity) => {
    if (quantity <= 0) {
      handleRemoveFromCart(id);
      return;
    }
    setCart(prev => prev.map(item => 
      item.id === id ? { ...item, cartQuantity: quantity } : item
    ));
  };

  const handleRemoveFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleAddProduct = (newProduct) => {
    setProducts(prev => [newProduct, ...prev]);
  };

  const handleCheckoutComplete = (totalPaid, contactData) => {
    const newOrder = {
      id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toISOString(),
      total: totalPaid,
      status: 'Processing',
      items: cart.map(item => ({ name: item.name, qty: item.cartQuantity, price: item.price })),
      deliveryEstimate: 'Expected in 2-3 days',
      customer: contactData || { name: 'Guest User', email: 'N/A', phone: 'N/A', address: 'N/A' }
    };
    
    setOrders(prev => [newOrder, ...prev]);
    setCart([]); // Clear cart
    setActiveTab('orders'); // Jump to orders
  };

  const tabs = [
    { id: 'shop', label: 'Buy Products', icon: Store },
    { id: 'sell', label: 'Sell Your Yield', icon: ListPlus },
    { id: 'cart', label: 'Cart', icon: ShoppingCart, badge: cartItemCount },
    { id: 'orders', label: 'Orders', icon: Package }
  ];

  return (
    <div className="min-h-screen pb-24 relative overflow-hidden font-sans">
      {/* ATMOSPHERIC BACKGROUND */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[10%] right-[10%] w-[50%] h-[50%] bg-emerald-500/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[10%] left-[10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-[1600px] mx-auto px-6 relative z-10 pt-8">
        {/* Header Area */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-12 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <PageHeader
              icon="🛒"
              title="Agri Marketplace"
              subtitle="Buy seeds, sell your yield, and discover specialized farming equipment near you."
              variant="cinematic"
              className="mb-0 text-left"
            />
          </motion.div>
          
          {/* Navigation Pills */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex gap-2 bg-white/50 backdrop-blur-xl p-2 rounded-[2rem] shadow-2xl border border-emerald-100 overflow-x-auto max-w-full hide-scrollbar snap-x"
          >
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`snap-start flex items-center gap-3 px-8 py-4 rounded-[1.5rem] font-black uppercase tracking-widest text-[11px] transition-all duration-500 relative whitespace-nowrap ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-500/30'
                      : 'text-emerald-900/40 hover:bg-emerald-50 hover:text-emerald-700'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                  {tab.badge > 0 && (
                    <span className={`absolute -top-1 -right-1 w-6 h-6 flex items-center justify-center rounded-full text-[10px] font-black border-2 ${
                      isActive ? 'bg-amber-400 text-amber-950 border-emerald-600' : 'bg-emerald-500 text-white border-white'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </motion.div>
        </div>

        {/* Main Content Area */}
        <div className="min-h-[500px]">
          {activeTab === 'shop' && (
            <ProductList products={products} onAddToCart={handleAddToCart} />
          )}
          
          {activeTab === 'sell' && (
            <div className="animate-fade-in">
               <SellProductForm onAddProduct={handleAddProduct} />
            </div>
          )}
          
          {activeTab === 'cart' && (
            <div className="animate-fade-in">
               <Cart 
                 items={cart} 
                 total={cartTotal} 
                 onRemove={handleRemoveFromCart}
                 onUpdateQuantity={handleUpdateCartQuantity}
                 onCheckout={() => setActiveTab('checkout')}
               />
            </div>
          )}
          
          {activeTab === 'checkout' && (
            <div className="animate-fade-in">
              <CheckoutPayment 
                cartTotal={cartTotal} 
                onComplete={handleCheckoutComplete}
                onCancel={() => setActiveTab('cart')}
              />
            </div>
          )}
          
          {activeTab === 'orders' && (
            <div className="animate-fade-in max-w-3xl mx-auto">
               <OrderHistory orders={orders} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
