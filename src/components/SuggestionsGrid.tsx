import React from 'react';
import { SuggestionItem } from '@/types';

interface SuggestionsGridProps {
  items: SuggestionItem[];
  onSelect: (text: string) => void;
  isLoading?: boolean;
}

export const SuggestionsGrid: React.FC<SuggestionsGridProps> = ({ items, onSelect, isLoading = false }) => {
  // If loading, render skeletons
  if (isLoading) {
    return (
      <div className="grid gap-3 mb-8 max-w-4xl px-4 w-full grid-cols-1 md:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <div 
            key={i}
            className="flex flex-col items-start gap-2 p-4 rounded-xl border border-gray-100 bg-white animate-pulse"
          >
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) return null;

  const isRichHooks = typeof items[0] !== 'string';

  return (
    <div className={`grid gap-3 mb-8 max-w-4xl px-4 w-full ${isRichHooks ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-2 md:grid-cols-4'}`}>
      {items.map((item, i) => {
        if (typeof item === 'string') {
          return (
            <button 
              key={i} 
              onClick={() => onSelect(item)}
              className="text-sm px-4 py-3 rounded-xl border truncate transition-colors text-gray-600 bg-white border-gray-200 hover:bg-gray-50 text-left"
            >
              {item}
            </button>
          );
        } else {
          // Rich Hook Rendering
          return (
            <button
              key={i}
              onClick={() => onSelect(item.prompt)}
              className="group flex flex-col items-start gap-1 p-4 rounded-xl border border-blue-200 bg-blue-50/40 hover:bg-blue-50 text-left transition-all hover:shadow-sm h-full"
            >
              <div className="flex items-center text-blue-700 font-semibold text-sm w-full">
                <span className="mr-2 text-lg">✨</span>
                <span className="truncate flex-1">{item.title}</span>
              </div>
              <div className="text-xs text-slate-500 line-clamp-2 leading-relaxed w-full">
                {item.description}
              </div>
            </button>
          );
        }
      })}
    </div>
  );
};
