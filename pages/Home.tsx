
import React from 'react';
import Hero from '../components/Hero.tsx';
import ProductCard from '../components/ProductCard.tsx';
import { INITIAL_PRODUCTS } from '../constants.tsx';
import { Product } from '../types.ts';
import { ShieldCheck, Leaf, Activity, Star, ArrowRight, Zap, Sparkles, Microscope, Lock, CheckCircle2, Trophy, Flame, Video } from 'lucide-react';

interface HomeProps {
  navigate: (page: any) => void;
  addToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
  onPlayVideo?: () => void;
}

const Home: React.FC<HomeProps> = ({ navigate, addToCart, onViewDetails, onPlayVideo }) => {
  const bestSellers = INITIAL_PRODUCTS.filter(p => p.isBestSeller).slice(0, 4);

  const TrustBadge = ({ icon: Icon, title, text }: any) => (
    <div className="flex flex-col items-center text-center p-12 bg-white rounded-[4rem] shadow-2xl border-4 border-gray-50 hover:border-hh-green/30 transition-all group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-hh-green/5 rounded-full blur-2xl group-hover:bg-hh-green/10 transition-all"></div>
      <div className="w-24 h-24 bg-hh-dark rounded-[2.5rem] flex items-center justify-center text-hh-green mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-xl">
        <Icon className="w-12 h-12" />
      </div>
      <h4 className="font-heading font-black uppercase text-sm tracking-[0.2em] mb-4 italic leading-none">{title}</h4>
      <p className="text-gray-400 text-[10px] font-bold leading-relaxed uppercase tracking-widest">{text}</p>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-700">
      <Hero onShopClick={() => navigate('shop')} onPlayVideo={onPlayVideo} />

      {/* Trust Stacks */}
      <section className="py-32 bg-white px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            <TrustBadge icon={ShieldCheck} title="WADA Compliant" text="Clean Protocol • Safe for Elite Output" />
            <TrustBadge icon={Microscope} title="Purity Validated" text="3rd Party Lab Verified • Zero Fillers" />
            <TrustBadge icon={Leaf} title="Vegan Synthesis" text="100% Plant-Based • Earth Optimized" />
            <TrustBadge icon={Lock} title="Bio-Secure" text="Military-Grade Transaction Encryption" />
          </div>
        </div>
      </section>

      {/* Bio-Engine Teaser */}
      <section className="py-32 bg-hh-light px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="bg-hh-dark rounded-[5rem] overflow-hidden flex flex-col lg:flex-row relative group">
             <div className="absolute inset-0 bg-hh-green opacity-0 group-hover:opacity-5 transition-opacity duration-1000"></div>
             <div className="flex-1 p-16 md:p-24 space-y-10 relative z-10">
                <div className="inline-flex items-center gap-3 px-6 py-2 bg-hh-green text-hh-dark rounded-full font-black text-[10px] uppercase tracking-[0.4em] mb-4">
                   <Sparkles className="w-4 h-4" /> New Feature Deployed
                </div>
                <h2 className="font-heading text-5xl md:text-7xl font-black italic uppercase text-white leading-none tracking-tighter">
                   BIO-ENGINE <br />
                   <span className="text-hh-green">VISUALIZER</span>
                </h2>
                <p className="text-gray-400 text-lg leading-relaxed font-bold italic max-w-lg">
                   Experience the future of performance tracking. Input your metrics and watch the neural engine synthesize a cinematic visualization of your optimized state.
                </p>
                <button 
                  onClick={() => navigate('bioengine')}
                  className="px-14 py-6 bg-hh-green text-hh-dark rounded-2xl font-black uppercase tracking-[0.3em] text-xs hover:bg-white transition-all flex items-center gap-4 shadow-4xl shadow-hh-green/20"
                >
                   ENTER THE LAB <Video className="w-5 h-5" />
                </button>
             </div>
             <div className="flex-1 relative min-h-[400px]">
                <img 
                  src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1400" 
                  alt="Elite Performance" 
                  className="absolute inset-0 w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[2000ms]"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-hh-dark via-transparent to-transparent lg:hidden"></div>
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-hh-dark to-transparent hidden lg:block"></div>
             </div>
          </div>
        </div>
      </section>

      {/* The Protocol Section */}
      <section className="py-40 bg-hh-dark text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-hh-green/10 rounded-full blur-[200px] animate-pulse"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-32">
            <div className="flex-1 order-2 lg:order-1">
              <div className="relative group">
                <div className="absolute -inset-10 bg-gradient-to-r from-hh-green/30 to-hh-orange/30 rounded-[5rem] blur-3xl opacity-30 group-hover:opacity-50 transition duration-1000"></div>
                <div className="relative rounded-[5rem] overflow-hidden border-[12px] border-white/5 shadow-4xl group-hover:border-hh-green/20 transition-all duration-700">
                  <img 
                    src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=90&w=1200" 
                    alt="High intensity training" 
                    className="w-full h-[700px] object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 transform group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-hh-dark via-transparent to-transparent opacity-80"></div>
                  <div className="absolute bottom-12 left-12 right-12">
                     <div className="p-8 bg-white/5 backdrop-blur-xl rounded-[3rem] border border-white/10 flex items-center justify-between">
                        <div>
                           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-hh-green mb-2">Neural Output</p>
                           <p className="text-3xl font-heading font-black italic uppercase tracking-tighter">MAX DOMINANCE</p>
                        </div>
                        <Flame className="w-12 h-12 text-hh-orange animate-bounce" />
                     </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-1 order-1 lg:order-2">
              <div className="inline-flex items-center gap-4 px-8 py-3 bg-hh-green text-hh-dark rounded-full font-black text-[10px] uppercase tracking-[0.4em] mb-12 shadow-[0_0_30px_rgba(76,175,80,0.3)]">
                <Trophy className="w-4 h-4" /> Performance Protocol Activated
              </div>
              <h2 className="font-heading text-6xl md:text-[10rem] font-black italic uppercase leading-[0.75] mb-12 tracking-tighter">
                REWRITE <br />
                <span className="text-hh-green">LIMITS</span>
              </h2>
              <p className="text-gray-400 text-2xl leading-relaxed font-bold mb-16 italic border-l-8 border-hh-green pl-10 max-w-xl">
                "Evolution isn't an accident. It's a calculation. We provide the variables for your peak state."
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-16">
                 <div className="p-6 bg-white/5 rounded-[2.5rem] border border-white/10 flex items-center gap-4 group hover:bg-white/10 transition-all">
                    <CheckCircle2 className="w-8 h-8 text-hh-green group-hover:scale-110 transition-transform" />
                    <span className="text-[11px] font-black uppercase tracking-widest">Molecular Precision</span>
                 </div>
                 <div className="p-6 bg-white/5 rounded-[2.5rem] border border-white/10 flex items-center gap-4 group hover:bg-white/10 transition-all">
                    <CheckCircle2 className="w-8 h-8 text-hh-green group-hover:scale-110 transition-transform" />
                    <span className="text-[11px] font-black uppercase tracking-widest">Bio-Sync Tech</span>
                 </div>
              </div>

              <button 
                onClick={() => navigate('shop')}
                className="w-full sm:w-auto px-16 py-8 bg-hh-green text-hh-dark rounded-[2.5rem] font-heading font-black uppercase tracking-[0.4em] text-sm hover:bg-white transition-all shadow-4xl active:scale-95 flex items-center justify-center gap-4"
              >
                INITIALIZE STACK <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collection */}
      <section className="py-40 bg-hh-light relative">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
            <div>
              <div className="w-32 h-2 bg-hh-green rounded-full mb-6"></div>
              <h2 className="font-heading text-6xl md:text-9xl font-black italic tracking-tighter uppercase mb-4 leading-none">
                TOP <span className="text-hh-green">NODES</span>
              </h2>
              <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-[10px] italic">The Most Deployed Biological Stacks</p>
            </div>
            <button 
              onClick={() => navigate('shop')}
              className="px-16 py-7 bg-hh-dark text-white rounded-[2.5rem] font-heading font-black uppercase tracking-[0.4em] hover:bg-hh-green hover:text-hh-dark transition-all shadow-4xl active:scale-95 text-sm"
            >
              VIEW FULL STACK
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
