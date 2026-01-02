
import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types.ts';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose, items, onRemove, onUpdateQuantity }) => {
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-[60] shadow-2xl transition-transform duration-500 ease-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-heading font-extrabold text-2xl uppercase italic tracking-tighter">Your <span className="text-hh-green">Stack</span></h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-grow overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-10">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8 text-gray-300" />
                </div>
                <p className="text-gray-400 font-medium">Your cart is currently empty.</p>
                <button 
                  onClick={onClose}
                  className="mt-4 text-hh-green font-bold uppercase tracking-widest text-sm hover:underline"
                >
                  Start Fueling Up
                </button>
              </div>
            ) : (
              items.map(item => (
                <div key={item.id} className="flex gap-4 group">
                  <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-heading font-bold text-sm leading-tight group-hover:text-hh-green transition-colors">{item.name}</h4>
                      <button onClick={() => onRemove(item.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 font-bold uppercase mb-2">{item.category}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-gray-200 rounded-lg">
                        <button onClick={() => onUpdateQuantity(item.id, -1)} className="p-1 hover:text-hh-green"><Minus className="w-3 h-3" /></button>
                        <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                        <button onClick={() => onUpdateQuantity(item.id, 1)} className="p-1 hover:text-hh-green"><Plus className="w-3 h-3" /></button>
                      </div>
                      <span className="font-heading font-extrabold">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {items.length > 0 && (
            <div className="p-6 border-t border-gray-100 bg-gray-50">
              <div className="flex justify-between mb-2">
                <span className="text-gray-500 text-sm">Subtotal</span>
                <span className="font-bold">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-6">
                <span className="text-gray-500 text-sm">Shipping</span>
                <span className="text-hh-green font-bold text-sm uppercase">Free</span>
              </div>
              <div className="flex justify-between mb-8">
                <span className="font-heading font-extrabold text-xl">Total</span>
                <span className="font-heading font-extrabold text-2xl text-hh-green">${total.toFixed(2)}</span>
              </div>
              <button className="w-full py-4 bg-hh-dark text-white font-heading font-bold rounded-2xl hover:bg-hh-green transition-all shadow-xl hover:shadow-hh-green/20">
                CHECKOUT SECURELY
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;
