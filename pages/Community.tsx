
import React from 'react';
import { Users, Globe, Award, Activity, Quote, Zap, Binary, ChevronRight } from 'lucide-react';

interface CommunityProps {
  navigate: (page: any) => void;
}

const stats = [
  { value: '18,742', label: 'Active Nodes', icon: Users },
  { value: '4.2M+', label: 'Upgrades Synchronized', icon: Zap },
  { value: '42', label: 'Countries Deployed', icon: Globe },
  { value: '#1', label: 'Global Bio-Fuel Rank', icon: Award },
];

const testimonials = [
  { user: 'ALPHA_STRAIN_7', location: 'Tokyo, JP', text: "The noise is gone. My output is pure signal. Hello Healthy isn't a supplement, it's a firmware upgrade for humans." },
  { user: 'BIO_DOMINA', location: 'Berlin, DE', text: 'My recovery delta has decreased by 18%. The data doesn\'t lie. This is the new baseline for elite performance.' },
  { user: 'ZENITH_PULSE', location: 'Rio de Janeiro, BZ', text: 'Switched from a legacy stack and unlocked a new level of neural clarity. My focus during deep work sessions is off the charts.' },
  { user: 'KILO_FIVE', location: 'Seoul, KR', text: "The lab-tested purity is what sold me. No fillers, just verified, high-grade fuel for the mission. It's that simple." },
  { user: 'OMEGΔ_POINT', location: 'New York, US', text: 'My entire squad runs on the Elite Stack. The synergistic effect is undeniable. We are operating at a higher frequency.' },
  { user: 'GHOST_RUNNER', location: 'London, UK', text: 'Three weeks in and I\'ve shattered every personal best. It feels like unlocking a hidden biological potential I never knew existed.' },
];

const Community: React.FC<CommunityProps> = ({ navigate }) => {
  return (
    <div className="animate-in fade-in duration-1000 bg-hh-dark selection:bg-hh-green selection:text-hh-dark">
      {/* Hero */}
      <section className="relative pt-24 pb-20 sm:pb-32 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(76,175,80,0.15),transparent_40%)]"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8 px-4 sm:px-5 py-2 bg-hh-green/10 border border-hh-green/20 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-hh-green">
            <Activity className="w-4 h-4" /> LIVE NETWORK STATUS
          </div>
          <h1 className="font-heading text-5xl sm:text-7xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.9] lg:leading-none mb-6">
            GLOBAL <br /><span className="text-hh-green">PERFORMANCE GRID</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Witness the collective. Thousands of elite performers, one synchronized mission: to redefine the limits of biological potential.
          </p>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="max-w-7xl mx-auto px-6 -mt-10 sm:-mt-20 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 rounded-[2rem] sm:rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
          {stats.map((stat, i) => (
            <div key={i} className="bg-hh-card p-8 sm:p-10 text-center group">
              <stat.icon className="w-8 h-8 sm:w-10 h-10 mx-auto mb-4 sm:mb-6 text-hh-green group-hover:text-hh-orange transition-colors" />
              <div className="text-4xl sm:text-5xl font-heading font-black italic tracking-tighter text-white mb-2">{stat.value}</div>
              <div className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Global Map */}
      <section className="py-24 sm:py-48 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 flex items-center justify-center">
           <Globe className="w-[500px] h-[500px] sm:w-[800px] sm:h-[800px] text-white opacity-20" />
        </div>
        <div className="max-w-5xl mx-auto relative h-[300px] sm:h-[500px]">
          {/* Map Nodes - Example positions */}
          {[
            { top: '35%', left: '15%' }, { top: '30%', left: '50%' }, { top: '70%', left: '80%' },
            { top: '50%', left: '75%' }, { top: '25%', left: '85%' }, { top: '65%', left: '25%' },
            { top: '40%', left: '55%' }, { top: '80%', left: '52%' }, { top: '15%', left: '45%' },
          ].map((pos, i) => (
            <div key={i} className="absolute w-3 h-3 sm:w-4 sm:h-4 rounded-full" style={{...pos, animation: `pulse-map 3s ease-in-out ${i * 0.3}s infinite`}}>
              <div className="absolute inset-0 bg-hh-green rounded-full"></div>
              <div className="absolute inset-0 bg-hh-green rounded-full animate-ping"></div>
            </div>
          ))}
          <style>{`
            @keyframes pulse-map {
              0%, 100% { transform: scale(0.8); box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7); }
              50% { transform: scale(1.2); box-shadow: 0 0 10px 15px rgba(76, 175, 80, 0); }
            }
          `}</style>
        </div>
      </section>

      {/* Field Reports Ticker */}
      <section className="py-20 sm:py-24 bg-hh-card border-y border-white/5 overflow-hidden">
        <h2 className="text-center font-heading font-black italic uppercase text-4xl sm:text-5xl tracking-tighter mb-12 sm:mb-20">
          INCOMING <span className="text-hh-green">FIELD REPORTS</span>
        </h2>
        <div className="animate-marquee flex gap-6 sm:gap-8 whitespace-nowrap">
          {[...testimonials, ...testimonials].map((item, i) => (
            <div key={i} className="bg-hh-dark border border-white/5 rounded-[2rem] sm:rounded-[2.5rem] p-8 sm:p-10 w-[300px] sm:w-[450px] flex-shrink-0">
              <Quote className="w-8 h-8 sm:w-10 h-10 text-hh-green/30 mb-4 sm:mb-6" />
              <p className="text-sm sm:text-lg text-white font-medium italic mb-6 sm:mb-8 leading-relaxed h-24 sm:h-32 whitespace-normal line-clamp-4">"{item.text}"</p>
              <div className="pt-6 sm:pt-8 border-t border-white/5">
                <div className="text-xs sm:text-sm font-black uppercase tracking-widest text-white">{item.user}</div>
                <div className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-hh-orange mt-1">{item.location}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Join CTA */}
      <section className="py-32 sm:py-48 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <Binary className="w-12 h-12 sm:w-16 h-16 mx-auto mb-8 sm:mb-10 text-hh-orange animate-pulse" />
          <h2 className="font-heading text-5xl sm:text-7xl lg:text-8xl font-black italic uppercase tracking-tighter leading-[0.9] lg:leading-none mb-8">
            JOIN THE <span className="text-hh-green">MOVEMENT</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-400 mb-12 sm:mb-16 max-w-xl mx-auto">
            Your protocol is waiting. Calibrate your biology and synchronize with the global elite.
          </p>
          <button 
            onClick={() => navigate('quiz')}
            className="group relative w-full sm:w-auto px-10 sm:px-20 py-6 sm:py-10 bg-hh-green text-hh-dark font-heading font-black text-xs sm:text-sm rounded-[1.5rem] sm:rounded-3xl hover:bg-white transition-all shadow-[0_20px_60px_-10px_rgba(76,175,80,0.6)] active:scale-95 uppercase tracking-[0.2em] sm:tracking-[0.3em] italic"
          >
            <span className="relative z-10 flex items-center justify-center gap-3 sm:gap-4">
              Initiate Bio-Protocol <ChevronRight className="w-5 h-5 sm:w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </span>
          </button>
        </div>
      </section>
    </div>
  );
};

export default Community;
