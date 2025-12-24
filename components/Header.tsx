
import React, { useState } from 'react';
import { ShoppingCart, Menu, X, ChevronRight, ShieldCheck, Microscope } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  setCurrentPage: (page: any) => void;
  currentPage: string;
}

const BrandLogo = () => (
  <div className="relative flex items-center justify-center group">
    {/* High contrast visual anchor */}
    <div className="absolute inset-[-12px] bg-hh-green/40 rounded-full blur-2xl group-hover:bg-hh-green/60 transition-all duration-700 opacity-0 group-hover:opacity-100"></div>
    <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center bg-hh-dark rounded-2xl shadow-2xl border-2 border-hh-green/30 group-hover:border-hh-green transition-all transform group-hover:scale-105">
      <svg viewBox="0 0 100 100" className="w-10 h-10 sm:w-12 sm:h-12" xmlns="http://www.w3.org/2000/svg">
        {/* Aggressive Monolith H Bars */}
        <rect x="18" y="15" width="16" height="70" rx="4" fill="#FFFFFF" />
        <rect x="66" y="15" width="16" height="70" rx="4" fill="#FFFFFF" />
        {/* The Biological Core Connector */}
        <rect x="34" y="42" width="32" height="16" rx="2" fill="#4CAF50" />
        <circle cx="50" cy="50" r="12" fill="#4CAF50" className="animate-pulse" />
        <circle cx="50" cy="50" r="5" fill="#FFFFFF" />
      </svg>
    </div>
  </div>
);

const Header: React.FC<HeaderProps> = ({ cartCount, onOpenCart, setCurrentPage, currentPage }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Fuel Stack', id: 'shop' },
    { label: 'Bio-Quiz', id: 'quiz' },
    { label: 'Asset Lab', id: 'visualizer' },
    { label: 'Live Lab', id: 'livelab' },
  ];

  const handleNav = (id: any) => {
    setCurrentPage(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white z-[60] border-b-2 border-gray-100 shadow-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 h-24 sm:h-32 flex items-center justify-between">
        <div 
          className="flex items-center gap-4 sm:gap-8 cursor-pointer group" 
          onClick={() => handleNav('home')}
        >
          <BrandLogo />
          <div className="flex flex-col">
            <h1 className="font-heading font-black text-2xl sm:text-4xl tracking-[-0.12em] uppercase leading-none italic">
              <span className="text-hh-dark">HELLO</span>
              <span className="text-hh-green">HEALTHY</span>
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <Microscope className="w-3 h-3 text-hh-green" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400">Biological Dominance</span>
            </div>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`font-heading text-xs font-black uppercase tracking-[0.2em] transition-all px-8 py-5 rounded-2xl ${
                currentPage === item.id 
                  ? 'bg-hh-dark text-white shadow-2xl shadow-black/30 translate-y-[-4px]' 
                  : 'text-gray-500 hover:text-hh-green hover:bg-gray-50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3 sm:gap-6">
          <button onClick={onOpenCart} className="relative p-5 text-hh-dark bg-hh-light hover:bg-hh-dark hover:text-white rounded-3xl transition-all shadow-inner group overflow-hidden">
            <div className="absolute inset-0 bg-hh-green translate-y-full group-hover:translate-y-0 transition-transform duration-300 opacity-20"></div>
            <ShoppingCart className="w-7 h-7 relative z-10" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[11px] font-black px-2.5 py-1 rounded-full ring-4 ring-white shadow-lg z-20">
                {cartCount}
              </span>
            )}
          </button>
          <button className="lg:hidden p-5 text-hh-dark hover:bg-gray-100 rounded-3xl transition-colors border border-gray-100" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
          </button>
        </div>
      </div>

      <div className={`lg:hidden fixed inset-0 top-24 bg-hh-dark/60 backdrop-blur-lg z-50 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMobileMenuOpen(false)} />
      
      <div className={`lg:hidden absolute top-24 left-0 right-0 bg-white border-b-4 border-hh-green transition-all duration-500 z-[51] shadow-2xl rounded-b-[4rem] overflow-hidden ${isMobileMenuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <nav className="p-10 flex flex-col gap-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`text-left font-heading font-black uppercase tracking-[0.3em] text-lg flex items-center justify-between p-8 rounded-[2.5rem] transition-all ${
                currentPage === item.id ? 'bg-hh-green text-white shadow-2xl' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {item.label}
              <ChevronRight className={`w-6 h-6 ${currentPage === item.id ? 'translate-x-1' : 'opacity-30'}`} />
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
