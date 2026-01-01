
import React from 'react';
import Hero from '../components/Hero.tsx';
import ProductCard from '../components/ProductCard.tsx';
import { INITIAL_PRODUCTS } from '../constants.tsx';
import { Product } from '../types.ts';
import { ShieldCheck, Leaf, Activity, Star, ArrowRight, Zap, Sparkles, Microscope, Lock, CheckCircle2 } from 'lucide-react';

interface HomeProps {
  navigate: (page: any) => void;
  addToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
  onPlayVideo?: () => void;
}

const Home: React.FC<HomeProps> = ({ navigate, addToCart, onViewDetails, onPlayVideo }) => {
  const bestSellers = INITIAL_PRODUCTS.filter(p => p.isBestSeller).slice(0, 4);

  const TrustBadge = ({ icon: Icon, title, text }: any) => (
    <div className="flex flex-col items-center text-center p-10 bg-white rounded-[4rem] shadow-2xl border border-gray-100 hover:border-hh-green/30 transition-all group">
      <div className="w-24 h-24 bg-hh-green/10 rounded-[3rem] flex items-center justify-center text-hh-green mb-8 group-hover:scale-110 transition-transform">
        <Icon className="w-12 h-12" />
      </div>
      <h4 className="font-heading font-black uppercase text-sm tracking-[0.2em] mb-4">{title}</h4>
      <p className="text-gray-400 text-xs font-bold leading-relaxed">{text}</p>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-700">
      <Hero onShopClick={() => navigate('shop')} onPlayVideo={onPlayVideo} />

      {/* Laboratory Trust Section */}
      <section className="py-24 bg-hh-light px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            <TrustBadge icon={ShieldCheck} title="WADA Compliant" text="Safe for elite performance athletes. Zero banned substances." />
            <TrustBadge icon={Microscope} title="3rd Party Lab Tested" text="Potency, purity, and profile verified by independent scientists." />
            <TrustBadge icon={Leaf} title="Vegan Certified" text="100% plant-based synthesis. No fillers, no toxins." />
            <TrustBadge icon={Lock} title="Biological Security" text="Your data and transactions are military-grade encrypted." />
          </div>
        </div>
      </section>

      {/* Biological Illustration / Science Section */}
      <section className="py-32 bg-hh-dark text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-hh-green/10 rounded-full blur-[150px]"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-24">
            <div className="flex-1 order-2 lg:order-1">
              <div className="relative group">
                <div className="absolute -inset-8 bg-gradient-to-r from-hh-green to-hh-orange rounded-[5rem] blur-2xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                {/* High quality biological performance visual */}
                <img 
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=90&w=1200" 
                  alt="Biological Science Lab" 
                  className="relative rounded-[4.5rem] shadow-3xl border-8 border-white/5 object-cover h-[600px] w-full transform group-hover:scale-[1.02] transition-transform duration-1000"
                />
                <div className="absolute -bottom-12 -right-12 bg-hh-green p-12 rounded-[4rem] shadow-4xl transform rotate-6 hidden md:block">
                   <Zap className="w-14 h-14 text-hh-dark fill-current" />
                </div>
              </div>
            </div>
            <div className="flex-1 order-1 lg:order-2">
              <div className="inline-flex items-center gap-3 px-8 py-4 bg-hh-green/20 text-hh-green rounded-full font-black text-xs uppercase tracking-[0.5em] mb-12 border border-hh-green/40">
                <Sparkles className="w-5 h-5 fill-current" />
                Biological Dominance Active
              </div>
              <h2 className="font-heading text-6xl md:text-9xl font-black italic uppercase leading-[0.8] mb-12 tracking-tighter">
                DRIVEN BY <br />
                <span className="text-hh-green">PURITY</span>
              </h2>
              <p className="text-gray-400 text-2xl leading-relaxed font-medium mb-16 italic max-w-xl">
                "We don't sell hope. We sell synthesis. Every scoop is a calculated strike at your biological limits."
              </p>
              
              <div className="space-y-8 mb-16">
                 <div className="flex items-center gap-6">
                    <CheckCircle2 className="w-10 h-10 text-hh-green" />
                    <span className="text-xl font-black uppercase tracking-widest italic">Zero Filler Protocol</span>
                 </div>
                 <div className="flex items-center gap-6">
                    <CheckCircle2 className="w-10 h-10 text-hh-green" />
                    <span className="text-xl font-black uppercase tracking-widest italic">99.9% Bio-Availability</span>
                 </div>
                 <div className="flex items-center gap-6">
                    <CheckCircle2 className="w-10 h-10 text-hh-green" />
                    <span className="text-xl font-black uppercase tracking-widest italic">Clinical Grade Dosing</span>
                 </div>
              </div>

              <button 
                onClick={() => navigate('about')}
                className="group flex items-center gap-6 font-heading font-black uppercase tracking-[0.4em] text-lg hover:text-hh-green transition-all"
              >
                ENTERING THE LABORATORY <ArrowRight className="w-8 h-8 group-hover:translate-x-4 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Catalog */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
            <div>
              <h2 className="font-heading text-6xl md:text-8xl font-black italic tracking-tighter uppercase mb-6 leading-none">
                ELITE <span className="text-hh-green">FUELS</span>
              </h2>
              <div className="w-48 h-5 bg-hh-orange rounded-full shadow-lg shadow-hh-orange/20"></div>
            </div>
            <button 
              onClick={() => navigate('shop')}
              className="px-16 py-7 bg-hh-dark text-white rounded-[2.5rem] font-heading font-black uppercase tracking-[0.4em] hover:bg-hh-green transition-all shadow-3xl active:scale-95 text-sm"
            >
              ACCESS ALL NODES
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {bestSellers.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAddToCart={addToCart} 
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
