
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Sparkles, Download, Wand2, Info, Lock, AlertCircle, Video, Image as ImageIcon, Maximize, Play, Loader2 } from 'lucide-react';

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
        // Proceed as per race condition instructions
      }

      setIsGenerating(true);
      setError(null);
      setGeneratedContent(null);

      // Create a fresh instance to ensure the latest API key is used
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      if (mode === 'IMAGE') {
        const response = await ai.models.generateContent({
          model: 'gemini-3-pro-image-preview',
          contents: {
            parts: [{ text: `Professional e-commerce fitness brand photography for Hello Healthy Store: ${prompt}. Clean, cinematic, athletic lighting.` }],
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
          setGeneratedContent(`data:image/png;base64,${part.inlineData.data}`);
        } else {
          throw new Error("No image data returned from model.");
        }
      } else {
        // Veo 3 Video Generation
        let operation = await ai.models.generateVideos({
          model: 'veo-3.1-fast-generate-preview',
          prompt: `Cinematic 4k fitness commercial for Hello Healthy Store: ${prompt}. Slow motion, professional lighting.`,
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
        if (!downloadLink) throw new Error("Video generation failed to provide a download link.");
        
        const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        if (!response.ok) throw new Error("Failed to download generated video.");
        const blob = await response.blob();
        setGeneratedContent(URL.createObjectURL(blob));
      }

    } catch (err: any) {
      console.error(err);
      const isEntityError = err.message?.includes("Requested entity was not found");
      setError(isEntityError ? "A paid API key is required for this model. Please select a valid project." : "Generation failed. Please try again.");
      if (isEntityError) await (window as any).aistudio.openSelectKey();
    } finally {
      setIsGenerating(false);
    }
  };

  const currentRatios = mode === 'IMAGE' ? imageRatios : videoRatios;

  return (
    <div className="animate-in fade-in duration-700 min-h-screen bg-hh-light">
      <section className="pt-20 pb-32 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-hh-dark text-white rounded-full font-bold text-[10px] uppercase tracking-[0.3em] mb-6 shadow-xl">
              <Sparkles className="w-3 h-3 text-hh-green fill-current" />
              Hello Healthy Creative Studio
            </div>
            <h1 className="font-heading text-5xl md:text-7xl font-black italic uppercase mb-4 tracking-tighter leading-none">
              TRANSFORMATION <span className="text-hh-green">STUDIO</span>
            </h1>
            <p className="text-gray-500 max-w-xl mx-auto font-medium">
              Create professional fitness imagery or cinematic motion clips for your transformation journey.
              <span className="block mt-2 text-[10px] text-hh-orange uppercase tracking-widest font-black">Requires Paid API Project</span>
            </p>
          </div>

          <div className="bg-white rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden border border-gray-100 flex flex-col lg:flex-row min-h-[700px]">
            {/* Control Panel */}
            <div className="p-8 lg:p-12 lg:w-[400px] border-r border-gray-50 space-y-10">
              {/* Mode Toggle */}
              <div className="bg-hh-light p-1.5 rounded-2xl flex gap-2">
                <button 
                  onClick={() => { setMode('IMAGE'); setGeneratedContent(null); setAspectRatio('1:1'); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs transition-all ${mode === 'IMAGE' ? 'bg-white shadow-md text-hh-green' : 'text-gray-400'}`}
                >
                  <ImageIcon className="w-4 h-4" /> PHOTO
                </button>
                <button 
                  onClick={() => { setMode('VIDEO'); setGeneratedContent(null); setAspectRatio('16:9'); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs transition-all ${mode === 'VIDEO' ? 'bg-hh-dark text-white shadow-md' : 'text-gray-400'}`}
                >
                  <Video className="w-4 h-4" /> MOTION
                </button>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                  <Wand2 className="w-3 h-3" /> Creative Directive
                </label>
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={mode === 'IMAGE' ? "Describe the vision (e.g. 'Advanced whey protein stack in a futuristic minimal gym')" : "Describe the motion (e.g. 'Athlete doing heavy squats in a sunset stadium')"}
                  className="w-full bg-hh-light border-none rounded-2xl px-6 py-5 focus:ring-2 focus:ring-hh-green transition-all h-32 text-sm placeholder:text-gray-300 font-medium"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                  <Maximize className="w-3 h-3" /> Aspect Ratio
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {currentRatios.map(r => (
                    <button
                      key={r}
                      onClick={() => setAspectRatio(r)}
                      className={`py-2 rounded-lg text-[10px] font-black transition-all border-2 ${aspectRatio === r ? 'bg-hh-green border-hh-green text-white' : 'bg-white border-gray-100 text-gray-400 hover:border-hh-green/30'}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Output Quality</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['1K', '2K', '4K'] as const).map(q => (
                    <button
                      key={q}
                      onClick={() => setQuality(q)}
                      className={`py-2 rounded-lg text-[10px] font-black transition-all border-2 ${quality === q ? 'bg-hh-dark border-hh-dark text-white' : 'bg-white border-gray-100 text-gray-400 hover:border-hh-dark/30'}`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className={`w-full py-5 rounded-2xl font-heading font-black text-white transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 group ${mode === 'IMAGE' ? 'bg-hh-green shadow-hh-green/20' : 'bg-hh-dark shadow-black/20'}`}
              >
                {isGenerating ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> {mode === 'IMAGE' ? 'REFINING PHOTO...' : 'RENDERING MOTION...'}</>
                ) : (
                  <>GENERATE {mode} <Wand2 className="w-5 h-5 group-hover:rotate-12 transition-transform" /></>
                )}
              </button>
              
              <p className="text-[9px] text-center text-gray-400 font-bold uppercase tracking-widest">
                Check <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-hh-green underline">Billing Requirements</a>
              </p>
            </div>

            {/* Preview Section */}
            <div className="flex-grow p-8 lg:p-16 bg-[#FAFAFA] flex flex-col items-center justify-center relative min-h-[500px]">
               {isGenerating ? (
                 <div className="text-center space-y-6">
                    <div className="relative">
                      <div className="w-24 h-24 bg-hh-green/10 rounded-full flex items-center justify-center mx-auto animate-pulse">
                        <Sparkles className="w-12 h-12 text-hh-green" />
                      </div>
                      <div className="absolute inset-0 w-24 h-24 border-4 border-hh-green/20 border-t-hh-green rounded-full animate-spin mx-auto"></div>
                    </div>
                    <div className="space-y-2">
                      {/* Fixed malformed h3 tag by adding missing opening bracket */}
                      <h3 className="font-heading font-black uppercase tracking-tighter text-2xl text-hh-dark">Molecular Synthesis</h3>
                      <p className="text-xs text-gray-400 max-w-[240px] mx-auto italic font-medium uppercase tracking-widest">
                        {mode === 'IMAGE' ? 'Calibrating pixel purity and athletic lighting...' : 'Processing cinematic motion frames with Veo 3 engine...'}
                      </p>
                    </div>
                 </div>
               ) : generatedContent ? (
                 <div className="w-full max-w-3xl space-y-8 animate-in zoom-in duration-500">
                    <div className="relative bg-white p-4 rounded-[2rem] shadow-2xl group ring-1 ring-gray-100 overflow-hidden">
                       {mode === 'IMAGE' ? (
                         <img src={generatedContent} alt="Generated Vision" className="w-full h-auto rounded-xl object-contain max-h-[60vh]" />
                       ) : (
                         <video src={generatedContent} controls autoPlay loop className="w-full h-auto rounded-xl shadow-lg max-h-[60vh]" />
                       )}
                       <div className="absolute inset-0 bg-hh-dark/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                          <a 
                            href={generatedContent} 
                            download={`hh-${mode.toLowerCase()}.png`}
                            className="p-5 bg-white text-hh-dark rounded-2xl hover:bg-hh-green hover:text-white transition-all transform hover:scale-110 shadow-2xl"
                          >
                            <Download className="w-6 h-6" />
                          </a>
                       </div>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-400 bg-white px-8 py-4 rounded-2xl border border-gray-100 shadow-sm">
                       <span className="flex items-center gap-2"><Maximize className="w-3 h-3" /> Result: {aspectRatio} • {quality}</span>
                       <button onClick={() => setGeneratedContent(null)} className="text-hh-orange hover:scale-105 transition-transform">Discard Design</button>
                    </div>
                 </div>
               ) : error ? (
                 <div className="text-center space-y-4 p-12 bg-red-50 rounded-[3rem] border border-red-100 max-w-md animate-in shake duration-500">
                    <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
                    <div className="font-black text-red-500 uppercase tracking-[0.2em] text-sm">System Interruption</div>
                    <p className="text-sm text-red-400 leading-relaxed font-medium">{error}</p>
                    <button onClick={() => (window as any).aistudio.openSelectKey()} className="mt-4 text-[10px] font-black uppercase underline tracking-widest text-red-500">Select Paid API Key</button>
                 </div>
               ) : (
                 <div className="text-center space-y-6 opacity-40">
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto">
                      <ImageIcon className="w-10 h-10 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500 italic font-medium uppercase tracking-[0.2em]">Vision Awaiting Directive</p>
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
