'use client';

import React, { useState, useEffect } from 'react';
import { useChat } from '@/context/ChatContext';
import { MessageBubble } from './MessageBubble';
import { useChatService } from '@/hooks/useChatService';
import { useChatScroll } from '@/hooks/useChatScroll';
import { SuggestionsGrid } from './SuggestionsGrid';
import { SuggestionItem } from '@/types';
import { apiService } from '@/services/api';
import { DEFAULT_CHIPS } from '@/constants';
import PersonaModal from './PersonaModal';
import { ChatTopActions } from './ChatTopActions';
import { ChatComposer } from './ChatComposer';

const ChatInterface = () => {
  const { currentMessages, contextualHookEnabled, conversations, apiConfig, promptOverrides, personas, activePersonaId, setActivePersona, addPersona } = useChat();
  const { sendMessage, isLoading } = useChatService();
  const [input, setInput] = useState('');
  const [homeSuggestions, setHomeSuggestions] = useState<SuggestionItem[]>([]);
  const [isHooksLoading, setIsHooksLoading] = useState(false);
  const [showPersonaModal, setShowPersonaModal] = useState(false);
  
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

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim()) return;
    
    setInput('');
    await sendMessage(textToSend);
  };

  return (
    <div className="flex-1 h-screen flex flex-col bg-[#fdfbf7] relative">
      <ChatTopActions
        personas={personas}
        activePersonaId={activePersonaId}
        onSelectPersona={setActivePersona}
        onAddPersona={() => setShowPersonaModal(true)}
        onOpenPromptLab={openPromptLab}
        onOpenSettings={openSettings}
      />

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

          <ChatComposer
            input={input}
            onInputChange={setInput}
            onSend={handleSend}
            isLoading={isLoading}
          />
         </div>
    </div>
  );
};

export default ChatInterface;
