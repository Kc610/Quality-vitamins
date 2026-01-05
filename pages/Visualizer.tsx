
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
// Added Zap to the imports from lucide-react
import { Sparkles, Download, Wand2, AlertCircle, Video, Image as ImageIcon, Maximize, Loader2, X, Info, Layers, Terminal, Zap } from 'lucide-react';

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
  const [history, setHistory] = useState<{url: string, mode: Mode}[]>([]);

  const imageRatios: AspectRatio[] = ['1:1', '3:4', '4:3', '9:16', '16:9'];
  const videoRatios: AspectRatio[] = ['9:16', '16:9'];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    try {
      if (!(await (window as any).aistudio.hasSelectedApiKey())) {
        await (window as any).aistudio.openSelectKey();
        // Proceeding after triggering openSelectKey per instructions
      }

      setIsGenerating(true);
      setError(null);

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      if (mode === 'IMAGE') {
        const response = await ai.models.generateContent({
          model: 'gemini-3-pro-image-preview',
          contents: {
            parts: [{ text: `High-end professional product photography for Hello Healthy: ${prompt}. Photorealistic, premium aesthetic, cinematic lighting, ultra-sharp focus.` }],
          },
          config: {
            imageConfig: {
              aspectRatio: aspectRatio,
              imageSize: quality
            }
          },
        });

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
          // Fix: Explicitly cast mode to 'IMAGE' as Mode to satisfy TypeScript inference for the state update
          setHistory(prev => [{url: pixelData!, mode: 'IMAGE' as Mode}, ...prev].slice(0, 5));
        } else {
          throw new Error("Purity check failed. No visual output synthesized.");
        }
      } else {
        // Veo 3.1 Video
        let operation = await ai.models.generateVideos({
          model: 'veo-3.1-fast-generate-preview',
          prompt: `Cinematic high-performance 4k brand motion for Hello Healthy: ${prompt}. Professional slow motion.`,
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
        if (!downloadLink) throw new Error("Video synthesis timed out.");
        
        const videoRes = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        const blob = await videoRes.blob();
        const videoUrl = URL.createObjectURL(blob);
        setGeneratedContent(videoUrl);
        // Fix: Explicitly cast mode to 'VIDEO' as Mode to satisfy TypeScript inference for the state update
        setHistory(prev => [{url: videoUrl, mode: 'VIDEO' as Mode}, ...prev].slice(0, 5));
      }

    } catch (err: any) {
      console.error("Studio Error:", err);
      const errMsg = err.message || '';
      if (errMsg.includes("Requested entity was not found") || errMsg.includes("quota")) {
        setError("Your project lacks production credits. Link a Paid Billing Project.");
        await (window as any).aistudio.openSelectKey();
      } else {
        setError("Neural link severed. Purity check or connection timeout.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-hh-light pt-32 pb-24 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
        {/* Terminal Controls */}
        <aside className="lg:w-[450px] space-y-8 animate-in slide-in-from-left duration-700">
          <div className="bg-hh-dark rounded-[3rem] p-10 shadow-4xl border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-20"><Terminal className="w-12 h-12 text-hh-green" /></div>
            
            <div className="mb-10">
              <h2 className="font-heading font-black text-white text-3xl italic uppercase tracking-tighter mb-2">Visual <span className="text-hh-green">Lab</span></h2>
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.4em]">Neural Asset Production V3.1</p>
            </div>

            <div className="bg-white/5 p-2 rounded-[2rem] flex gap-2 mb-10 border border-white/5">
              <button 
                onClick={() => setMode('IMAGE')}
                className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[1.5rem] font-black text-[10px] tracking-widest transition-all ${mode === 'IMAGE' ? 'bg-hh-green text-hh-dark' : 'text-gray-500 hover:text-white'}`}
              >
                <ImageIcon className="w-4 h-4" /> STILL
              </button>
              <button 
                onClick={() => setMode('VIDEO')}
                className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[1.5rem] font-black text-[10px] tracking-widest transition-all ${mode === 'VIDEO' ? 'bg-hh-green text-hh-dark' : 'text-gray-500 hover:text-white'}`}
              >
                <Video className="w-4 h-4" /> MOTION
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[9px] font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
                  <Wand2 className="w-3 h-3 text-hh-green" /> Production Directive
                </label>
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your elite performance visual..."
                  className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-6 text-white text-sm focus:ring-2 focus:ring-hh-green/40 h-32 resize-none placeholder:text-gray-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Aspect Ratio</label>
                  <select 
                    value={aspectRatio} 
                    onChange={(e) => setAspectRatio(e.target.value as any)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-xs text-white"
                  >
                    {(mode === 'IMAGE' ? imageRatios : videoRatios).map(r => <option key={r} value={r} className="bg-hh-dark">{r}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-500">Mastering</label>
                  <select 
                    value={quality} 
                    onChange={(e) => setQuality(e.target.value as any)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-xs text-white"
                  >
                    <option value="1K" className="bg-hh-dark">1K Standard</option>
                    <option value="2K" className="bg-hh-dark">2K Pro</option>
                    <option value="4K" className="bg-hh-dark">4K Ultra</option>
                  </select>
                </div>
              </div>

              <button 
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className={`w-full py-6 rounded-3xl font-heading font-black text-sm text-hh-dark transition-all shadow-2xl flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50 tracking-[0.2em] bg-hh-green hover:bg-white`}
              >
                {/* Fixed the missing Zap reference by adding it to imports above */}
                {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Zap className="w-5 h-5 fill-current" /> SYNTHESIZE</>}
              </button>
            </div>
          </div>

          {history.length > 0 && (
            <div className="bg-white rounded-[3rem] p-8 shadow-xl border border-gray-100">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6 flex items-center gap-2">
                <Layers className="w-4 h-4" /> Lab History
              </h4>
              <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                {history.map((item, i) => (
                  <button 
                    key={i} 
                    onClick={() => setGeneratedContent(item.url)}
                    className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 border-2 border-transparent hover:border-hh-green transition-all"
                  >
                    {item.mode === 'IMAGE' ? <img src={item.url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-hh-dark"><Video className="w-4 h-4 text-white" /></div>}
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Viewport */}
        <main className="flex-grow min-h-[600px] bg-white rounded-[4rem] shadow-4xl border border-gray-100 flex flex-col relative overflow-hidden animate-in fade-in zoom-in-95 duration-700">
          <div className="absolute top-0 left-0 w-full p-8 flex justify-between items-center z-10">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="text-[9px] font-black uppercase tracking-[0.5em] text-gray-300">Lab-Render Output // {mode}</div>
          </div>

          <div className="flex-grow flex flex-col items-center justify-center p-12">
            {isGenerating ? (
              <div className="text-center space-y-10">
                <div className="relative w-48 h-48 mx-auto">
                  <div className="absolute inset-0 border-[12px] border-hh-green/10 border-t-hh-green rounded-full animate-spin"></div>
                  <Sparkles className="absolute inset-0 m-auto w-16 h-16 text-hh-green animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-heading font-black text-2xl uppercase italic tracking-tighter">Synthesizing Physics</h3>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.4em]">Mapping light transport equations...</p>
                </div>
              </div>
            ) : generatedContent ? (
              <div className="w-full h-full flex flex-col items-center justify-center space-y-8">
                <div className="relative group max-w-full">
                  {mode === 'IMAGE' ? (
                    <img src={generatedContent} className="max-w-full max-h-[60vh] rounded-3xl shadow-2xl border-4 border-gray-50 object-contain" />
                  ) : (
                    <video src={generatedContent} controls autoPlay loop className="max-w-full max-h-[60vh] rounded-3xl shadow-2xl border-4 border-gray-50" />
                  )}
                  <div className="absolute inset-0 bg-hh-dark/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center rounded-3xl gap-4">
                    <a href={generatedContent} download className="p-6 bg-white rounded-full text-hh-dark shadow-2xl hover:bg-hh-green transition-all transform hover:scale-110">
                      <Download className="w-8 h-8" />
                    </a>
                  </div>
                </div>
                <button 
                  onClick={() => setGeneratedContent(null)}
                  className="px-10 py-4 bg-gray-50 text-gray-400 font-black uppercase text-[10px] tracking-widest rounded-full hover:bg-red-50 hover:text-red-500 transition-all"
                >
                  Discard Result
                </button>
              </div>
            ) : error ? (
              <div className="text-center p-12 max-w-md bg-red-50 rounded-[3rem] border border-red-100 space-y-8 animate-in shake">
                <AlertCircle className="w-20 h-20 text-red-500 mx-auto" />
                <div className="space-y-4">
                  <h4 className="font-heading font-black text-xl uppercase italic tracking-tighter text-red-600">Calibration Error</h4>
                  <p className="text-sm text-red-400 font-bold italic">{error}</p>
                </div>
                <button onClick={() => (window as any).aistudio.openSelectKey()} className="w-full py-5 bg-red-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl">Update Key Credentials</button>
              </div>
            ) : (
              <div className="text-center space-y-8 opacity-20 grayscale">
                <Wand2 className="w-32 h-32 mx-auto" />
                <p className="text-xl font-heading font-black uppercase italic tracking-[0.4em]">Standby for Production</p>
              </div>
            )}
          </div>
          
          <div className="p-8 border-t border-gray-50 flex items-center justify-between text-gray-300">
             <div className="flex items-center gap-4">
               <Info className="w-4 h-4" />
               <span className="text-[8px] font-black uppercase tracking-widest">Purity Grade: 99.9% // Biological Performance Optimized</span>
             </div>
             <div className="font-black text-[8px] uppercase tracking-widest">© Hello Healthy Lab // 2025</div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Visualizer;
