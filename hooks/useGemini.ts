
import { useState } from 'react';
import { GoogleGenAI, Content } from "@google/genai";
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
        role: msg.role,
        parts: [{ text: msg.text }]
      }));

      const stream = await ai.models.generateContentStream({
        model: 'gemini-3-pro-preview',
        contents: contents,
        config: {
          temperature: 1,
          topP: 0.95,
          maxOutputTokens: 65535,
          thinkingConfig: {
            thinkingBudget: 32768,
          },
          tools: [{ googleSearch: {} }],
        },
      });

      let fullResponseText = '';
      for await (const chunk of stream) {
        const chunkText = chunk.text;
        if (chunkText) {
          fullResponseText += chunkText;
          setStreamingResponse(fullResponseText);
        }

        const groundingChunks = chunk.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (groundingChunks) {
          const newCitations: Citation[] = groundingChunks
            .filter(c => c.web && c.web.uri)
            .map(c => ({
              uri: c.web.uri,
              title: c.web.title || 'Source',
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
      setError(e.message || "An error occurred during synthesis.");
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, streamingResponse, citations, error, generateStream };
};
