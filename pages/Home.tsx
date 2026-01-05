
import React from 'react';
import Hero from '../components/Hero.tsx';
import ProductCard from '../components/ProductCard.tsx';
import BrandVision from '../components/BrandVision.tsx';
import { INITIAL_PRODUCTS } from '../constants.tsx';
import { Product } from '../types.ts';
import { BarChart3, Fingerprint, Microscope, ShieldCheck, Zap, Sparkles, Binary, Dna, Activity, Users, Award, Atom, FlaskConical, Globe, TrendingUp } from 'lucide-react';

interface HomeProps {
  navigate: (page: any) => void;
  addToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

const Home: React.FC<HomeProps> = ({ navigate, addToCart, onViewDetails }) => {
  const bestSellers = INITIAL_PRODUCTS.filter(p => p.isBestSeller).slice(0, 4);

  return (
    <div className="animate-in fade-in duration-1000 bg-hh-dark selection:bg-hh-green selection:text-hh-dark">
      <Hero onShopClick={() => navigate('shop')} />

      {/* Real-time Validation Bar */}
      <div className="bg-hh-green py-6 sm:py-8 overflow-hidden relative z-40 border-y border-white/10 shadow-[0_0_50px_rgba(76,175,80,0.3)]">
        <div className="animate-marquee flex gap-12 sm:gap-24 items-center whitespace-nowrap">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 sm:gap-6 text-hh-dark font-heading font-black text-[10px] sm:text-sm uppercase italic tracking-[0.1em] sm:tracking-[0.2em]">
              <Users className="w-4 h-4 sm:w-6 h-6" /> 18,742 NODES ACTIVE
              <span className="opacity-30 tracking-normal text-[12px] sm:text-[14px] font-sans">//</span>
              <Award className="w-4 h-4 sm:w-6 h-6" /> GLOBAL RANKING: #1 BIO-FUEL
              <span className="opacity-30 tracking-normal text-[12px] sm:text-[14px] font-sans">//</span>
              <Activity className="w-4 h-4 sm:w-6 h-6" /> 4.2M BIOLOGICAL UPGRADES SYNCHRONIZED
              <span className="opacity-30 tracking-normal text-[12px] sm:text-[14px] font-sans">//</span>
              <Globe className="w-4 h-4 sm:w-6 h-6" /> DEPLOYED IN 42 COUNTRIES
              <span className="opacity-30 tracking-normal text-[12px] sm:text-[14px] font-sans">//</span>
            </div>
          ))}
        </div>
      </div>

      {/* The Bio-Performance HUD Section */}
      <section className="max-w-7xl mx-auto px-6 -mt-8 sm:-mt-16 relative z-30 mb-24 sm:mb-48">
        <div className="bg-hh-card/95 backdrop-blur-3xl border border-white/10 rounded-[3rem] sm:rounded-[5rem] p-8 sm:p-12 md:p-20 shadow-[0_60px_120px_-30px_rgba(0,0,0,0.7)] overflow-hidden relative group">
          {/* Subtle Corner Graphic */}
          <div className="absolute top-0 right-0 p-6 sm:p-12 opacity-10 group-hover:opacity-30 transition-all duration-1000 group-hover:rotate-12">
            <Atom className="w-24 h-24 sm:w-32 h-32 text-hh-green animate-spin-slow" />
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
            <div className="flex-1 w-full space-y-12 sm:space-y-16">
              <div className="flex items-center gap-6 sm:gap-8">
                <div className="w-16 h-16 sm:w-20 h-20 bg-hh-green rounded-[1.5rem] sm:rounded-3xl flex items-center justify-center text-hh-dark shadow-[0_0_40px_rgba(76,175,80,0.4)] border border-hh-green/30 transform -rotate-3">
                  <BarChart3 className="w-8 h-8 sm:w-10 h-10" />
                </div>
                <div>
                  <h3 className="font-heading font-black italic uppercase text-2xl sm:text-4xl tracking-tighter leading-none">SYSTEM <span className="text-hh-green">INTEGRITY</span></h3>
                  <p className="text-[9px] sm:text-[11px] font-black uppercase text-gray-500 tracking-[0.3em] sm:tracking-[0.5em] mt-2 sm:mt-3">Collective Optimization Analytics</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
                {[
                  { label: 'Collective Strength Index', val: 99.9, color: 'bg-hh-green' },
                  { label: 'Cellular Availability Delta', val: 98.4, color: 'bg-hh-green' },
                  { label: 'Synthesized Peak Recovery', val: 94.5, color: 'bg-hh-green' },
                  { label: 'Metabolic Conversion efficiency', val: 87.2, color: 'bg-hh-orange' },
                ].map((stat, i) => (
                  <div key={i} className="space-y-3 sm:space-y-5">
                    <div className="flex justify-between items-end text-[9px] sm:text-[11px] font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] text-gray-400">
                      <span className="flex items-center gap-2 sm:gap-3">
                        <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${stat.color} animate-pulse`}></div>
                        {stat.label}
                      </span>
                      <span className="text-white text-xl sm:text-2xl font-heading italic tracking-tighter">{stat.val}%</span>
                    </div>
                    <div className="h-2.5 sm:h-3 bg-white/5 rounded-full overflow-hidden p-[1px] sm:p-[2px] border border-white/10">
                      <div className={`h-full ${stat.color} rounded-full transition-all duration-2000 ease-out shadow-[0_0_15px_rgba(76,175,80,0.6)]`} style={{ width: `${stat.val}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:w-1/3 w-full flex flex-col gap-6 sm:gap-8">
              <div className="p-8 sm:p-10 bg-hh-green/10 rounded-[2.5rem] sm:rounded-[3.5rem] border border-hh-green/20 relative overflow-hidden group/card hover:bg-hh-green/20 transition-all cursor-crosshair">
                <div className="absolute top-0 right-0 p-4 sm:p-6"><Dna className="w-12 h-12 sm:w-16 h-16 text-hh-green/20" /></div>
                <div className="flex items-center gap-6 sm:gap-8 mb-4 sm:mb-6">
                  <Fingerprint className="w-12 h-12 sm:w-16 h-16 text-hh-green animate-pulse" />
                  <div>
                    <h4 className="font-heading font-black text-xl sm:text-2xl uppercase tracking-tighter italic">BIO-PROTOCOL</h4>
                    <p className="text-[8px] sm:text-[9px] font-black uppercase text-hh-green tracking-widest mt-1">Status: Ready for Synthesis</p>
                  </div>
                </div>
                <p className="text-[11px] sm:text-[12px] text-gray-400 font-bold uppercase leading-relaxed italic">
                  Genetic verification complete. Standard routines are for the standard human. Let Gemini architect your elite biological path.
                </p>
              </div>

              <button 
                onClick={() => navigate('quiz')}
                className="w-full py-6 sm:py-10 bg-white text-hh-dark rounded-[2rem] sm:rounded-[3.5rem] font-heading font-black text-xs sm:text-md uppercase tracking-[0.2em] sm:tracking-[0.3em] italic shadow-4xl hover:bg-hh-green transition-all active:scale-95 flex items-center justify-center gap-4 sm:gap-6 group"
              >
                GENERATE CUSTOM DEPLOYMENT <Binary className="w-5 h-5 sm:w-7 sm:h-7 group-hover:rotate-12 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products - Catalog */}
      <section className="py-24 sm:py-48 px-6 bg-[radial-gradient(circle_at_50%_50%,rgba(76,175,80,0.05),transparent_70%)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 sm:mb-32 gap-10 md:gap-16">
            <div className="space-y-4 sm:space-y-6 text-center md:text-left">
              <div className="inline-flex items-center gap-3 sm:gap-4 px-6 sm:px-8 py-2 sm:py-3 bg-hh-green/10 text-hh-green rounded-full font-black text-[9px] sm:text-[11px] uppercase tracking-[0.4em] sm:tracking-[0.5em] border border-hh-green/20">
                <Zap className="w-4 h-4 sm:w-5 h-5 fill-current" /> PERFORMANCE MODULES
              </div>
              <h2 className="font-heading text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] font-black italic uppercase tracking-tighter leading-[0.8] lg:leading-[0.75]">
                ELITE <br /><span className="text-hh-green">STACKS</span>
              </h2>
            </div>
            <button 
              onClick={() => navigate('shop')}
              className="w-full sm:w-auto px-10 sm:px-20 py-6 sm:py-8 border-2 border-white/10 text-white font-heading font-black uppercase italic tracking-[0.2em] rounded-[2rem] sm:rounded-[2.5rem] hover:bg-hh-green hover:text-hh-dark hover:border-hh-green transition-all shadow-4xl text-xs"
            >
              BROWSE ALL FUEL
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
            {bestSellers.map(p => (
              <ProductCard 
                key={p.id} 
                product={p} 
                onAddToCart={addToCart} 
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Brand Vision Generative Section */}
      <BrandVision />

      {/* The Foundry (Science Section) - Deep Intrigue */}
      <section className="py-32 sm:py-60 bg-hh-dark relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-hh-orange/40 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 lg:gap-32 items-center">
          <div className="relative group px-4 lg:px-0">
            <div className="absolute inset-0 bg-hh-orange/10 rounded-[3rem] sm:rounded-[6rem] blur-[60px] sm:blur-[100px] group-hover:bg-hh-orange/20 transition-all duration-1000"></div>
            <div className="relative rounded-[3rem] sm:rounded-[5rem] overflow-hidden border-2 border-white/10 p-3 sm:p-4 bg-white/5 backdrop-blur-3xl">
              <img 
                src="https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=95&w=1000" 
                alt="Laboratory Synthesis" 
                className="w-full h-auto aspect-square object-cover rounded-[2rem] sm:rounded-[4rem] grayscale group-hover:grayscale-0 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-hh-dark/40 mix-blend-overlay"></div>
            </div>
            {/* HUD Callouts */}
            <div className="absolute -bottom-6 -right-6 sm:-bottom-10 sm:-right-10 bg-hh-dark/95 border-2 border-hh-orange/30 p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] shadow-4xl backdrop-blur-2xl">
               <FlaskConical className="w-8 h-8 sm:w-12 h-12 text-hh-orange mb-3 sm:mb-4 animate-bounce" />
               <div className="text-[10px] sm:text-sm font-heading font-black italic uppercase text-white tracking-tighter">MOLECULAR PURITY CHECK</div>
               <div className="text-[8px] sm:text-[10px] text-hh-orange font-bold tracking-[0.2em] sm:tracking-[0.3em] mt-1 uppercase">Standard: EXCEEDED</div>
            </div>
          </div>

          <div className="space-y-8 sm:space-y-12 text-center lg:text-left pt-12 lg:pt-0">
            <div className="inline-flex items-center gap-4 px-6 sm:px-8 py-2 sm:py-3 bg-hh-orange/10 text-hh-orange rounded-full font-black text-[9px] sm:text-[11px] uppercase tracking-[0.4em] sm:tracking-[0.5em] border border-hh-orange/20">
              <Microscope className="w-4 h-4 sm:w-5 h-5" /> THE FOUNDRY PROTOCOL
            </div>
            <h2 className="font-heading text-5xl sm:text-7xl lg:text-9xl font-black italic uppercase tracking-tighter leading-[0.9] lg:leading-[0.8] text-white">
              SCIENCE <br /><span className="text-hh-orange">SYNTHESIS</span>
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-400 font-medium italic leading-relaxed border-l-4 sm:border-l-8 border-hh-orange pl-6 sm:pl-10">
              Every molecule is verified through third-party neural-audit. We don't just lab-test; we chemically authenticate the potential of every gram. No fillers. No noise. Just the signals your body needs to dominate.
            </p>
            <div className="grid grid-cols-2 gap-4 sm:gap-8 pt-6 sm:pt-8">
               <div className="p-6 sm:p-8 bg-white/5 rounded-2xl sm:rounded-3xl border border-white/10 hover:border-hh-orange/40 transition-all">
                  <div className="text-2xl sm:text-3xl font-heading font-black text-hh-orange mb-1 sm:mb-2">99.9%</div>
                  <div className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] text-gray-500 italic">Purity Rating</div>
               </div>
               <div className="p-6 sm:p-8 bg-white/5 rounded-2xl sm:rounded-3xl border border-white/10 hover:border-hh-orange/40 transition-all">
                  <div className="text-2xl sm:text-3xl font-heading font-black text-hh-orange mb-1 sm:mb-2">0.0%</div>
                  <div className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] text-gray-500 italic">Prohibited Subs</div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges - Optimized Clinical Style */}
      <section className="py-24 sm:py-40 bg-hh-card border-y border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-20">
            {[
              { icon: ShieldCheck, title: "WADA COMPLIANT", text: "Zero prohibited biological components.", color: 'text-hh-green' },
              { icon: Microscope, title: "LAB VERIFIED", text: "3rd party molecular authentication.", color: 'text-hh-orange' },
              { icon: Zap, title: "BIO-ACTIVE", text: "Engineered for maximum cellular synthesis.", color: 'text-hh-green' },
              { icon: Sparkles, title: "PLANT SYNTHESIS", text: "100% molecular vegan derivatives.", color: 'text-white' }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center group cursor-default">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-hh-dark rounded-[1.5rem] sm:rounded-[2rem] flex items-center justify-center text-hh-green mb-6 sm:mb-10 group-hover:bg-hh-green group-hover:text-hh-dark transition-all duration-700 border-2 border-white/5 group-hover:rotate-12 group-hover:shadow-[0_0_50px_rgba(76,175,80,0.5)]">
                  <item.icon className="w-10 h-10 sm:w-12 h-12" />
                </div>
                <h4 className={`font-heading font-black uppercase text-sm sm:text-md tracking-[0.1em] sm:tracking-[0.2em] mb-3 sm:mb-4 italic ${item.color}`}>{item.title}</h4>
                <p className="text-[10px] sm:text-[11px] text-gray-500 font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] max-w-[240px] leading-relaxed italic opacity-70 group-hover:opacity-100 transition-opacity">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
