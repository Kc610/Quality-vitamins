
import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Quiz from './pages/Quiz';
import About from './pages/About';
import Contact from './pages/Contact';
import Visualizer from './pages/Visualizer';
import LiveLab from './pages/LiveLab';
import Cart from './components/Cart';
import ProductModal from './components/ProductModal';
import ChatBot from './components/ChatBot';
import { X, Play } from 'lucide-react';
import { Product, CartItem } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'shop' | 'quiz' | 'about' | 'contact' | 'visualizer' | 'livelab'>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const cartCount = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <Home navigate={setCurrentPage} addToCart={addToCart} onViewDetails={setSelectedProduct} onPlayVideo={() => setIsVideoModalOpen(true)} />;
      case 'shop': return <Shop addToCart={addToCart} onViewDetails={setSelectedProduct} />;
      case 'quiz': return <Quiz navigate={setCurrentPage} />;
      case 'visualizer': return <Visualizer />;
      case 'livelab': return <LiveLab />;
      case 'about': return <About />;
      case 'contact': return <Contact />;
      default: return <Home navigate={setCurrentPage} addToCart={addToCart} onViewDetails={setSelectedProduct} onPlayVideo={() => setIsVideoModalOpen(true)} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-x-hidden">
      <Header 
        cartCount={cartCount} 
        onOpenCart={() => setIsCartOpen(true)} 
        setCurrentPage={setCurrentPage} 
        currentPage={currentPage}
      />
      
      <main className="flex-grow pt-14 sm:pt-20">
        {renderPage()}
      </main>

      <Footer setCurrentPage={setCurrentPage} />

      <Cart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cart} 
        onRemove={removeFromCart} 
        onUpdateQuantity={updateQuantity} 
      />

      <ProductModal 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
        onAddToCart={addToCart}
      />

      {/* Science Video Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-hh-dark/95 backdrop-blur-xl animate-in fade-in duration-300">
          <button 
            onClick={() => setIsVideoModalOpen(false)}
            className="absolute top-6 right-6 text-white hover:text-hh-green transition-colors z-10"
          >
            <X className="w-10 h-10" />
          </button>
          <div className="w-full max-w-5xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10 relative">
            <video 
              autoPlay 
              controls 
              className="w-full h-full object-cover"
              src="https://videos.pexels.com/video-files/3125907/3125907-uhd_2560_1440_25fps.mp4"
            ></video>
          </div>
        </div>
      )}

      <ChatBot />
    </div>
  );
};

export default App;
