'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, Plus as PlusIcon, FlaskConical, Settings as SettingsIcon, User as UserIcon } from 'lucide-react';
import { useChat } from '@/context/ChatContext';
import { MessageBubble } from './MessageBubble';
import { useChatService } from '@/hooks/useChatService';
import { useChatScroll } from '@/hooks/useChatScroll';
import { SuggestionsGrid } from './SuggestionsGrid';
import { SuggestionItem } from '@/types';
import { apiService } from '@/services/api';
import { DEFAULT_CHIPS } from '@/constants';
import PersonaModal from './PersonaModal';

const ChatInterface = () => {
  const { currentMessages, contextualHookEnabled, conversations, apiConfig, promptOverrides, personas, activePersonaId, setActivePersona, addPersona } = useChat();
  const { sendMessage, isLoading } = useChatService();
  const [input, setInput] = useState('');
  const [homeSuggestions, setHomeSuggestions] = useState<SuggestionItem[]>([]);
  const [isHooksLoading, setIsHooksLoading] = useState(false);
  const [showPersonaModal, setShowPersonaModal] = useState(false);
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const personaMenuRef = useRef<HTMLDivElement | null>(null);
  
  const { scrollRef, handleScroll } = useChatScroll(currentMessages, isLoading);

  // Fetch contextual suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
        if (!contextualHookEnabled || conversations.length === 0) {
            setHomeSuggestions([]);
            return;
        }

        setIsHooksLoading(true);
        const hooks = await apiService.fetchConversationalHooks(conversations, apiConfig, promptOverrides);
        setHomeSuggestions(hooks);
        setIsHooksLoading(false);
    };

    if (currentMessages.length === 0) {
        fetchSuggestions();
    }
    // Optimization: Only refetch when:
    // 1. Feature is toggled (contextualHookEnabled)
    // 2. We enter "Home" mode (currentMessages.length changes to 0)
    // 3. A NEW conversation is added (conversations.length changes)
    // We intentionally ignore updates to existing conversation content to reduce API calls.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contextualHookEnabled, currentMessages.length, conversations.length, apiConfig, promptOverrides]);

  const activeChips = (contextualHookEnabled && homeSuggestions.length > 0) ? homeSuggestions : DEFAULT_CHIPS;

  const openPromptLab = () => {
    window.dispatchEvent(new Event('open-prompt-lab'));
  };

  const openSettings = () => {
    window.dispatchEvent(new Event('open-settings-modal'));
  };

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (personaMenuRef.current && !personaMenuRef.current.contains(e.target as Node)) {
        setShowPersonaMenu(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

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

  return (
    <div className="flex-1 h-screen flex flex-col bg-[#fdfbf7] relative">
      <div className="absolute top-4 right-4 flex flex-col items-end gap-2 z-10">
        <div className="relative" ref={personaMenuRef}>
          <button
            onClick={() => setShowPersonaMenu((v) => !v)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50"
          >
            <UserIcon size={16} className="text-gray-600" />
            <span>{personas.find(p => p.id === activePersonaId)?.name || 'Persona'}</span>
          </button>
          {showPersonaMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
              <div className="max-h-64 overflow-y-auto">
                {personas.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => { setActivePersona(p.id); setShowPersonaMenu(false); }}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <div className="flex flex-col text-left">
                      <span className="font-medium truncate">{p.name}</span>
                      <span className="text-xs text-gray-400 truncate">{p.role}</span>
                    </div>
                    {activePersonaId === p.id && <span className="text-blue-600 text-xs font-semibold">Active</span>}
                  </button>
                ))}
              </div>
              <button
                onClick={() => { setShowPersonaModal(true); setShowPersonaMenu(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 border-t border-gray-100"
              >
                <span className="text-lg leading-none">＋</span>
                <span>Add Persona</span>
              </button>
            </div>
          )}
        </div>
        <button
          onClick={openPromptLab}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50"
        >
          <FlaskConical size={16} className="text-gray-600" />
          <span>Prompt Lab</span>
        </button>
        <button
          onClick={openSettings}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50"
        >
          <SettingsIcon size={16} className="text-gray-600" />
          <span>Settings</span>
        </button>
      </div>

      <PersonaModal
        isOpen={showPersonaModal}
        onClose={() => setShowPersonaModal(false)}
        onAdd={(persona) => { addPersona(persona); setShowPersonaModal(false); }}
      />
      {/* Messages Area */}
      <div 
        className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col items-center" 
        ref={scrollRef}
        onScroll={handleScroll}
      >
        {(currentMessages.length === 0 && !isLoading) ? (
          <div className="flex flex-col items-center justify-center h-full w-full max-w-4xl space-y-8 mt-[10vh]">
             <h1 className="text-4xl font-semibold text-gray-800 text-center">Hey, what&apos;s on your mind today?</h1>
          </div>
        ) : (
          <div className="w-full max-w-3xl space-y-6 pb-24">
            {currentMessages.map((msg, idx) => (
                <div key={idx} id={`message-${idx}`} className="scroll-mt-8">
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
                <SuggestionsGrid 
                    items={activeChips} 
                    onSelect={handleSend} 
                    isLoading={isHooksLoading}
                />
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
