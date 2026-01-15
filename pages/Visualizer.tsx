
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
// Added missing icon imports: Lock and Activity to resolve name collision with global types and fix JSX errors
import { Sparkles, Download, Wand2, AlertCircle, Video, Image as ImageIcon, Maximize, Loader2, X, Info, ShieldCheck, Lock, Activity } from 'lucide-react';

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
            parts: [{ text: `Elite pharmaceutical product photography for Hello Healthy: ${prompt}. Photorealistic, premium aesthetic, volumetric lighting, hyper-detailed textures, 8k resolution.` }],
          },
          config: {
            imageConfig: {
              aspectRatio: aspectRatio,
              imageSize: quality
            }
          },
        });

        const part = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
        if (part?.inlineData) {
          setGeneratedContent(`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`);
        } else {
          throw new Error("Purity check failed. Neural link returned no visual data.");
        }
      } else {
        // Veo 3.1 Video
        let operation = await ai.models.generateVideos({
          model: 'veo-3.1-fast-generate-preview',
          prompt: `Cinematic high-performance athlete commercial for Hello Healthy: ${prompt}. Slow motion, professional lighting, 4k high dynamic range.`,
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
        if (!downloadLink) throw new Error("Video synthesis timed out or failed safety checks.");
        
        const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        if (!response.ok) throw new Error("Synthesis resource link expired.");
        const blob = await response.blob();
        setGeneratedContent(URL.createObjectURL(blob));
      }

    } catch (err: any) {
      console.error("Studio Error:", err);
      const errMsg = err.message || '';
      if (errMsg.includes("RESOURCE_EXHAUSTED") || errMsg.includes("limit: 0")) {
        setError("Production credits exhausted. Switch to a Paid Google Cloud project to resume synthesis.");
        await (window as any).aistudio.openSelectKey();
      } else {
        setError("Neural link severed. Purity check or connection timeout. Ensure prompt follows safety guidelines.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const currentRatios = mode === 'IMAGE' ? imageRatios : videoRatios;

  return (
    <div className="animate-in fade-in duration-700 min-h-screen bg-hh-light pt-12 md:pt-24 pb-24">
      <section className="px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 md:mb-24">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-hh-dark text-white rounded-full font-black text-[10px] md:text-[11px] uppercase tracking-[0.5em] mb-10 shadow-4xl border border-white/10">
              <Sparkles className="w-4 h-4 text-hh-green fill-current" />
              NEURAL ASSET STUDIO
            </div>
            <h1 className="font-heading text-6xl md:text-[8rem] font-black italic uppercase mb-4 tracking-tighter leading-[0.8]">
              BIO <span className="text-hh-green">VISUALS</span>
            </h1>
            <p className="text-gray-400 text-[10px] md:text-xs max-w-xl mx-auto font-black uppercase tracking-[0.4em] leading-relaxed italic">
              Deploy high-fidelity brand imagery and cinematic motion through the Hello Healthy neural engine.
              <span className="block mt-4 text-hh-orange font-black opacity-80">Paid Production Credentials Required</span>
            </p>
          </div>

          <div className="bg-white rounded-[4rem] md:rounded-[6rem] shadow-[0_120px_240px_-60px_rgba(0,0,0,0.2)] overflow-hidden border border-gray-100 flex flex-col lg:flex-row min-h-[700px] md:min-h-[900px]">
            {/* Sidebar Controls */}
            <div className="p-10 md:p-16 lg:w-[480px] border-b lg:border-b-0 lg:border-r border-gray-100 space-y-12 bg-[#fafafa]">
              <div className="bg-gray-200/50 p-2.5 rounded-[2.5rem] flex gap-3 shadow-inner">
                <button 
                  onClick={() => { setMode('IMAGE'); setGeneratedContent(null); setAspectRatio('1:1'); }}
                  className={`flex-1 flex items-center justify-center gap-3 py-6 rounded-[2rem] font-black text-[11px] tracking-widest transition-all ${mode === 'IMAGE' ? 'bg-white shadow-xl text-hh-green border border-hh-green/10' : 'text-gray-400 hover:text-hh-dark'}`}
                >
                  <ImageIcon className="w-4 h-4" /> STILLS
                </button>
                <button 
                  onClick={() => { setMode('VIDEO'); setGeneratedContent(null); setAspectRatio('16:9'); }}
                  className={`flex-1 flex items-center justify-center gap-3 py-6 rounded-[2rem] font-black text-[11px] tracking-widest transition-all ${mode === 'VIDEO' ? 'bg-hh-dark text-white shadow-xl' : 'text-gray-400 hover:text-hh-dark'}`}
                >
                  <Video className="w-4 h-4" /> MOTION
                </button>
              </div>

              <div className="space-y-6">
                <label className="block text-[10px] font-black uppercase tracking-[0.5em] text-gray-400 flex items-center gap-4">
                  <ShieldCheck className="w-5 h-5 text-hh-green" /> PRODUCTION DIRECTIVE
                </label>
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={mode === 'IMAGE' ? "Cinematic product shot of protein isolate with frozen water splashes, futuristic gym background..." : "High speed macro shot of a performance capsule dissolving in a blue vortex..."}
                  className="w-full bg-white border border-gray-100 rounded-[2.5rem] px-10 py-10 focus:ring-4 focus:ring-hh-green/10 transition-all h-48 md:h-64 text-base font-bold placeholder:text-gray-300 resize-none shadow-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Aspect Ratio</label>
                  <select 
                    value={aspectRatio} 
                    onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                    className="w-full bg-white rounded-3xl py-5 px-6 text-xs font-black border border-gray-100 cursor-pointer shadow-sm hover:border-hh-green transition-all appearance-none"
                  >
                    {currentRatios.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Mastering</label>
                  <select 
                    value={quality} 
                    onChange={(e) => setQuality(e.target.value as Quality)}
                    className="w-full bg-white rounded-3xl py-5 px-6 text-xs font-black border border-gray-100 cursor-pointer shadow-sm hover:border-hh-green transition-all appearance-none"
                  >
                    <option value="1K">1K RAW</option>
                    <option value="2K">2K PRO</option>
                    <option value="4K">4K CINEMA</option>
                  </select>
                </div>
              </div>

              <button 
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className={`w-full py-8 rounded-[2.5rem] font-heading font-black text-sm text-white transition-all shadow-4xl flex items-center justify-center gap-6 active:scale-95 disabled:opacity-50 tracking-[0.4em] ${mode === 'IMAGE' ? 'bg-hh-green hover:bg-white hover:text-hh-dark shadow-hh-green/40' : 'bg-hh-dark hover:bg-hh-green shadow-black/40'}`}
              >
                {isGenerating ? (
                  <><Loader2 className="w-7 h-7 animate-spin" /> SYNTHESIZING...</>
                ) : (
                  <>DEPLOY PRODUCTION <Wand2 className="w-7 h-7" /></>
                )}
              </button>
              
              <div className="flex items-center gap-4 justify-center text-[9px] text-gray-400 font-black uppercase tracking-[0.4em]">
                 <Lock className="w-4 h-4" /> Lab-Secured Output Encryption
              </div>
            </div>

            {/* Preview Viewport */}
            <div className="flex-grow p-10 md:p-24 bg-[#fcfcfc] flex flex-col items-center justify-center relative min-h-[600px] md:min-h-[800px]">
               {isGenerating ? (
                 <div className="text-center space-y-16 animate-in fade-in duration-1000">
                    <div className="relative w-48 h-48 mx-auto">
                      <div className="absolute inset-0 border-[12px] border-hh-green/10 border-t-hh-green rounded-full animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Activity className="w-20 h-20 text-hh-green animate-pulse" />
                      </div>
                    </div>
                    <div className="space-y-6">
                      <h3 className="font-heading font-black uppercase text-4xl text-hh-dark italic tracking-tighter leading-none">Mapping Biological Pixels</h3>
                      <p className="text-[12px] text-gray-400 font-black uppercase tracking-[0.6em] max-w-sm mx-auto leading-loose italic">
                        The neural engine is synthesizing your directive into high-fidelity visual stacks.
                      </p>
                    </div>
                 </div>
               ) : generatedContent ? (
                 <div className="w-full max-w-5xl space-y-12 animate-in zoom-in-95 duration-1000">
                    <div className="relative bg-white p-8 md:p-12 rounded-[5rem] shadow-[0_100px_200px_-50px_rgba(0,0,0,0.3)] border border-gray-100 overflow-hidden group">
                       {mode === 'IMAGE' ? (
                         <img src={generatedContent} alt="Synthesis Output" className="w-full h-auto rounded-[3.5rem] object-contain max-h-[75vh] mx-auto shadow-sm" />
                       ) : (
                         <video src={generatedContent} controls autoPlay loop className="w-full h-auto rounded-[3.5rem] max-h-[75vh] mx-auto shadow-inner" />
                       )}
                       
                       <div className="absolute inset-0 bg-hh-dark/80 opacity-0 group-hover:opacity-100 transition-all duration-700 flex items-center justify-center gap-10">
                          <a 
                            href={generatedContent} 
                            download={`hh-lab-export-${Date.now()}.png`}
                            className="p-10 bg-white text-hh-dark rounded-[3rem] shadow-4xl hover:bg-hh-green hover:text-white transition-all transform hover:scale-110 active:scale-90"
                          >
                            <Download className="w-12 h-12" />
                          </a>
                       </div>
                    </div>
                    <div className="flex justify-center">
                      <button onClick={() => setGeneratedContent(null)} className="flex items-center gap-4 text-[11px] font-black uppercase text-gray-400 hover:text-hh-orange tracking-[0.5em] transition-all bg-white px-10 py-5 rounded-full shadow-xl border border-gray-50 hover:-translate-y-1 active:scale-95">
                        <X className="w-5 h-5" /> RE-INITIALIZE PRODUCTION STACK
                      </button>
                    </div>
                 </div>
               ) : error ? (
                 <div className="text-center space-y-10 p-16 md:p-24 bg-red-600/5 rounded-[5rem] border border-red-600/20 max-w-2xl animate-in shake duration-500 shadow-4xl">
                    <AlertCircle className="w-24 h-24 text-red-500 mx-auto" />
                    <div className="space-y-4">
                      <div className="text-[12px] font-black uppercase tracking-[0.5em] text-red-500 italic">Neural Protocol Error</div>
                      <p className="text-lg text-red-600/80 font-bold leading-relaxed italic">{error}</p>
                    </div>
                    <button 
                      onClick={() => (window as any).aistudio.openSelectKey()} 
                      className="w-full py-8 bg-red-600 text-white rounded-[2.5rem] font-black uppercase text-[12px] tracking-[0.5em] hover:bg-red-700 transition-all shadow-4xl shadow-red-600/30 active:scale-95"
                    >
                      Verify Project Tier & Billing
                    </button>
                 </div>
               ) : (
                 <div className="text-center opacity-30 select-none group">
                    <div className="w-40 h-40 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-12 group-hover:scale-110 transition-transform duration-1000 group-hover:bg-hh-green/10">
                      <Wand2 className="w-20 h-20 text-gray-300 group-hover:text-hh-green transition-colors" />
                    </div>
                    <p className="text-[16px] text-gray-400 font-black uppercase tracking-[0.8em] italic">Deploy Command Node</p>
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
