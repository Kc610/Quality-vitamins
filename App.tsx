
import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx';
import Home from './pages/Home.tsx';
import Shop from './pages/Shop.tsx';
import Quiz from './pages/Quiz.tsx';
import About from './pages/About.tsx';
import Contact from './pages/Contact.tsx';
import Visualizer from './pages/Visualizer.tsx';
import LiveLab from './pages/LiveLab.tsx';
import Community from './pages/Community.tsx'; // Import Community page
import Cart from './components/Cart.tsx';
import ProductModal from './components/ProductModal.tsx';
import ChatBot from './components/ChatBot.tsx';
import { Product, CartItem } from './types.ts';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'shop' | 'quiz' | 'about' | 'contact' | 'visualizer' | 'livelab' | 'community'>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Auto-scroll on page change
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

  const removeFromCart = (id: string) => setCart(prev => prev.filter(item => item.id !== id));
  
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
      case 'home': return <Home navigate={setCurrentPage} addToCart={addToCart} onViewDetails={setSelectedProduct} />;
      case 'shop': return <Shop addToCart={addToCart} onViewDetails={setSelectedProduct} />;
      case 'quiz': return <Quiz navigate={setCurrentPage} />;
      case 'visualizer': return <Visualizer />;
      case 'livelab': return <LiveLab />;
      case 'community': return <Community navigate={setCurrentPage} />; // Add Community page case
      case 'about': return <About />;
      case 'contact': return <Contact />;
      default: return <Home navigate={setCurrentPage} addToCart={addToCart} onViewDetails={setSelectedProduct} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-hh-dark text-white selection:bg-hh-green selection:text-hh-dark overflow-x-hidden">
      <Header 
        cartCount={cartCount} 
        onOpenCart={() => setIsCartOpen(true)} 
        setCurrentPage={setCurrentPage} 
        currentPage={currentPage}
      />
      
      <main className="flex-grow pt-24 lg:pt-32">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {renderPage()}
        </div>
      </main>

      <Footer setCurrentPage={setCurrentPage} />

      <Cart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cart} 
        onRemove={removeFromCart} 
        onUpdateQuantity={updateQuantity} 
      />

      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
          onAddToCart={addToCart}
        />
      )}

      <ChatBot />
    </div>
  );
};

export default App;
