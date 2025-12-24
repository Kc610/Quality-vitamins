
import React from 'react';
import { Zap, Play } from 'lucide-react';

interface HeroProps {
  onShopClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onShopClick }) => {
  return (
    <section className="relative overflow-hidden bg-white pt-16 pb-24 md:pt-24 md:pb-32">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] bg-hh-green/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[400px] h-[400px] bg-hh-orange/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Content */}
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-hh-green/10 text-hh-green rounded-full font-bold text-xs uppercase tracking-widest mb-6">
              <Zap className="w-3 h-3 fill-current" />
              100% Plant-Based Science
            </div>
            
            <h1 className="font-heading text-5xl md:text-7xl font-extrabold text-hh-dark leading-[1.1] mb-6">
              TRANSFORM YOUR <br />
              <span className="text-hh-green relative inline-block">
                PERFORMANCE
                <span className="absolute bottom-2 left-0 w-full h-3 bg-hh-orange/20 -z-10"></span>
              </span>
            </h1>
            
            <p className="text-lg text-gray-600 mb-10 max-w-xl mx-auto md:mx-0">
              Lab-tested purity. Clean formulas. No fillers. Just the fuel you need to reach your transformation goals faster and cleaner than ever before.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
              <button 
                onClick={onShopClick}
                className="w-full sm:w-auto px-10 py-4 bg-hh-green text-white font-heading font-bold rounded-full hover:bg-hh-greenDark transition-all hover:scale-105 shadow-lg shadow-hh-green/30"
              >
                SHOP THE ADAPT STACK
              </button>
              <button className="flex items-center gap-2 font-heading font-bold text-hh-dark hover:text-hh-green transition-colors p-4">
                <div className="w-10 h-10 rounded-full border-2 border-gray-100 flex items-center justify-center">
                  <Play className="w-4 h-4 fill-current" />
                </div>
                WATCH SCIENCE VIDEO
              </button>
            </div>

            <div className="mt-12 flex items-center gap-6 justify-center md:justify-start grayscale opacity-50">
              <div className="font-bold text-sm tracking-widest text-gray-400">TRUSTED BY ATHLETES WORLDWIDE</div>
            </div>
          </div>

          {/* Product Image */}
          <div className="flex-1 relative w-full max-w-lg">
             <div className="absolute inset-0 bg-gradient-to-tr from-hh-green to-hh-orange opacity-10 blur-2xl rounded-full"></div>
             <img 
               src="https://picsum.photos/seed/hero-supps/800/800" 
               alt="Adapt Stack Supplements" 
               className="relative z-10 rounded-3xl shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500"
             />
             
             {/* Float Badge */}
             <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl z-20 animate-bounce">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-hh-orange rounded-lg flex items-center justify-center text-white">
                    <Zap className="w-6 h-6 fill-current" />
                  </div>
                  <div>
                    <div className="font-heading font-extrabold text-xl leading-none">4.9/5</div>
                    <div className="text-xs font-bold text-gray-400 uppercase">Customer Rating</div>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
