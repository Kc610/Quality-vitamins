
import React from 'react';
import { Play, Sparkles, TrendingUp, Zap, Target, Cpu, Activity, ArrowRight, Crosshair, ChevronRight } from 'lucide-react';

interface HeroProps {
  onShopClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onShopClick }) => {
  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-20 overflow-hidden bg-hh-dark selection:bg-hh-green selection:text-hh-dark">
      {/* Dynamic Background Layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(76,175,80,0.15),transparent_50%)]"></div>
        <div className="absolute top-1/4 -left-1/4 w-[800px] h-[800px] bg-hh-green/10 rounded-full blur-[160px] animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-hh-orange/5 rounded-full blur-[120px]"></div>
        
        {/* Tech Grid */}
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
      </div>

      {/* Global Status Ticker */}
      <div className="absolute top-24 left-0 w-full bg-hh-dark/80 backdrop-blur-md border-y border-white/5 py-3 sm:py-4 overflow-hidden z-20 whitespace-nowrap">
        <div className="animate-marquee flex gap-8 sm:gap-16 items-center text-[8px] sm:text-[10px] font-black uppercase tracking-[0.4em] sm:tracking-[0.6em] text-hh-green/80">
          <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-hh-green rounded-full animate-ping"></div> NEURAL LINK: STABLE</span>
          <span>•</span>
          <span>BIOLOGICAL PURITY: 99.99%</span>
          <span>•</span>
          <span>METABOLIC SYNC: OPTIMAL</span>
          <span>•</span>
          <span>RECOVERY DELTA: +18.4%</span>
          <span>•</span>
          <span>NEURAL LINK: STABLE</span>
          <span>•</span>
          <span>BIOLOGICAL PURITY: 99.99%</span>
          <span>•</span>
          <span>METABOLIC SYNC: OPTIMAL</span>
          <span>•</span>
          <span>RECOVERY DELTA: +18.4%</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
        <div className="text-center lg:text-left pt-24 lg:pt-20">
          <div className="inline-flex items-center gap-3 sm:gap-4 mb-8 sm:mb-12 px-6 sm:px-8 py-2 sm:py-3 bg-white/5 border border-white/10 rounded-2xl text-[8px] sm:text-[10px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-hh-green backdrop-blur-xl">
             <Crosshair className="w-4 h-4 animate-spin-slow" /> TARGET: PEAK HUMAN PERFORMANCE
          </div>
          
          <h1 className="font-heading text-6xl sm:text-7xl md:text-8xl lg:text-[11rem] font-black text-white leading-[0.8] lg:leading-[0.75] mb-8 lg:mb-12 tracking-tighter italic uppercase">
            UPGRADE <br />
            <span className="text-hh-green flex items-center justify-center lg:justify-start gap-4 sm:gap-8 relative">
              BIOLOGY
              <div className="hidden lg:block h-4 flex-grow bg-hh-green/10 rounded-full overflow-hidden relative border border-hh-green/20">
                <div className="absolute inset-0 bg-hh-green animate-[scan_2.5s_ease-in-out_infinite] w-48 rounded-full shadow-[0_0_30px_#4CAF50]"></div>
              </div>
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-400 mb-10 sm:mb-16 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed italic border-l-4 sm:border-l-8 border-hh-orange pl-6 sm:pl-10 py-3 sm:py-4 bg-gradient-to-r from-hh-orange/5 to-transparent">
            Synthesized for the <span className="text-white">Elite Majority</span>. Protocol-driven. Science-backed. Lab-verified purity.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10 justify-center lg:justify-start">
            <button 
              onClick={onShopClick}
              className="group relative w-full sm:w-auto px-12 sm:px-20 py-6 sm:py-10 bg-hh-green text-hh-dark font-heading font-black text-xs sm:text-sm rounded-3xl hover:bg-white transition-all shadow-[0_20px_60px_-10px_rgba(76,175,80,0.6)] active:scale-95 uppercase tracking-[0.2em] sm:tracking-[0.3em] italic overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3 sm:gap-4">ACCESS THE ARCHIVE <ArrowRight className="w-5 h-5 sm:w-6 h-6 group-hover:translate-x-2 transition-transform" /></span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/50 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>
            
            <button className="flex items-center gap-4 sm:gap-6 font-heading font-black text-[10px] sm:text-xs text-gray-500 hover:text-white transition-all group">
              <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl border-2 border-white/10 flex items-center justify-center bg-white/5 group-hover:bg-hh-green group-hover:border-hh-green group-hover:text-hh-dark transition-all shadow-2xl">
                <Play className="w-6 h-6 sm:w-8 sm:h-8 fill-current ml-1" />
              </div>
              VIEW FOUNDRY SPECS
            </button>
          </div>
        </div>

        <div className="relative hidden lg:block perspective-1000">
          <div className="relative rounded-[6rem] overflow-hidden border-[2px] border-white/10 p-6 bg-white/5 backdrop-blur-3xl group transition-all duration-700 hover:rotate-y-6">
            {/* Real-time HUD Elements */}
            <div className="absolute top-16 left-16 z-30 pointer-events-none space-y-4">
              <div className="flex items-center gap-4 bg-hh-dark/95 px-6 py-4 rounded-2xl border border-hh-green/40 backdrop-blur-3xl shadow-4xl">
                <Target className="w-6 h-6 text-hh-green animate-pulse" />
                <div className="space-y-0.5">
                  <span className="text-[12px] font-black uppercase text-white tracking-widest block">NEURAL LOCK</span>
                  <span className="text-[9px] text-hh-green font-bold uppercase tracking-widest block opacity-70">Focus: 98.4%</span>
                </div>
              </div>
            </div>

            <div className="absolute bottom-16 right-16 z-30 pointer-events-none">
              <div className="bg-hh-dark/95 p-10 rounded-[3.5rem] border border-white/10 backdrop-blur-3xl shadow-4xl min-w-[280px]">
                 <div className="flex items-center gap-6 mb-8">
                   <div className="w-12 h-12 bg-hh-green rounded-2xl flex items-center justify-center text-hh-dark shadow-[0_0_20px_#4CAF50]"><Activity className="w-6 h-6" /></div>
                   <div>
                     <div className="text-[12px] font-black uppercase text-white tracking-widest">SYSTEM PULSE</div>
                     <div className="text-[9px] text-hh-green uppercase font-bold tracking-[0.3em] mt-1">Status: SYNCHRONIZED</div>
                   </div>
                 </div>
                 <div className="flex gap-2.5 h-12 items-end">
                   {[...Array(20)].map((_, i) => (
                     <div key={i} className="flex-1 bg-hh-green/30 rounded-full animate-pulse group-hover:bg-hh-green transition-all" style={{ height: `${Math.random() * 80 + 20}%`, animationDelay: `${i * 120}ms` }}></div>
                   ))}
                 </div>
              </div>
            </div>

            <div className="absolute top-0 left-0 w-full h-2 bg-hh-green/60 shadow-[0_0_30px_#4CAF50] z-20 animate-scan"></div>

            <img 
              src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=95&w=1400" 
              alt="Peak Performance Concept" 
              className="w-full h-auto aspect-[4/5] object-cover rounded-[5rem] opacity-70 group-hover:scale-105 transition-transform duration-[8000ms] grayscale hover:grayscale-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-hh-dark via-transparent to-hh-dark/40 opacity-80"></div>
          </div>

          {/* Floaters */}
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-hh-green/10 rounded-full blur-[120px] animate-pulse-slow"></div>
          <div className="absolute top-1/2 -left-32 p-10 bg-hh-dark/95 backdrop-blur-3xl border-2 border-white/10 rounded-[4rem] shadow-4xl space-y-6 transform -rotate-12 hover:rotate-0 transition-transform duration-700">
             <Cpu className="w-12 h-12 text-hh-orange" />
             <div className="space-y-1">
               <div className="text-[10px] font-black uppercase text-gray-500 tracking-widest">NEURAL CORE</div>
               <div className="text-2xl font-heading font-black italic text-white uppercase tracking-tighter">SYNTHESIS PRO V3</div>
             </div>
             <div className="flex gap-1">
               <div className="w-full h-1 bg-hh-green/40 rounded-full"></div>
               <div className="w-full h-1 bg-hh-green/40 rounded-full"></div>
               <div className="w-3/4 h-1 bg-white/10 rounded-full"></div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
