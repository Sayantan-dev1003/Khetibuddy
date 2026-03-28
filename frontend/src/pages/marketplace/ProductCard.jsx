import React from 'react';
import { Star, MapPin, ShoppingCart, Check } from 'lucide-react';
import Card from '../../components/ui/Card';
import PrimaryButton from '../../components/ui/PrimaryButton';

export default function ProductCard({ product, onAddToCart }) {
  const [added, setAdded] = React.useState(false);
  const [imgSrc, setImgSrc] = React.useState(product.image);

  React.useEffect(() => {
    const fetchImage = async () => {
      const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_KEY;
      if (!UNSPLASH_KEY) return;
      
      try {
        const query = encodeURIComponent(`${product.category} ${product.name.split(' ')[0]}`); // simplify query
        const res = await fetch(`https://api.unsplash.com/search/photos?query=${query}&per_page=1`, {
          headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` },
        });
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          setImgSrc(data.results[0].urls.small);
          // Optionally update localStorage data if needed, but keeping local state is fine for dummy work
        }
      } catch (err) {
        console.error("Unsplash fetch error:", err);
      }
    };

    fetchImage();
  }, [product.name, product.category]);

  const handleAdd = () => {
    // Send imgSrc instead of product.image so the Cart matches perfectly!
    onAddToCart({ ...product, image: imgSrc });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <Card hover className={`flex flex-col h-full ${product.isDeal ? 'border-2 border-amber-300' : 'border border-gray-100'} overflow-hidden p-0 relative group`}>
      {product.isDeal && (
        <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10 shadow-sm">
          🔥 Hot Deal
        </div>
      )}
      
      <div className="h-48 overflow-hidden bg-gray-100 relative">
        <img 
          src={imgSrc} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {product.stock < 10 && (
          <div className="absolute bottom-0 left-0 right-0 bg-red-500/80 text-white text-xs text-center py-1">
            Only {product.stock} left in stock!
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-1">
          <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded">
            {product.category}
          </span>
          <div className="flex items-center gap-1 text-sm bg-gray-50 px-1.5 py-0.5 rounded">
            <Star size={14} className="text-amber-400 fill-amber-400" />
            <span className="font-medium">{product.rating}</span>
            <span className="text-gray-400 text-xs">({product.reviews})</span>
          </div>
        </div>
        
        <h3 className="font-bold text-gray-800 text-lg mb-1 line-clamp-2 leading-tight min-h-[50px]">{product.name}</h3>
        
        <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
          <MapPin size={14} className="text-gray-400"/>
          <span className="truncate">{product.seller} • {product.location}</span>
        </div>
        
        <div className="mt-auto">
          <div className="flex items-end gap-2 mb-4">
            <span className="text-2xl font-bold text-gray-900">₹{product.price}</span>
          </div>
          
          <PrimaryButton 
            onClick={handleAdd}
            className={`w-full justify-center transition-all duration-300 ${added ? 'bg-green-500 hover:bg-green-600' : ''}`}
            icon={added ? <Check size={18} /> : <ShoppingCart size={18} />}
          >
            {added ? 'Added to Cart' : 'Add to Cart'}
          </PrimaryButton>
        </div>
      </div>
    </Card>
  );
}
