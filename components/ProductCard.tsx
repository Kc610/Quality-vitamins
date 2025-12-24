
import React from 'react';
import { Product } from '../types';
import { ShoppingCart, Star, ShieldCheck, Eye, Zap, AlertCircle, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (p: Product) => void;
  onViewDetails: (p: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onViewDetails }) => {
  const isSale = product.salePrice && product.salePrice < product.price;
  const isLowStock = product.stockLevel !== undefined && product.stockLevel > 0 && product.stockLevel <= 5;
  const discountPercent = isSale ? Math.round(((product.price - product.salePrice!) / product.price) * 100) : 0;

  // Badge Priority: Sale > Low Stock > New Arrival > Best Seller
  const renderBadge = () => {
    if (isSale) {
      return (
        <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider shadow-lg flex items-center gap-1 animate-pulse">
          <Zap className="w-3 h-3 fill-current" /> {discountPercent}% OFF
        </div>
      );
    }
    if (isLowStock) {
      return (
        <div className="absolute top-3 left-3 bg-hh-orange text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider shadow-lg flex items-center gap-1">
          <AlertCircle className="w-3 h-3" /> ONLY {product.stockLevel} LEFT
        </div>
      );
    }
    if (product.isNew) {
      return (
        <div className="absolute top-3 left-3 bg-hh-green text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider shadow-lg flex items-center gap-1">
          <Sparkles className="w-3 h-3 fill-current" /> NEW
        </div>
      );
    }
    if (product.isBestSeller) {
      return (
        <div className="absolute top-3 left-3 bg-hh-dark text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider shadow-lg">
          BEST SELLER
        </div>
      );
    }
    return null;
  };

  return (
    <div 
      className="group bg-white rounded-3xl border border-gray-100 p-4 transition-all duration-300 hover:shadow-2xl hover:border-hh-green/20 hover:-translate-y-2 cursor-pointer flex flex-col"
      onClick={() => onViewDetails(product)}
    >
      <div className="relative aspect-square mb-4 overflow-hidden rounded-2xl bg-gray-50 flex-shrink-0">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110 p-4"
        />
        
        {renderBadge()}
        
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-md">
          <ShieldCheck className="w-4 h-4 text-hh-green" />
        </div>

        {/* Action Overlay */}
        <div className="absolute inset-0 bg-hh-dark/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
           <button 
              onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
              className="bg-hh-green text-white p-3 rounded-full hover:bg-hh-greenDark transform transition hover:scale-110 shadow-xl"
              title="Add to Cart"
           >
             <ShoppingCart className="w-5 h-5" />
           </button>
           <button 
              className="bg-white text-hh-dark p-3 rounded-full hover:bg-gray-100 transform transition hover:scale-110 shadow-xl"
              title="View Details"
           >
             <Eye className="w-5 h-5" />
           </button>
        </div>
      </div>

      <div className="px-2 flex-grow flex flex-col">
        <div className="flex items-center gap-1 mb-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-3 h-3 ${i < 4 ? 'text-hh-orange fill-hh-orange' : 'text-gray-200'}`} />
          ))}
          <span className="text-[10px] text-gray-400 font-bold ml-1">(28)</span>
        </div>
        
        <div className="text-[10px] font-bold text-hh-green uppercase tracking-widest mb-1">{product.category}</div>
        <h3 className="font-heading font-bold text-hh-dark mb-1 leading-tight group-hover:text-hh-green transition-colors text-sm h-10 line-clamp-2">{product.name}</h3>
        <p className="text-xs text-gray-400 mb-3 line-clamp-2 flex-grow">{product.description}</p>
        
        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex flex-col">
            {isSale && (
              <span className="text-[10px] text-gray-400 line-through font-bold">${product.price.toFixed(2)}</span>
            )}
            <span className={`font-heading font-extrabold text-lg ${isSale ? 'text-red-500' : 'text-hh-dark'}`}>
              ${(product.salePrice || product.price).toFixed(2)}
            </span>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
            className="text-[11px] font-black uppercase text-hh-dark hover:text-hh-green transition-colors tracking-tighter"
          >
            Add to Bag +
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
