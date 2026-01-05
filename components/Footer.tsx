
import React from 'react';
import { Youtube, Instagram, Facebook, Mail, ArrowRight, Sparkles, Activity } from 'lucide-react';

interface FooterProps {
  setCurrentPage: (page: any) => void;
}

const Footer: React.FC<FooterProps> = ({ setCurrentPage }) => {
  return (
    <footer className="bg-hh-dark text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Brand */}
          <div className="space-y-8">
            <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setCurrentPage('home')}>
              <div className="relative w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-2xl group-hover:rotate-12 transition-transform duration-500">
                <svg viewBox="0 0 40 40" className="w-8 h-8 fill-none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 8V32M28 8V32M12 20H28" stroke="#212121" strokeWidth="6" strokeLinecap="round" />
                  <path d="M22 14L28 20L22 26" stroke="#FF9800" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-extrabold text-2xl tracking-tighter uppercase leading-none">
                  Hello<span className="text-hh-green">Healthy</span>
                </span>
                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-hh-green mt-1 flex items-center gap-1">
                  <Activity className="w-2 h-2" /> Science & Nature
                </span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Empowering athletes and wellness enthusiasts with lab-tested, clean, and plant-based supplement science. Your transformation starts here.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-hh-green transition-all hover:-translate-y-1 border border-white/10">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://youtube.com/@Hellohealthy-610" target="_blank" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-red-600 transition-all hover:-translate-y-1 border border-white/10">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-blue-600 transition-all hover:-translate-y-1 border border-white/10">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-black uppercase tracking-widest text-[10px] text-hh-green mb-8 border-l-2 border-hh-green pl-4">Quick Links</h4>
            <ul className="space-y-4 text-sm text-gray-400 font-bold">
              <li><button onClick={() => setCurrentPage('shop')} className="hover:text-hh-green transition-colors uppercase tracking-tight">Shop All</button></li>
              <li><button onClick={() => setCurrentPage('quiz')} className="hover:text-hh-green transition-colors uppercase tracking-tight">Transformation Quiz</button></li>
              <li><button onClick={() => setCurrentPage('community')} className="hover:text-hh-green transition-colors uppercase tracking-tight">Community Hub</button></li>
              <li><button onClick={() => setCurrentPage('visualizer')} className="hover:text-hh-green transition-colors flex items-center gap-2 uppercase tracking-tight"><Sparkles className="w-3 h-3"/> AI Studio</button></li>
              <li><button onClick={() => setCurrentPage('about')} className="hover:text-hh-green transition-colors uppercase tracking-tight">Our Mission</button></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-heading font-black uppercase tracking-widest text-[10px] text-hh-orange mb-8 border-l-2 border-hh-orange pl-4">Support</h4>
            <ul className="space-y-4 text-sm text-gray-400 font-bold">
              <li><a href="#" className="hover:text-hh-orange transition-colors uppercase tracking-tight">Lab Reports</a></li>
              <li><a href="#" className="hover:text-hh-orange transition-colors uppercase tracking-tight">FAQs</a></li>
              <li><a href="#" className="hover:text-hh-orange transition-colors uppercase tracking-tight">Shipping</a></li>
              <li><a href="#" className="hover:text-hh-orange transition-colors uppercase tracking-tight">Privacy</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-heading font-black uppercase tracking-widest text-[10px] text-white mb-8 border-l-2 border-white pl-4">Join the Movement</h4>
            <p className="text-xs text-gray-500 mb-6 italic">Get 10% off your first stack + clean training tips.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Email address" 
                className="flex-grow bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-hh-green transition-colors"
              />
              <button className="bg-hh-green hover:bg-hh-greenDark p-3 rounded-xl transition-all group shadow-xl shadow-hh-green/10 active:scale-95">
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <p className="text-[9px] uppercase font-black tracking-[0.3em] text-gray-600">
            &copy; 2025 HELLO HEALTHY STORE • DESIGNED FOR PERFORMANCE • ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-6 grayscale opacity-20 hover:opacity-100 transition-opacity">
             <div className="h-4 w-8 bg-white rounded-sm"></div>
             <div className="h-4 w-8 bg-white rounded-sm"></div>
             <div className="h-4 w-8 bg-white rounded-sm"></div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
