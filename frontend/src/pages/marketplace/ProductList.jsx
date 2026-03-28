import React, { useState } from 'react';
import { Search, Filter, TrendingUp } from 'lucide-react';
import ProductCard from './ProductCard';
import { CATEGORIES } from './dummyData';

export default function ProductList({ products, onAddToCart }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const deals = products.filter(p => p.isDeal);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-4 sticky top-20 z-10 transition-shadow hover:shadow-md">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search seeds, fertilizers, equipment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all outline-none"
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-gray-50 border border-gray-200 hover:bg-gray-100 rounded-xl font-medium text-gray-700 transition-colors whitespace-nowrap">
            <Filter size={20} />
            Filters
          </button>
        </div>

        {/* Categories */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-none snap-x">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`snap-start px-4 py-2 rounded-full whitespace-nowrap font-medium transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-emerald-600 text-white shadow-md scale-105'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Deals (only show if 'All' category and no search) */}
      {activeCategory === 'All' && !searchQuery && deals.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4 mt-8">
            <TrendingUp size={24} className="text-amber-500" />
            <h2 className="text-xl font-bold text-gray-800">Nearby Hot Deals</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {deals.map(deal => (
              <ProductCard key={deal.id} product={deal} onAddToCart={onAddToCart} />
            ))}
          </div>
        </div>
      )}

      {/* Product Grid */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4 mt-8 flex items-center justify-between">
          <span>{activeCategory === 'All' ? 'All Products' : `${activeCategory} Products`}</span>
          <span className="text-sm font-normal text-gray-500">{filteredProducts.length} items found</span>
        </h2>
        
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or category filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
               <div key={product.id} className="transform transition duration-300 hover:-translate-y-1">
                 <ProductCard product={product} onAddToCart={onAddToCart} />
               </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
