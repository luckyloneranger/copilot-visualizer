import React from 'react';
import { Send, Mic, Plus as PlusIcon } from 'lucide-react';

interface ChatComposerProps {
  input: string;
  onInputChange: (value: string) => void;
  onSend: (textOverride?: string) => void;
  isLoading: boolean;
}

export const ChatComposer = ({ input, onInputChange, onSend, isLoading }: ChatComposerProps) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="w-full max-w-3xl px-4 relative">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-4 focus-within:ring-1 focus-within:ring-gray-300 transition-shadow">
        <textarea
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message Copilot"
          className="w-full bg-transparent outline-none resize-none text-gray-700 min-h-[24px] max-h-[200px]"
          rows={1}
          style={{ height: 'auto', minHeight: '24px' }}
        />
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
              <PlusIcon className="w-5 h-5" />
            </button>
            <div className="bg-gray-100 px-3 py-1 rounded-full text-xs font-medium text-gray-600 flex items-center gap-1">
              <span>Smart</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
              <Mic className="w-5 h-5" />
            </button>
            <button
              onClick={() => onSend()}
              disabled={!input.trim() || isLoading}
              className={`p-2 rounded-full transition-colors ${input.trim() ? 'bg-black text-white' : 'bg-gray-200 text-gray-400'}`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      <div className="text-center mt-2 text-xs text-gray-400">
        Copilot can make mistakes. Please check important info.
      </div>
    </div>
  );
};
