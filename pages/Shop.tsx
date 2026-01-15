
import React, { useState, useMemo } from 'react';
import ProductCard from '../components/ProductCard.tsx';
import { INITIAL_PRODUCTS } from '../constants.tsx';
import { Category, Product } from '../types.ts';
import { Filter, SlidersHorizontal, Search, Target, Zap, Activity, Shield } from 'lucide-react';

interface ShopProps {
  addToCart: (p: Product) => void;
  onViewDetails: (p: Product) => void;
}

const Shop: React.FC<ShopProps> = ({ addToCart, onViewDetails }) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [selectedGoal, setSelectedGoal] = useState<string | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', ...Object.values(Category)];
  const goals = ['All', 'Neural Drive', 'Tissue Repair', 'Metabolic Edge', 'Endurance'];

  const filteredProducts = useMemo(() => {
    return INITIAL_PRODUCTS.filter(p => {
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesGoal = selectedGoal === 'All' || p.tags.includes(selectedGoal);
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesGoal && matchesSearch;
    });
  }, [selectedCategory, selectedGoal, searchQuery]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Page Header */}
      <section className="bg-hh-light pt-12 pb-24 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-hh-green/5 blur-[100px] rounded-full"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-hh-dark text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6">
                <Target className="w-3 h-3 text-hh-green" /> Biological Selection
              </div>
              <h1 className="font-heading text-6xl md:text-8xl font-black italic tracking-tighter uppercase mb-4 leading-none">
                THE <span className="text-hh-green">COLLECTION</span>
              </h1>
              <p className="text-gray-500 max-w-xl font-medium uppercase tracking-widest text-[10px] italic">
                Sourced for Purity • Validated by Science • Deployed for Performance
              </p>
            </div>
            
            <div className="relative w-full max-w-md">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search directives..." 
                className="w-full bg-white border border-gray-100 rounded-[2rem] py-6 pl-16 pr-8 shadow-sm focus:outline-none focus:ring-4 focus:ring-hh-green/10 transition-all font-bold text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-8">
            {/* Category Filters */}
            <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide no-scrollbar">
              <div className="flex-shrink-0 flex items-center gap-2 mr-6 text-hh-dark/50">
                <Filter className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Protocol</span>
              </div>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat as any)}
                  className={`flex-shrink-0 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                    selectedCategory === cat 
                      ? 'bg-hh-dark border-hh-dark text-white shadow-xl translate-y-[-2px]' 
                      : 'bg-white border-gray-100 text-gray-400 hover:border-hh-green hover:text-hh-green'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Goal Filters */}
            <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide no-scrollbar">
              <div className="flex-shrink-0 flex items-center gap-2 mr-6 text-hh-dark/50">
                <Activity className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Biological Goal</span>
              </div>
              {goals.map((goal) => (
                <button
                  key={goal}
                  onClick={() => setSelectedGoal(goal)}
                  className={`flex-shrink-0 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all flex items-center gap-3 ${
                    selectedGoal === goal 
                      ? 'bg-hh-green border-hh-green text-white shadow-xl shadow-hh-green/20' 
                      : 'bg-white border-gray-100 text-gray-400 hover:border-hh-green hover:text-hh-green'
                  }`}
                >
                  {goal === 'Neural Drive' && <Zap className="w-3.5 h-3.5" />}
                  {goal === 'Tissue Repair' && <Shield className="w-3.5 h-3.5" />}
                  {goal}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Catalog */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
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
            <div className="text-center py-32 bg-hh-light rounded-[4rem] border-2 border-dashed border-gray-200">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white text-gray-200 mb-8 shadow-inner">
                <SlidersHorizontal className="w-10 h-10" />
              </div>
              <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-4">Directive Not Found</h3>
              <p className="text-gray-400 font-medium uppercase tracking-widest text-xs">Try adjusting your filters or biological markers.</p>
              <button 
                onClick={() => { setSelectedCategory('All'); setSelectedGoal('All'); setSearchQuery(''); }}
                className="mt-10 px-10 py-4 bg-hh-dark text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-hh-green transition-all"
              >
                Reset Calibration
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Shop;
