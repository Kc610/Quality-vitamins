
import React from 'react';
import { Product } from '../types';
import { ShoppingCart, Star, ShieldCheck, Eye, Zap, AlertCircle, Sparkles, TrendingUp, Microscope } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (p: Product) => void;
  onViewDetails: (p: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onViewDetails }) => {
  const isSale = product.salePrice && product.salePrice < product.price;
  const isLowStock = product.stockLevel !== undefined && product.stockLevel > 0 && product.stockLevel <= 5;
  const discountPercent = isSale ? Math.round(((product.price - product.salePrice!) / product.price) * 100) : 0;

  const renderBadge = () => {
    if (isSale) {
      return (
        <div className="absolute top-5 left-5 bg-red-600 text-white text-[10px] font-black px-5 py-2.5 rounded-2xl uppercase tracking-[0.3em] shadow-4xl flex items-center gap-2 animate-pulse z-20">
          <Zap className="w-3.5 h-3.5 fill-current" /> {discountPercent}% OFF
        </div>
      );
    }
    if (isLowStock) {
      return (
        <div className="absolute top-5 left-5 bg-hh-orange text-white text-[10px] font-black px-5 py-2.5 rounded-2xl uppercase tracking-[0.3em] shadow-4xl flex items-center gap-2 z-20">
          <AlertCircle className="w-3.5 h-3.5" /> {product.stockLevel} LEFT
        </div>
      );
    }
    if (product.isNew) {
      return (
        <div className="absolute top-5 left-5 bg-hh-green text-hh-dark text-[10px] font-black px-5 py-2.5 rounded-2xl uppercase tracking-[0.3em] shadow-4xl flex items-center gap-2 z-20 border-2 border-white/10">
          <Sparkles className="w-3.5 h-3.5 fill-current" /> NEW SYNTHESIS
        </div>
      );
    }
    if (product.isBestSeller) {
      return (
        <div className="absolute top-5 left-5 bg-hh-dark text-white text-[10px] font-black px-5 py-2.5 rounded-2xl uppercase tracking-[0.3em] shadow-4xl flex items-center gap-2 z-20">
          <TrendingUp className="w-3.5 h-3.5 text-hh-green" /> ELITE STACK
        </div>
      );
    }
    return null;
  };

  return (
    <div 
      className="group bg-white rounded-[4rem] border-4 border-gray-50 p-8 transition-all duration-700 hover:shadow-[0_100px_200px_-40px_rgba(0,0,0,0.25)] hover:border-hh-green/40 hover:-translate-y-6 cursor-pointer flex flex-col relative"
      onClick={() => onViewDetails(product)}
    >
      <div className="relative aspect-square mb-10 overflow-hidden rounded-[3.5rem] bg-hh-light flex-shrink-0 border-2 border-transparent group-hover:border-hh-green/20 transition-all shadow-inner">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-contain transition-transform duration-1000 group-hover:scale-110 p-12 drop-shadow-3xl"
        />
        
        {renderBadge()}
        
        {/* Lab Certification Indicator */}
        <div className="absolute bottom-5 right-5 bg-white/95 backdrop-blur-xl p-4 rounded-3xl shadow-2xl border border-gray-100 group-hover:bg-hh-green transition-all duration-500 z-20">
          <Microscope className="w-7 h-7 text-hh-green group-hover:text-white" />
        </div>

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 bg-hh-dark/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-6 z-10 backdrop-blur-[2px]">
           <button 
              onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
              className="bg-hh-green text-hh-dark p-8 rounded-[2.5rem] hover:bg-white transform transition-all hover:scale-110 shadow-4xl active:scale-90"
           >
             <ShoppingCart className="w-10 h-10" />
           </button>
           <button 
              className="bg-white text-hh-dark p-8 rounded-[2.5rem] hover:bg-hh-dark hover:text-white transform transition-all hover:scale-110 shadow-4xl active:scale-90"
           >
             <Eye className="w-10 h-10" />
           </button>
        </div>
      </div>

      <div className="px-2 flex-grow flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex text-hh-orange">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-4 h-4 ${i < 4 ? 'fill-current' : 'text-gray-200'}`} />
            ))}
          </div>
          <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full italic">Lab Tested</span>
        </div>
        
        <div className="text-[11px] font-black text-hh-green uppercase tracking-[0.5em] mb-3">{product.category}</div>
        <h3 className="font-heading font-black text-hh-dark mb-4 leading-none group-hover:text-hh-green transition-colors text-2xl h-16 line-clamp-2 italic uppercase tracking-tighter">{product.name}</h3>
        <p className="text-sm text-gray-400 mb-10 line-clamp-2 flex-grow font-medium leading-relaxed italic">{product.description}</p>
        
        <div className="flex items-center justify-between mt-auto pt-8 border-t-4 border-gray-50">
          <div className="flex flex-col">
            {isSale && (
              <span className="text-xs text-gray-300 line-through font-black tracking-tight italic">${product.price.toFixed(2)}</span>
            )}
            <span className={`font-heading font-black text-3xl ${isSale ? 'text-red-600' : 'text-hh-dark'} tracking-tighter italic`}>
              ${(product.salePrice || product.price).toFixed(2)}
            </span>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
            className="text-[11px] font-black uppercase text-hh-dark hover:text-hh-green transition-all tracking-[0.4em] border-b-4 border-hh-dark hover:border-hh-green pb-2 italic"
          >
            FUEL UP +
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
