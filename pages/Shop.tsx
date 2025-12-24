
import React, { useState, useMemo } from 'react';
import ProductCard from '../components/ProductCard';
import { INITIAL_PRODUCTS } from '../constants';
import { Category, Product } from '../types';
import { Filter, SlidersHorizontal, Search } from 'lucide-react';

interface ShopProps {
  addToCart: (p: Product) => void;
  onViewDetails: (p: Product) => void;
}

const Shop: React.FC<ShopProps> = ({ addToCart, onViewDetails }) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', ...Object.values(Category)];

  const filteredProducts = useMemo(() => {
    return INITIAL_PRODUCTS.filter(p => {
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Page Header */}
      <section className="bg-hh-light pt-12 pb-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div>
              <h1 className="font-heading text-5xl md:text-7xl font-black italic tracking-tighter uppercase mb-4 leading-none">
                THE <span className="text-hh-green">COLLECTION</span>
              </h1>
              <p className="text-gray-500 max-w-xl font-medium uppercase tracking-widest text-xs">
                Performance Optimized • Science Based • Lab Tested
              </p>
            </div>
            
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Find your fuel..." 
                className="w-full bg-white border border-gray-100 rounded-full py-4 pl-12 pr-6 shadow-sm focus:outline-none focus:ring-2 focus:ring-hh-green/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide no-scrollbar">
            <div className="flex-shrink-0 flex items-center gap-2 mr-4 text-hh-dark/50">
              <Filter className="w-4 h-4" />
              <span className="text-xs font-black uppercase">Category</span>
            </div>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat as any)}
                className={`flex-shrink-0 px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest border transition-all ${
                  selectedCategory === cat 
                    ? 'bg-hh-green border-hh-green text-white shadow-lg shadow-hh-green/30' 
                    : 'bg-white border-gray-100 text-gray-500 hover:border-hh-green hover:text-hh-green'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Catalog */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={addToCart} 
                  onViewDetails={onViewDetails}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-50 text-gray-300 mb-6">
                <SlidersHorizontal className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-2">No results found</h3>
              <p className="text-gray-400">Try adjusting your filters or search query.</p>
              <button 
                onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                className="mt-6 text-hh-green font-bold uppercase underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Shop;
