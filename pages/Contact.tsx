
import React from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <div className="animate-in fade-in duration-700 min-h-screen bg-hh-light pt-20 pb-32">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="font-heading text-5xl md:text-7xl font-black italic uppercase mb-4 tracking-tighter">
            GET IN <span className="text-hh-green">TOUCH</span>
          </h1>
          <p className="text-gray-500 uppercase tracking-[0.3em] font-bold text-[10px]">We're here to fuel your journey</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
          {/* Info */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-hh-dark text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-hh-green/20 rounded-full blur-2xl"></div>
              <h3 className="font-heading text-2xl font-bold mb-8 italic">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-hh-green flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">Email Support</div>
                    <div className="font-bold text-lg">support@hellohealthy.store</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-hh-green flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">Call Center</div>
                    <div className="font-bold text-lg">+1 (888) HELLO-HEALTH</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-hh-green flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-1">Headquarters</div>
                    <div className="font-bold">123 Wellness Way, Silicon Valley, CA 94025</div>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-10 border-t border-white/5">
                <h4 className="font-heading font-bold text-xs uppercase tracking-widest mb-4">Social Hub</h4>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">YT</div>
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">IG</div>
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">FB</div>
                </div>
              </div>
            </div>

            <div className="bg-hh-green/5 p-8 rounded-[2rem] border border-hh-green/10 flex items-center gap-6">
              <div className="w-12 h-12 bg-hh-green rounded-full flex items-center justify-center text-white">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-hh-dark">Live Chat Available</h4>
                <p className="text-sm text-gray-500">Mon-Fri: 9am - 6pm PST</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7 bg-white p-10 md:p-14 rounded-[3rem] shadow-xl">
             <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                   <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">First Name</label>
                   <input type="text" className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-hh-green transition-all" />
                 </div>
                 <div>
                   <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Last Name</label>
                   <input type="text" className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-hh-green transition-all" />
                 </div>
               </div>
               
               <div>
                 <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Email Address</label>
                 <input type="email" className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-hh-green transition-all" />
               </div>

               <div>
                 <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Subject</label>
                 <select className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-hh-green appearance-none">
                   <option>Product Question</option>
                   <option>Order Support</option>
                   <option>Bulk/Wholesale</option>
                   <option>Partnership</option>
                 </select>
               </div>

               <div>
                 <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Message</label>
                 <textarea rows={5} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-hh-green transition-all resize-none"></textarea>
               </div>

               <button className="w-full py-5 bg-hh-green text-white font-heading font-bold rounded-2xl hover:bg-hh-greenDark transition-all shadow-lg flex items-center justify-center gap-3">
                 SEND MESSAGE <Send className="w-5 h-5" />
               </button>
             </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
