
import { useState } from 'react';
import { GoogleGenAI, Content, GenerateContentResponse } from "@google/genai";
import { ChatMessage } from '../types.ts';

interface Citation {
  uri: string;
  title: string;
}

export const useGemini = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [streamingResponse, setStreamingResponse] = useState<string>('');
  const [citations, setCitations] = useState<Citation[]>([]);
  const [error, setError] = useState<string | null>(null);

  const generateStream = async (history: ChatMessage[]) => {
    setIsLoading(true);
    setStreamingResponse('');
    setCitations([]);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      const contents: Content[] = history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

      const stream = await ai.models.generateContentStream({
        model: 'gemini-3-pro-preview',
        contents: contents,
        config: {
          temperature: 0.7,
          topP: 0.95,
          thinkingConfig: {
            thinkingBudget: 32768,
          },
          tools: [{ googleSearch: {} }],
        },
      });

      let fullResponseText = '';
      for await (const chunk of stream) {
        const c = chunk as GenerateContentResponse;
        const chunkText = c.text;
        
        if (chunkText) {
          fullResponseText += chunkText;
          setStreamingResponse(fullResponseText);
        }

        const groundingChunks = c.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (groundingChunks) {
          const newCitations: Citation[] = groundingChunks
            .filter(chunk => chunk.web && chunk.web.uri)
            .map(chunk => ({
              uri: chunk.web!.uri!,
              title: chunk.web!.title || 'Source',
            }));
          
          setCitations(prev => {
            const existingUris = new Set(prev.map(c => c.uri));
            const uniqueNewCitations = newCitations.filter(c => !existingUris.has(c.uri));
            return [...prev, ...uniqueNewCitations];
          });
        }
      }
    } catch (e: any) {
      console.error("Gemini Hook Error:", e);
      setError(e.message || "An error occurred during biological synthesis.");
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, streamingResponse, citations, error, generateStream };
};
