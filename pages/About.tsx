
import React from 'react';
import { Microscope, Leaf, ShieldCheck, Heart } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="animate-in fade-in duration-700">
      {/* Hero */}
      <section className="bg-hh-dark text-white py-32 px-4 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-hh-green/10 rounded-full blur-3xl"></div>
         <div className="max-w-4xl mx-auto relative z-10 text-center">
           <h1 className="font-heading text-5xl md:text-7xl font-black italic uppercase mb-6 leading-none">
             THE <span className="text-hh-green">PURITY</span> MISSION
           </h1>
           <p className="text-xl text-gray-400 leading-relaxed font-light">
             We founded Hello Healthy because we were tired of "prop blends," fillers, and supplements that hid their science. We believe you deserve better.
           </p>
         </div>
      </section>

      {/* Values */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-hh-green/10 rounded-[2rem] flex items-center justify-center text-hh-green mx-auto mb-6">
                <Microscope className="w-10 h-10" />
              </div>
              <h3 className="font-heading font-bold uppercase tracking-widest text-sm mb-4 italic">Lab-Tested</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Every batch is third-party tested for purity and potency. We don't just say it—we prove it.</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-hh-orange/10 rounded-[2rem] flex items-center justify-center text-hh-orange mx-auto mb-6">
                <Leaf className="w-10 h-10" />
              </div>
              <h3 className="font-heading font-bold uppercase tracking-widest text-sm mb-4 italic">Plant Based</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Harnessing the power of nature through modern science. 100% vegan and earth-friendly.</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-hh-dark/5 rounded-[2rem] flex items-center justify-center text-hh-dark mx-auto mb-6">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <h3 className="font-heading font-bold uppercase tracking-widest text-sm mb-4 italic">Clean Formulas</h3>
              <p className="text-sm text-gray-500 leading-relaxed">No artificial colors, flavors, or sweeteners. Only what your body needs to excel.</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-red-50 rounded-[2rem] flex items-center justify-center text-red-500 mx-auto mb-6">
                <Heart className="w-10 h-10" />
              </div>
              <h3 className="font-heading font-bold uppercase tracking-widest text-sm mb-4 italic">Ethical Sourcing</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Fair trade ingredients and strictly zero animal testing. Ever.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 px-4 bg-hh-light">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1">
              <img src="https://picsum.photos/seed/founders/600/800" className="rounded-[3rem] shadow-2xl" alt="Founders" />
            </div>
            <div className="flex-1">
              <h2 className="font-heading text-4xl font-black italic uppercase mb-6 leading-tight">
                SCIENCE MEETS <span className="text-hh-green">NATURE</span>
              </h2>
              <div className="space-y-6 text-gray-600">
                <p>Hello Healthy started in a small lab with one goal: to optimize human performance without the toxicity of traditional supplements.</p>
                <p>Today, we lead the charge in plant-based science, creating products that help athletes break barriers while supporting their long-term wellness.</p>
                <p>From our Adaptogens to our Bio-available Proteins, every ingredient is chosen for its synergy and efficacy. We are more than a supplement company—we are a transformation movement.</p>
              </div>
              <div className="mt-10 p-6 bg-white rounded-3xl border-2 border-hh-green/10 italic font-medium text-hh-green">
                "Our promise: Transparency in every scoop. Performance in every gram."
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
