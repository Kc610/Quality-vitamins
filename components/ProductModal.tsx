
import React, { useState } from 'react';
import { Product } from '../types.ts';
import { X, ShieldCheck, CheckCircle2, ShoppingCart, Star, Zap, Microscope, Activity } from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (p: Product) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onAddToCart }) => {
  const [activeTab, setActiveTab] = useState<'science' | 'ingredients' | 'benefits'>('science');

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      <div 
        className="absolute inset-0 bg-hh-dark/80 backdrop-blur-xl animate-in fade-in duration-500"
        onClick={onClose}
      />
      
      <div className="relative bg-white w-full max-w-6xl max-h-[95vh] rounded-[4rem] shadow-[0_100px_200px_-50px_rgba(0,0,0,0.5)] flex flex-col lg:flex-row overflow-hidden animate-in zoom-in-95 duration-500 border border-white/10">
        <button 
          onClick={onClose} 
          className="absolute top-8 right-8 z-[110] p-4 bg-hh-dark text-white rounded-[1.5rem] hover:bg-hh-green hover:text-hh-dark transition-all shadow-2xl active:scale-90"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Product Visual */}
        <div className="lg:w-5/12 bg-hh-light p-12 lg:p-20 flex flex-col items-center justify-center relative min-h-[400px]">
           <div className="absolute top-12 left-12">
              <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-xl border border-gray-100 italic">
                <Microscope className="w-4 h-4 text-hh-green" /> Lab-Verified Purity
              </div>
           </div>
           
           <div className="relative group w-full flex justify-center">
              <div className="absolute inset-0 bg-hh-green/5 blur-3xl rounded-full scale-75 group-hover:scale-100 transition-transform duration-1000"></div>
              <img 
                src={product.image} 
                alt={product.name} 
                className="relative max-w-full max-h-[450px] object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.2)] group-hover:scale-110 transition-transform duration-1000" 
              />
           </div>

           <div className="mt-16 grid grid-cols-2 gap-4 w-full">
              <div className="p-6 bg-white rounded-3xl border border-gray-50 text-center space-y-2">
                 <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Purity Score</p>
                 <p className="text-2xl font-black italic tracking-tighter text-hh-green">99.9%</p>
              </div>
              <div className="p-6 bg-white rounded-3xl border border-gray-50 text-center space-y-2">
                 <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Bio-Activity</p>
                 <p className="text-2xl font-black italic tracking-tighter text-hh-orange">MAX</p>
              </div>
           </div>
        </div>

        {/* Product Details */}
        <div className="lg:w-7/12 p-12 lg:p-20 overflow-y-auto bg-white">
          <div className="flex flex-col h-full">
            <div className="mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex gap-1 text-hh-orange">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 border-l border-gray-200 pl-4">Clinical Strength Formulation</span>
              </div>
              <h2 className="font-heading text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-hh-dark mb-4 leading-none">
                {product.name}
              </h2>
              <div className="flex items-center gap-4">
                <span className="px-4 py-1.5 bg-hh-green/10 text-hh-green rounded-full text-[10px] font-black uppercase tracking-widest">{product.category}</span>
                <span className="text-3xl font-heading font-black text-hh-dark italic tracking-tighter">${product.price.toFixed(2)}</span>
              </div>
            </div>

            {/* Content Tabs */}
            <div className="flex gap-8 border-b-2 border-gray-50 mb-10 overflow-x-auto no-scrollbar">
              {['science', 'benefits', 'ingredients'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`pb-4 text-[11px] font-black uppercase tracking-[0.3em] transition-all relative ${
                    activeTab === tab ? 'text-hh-dark' : 'text-gray-300 hover:text-gray-500'
                  }`}
                >
                  {tab}
                  {activeTab === tab && <div className="absolute bottom-[-2px] left-0 w-full h-1 bg-hh-green rounded-full shadow-[0_0_10px_#4CAF50]"></div>}
                </button>
              ))}
            </div>

            <div className="flex-grow space-y-10 mb-16 animate-in fade-in slide-in-from-left-4 duration-500">
              {activeTab === 'science' && (
                <div className="space-y-8">
                  <p className="text-gray-600 leading-relaxed text-lg font-medium italic">
                    {product.longDescription || product.description}
                  </p>
                  {product.suggestedUse && (
                    <div className="p-8 bg-hh-light rounded-[2.5rem] border-l-8 border-hh-orange space-y-3">
                       <div className="flex items-center gap-3 text-hh-orange">
                          <Zap className="w-5 h-5 fill-current" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Protocol Directive</span>
                       </div>
                       <p className="text-sm text-hh-dark font-black italic tracking-tight uppercase leading-relaxed">
                         {product.suggestedUse}
                       </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'benefits' && product.benefits && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {product.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-start gap-4 p-6 bg-hh-light rounded-[2rem] border border-gray-100 group hover:border-hh-green/30 transition-all">
                      <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-hh-green shadow-sm group-hover:scale-110 transition-transform">
                        <Activity className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-widest text-gray-700 leading-tight italic pt-2">{benefit}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'ingredients' && product.ingredients && (
                <div className="space-y-6">
                   <div className="flex items-center gap-3 text-gray-400">
                      <ShieldCheck className="w-5 h-5" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Molecular Profile</span>
                   </div>
                   <p className="text-sm text-gray-600 font-bold uppercase tracking-tight bg-hh-light p-10 rounded-[3rem] border border-gray-100 leading-loose italic">
                     {product.ingredients}
                   </p>
                   <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.4em] italic text-center">
                      * 100% Free from artificial sweeteners, colors, and GMO synthetic binders.
                   </p>
                </div>
              )}
            </div>

            {/* CTA */}
            <div className="pt-10 border-t-2 border-gray-50 flex flex-col sm:flex-row gap-6">
              <button 
                onClick={() => { onAddToCart(product); onClose(); }}
                className="flex-grow py-7 bg-hh-dark text-white font-heading font-black rounded-[2.5rem] hover:bg-hh-green hover:text-hh-dark transition-all shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] flex items-center justify-center gap-5 active:scale-95 uppercase tracking-[0.3em] text-xs italic"
              >
                <ShoppingCart className="w-6 h-6" /> INITIALIZE STACK
              </button>
              <button 
                onClick={onClose} 
                className="py-7 px-12 border-4 border-gray-100 text-gray-400 font-black rounded-[2.5rem] hover:bg-hh-light hover:text-hh-dark transition-all uppercase tracking-[0.3em] text-[10px]"
              >
                CLOSE NODE
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
