
import React from 'react';
import { Zap, Play, ShieldCheck, Sparkles } from 'lucide-react';

interface HeroProps {
  onShopClick: () => void;
  onPlayVideo?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onShopClick, onPlayVideo }) => {
  return (
    <section className="relative overflow-hidden bg-white pt-10 pb-16 md:pt-20 md:pb-32">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-hh-green/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-hh-orange/5 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="flex-1 text-center lg:text-left order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-hh-dark text-white rounded-full font-black text-[9px] md:text-xs uppercase tracking-[0.4em] mb-6 md:mb-10 shadow-2xl shadow-black/20">
              <Sparkles className="w-3 h-3 text-hh-green fill-current" />
              Next-Gen Biological Fuel
            </div>
            
            <h1 className="font-heading text-5xl sm:text-6xl md:text-[9rem] font-black text-hh-dark leading-[0.85] mb-6 md:mb-10 tracking-tighter italic uppercase">
              MASTER <br />
              <span className="text-hh-green relative inline-block">
                BIOLOGY
                <span className="absolute -bottom-2 md:-bottom-4 left-0 w-full h-3 md:h-5 bg-hh-orange/20 -z-10 rounded-full"></span>
              </span>
            </h1>
            
            <p className="text-sm md:text-xl text-gray-500 mb-8 md:mb-12 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
              Synthesizing elite performance with 100% plant-based purity. Lab-tested, professional-grade, and designed to unlock your next evolution.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start">
              <button 
                onClick={onShopClick}
                className="w-full sm:w-auto px-14 py-6 bg-hh-green text-white font-heading font-black text-xs md:text-sm rounded-2xl hover:bg-hh-dark transition-all shadow-[0_24px_48px_-12px_rgba(76,175,80,0.4)] active:scale-95 uppercase tracking-[0.2em]"
              >
                SHOP THE STACK
              </button>
              <button 
                onClick={onPlayVideo}
                className="flex items-center gap-4 font-heading font-black text-xs md:text-sm text-hh-dark hover:text-hh-green transition-all p-4 group"
              >
                <div className="w-14 h-14 rounded-full border-2 border-hh-dark flex items-center justify-center group-hover:bg-hh-green group-hover:border-hh-green transition-all shadow-xl group-hover:text-white">
                  <Play className="w-5 h-5 fill-current ml-1" />
                </div>
                WATCH THE SCIENCE
              </button>
            </div>

            <div className="mt-16 flex items-center justify-center lg:justify-start gap-10 opacity-40 grayscale hover:grayscale-0 transition-all">
               <div className="text-[10px] font-black uppercase tracking-[0.3em]">WADA Compliant</div>
               <div className="text-[10px] font-black uppercase tracking-[0.3em]">3rd Party Lab Tested</div>
               <div className="text-[10px] font-black uppercase tracking-[0.3em]">Vegan Certified</div>
            </div>
          </div>

          <div className="flex-1 relative w-full max-w-lg lg:max-w-none order-1 lg:order-2">
             <div className="relative group">
               {/* Premium Athletic Visual */}
               <div className="absolute -inset-6 bg-gradient-to-tr from-hh-green/40 to-hh-orange/20 blur-[100px] opacity-40 rounded-full animate-pulse"></div>
               <div className="relative rounded-[3.5rem] overflow-hidden shadow-[0_80px_160px_-32px_rgba(0,0,0,0.3)] border-[12px] border-white transform hover:scale-[1.02] transition-transform duration-700">
                 <img 
                   src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=90&w=1400" 
                   alt="Cinematic Athletic Performance" 
                   className="w-full h-auto object-cover aspect-[4/5] lg:aspect-[5/6] transform group-hover:scale-110 transition-transform duration-[2000ms]"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-hh-dark/80 via-transparent to-transparent"></div>
                 
                 <div className="absolute bottom-10 left-10 right-10 flex items-end justify-between">
                    <div className="bg-white/95 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl border border-white/20">
                       <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-hh-green rounded-2xl flex items-center justify-center text-white shadow-xl shadow-hh-green/30">
                            <Zap className="w-6 h-6 fill-current" />
                         </div>
                         <div>
                            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-400 mb-1">Purity Index</p>
                            <p className="font-heading font-black text-hh-dark italic uppercase text-lg tracking-tighter">99.9% BIO-ACTIVE</p>
                         </div>
                       </div>
                    </div>
                 </div>
               </div>
               
               {/* Floating elements */}
               <div className="absolute -top-10 -right-10 bg-hh-dark p-8 rounded-[2.5rem] shadow-2xl text-hh-green transform rotate-12 animate-float hidden md:block border border-white/10">
                  <ShieldCheck className="w-10 h-10" />
               </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
