
import React, { useState } from 'react';
import { ShoppingCart, Menu, X, Sparkles, Mic, Activity } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  setCurrentPage: (page: any) => void;
  currentPage: string;
}

const BrandLogo = () => (
  <div className="relative flex items-center justify-center">
    {/* Dynamic Background Glows */}
    <div className="absolute inset-[-6px] bg-hh-green/20 rounded-full blur-xl group-hover:bg-hh-orange/30 transition-colors duration-700 animate-pulse"></div>
    <div className="absolute inset-0 bg-gradient-to-tr from-hh-green to-hh-orange opacity-10 rounded-full group-hover:opacity-20 transition-opacity"></div>
    
    <div className="relative w-11 h-11 bg-white rounded-xl shadow-lg border border-gray-100 flex items-center justify-center overflow-hidden group-hover:rounded-full group-hover:scale-110 group-hover:rotate-[360deg] transition-all duration-700 ease-in-out">
      {/* Custom SVG Logo - Bio-Science "H" */}
      <svg viewBox="0 0 40 40" className="w-7 h-7 fill-none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 8V32M28 8V32M12 20H28" stroke="currentColor" strokeWidth="6" strokeLinecap="round" className="text-hh-dark group-hover:text-hh-green transition-colors duration-500" />
        <path d="M22 14L28 20L22 26" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="text-hh-orange" />
        <circle cx="12" cy="12" r="2" fill="white" className="animate-pulse" />
      </svg>
    </div>
  </div>
);

const Header: React.FC<HeaderProps> = ({ cartCount, onOpenCart, setCurrentPage, currentPage }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Shop', id: 'shop' },
    { label: 'Quiz', id: 'quiz' },
    { label: 'Studio', id: 'visualizer' },
    { label: 'Live Lab', id: 'livelab' },
    { label: 'About', id: 'about' },
  ];

  const handleNav = (id: any) => {
    setCurrentPage(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md z-40 border-b border-gray-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        {/* Enhanced Branding Section */}
        <div 
          className="flex items-center gap-4 cursor-pointer group" 
          onClick={() => handleNav('home')}
        >
          <BrandLogo />

          <div className="flex flex-col">
            <h1 className="font-heading font-black text-xl md:text-2xl tracking-tighter uppercase leading-none flex items-center">
              <span className="text-hh-dark group-hover:tracking-normal transition-all duration-500">Hello</span>
              <span className="text-hh-green ml-1 relative">
                Healthy
                <span className="absolute -bottom-1 left-0 w-0 h-1 bg-hh-orange group-hover:w-full transition-all duration-500 rounded-full"></span>
              </span>
            </h1>
            <div className="flex items-center gap-2 mt-1.5 overflow-hidden">
              <Activity className="w-2.5 h-2.5 text-hh-orange group-hover:animate-bounce" />
              <span className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.4em] text-gray-400 group-hover:text-hh-orange transition-colors duration-500 whitespace-nowrap">
                Energetic Source
              </span>
            </div>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`font-heading text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 flex items-center gap-2 px-4 py-2 rounded-xl ${
                currentPage === item.id 
                  ? 'bg-hh-dark text-white shadow-xl shadow-black/10' 
                  : 'text-gray-500 hover:text-hh-green hover:bg-hh-green/5'
              } ${item.id === 'livelab' ? 'text-hh-orange border border-hh-orange/20 ring-4 ring-hh-orange/5 animate-pulse' : ''}`}
            >
              {item.id === 'visualizer' && <Sparkles className="w-3 h-3 text-hh-green" />}
              {item.id === 'livelab' && <Mic className="w-3 h-3" />}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <button onClick={onOpenCart} className="relative p-2.5 text-gray-700 hover:text-hh-green transition-all hover:scale-110 bg-gray-50 rounded-full">
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-hh-orange text-white text-[9px] font-black px-1.5 py-0.5 rounded-full ring-2 ring-white animate-bounce">
                {cartCount}
              </span>
            )}
          </button>
          <button className="lg:hidden p-2 text-hh-dark" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-100 p-8 absolute top-20 left-0 right-0 animate-in slide-in-from-top duration-500 shadow-2xl z-50 rounded-b-[2rem]">
          <nav className="flex flex-col gap-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`text-left font-heading font-black uppercase tracking-widest text-sm flex items-center justify-between group ${currentPage === item.id ? 'text-hh-green' : 'text-gray-600'}`}
              >
                <div className="flex items-center gap-4">
                  {item.id === 'visualizer' && <Sparkles className="w-5 h-5 text-hh-green" />}
                  {item.id === 'livelab' && <Mic className="w-5 h-5 text-hh-orange" />}
                  {item.label}
                </div>
                <X className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity -rotate-45" />
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
