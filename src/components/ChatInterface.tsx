'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Plus as PlusIcon } from 'lucide-react';
import { useChat } from '@/context/ChatContext';
import { MessageBubble } from './MessageBubble';
import { useChatService } from '@/hooks/useChatService';

const ChatInterface = () => {
  const { currentMessages, contextualHookEnabled, conversations, apiConfig } = useChat();
  const { sendMessage, isLoading } = useChatService();
  const [input, setInput] = useState('');
  const [homeSuggestions, setHomeSuggestions] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const defaultChips = [
    "Create an image",
    "Recommend a product",
    "Improve writing",
    "Take a quiz",
    "Write a first draft",
    "Draft a text",
    "Write a speech",
    "Say it with care"
  ];

  // Fetch contextual suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
        if (!contextualHookEnabled || conversations.length === 0) {
            setHomeSuggestions([]);
            return;
        }

        try {
            const response = await fetch('/api/conversational-journeys', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ conversations, apiConfig })
            });
            const data = await response.json();
            if (data.hooks && Array.isArray(data.hooks)) {
                setHomeSuggestions(data.hooks);
            }
        } catch (e) {
            console.error("Failed to fetch contextual hooks", e);
        }
    };

    if (currentMessages.length === 0) {
        fetchSuggestions();
    }
  }, [contextualHookEnabled, currentMessages.length, conversations, apiConfig]);

  const activeChips = (contextualHookEnabled && homeSuggestions.length > 0) ? homeSuggestions : defaultChips;

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim()) return;
    
    setInput('');
    await sendMessage(textToSend);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentMessages, isLoading]); // Scroll on new messages

  return (
    <div className="flex-1 h-screen flex flex-col bg-[#fdfbf7] relative">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col items-center" ref={scrollRef}>
        {(currentMessages.length === 0 && !isLoading) ? (
          <div className="flex flex-col items-center justify-center h-full w-full max-w-4xl space-y-8 mt-[10vh]">
             <h1 className="text-4xl font-semibold text-gray-800 text-center">Hey, what's on your mind today?</h1>
          </div>
        ) : (
          <div className="w-full max-w-3xl space-y-6 pb-24">
            {currentMessages.map((msg, idx) => (
                <div key={idx}>
                    <MessageBubble 
                        message={msg} 
                        onSuggestionClick={(text) => handleSend(text)} 
                    />
                </div>
            ))}
             {isLoading && (
                 <div className="flex gap-4 p-6 w-full max-w-3xl">
                     <div className="w-8 h-8 rounded-full bg-gray-200" />
                     <div className="flex-1 space-y-2">
                         <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                         <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                     </div>
                 </div>
             )}
          </div>
        )}
      </div>

       {/* Input Area */}
       <div className="w-full flex flex-col items-center justify-end pb-8">
            {currentMessages.length === 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-8 max-w-4xl px-4">
                    {activeChips.map((chip, i) => (
                         <button 
                            key={i} 
                            onClick={() => handleSend(chip)}
                            className={`text-sm px-4 py-2 rounded-xl border truncate transition-colors ${
                                (contextualHookEnabled && homeSuggestions.length > 0) 
                                ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100' 
                                : 'text-gray-600 bg-white border-gray-200 hover:bg-gray-50'
                            }`}
                        >
                            {(contextualHookEnabled && homeSuggestions.length > 0) && <span className="mr-2">✨</span>}
                            {chip}
                        </button>
                    ))}
                </div>
            )}

            <div className="w-full max-w-3xl px-4 relative">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-4 focus-within:ring-1 focus-within:ring-gray-300 transition-shadow">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Message Copilot"
                        className="w-full bg-transparent outline-none resize-none text-gray-700 min-h-[24px] max-h-[200px]"
                        rows={1}
                        style={{ height: 'auto', minHeight: '24px' }}
                    />
                    <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                             <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                                <PlusIcon className="w-5 h-5"/>
                             </button>
                             <div className="bg-gray-100 px-3 py-1 rounded-full text-xs font-medium text-gray-600 flex items-center gap-1">
                                <span>Smart</span>
                             </div>
                        </div>
                        <div className="flex items-center gap-2">
                             <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                                <Mic className="w-5 h-5"/>
                             </button>
                            <button
                                onClick={() => handleSend()}
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
       </div>
    </div>
  );
};

export default ChatInterface;
