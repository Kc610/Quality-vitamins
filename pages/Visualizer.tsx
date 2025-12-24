
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Sparkles, Download, Wand2, AlertCircle, Video, Image as ImageIcon, Maximize, Loader2, X, Info } from 'lucide-react';

type Mode = 'IMAGE' | 'VIDEO';
type AspectRatio = '1:1' | '3:4' | '4:3' | '9:16' | '16:9';
type Quality = '1K' | '2K' | '4K';

const Visualizer: React.FC = () => {
  const [mode, setMode] = useState<Mode>('IMAGE');
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [quality, setQuality] = useState<Quality>('1K');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const imageRatios: AspectRatio[] = ['1:1', '3:4', '4:3', '9:16', '16:9'];
  const videoRatios: AspectRatio[] = ['9:16', '16:9'];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    try {
      if (!(await (window as any).aistudio.hasSelectedApiKey())) {
        await (window as any).aistudio.openSelectKey();
      }

      setIsGenerating(true);
      setError(null);
      setGeneratedContent(null);

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      if (mode === 'IMAGE') {
        const response = await ai.models.generateContent({
          model: 'gemini-3-pro-image-preview',
          contents: {
            parts: [{ text: `High-end professional product photography for Hello Healthy supplement line: ${prompt}. Photorealistic, premium aesthetic, 8k resolution, cinematic lighting, sharp focus.` }],
          },
          config: {
            imageConfig: {
              aspectRatio: aspectRatio,
              imageSize: quality
            }
          },
        });

        // FIXED: Robustly search through all response parts for pixel data
        let pixelData = null;
        if (response.candidates?.[0]?.content?.parts) {
          for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
              pixelData = `data:image/png;base64,${part.inlineData.data}`;
              break;
            }
          }
        }

        if (pixelData) {
          setGeneratedContent(pixelData);
        } else {
          throw new Error("No pixel data synthesized. This usually happens if production credits are missing or safety filters were triggered.");
        }
      } else {
        // Veo 3.1 Video
        let operation = await ai.models.generateVideos({
          model: 'veo-3.1-fast-generate-preview',
          prompt: `Cinematic high-performance 4k brand commercial for Hello Healthy: ${prompt}. Professional slow motion, cinematic lighting.`,
          config: {
            numberOfVideos: 1,
            resolution: quality === '4K' ? '1080p' : '720p',
            aspectRatio: aspectRatio === '9:16' || aspectRatio === '16:9' ? aspectRatio : '16:9'
          }
        });

        while (!operation.done) {
          await new Promise(resolve => setTimeout(resolve, 10000));
          operation = await ai.operations.getVideosOperation({ operation: operation });
        }

        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (!downloadLink) throw new Error("Video synthesis timeout.");
        
        const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        if (!response.ok) throw new Error("Resource link expired.");
        const blob = await response.blob();
        setGeneratedContent(URL.createObjectURL(blob));
      }

    } catch (err: any) {
      console.error("Studio Error:", err);
      const errMsg = typeof err === 'string' ? err : (err.message || '');
      const isQuotaError = errMsg.includes("RESOURCE_EXHAUSTED") || errMsg.includes("limit: 0") || errMsg.includes("quota exceeded");

      if (isQuotaError) {
        setError("Your Google Cloud project lacks production credits for Gemini 3 Studio. Please link a Paid project.");
        await (window as any).aistudio.openSelectKey();
      } else {
        setError("Neural link severed. Purity check or connection timeout. Please retry.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const currentRatios = mode === 'IMAGE' ? imageRatios : videoRatios;

  return (
    <div className="animate-in fade-in duration-700 min-h-screen bg-hh-light pt-8 md:pt-24 pb-24">
      <section className="px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10 md:mb-20">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-hh-dark text-white rounded-full font-black text-[10px] md:text-[11px] uppercase tracking-[0.5em] mb-8 shadow-2xl border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-hh-green fill-current" />
              Neural Asset Production
            </div>
            <h1 className="font-heading text-5xl md:text-[7rem] font-black italic uppercase mb-2 md:mb-6 tracking-tighter leading-[0.85]">
              VISUAL <span className="text-hh-green">LAB</span>
            </h1>
            <p className="text-gray-400 text-[10px] md:text-xs max-w-xl mx-auto font-black uppercase tracking-[0.3em] leading-relaxed">
              Synthesize Brand Photography & Motion in Real-Time.
              <span className="block mt-3 text-hh-orange">Paid Tier AI Credentials Mandatory</span>
            </p>
          </div>

          <div className="bg-white rounded-[3rem] md:rounded-[5rem] shadow-[0_100px_200px_-50px_rgba(0,0,0,0.15)] overflow-hidden border border-gray-100 flex flex-col lg:flex-row min-h-[600px] md:min-h-[850px]">
            {/* Sidebar Controls */}
            <div className="p-10 md:p-14 lg:w-[450px] border-b lg:border-b-0 lg:border-r border-gray-50 space-y-12">
              <div className="bg-hh-light p-2 rounded-[2rem] flex gap-3">
                <button 
                  onClick={() => { setMode('IMAGE'); setGeneratedContent(null); setAspectRatio('1:1'); }}
                  className={`flex-1 flex items-center justify-center gap-3 py-5 rounded-[1.5rem] font-black text-[11px] tracking-widest transition-all ${mode === 'IMAGE' ? 'bg-white shadow-xl text-hh-green' : 'text-gray-400 hover:text-hh-dark'}`}
                >
                  <ImageIcon className="w-4 h-4" /> STILL
                </button>
                <button 
                  onClick={() => { setMode('VIDEO'); setGeneratedContent(null); setAspectRatio('16:9'); }}
                  className={`flex-1 flex items-center justify-center gap-3 py-5 rounded-[1.5rem] font-black text-[11px] tracking-widest transition-all ${mode === 'VIDEO' ? 'bg-hh-dark text-white shadow-xl' : 'text-gray-400 hover:text-hh-dark'}`}
                >
                  <Video className="w-4 h-4" /> MOTION
                </button>
              </div>

              <div className="space-y-5">
                <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 flex items-center gap-3">
                  <Wand2 className="w-4 h-4" /> PRODUCTION DIRECTIVE
                </label>
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={mode === 'IMAGE' ? "Elite athlete training in a futuristic glass gym..." : "Macrophotography of protein powder mixing in water with blue backlighting..."}
                  className="w-full bg-hh-light border-none rounded-[2rem] px-8 py-8 focus:ring-2 focus:ring-hh-green/20 transition-all h-40 md:h-56 text-base font-bold placeholder:text-gray-300 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Aspect</label>
                  <select 
                    value={aspectRatio} 
                    onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                    className="w-full bg-hh-light rounded-2xl py-4 px-5 text-sm font-black border-none cursor-pointer"
                  >
                    {currentRatios.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Mastering</label>
                  <select 
                    value={quality} 
                    onChange={(e) => setQuality(e.target.value as Quality)}
                    className="w-full bg-hh-light rounded-2xl py-4 px-5 text-sm font-black border-none cursor-pointer"
                  >
                    <option value="1K">1080p Standard</option>
                    <option value="2K">2K Professional</option>
                    <option value="4K">4K Cinematic</option>
                  </select>
                </div>
              </div>

              <button 
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className={`w-full py-7 rounded-[2rem] font-heading font-black text-sm text-white transition-all shadow-2xl flex items-center justify-center gap-5 active:scale-95 disabled:opacity-50 tracking-[0.3em] ${mode === 'IMAGE' ? 'bg-hh-green shadow-hh-green/40' : 'bg-hh-dark shadow-black/40'}`}
              >
                {isGenerating ? (
                  <><Loader2 className="w-6 h-6 animate-spin" /> MAPPING PIXELS...</>
                ) : (
                  <>START SYNTHESIS <Sparkles className="w-6 h-6" /></>
                )}
              </button>
              
              <div className="flex items-center gap-4 justify-center text-[10px] text-gray-300 font-black uppercase tracking-[0.3em]">
                 <Info className="w-4 h-4" /> Lab Encrypted Output
              </div>
            </div>

            {/* Preview Viewport */}
            <div className="flex-grow p-8 md:p-20 bg-[#FBFBFB] flex flex-col items-center justify-center relative min-h-[500px] md:min-h-[700px]">
               {isGenerating ? (
                 <div className="text-center space-y-12">
                    <div className="relative w-40 h-40 mx-auto">
                      <div className="absolute inset-0 border-[8px] border-hh-green/10 border-t-hh-green rounded-full animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles className="w-16 h-16 text-hh-green animate-pulse" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="font-heading font-black uppercase text-3xl text-hh-dark italic tracking-tighter leading-none">Synthesizing Biology</h3>
                      <p className="text-[11px] text-gray-400 font-black uppercase tracking-[0.5em] max-w-[320px] mx-auto leading-loose">
                        Processing frame sequences through the neural production engine.
                      </p>
                    </div>
                 </div>
               ) : generatedContent ? (
                 <div className="w-full max-w-4xl space-y-10 animate-in zoom-in-95 duration-1000">
                    <div className="relative bg-white p-6 md:p-8 rounded-[4rem] shadow-[0_100px_200px_-40px_rgba(0,0,0,0.25)] border border-gray-100 overflow-hidden group">
                       {mode === 'IMAGE' ? (
                         <img src={generatedContent} alt="Synthesis Output" className="w-full h-auto rounded-[3rem] object-contain max-h-[70vh] mx-auto shadow-sm" />
                       ) : (
                         <video src={generatedContent} controls autoPlay loop className="w-full h-auto rounded-[3rem] max-h-[70vh] mx-auto shadow-inner" />
                       )}
                       
                       <div className="absolute inset-0 bg-hh-dark/70 opacity-0 group-hover:opacity-100 transition-all duration-700 flex items-center justify-center gap-8">
                          <a 
                            href={generatedContent} 
                            download={`hello-healthy-lab-${Date.now()}.png`}
                            className="p-8 bg-white text-hh-dark rounded-[2.5rem] shadow-2xl hover:bg-hh-green hover:text-white transition-all transform hover:scale-110 active:scale-90"
                          >
                            <Download className="w-10 h-10" />
                          </a>
                       </div>
                    </div>
                    <div className="flex justify-center">
                      <button onClick={() => setGeneratedContent(null)} className="flex items-center gap-3 text-[11px] font-black uppercase text-gray-400 hover:text-hh-orange tracking-[0.4em] transition-colors bg-white px-8 py-3 rounded-full shadow-md border border-gray-50">
                        <X className="w-4 h-4" /> DISCARD & START NEW STACK
                      </button>
                    </div>
                 </div>
               ) : error ? (
                 <div className="text-center space-y-8 p-14 md:p-20 bg-red-50 rounded-[5rem] border border-red-100 max-w-xl animate-in shake duration-500 shadow-2xl">
                    <AlertCircle className="w-20 h-20 text-red-400 mx-auto" />
                    <div className="space-y-3">
                      <div className="text-[11px] font-black uppercase tracking-[0.4em] text-red-500">Neural Link Severed</div>
                      <p className="text-base text-red-400 font-bold leading-relaxed italic">{error}</p>
                    </div>
                    <button 
                      onClick={() => (window as any).aistudio.openSelectKey()} 
                      className="w-full py-6 bg-red-500 text-white rounded-[2rem] font-black uppercase text-[11px] tracking-[0.4em] hover:bg-red-600 transition-all shadow-2xl shadow-red-500/30"
                    >
                      Verify Paid Credentials
                    </button>
                 </div>
               ) : (
                 <div className="text-center opacity-30 select-none group">
                    <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-10 group-hover:scale-110 transition-transform duration-1000 group-hover:bg-hh-green/10">
                      <ImageIcon className="w-16 h-16 text-gray-300 group-hover:text-hh-green transition-colors" />
                    </div>
                    <p className="text-[14px] text-gray-400 font-black uppercase tracking-[0.6em]">Standby for Directive</p>
                 </div>
               )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Visualizer;
