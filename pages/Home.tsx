
import React from 'react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import { INITIAL_PRODUCTS } from '../constants';
import { Product } from '../types';
import { ShieldCheck, Leaf, Activity, Star, ArrowRight, Zap, Sparkles } from 'lucide-react';

interface HomeProps {
  navigate: (page: any) => void;
  addToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

const Home: React.FC<HomeProps> = ({ navigate, addToCart, onViewDetails }) => {
  const bestSellers = INITIAL_PRODUCTS.filter(p => p.isBestSeller).slice(0, 4);

  return (
    <div className="animate-in fade-in duration-700">
      <Hero onShopClick={() => navigate('shop')} />

      {/* Science & Performance Union Section */}
      <section className="py-24 bg-hh-dark text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-hh-green/10 rounded-full blur-[120px]"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 order-2 lg:order-1">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-hh-green to-hh-orange rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                <img 
                  src="https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&q=80&w=1200" 
                  alt="Human & AI Science Union" 
                  className="relative rounded-[2.5rem] shadow-2xl border border-white/10"
                />
                <div className="absolute bottom-8 left-8 right-8 bg-black/60 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                   <p className="text-xs font-black uppercase tracking-widest text-hh-green mb-1">Hello Healthy Labs</p>
                   <p className="text-sm font-medium text-gray-300 italic">"Our supplements are the bridge between your biology and your peak potential."</p>
                </div>
              </div>
            </div>
            <div className="flex-1 order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-hh-green/20 text-hh-green rounded-full font-bold text-xs uppercase tracking-widest mb-8 border border-hh-green/30">
                <Sparkles className="w-4 h-4 fill-current" />
                Next-Gen Nutrition
              </div>
              <h2 className="font-heading text-4xl md:text-6xl font-black italic uppercase leading-none mb-8">
                WHERE <span className="text-hh-green">SCIENCE</span> <br />
                MEETS PERFORMANCE
              </h2>
              <div className="space-y-6 text-gray-400 text-lg leading-relaxed">
                <p>Hello Healthy isn't just about pills and powders. We utilize the latest in bio-optimization research to craft formulas that are as pure as they are potent.</p>
                <div className="grid grid-cols-2 gap-8 py-6">
                  <div>
                    <div className="text-hh-orange font-heading font-black text-4xl mb-2">100%</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">Plant-Based Science</div>
                  </div>
                  <div>
                    <div className="text-hh-green font-heading font-black text-4xl mb-2">0</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">Artificial Fillers</div>
                  </div>
                </div>
                <button 
                  onClick={() => navigate('about')}
                  className="flex items-center gap-3 font-heading font-black uppercase tracking-tighter hover:text-hh-green transition-all"
                >
                  DISCOVER THE LAB <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="font-heading text-4xl md:text-5xl font-black italic tracking-tighter uppercase mb-2">
                BEST <span className="text-hh-green">SELLERS</span>
              </h2>
              <div className="w-24 h-2 bg-hh-orange rounded-full"></div>
            </div>
            <button 
              onClick={() => navigate('shop')}
              className="flex items-center gap-2 font-heading font-bold text-hh-green hover:gap-4 transition-all"
            >
              EXPLORE FULL SHOP <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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

      {/* Quiz Teaser with the Provided Branding Image */}
      <section className="py-24 px-4 overflow-hidden bg-hh-light">
        <div className="max-w-6xl mx-auto">
          <div className="relative bg-white rounded-[3rem] p-10 md:p-16 overflow-hidden shadow-2xl group border border-gray-100">
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-hh-orange/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
              <div className="flex-1 text-center lg:text-left">
                <h2 className="font-heading text-4xl md:text-6xl font-black italic uppercase leading-[0.9] mb-8">
                  KNOW YOUR <br />
                  <span className="text-hh-green">PHYSIOLOGY</span>
                </h2>
                <p className="text-lg text-gray-500 mb-10 max-w-md mx-auto lg:mx-0 font-medium">
                  We don't guess. We analyze. Take the 2-minute Transformation Quiz to find the exact molecular fuel your body needs.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <button 
                    onClick={() => navigate('quiz')}
                    className="px-12 py-5 bg-hh-dark text-white font-heading font-black rounded-full hover:bg-hh-green transition-all hover:scale-105 shadow-2xl shadow-black/20 uppercase tracking-tighter"
                  >
                    START TRANSFORMATION
                  </button>
                  <button 
                    onClick={() => navigate('visualizer')}
                    className="px-12 py-5 bg-white text-hh-dark border-2 border-gray-100 font-heading font-black rounded-full hover:border-hh-green hover:text-hh-green transition-all uppercase tracking-tighter flex items-center justify-center gap-2"
                  >
                    <Zap className="w-5 h-5 fill-current" /> AI VISUALIZER
                  </button>
                </div>
              </div>
              <div className="flex-1 relative">
                <div className="absolute inset-0 bg-hh-green/5 blur-3xl rounded-full"></div>
                <img 
                  src="https://images.unsplash.com/photo-1548690312-e3b507d17a12?auto=format&fit=crop&q=80&w=1000" 
                  className="relative rounded-[2.5rem] shadow-2xl rotate-2 group-hover:rotate-0 transition-transform duration-700 h-[500px] w-full object-cover" 
                  alt="Training High Performance" 
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
