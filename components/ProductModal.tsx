
import React from 'react';
import { Product } from '../types';
import { X, ShieldCheck, CheckCircle2, ShoppingCart, Star } from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (p: Product) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onAddToCart }) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      <div 
        className="absolute inset-0 bg-hh-dark/60 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      <div className="relative bg-white w-full max-w-5xl max-h-[90vh] rounded-[2.5rem] shadow-2xl flex flex-col lg:flex-row overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Close Button Mobile */}
        <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 bg-gray-100 rounded-full lg:hidden">
          <X className="w-5 h-5" />
        </button>

        {/* Image Section */}
        <div className="lg:w-1/2 bg-hh-light p-8 lg:p-12 flex items-center justify-center relative min-h-[300px]">
           <div className="absolute top-8 left-8">
              <div className="px-3 py-1 bg-hh-green text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                Lab-Tested Purity
              </div>
           </div>
           <img src={product.image} alt={product.name} className="max-w-full max-h-full object-contain drop-shadow-2xl" />
        </div>

        {/* Info Section */}
        <div className="lg:w-1/2 p-8 lg:p-12 overflow-y-auto">
          <div className="flex flex-col h-full">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex text-hh-orange">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <span className="text-xs font-bold text-gray-400">4.9 (42 Reviews)</span>
              </div>
              <h2 className="font-heading text-3xl font-black uppercase italic tracking-tighter text-hh-dark mb-2 leading-none">
                {product.name}
              </h2>
              <p className="text-hh-green font-bold text-sm uppercase tracking-widest mb-4">{product.category}</p>
              <p className="text-2xl font-heading font-black text-hh-dark">${product.price.toFixed(2)}</p>
            </div>

            <div className="space-y-6 mb-10 flex-grow">
              <section>
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">The Science</h4>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {product.longDescription || product.description}
                </p>
              </section>

              {product.benefits && (
                <section>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">Key Benefits</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {product.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                        <CheckCircle2 className="w-4 h-4 text-hh-green flex-shrink-0" />
                        {benefit}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {product.ingredients && (
                <section>
                   <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Clean Ingredients</h4>
                   <p className="text-xs text-gray-500 italic bg-gray-50 p-4 rounded-xl border border-gray-100">
                     {product.ingredients}
                   </p>
                </section>
              )}

              {product.suggestedUse && (
                <section>
                   <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Suggested Use</h4>
                   <p className="text-sm text-gray-600 font-medium border-l-4 border-hh-orange pl-4 py-1">
                     {product.suggestedUse}
                   </p>
                </section>
              )}
            </div>

            <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => { onAddToCart(product); onClose(); }}
                className="flex-grow py-5 bg-hh-green text-white font-heading font-bold rounded-2xl hover:bg-hh-greenDark transition-all shadow-xl shadow-hh-green/20 flex items-center justify-center gap-3 active:scale-95"
              >
                <ShoppingCart className="w-5 h-5" /> ADD TO MY STACK
              </button>
              <button onClick={onClose} className="py-5 px-10 border-2 border-gray-100 text-gray-500 font-heading font-bold rounded-2xl hover:bg-gray-50 transition-all">
                CLOSE
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
