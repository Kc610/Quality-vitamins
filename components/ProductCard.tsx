import React, { useState } from 'react';
import { Product } from '../types.ts';
import { ShoppingCart, Eye, Zap, Sparkles, TrendingUp, Cpu, Loader2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface ProductCardProps {
  product: Product;
  onAddToCart: (p: Product) => void;
  onViewDetails: (p: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onViewDetails }) => {
  const [smartTip, setSmartTip] = useState<string | null>(null);
  const [isLoadingTip, setIsLoadingTip] = useState(false);

  const fetchSmartTip = async () => {
    if (smartTip) return;
    setIsLoadingTip(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Provide a 10-word punchy, high-octane performance tip for a biological performance athlete taking ${product.name}. Focus on biological dominance and cellular output.`,
      });
      setSmartTip(response.text || "Optimize intake for maximum delta.");
    } catch (e) {
      setSmartTip("Synthesize output for peak performance.");
    } finally {
      setIsLoadingTip(false);
    }
  };

  return (
    <div 
      className="group bg-hh-card rounded-[3.5rem] border border-white/5 p-8 transition-all duration-500 hover:border-hh-green/30 hover:-translate-y-4 hover:shadow-2xl cursor-pointer flex flex-col relative"
      onClick={() => onViewDetails(product)}
      onMouseEnter={fetchSmartTip}
    >
      <div className="relative aspect-square mb-8 overflow-hidden rounded-[2.5rem] bg-hh-dark flex-shrink-0 border border-white/5 group-hover:border-hh-green/20 transition-all">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110 p-8"
        />
        
        {product.isBestSeller && (
          <div className="absolute top-4 left-4 bg-hh-green text-hh-dark text-[9px] font-black px-4 py-2 rounded-xl uppercase tracking-widest shadow-xl flex items-center gap-2">
            <TrendingUp className="w-3 h-3" /> Elite Stack
          </div>
        )}

        <div className="absolute inset-0 bg-hh-dark/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-8 backdrop-blur-sm">
           <div className="mb-6 text-center space-y-3">
              <Cpu className="w-8 h-8 text-hh-green mx-auto" />
              <p className="text-[10px] font-black uppercase text-hh-green tracking-widest">Neural Insight</p>
              {isLoadingTip ? (
                <Loader2 className="w-5 h-5 animate-spin text-white mx-auto" />
              ) : (
                <p className="text-xs text-white font-bold italic leading-relaxed">"{smartTip}"</p>
              )}
           </div>
           
           <div className="flex gap-4">
             <button 
                onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
                className="bg-hh-green text-hh-dark p-6 rounded-2xl hover:bg-white transform transition-all hover:scale-110 shadow-2xl active:scale-95"
             >
               <ShoppingCart className="w-6 h-6" />
             </button>
             <button 
                className="bg-white/10 text-white p-6 rounded-2xl hover:bg-white hover:text-hh-dark transform transition-all hover:scale-110 shadow-2xl active:scale-95"
             >
               <Eye className="w-6 h-6" />
             </button>
           </div>
        </div>
      </div>

      <div className="flex-grow flex flex-col">
        <div className="text-[10px] font-black text-hh-green uppercase tracking-[0.3em] mb-2">{product.category}</div>
        <h3 className="font-heading font-black text-white mb-4 leading-none group-hover:text-hh-green transition-colors text-xl line-clamp-2 italic uppercase tracking-tighter">{product.name}</h3>
        <p className="text-xs text-gray-500 mb-8 line-clamp-2 flex-grow font-medium italic">{product.description}</p>
        
        <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
          <span className="font-heading font-black text-2xl text-white tracking-tighter italic">
            ${product.price.toFixed(2)}
          </span>
          <button 
            onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
            className="text-[10px] font-black uppercase text-hh-green hover:text-white transition-all tracking-widest border-b-2 border-hh-green/30 hover:border-white pb-1 italic"
          >
            Deploy +
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;