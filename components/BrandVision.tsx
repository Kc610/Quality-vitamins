
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Video, Sparkles, Play, Loader2, ShieldCheck, Zap, Download, Maximize, Smartphone } from 'lucide-react';

const BrandVision: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState('');

  const generateVision = async () => {
    if (!prompt.trim()) return;
    
    try {
      if (!(await (window as any).aistudio.hasSelectedApiKey())) {
        await (window as any).aistudio.openSelectKey();
      }

      setIsGenerating(true);
      setVideoUrl(null);
      setStatus('Initializing Neural Engine...');

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      setStatus('Synthesizing Biological Frames...');
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: `Elite cinematic brand vision for Hello Healthy. Subject: ${prompt}. High-octane performance, professional lighting, slow motion, motivational aesthetic, 4k detail.`,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: aspectRatio
        }
      });

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        setStatus('Optimizing Light Transport...');
        operation = await ai.operations.getVideosOperation({operation: operation});
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        setStatus('Downloading Asset...');
        const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        const blob = await response.blob();
        setVideoUrl(URL.createObjectURL(blob));
      }
    } catch (err) {
      console.error("Vision Error:", err);
      setStatus('Neural Link Severed. Retry.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section className="py-24 sm:py-48 bg-hh-dark relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-hh-green to-transparent opacity-30"></div>
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="space-y-8 lg:space-y-12 text-center lg:text-left">
            <div className="inline-flex items-center gap-3 sm:gap-4 px-5 sm:px-6 py-2 bg-hh-orange/10 border border-hh-orange/20 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-hh-orange mx-auto lg:mx-0">
              <Sparkles className="w-4 h-4 sm:w-5 h-5" /> GENERATIVE PERFORMANCE VISION
            </div>
            
            <h2 className="font-heading text-6xl sm:text-7xl lg:text-9xl font-black italic uppercase tracking-tighter leading-[0.9] lg:leading-[0.8] text-white">
              SIGHT <br />
              <span className="text-hh-green">BEYOND</span>
            </h2>
            
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-400 font-medium italic leading-relaxed border-l-4 sm:border-l-8 border-hh-green pl-6 sm:pl-10 text-left">
              Describe your objective. Our neural core will synthesize a custom cinematic manifest of your biological dominance.
            </p>

            <div className="space-y-6 lg:space-y-8">
              <div className="flex gap-3 sm:gap-4">
                <button 
                  onClick={() => setAspectRatio('16:9')}
                  className={`flex-1 flex items-center justify-center gap-2 sm:gap-3 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-black text-[8px] sm:text-[10px] uppercase tracking-widest transition-all border ${aspectRatio === '16:9' ? 'bg-hh-green text-hh-dark border-hh-green' : 'text-gray-500 border-white/10 hover:border-hh-green'}`}
                >
                  <Maximize className="w-3 h-3 sm:w-4 h-4" /> CINEMATIC (16:9)
                </button>
                <button 
                  onClick={() => setAspectRatio('9:16')}
                  className={`flex-1 flex items-center justify-center gap-2 sm:gap-3 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-black text-[8px] sm:text-[10px] uppercase tracking-widest transition-all border ${aspectRatio === '9:16' ? 'bg-hh-green text-hh-dark border-hh-green' : 'text-gray-500 border-white/10 hover:border-hh-green'}`}
                >
                  <Smartphone className="w-3 h-3 sm:w-4 h-4" /> MOBILE (9:16)
                </button>
              </div>

              <div className="relative group">
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., Shattering the sound barrier through biological focus..."
                  className="w-full bg-white/5 border-2 border-white/10 rounded-[2rem] sm:rounded-[2.5rem] px-6 sm:px-10 py-6 sm:py-10 text-white text-base sm:text-xl focus:outline-none focus:border-hh-green transition-all placeholder:text-gray-700 min-h-[140px] sm:min-h-[180px] resize-none"
                />
                <button 
                  onClick={generateVision}
                  disabled={isGenerating || !prompt.trim()}
                  className="absolute right-4 bottom-4 sm:right-6 sm:bottom-6 px-6 sm:px-12 py-3 sm:py-5 bg-hh-green text-hh-dark font-heading font-black text-[10px] sm:text-sm uppercase tracking-widest rounded-2xl sm:rounded-3xl hover:bg-white transition-all disabled:opacity-50 flex items-center gap-3 sm:gap-4 shadow-2xl active:scale-95"
                >
                  {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Video className="w-5 h-5" />}
                  {isGenerating ? 'SYNTHESIZING' : 'GENERATE'}
                </button>
              </div>
            </div>
          </div>

          <div className="relative lg:mt-0 mt-12">
            <div className={`bg-white/5 rounded-[3rem] sm:rounded-[4rem] border-2 border-white/10 overflow-hidden shadow-4xl group relative flex items-center justify-center transition-all duration-700 ${aspectRatio === '16:9' ? 'aspect-video w-full' : 'aspect-[9/16] h-[500px] sm:h-[700px] mx-auto'}`}>
              {isGenerating ? (
                <div className="text-center space-y-6 sm:space-y-8 p-8 sm:p-12">
                  <div className="w-20 h-20 sm:w-32 h-32 border-t-8 border-hh-green rounded-full animate-spin mx-auto shadow-[0_0_40px_rgba(76,175,80,0.5)]"></div>
                  <div className="space-y-2">
                    <p className="text-[10px] sm:text-sm font-black uppercase tracking-[0.4em] sm:tracking-[0.6em] text-hh-green animate-pulse">{status}</p>
                    <p className="text-[8px] text-gray-500 uppercase tracking-widest">Veo 3.1 Neural Compute Node</p>
                  </div>
                </div>
              ) : videoUrl ? (
                <>
                  <video src={videoUrl} controls autoPlay loop className="w-full h-full object-cover" />
                  <a href={videoUrl} download="PeakVision_HEH.mp4" className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 p-4 sm:p-8 bg-hh-green text-hh-dark rounded-full shadow-4xl hover:scale-110 transition-transform active:scale-95">
                    <Download className="w-6 h-6 sm:w-10 h-10" />
                  </a>
                </>
              ) : (
                <div className="text-center opacity-10 group-hover:opacity-30 transition-opacity duration-1000">
                  <Play className="w-24 h-24 sm:w-48 h-48 mx-auto mb-6 sm:mb-8 text-white" />
                  <p className="font-heading font-black uppercase italic tracking-[0.6em] sm:tracking-[0.8em] text-xl sm:text-3xl">STANDBY</p>
                </div>
              )}
            </div>
            
            {/* HUD Overlays */}
            <div className="absolute -top-8 -right-8 w-48 h-48 sm:w-64 sm:h-64 bg-hh-green/10 rounded-full blur-[80px] sm:blur-[100px] pointer-events-none"></div>
            <div className="absolute -bottom-8 -left-8 w-48 h-48 sm:w-64 sm:h-64 bg-hh-orange/5 rounded-full blur-[80px] sm:blur-[100px] pointer-events-none"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandVision;
