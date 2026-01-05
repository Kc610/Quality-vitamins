
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X, ChevronRight, Microscope, Zap } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  setCurrentPage: (page: any) => void;
  currentPage: string;
}

const BrandLogo = () => (
  <div className="relative flex items-center justify-center group">
    <div className="absolute inset-[-8px] bg-hh-green/30 rounded-full blur-xl group-hover:bg-hh-green/50 transition-all duration-700 opacity-0 group-hover:opacity-100"></div>
    <div className="relative w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-2xl border border-hh-green/20 group-hover:rotate-6 transition-all">
      <svg viewBox="0 0 100 100" className="w-8 h-8" xmlns="http://www.w3.org/2000/svg">
        <rect x="20" y="20" width="15" height="60" rx="2" fill="#111111" />
        <rect x="65" y="20" width="15" height="60" rx="2" fill="#111111" />
        <rect x="35" y="42" width="30" height="15" rx="1" fill="#4CAF50" />
        <circle cx="50" cy="50" r="10" fill="#4CAF50" className="animate-pulse" />
      </svg>
    </div>
  </div>
);

const Header: React.FC<HeaderProps> = ({ cartCount, onOpenCart, setCurrentPage, currentPage }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'FUEL STACK', id: 'shop' },
    { label: 'BIO-QUIZ', id: 'quiz' },
    { label: 'COMMUNITY', id: 'community' },
    { label: 'VISUAL LAB', id: 'visualizer' },
    { label: 'LIVE LAB', id: 'livelab' },
  ];

  const handleNav = (id: any) => {
    setCurrentPage(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled ? 'bg-hh-dark/90 backdrop-blur-xl border-b border-white/10 py-4' : 'bg-transparent py-8'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div 
          className="flex items-center gap-4 cursor-pointer group" 
          onClick={() => handleNav('home')}
        >
          <BrandLogo />
          <div className="flex flex-col">
            <h1 className="font-heading font-black text-2xl tracking-tighter uppercase leading-none italic">
              HELLO<span className="text-hh-green">HEALTHY</span>
            </h1>
            <span className="text-[8px] font-black uppercase tracking-[0.4em] text-gray-500">Biological Performance</span>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-1 bg-white/5 backdrop-blur-md rounded-2xl p-1 border border-white/10">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`font-heading text-[10px] font-black uppercase tracking-[0.2em] transition-all px-6 py-3 rounded-xl ${
                currentPage === item.id 
                  ? 'bg-hh-green text-hh-dark shadow-lg' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button 
            onClick={onOpenCart} 
            className="relative p-4 text-white bg-white/5 hover:bg-hh-green hover:text-hh-dark rounded-xl transition-all border border-white/10 group"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-hh-orange text-white text-[9px] font-black px-2 py-0.5 rounded-full ring-2 ring-hh-dark shadow-lg">
                {cartCount}
              </span>
            )}
          </button>
          <button 
            className="lg:hidden p-4 text-white bg-white/5 rounded-xl transition-colors border border-white/10" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden fixed inset-0 top-[88px] bg-hh-dark/95 backdrop-blur-2xl z-50 transition-all duration-500 transform ${isMobileMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
        <nav className="p-8 flex flex-col gap-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`text-left font-heading font-black uppercase tracking-widest text-lg flex items-center justify-between p-6 rounded-2xl transition-all ${
                currentPage === item.id ? 'bg-hh-green text-hh-dark shadow-xl' : 'text-gray-400 hover:bg-white/5'
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
