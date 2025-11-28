import React, { useState } from 'react';
import { Sparkles, Loader2, ChevronRight } from 'lucide-react';
import { generatePlateIdeas } from '../services/geminiService';
import { GeminiSuggestion } from '../types';

interface GeminiAssistantProps {
  onSelect: (text: string) => void;
}

export const GeminiAssistant: React.FC<GeminiAssistantProps> = ({ onSelect }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<GeminiSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    const ideas = await generatePlateIdeas(input);
    setSuggestions(ideas);
    setLoading(false);
  };

  if (!process.env.API_KEY) return null;

  return (
    <div className="mt-8 p-6 bg-gray-900/50 border border-brand-accent/20 rounded-xl backdrop-blur-sm">
      <div 
        className="flex items-center justify-between cursor-pointer mb-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2 text-brand-accent">
          <Sparkles size={20} />
          <h3 className="font-display font-bold text-lg">AI Plate Ideas</h3>
        </div>
        <ChevronRight className={`transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </div>

      {isOpen && (
        <div className="space-y-4 animate-fadeIn">
          <p className="text-sm text-gray-400">
            Tell us about your name, car model, or hobby, and our AI will suggest creative plate combinations.
          </p>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. 'David loves BMW', 'Dark Knight'"
              className="flex-1 bg-black border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-brand-accent focus:outline-none"
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            />
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="bg-brand-accent text-black font-bold px-4 py-2 rounded-lg hover:bg-white transition-colors flex items-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : 'Generate'}
            </button>
          </div>

          {suggestions.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              {suggestions.map((idea, idx) => (
                <div 
                  key={idx}
                  onClick={() => onSelect(idea.text)}
                  className="group p-3 bg-gray-800 hover:bg-gray-700 rounded border border-gray-700 hover:border-brand-accent cursor-pointer transition-all"
                >
                  <div className="font-plate text-xl text-yellow-400 group-hover:text-brand-accent">
                    {idea.text}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {idea.reasoning}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
