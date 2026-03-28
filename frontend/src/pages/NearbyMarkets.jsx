import React, { useState, useEffect } from 'react';
import { ShoppingCart, Store, Navigation, ListPlus, Package } from 'lucide-react';
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
    <div className="max-w-7xl mx-auto pb-24">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <PageHeader
          icon="🛒"
          title="Smart Agri Marketplace"
          subtitle="Buy, sell, and discover agricultural products near you."
        />
        
        {/* Navigation Pills */}
        <div className="flex gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-emerald-100 overflow-x-auto max-w-full hide-scrollbar snap-x">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`snap-start flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 relative whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-700'
                }`}
              >
                <Icon size={18} />
                {tab.label}
                {tab.badge > 0 && (
                  <span className={`absolute -top-1.5 -right-1.5 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold border-2 ${
                    isActive ? 'bg-amber-400 text-amber-900 border-emerald-600' : 'bg-emerald-500 text-white border-white'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
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
  );
}
