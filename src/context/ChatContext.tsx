'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Message, UserPersona, Conversation, ApiConfiguration } from '@/types';
import { STORAGE_CONSTANTS, DEFAULT_PERSONAS } from '@/constants';

interface ChatContextType {
  conversations: Conversation[];
  currentConversationId: string | null;
  createNewChat: () => string;
  selectChat: (id: string) => void;
  deleteChat: (id: string) => void;
  addMessage: (conversationId: string, message: Message) => void;
  updateLastMessage: (conversationId: string, content: string, suggestions?: string[]) => void;
  currentMessages: Message[];
  suggestionsEnabled: boolean;
  toggleSuggestions: () => void;
  inlineSuggestionsEnabled: boolean;
  toggleInlineSuggestions: () => void;
  contextualHookEnabled: boolean;
  toggleContextualHook: () => void;
  
  // Personas
  personas: UserPersona[];
  activePersonaId: string | null;
  addPersona: (persona: Omit<UserPersona, 'id'>) => void;
  setActivePersona: (id: string) => void;
  deletePersona: (id: string) => void;
  getActivePersona: () => UserPersona | undefined;

  // API Config
  apiConfig: ApiConfiguration;
  updateApiConfig: (config: ApiConfiguration) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [suggestionsEnabled, setSuggestionsEnabled] = useState(true);
  const [inlineSuggestionsEnabled, setInlineSuggestionsEnabled] = useState(false);
  const [contextualHookEnabled, setContextualHookEnabled] = useState(false);
  
  // API Config
  const [apiConfig, setApiConfig] = useState<ApiConfiguration>({
      endpoint: '',
      apiKey: '',
      deployment: '',
      apiVersion: '2024-02-15-preview'
  });

  // Persona State
  const [personas, setPersonas] = useState<UserPersona[]>([...DEFAULT_PERSONAS]);
  const [activePersonaId, setActivePersonaId] = useState<string>('default');

  // Load from database (localStorage for now)
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_CONSTANTS.KEYS.CONVERSATIONS);
    const savedSuggestions = localStorage.getItem(STORAGE_CONSTANTS.KEYS.SUGGESTIONS_ENABLED);
    const savedInlineSuggestions = localStorage.getItem(STORAGE_CONSTANTS.KEYS.INLINE_SUGGESTIONS_ENABLED);
    const savedContextualHook = localStorage.getItem(STORAGE_CONSTANTS.KEYS.CONTEXTUAL_HOOK_ENABLED);
    const savedPersonas = localStorage.getItem(STORAGE_CONSTANTS.KEYS.PERSONAS);
    const savedActivePersona = localStorage.getItem(STORAGE_CONSTANTS.KEYS.ACTIVE_PERSONA);
    const savedApiConfig = localStorage.getItem(STORAGE_CONSTANTS.KEYS.API_CONFIG);

    if (saved) {
      try {
         const parsed = JSON.parse(saved);
         setConversations(parsed);
      } catch (e) {
        console.error("Failed to load conversations", e);
      }
    }
    
    if (savedSuggestions !== null) setSuggestionsEnabled(savedSuggestions === 'true');
    if (savedInlineSuggestions !== null) setInlineSuggestionsEnabled(savedInlineSuggestions === 'true');
    if (savedContextualHook !== null) setContextualHookEnabled(savedContextualHook === 'true');
    if (savedPersonas) setPersonas(JSON.parse(savedPersonas));
    if (savedActivePersona) setActivePersonaId(savedActivePersona);
    if (savedApiConfig) {
        try {
            setApiConfig(JSON.parse(savedApiConfig));
        } catch (e) {
            console.error("Failed to load api config", e);
        }
    }
  }, []);

  // Save to database
  useEffect(() => {
    const timeoutId = setTimeout(() => {
        if (conversations.length > 0) {
            localStorage.setItem(STORAGE_CONSTANTS.KEYS.CONVERSATIONS, JSON.stringify(conversations));
        }
    }, STORAGE_CONSTANTS.DEBOUNCE_DELAY);

    return () => clearTimeout(timeoutId);
  }, [conversations]);
  
  useEffect(() => {
      localStorage.setItem(STORAGE_CONSTANTS.KEYS.SUGGESTIONS_ENABLED, String(suggestionsEnabled));
      localStorage.setItem(STORAGE_CONSTANTS.KEYS.INLINE_SUGGESTIONS_ENABLED, String(inlineSuggestionsEnabled));
      localStorage.setItem(STORAGE_CONSTANTS.KEYS.CONTEXTUAL_HOOK_ENABLED, String(contextualHookEnabled));
      localStorage.setItem(STORAGE_CONSTANTS.KEYS.PERSONAS, JSON.stringify(personas));
      localStorage.setItem(STORAGE_CONSTANTS.KEYS.ACTIVE_PERSONA, activePersonaId);
      localStorage.setItem(STORAGE_CONSTANTS.KEYS.API_CONFIG, JSON.stringify(apiConfig));
  }, [suggestionsEnabled, inlineSuggestionsEnabled, contextualHookEnabled, personas, activePersonaId, apiConfig]);

  const toggleSuggestions = () => {
      setSuggestionsEnabled(prev => !prev);
  }

  const toggleInlineSuggestions = () => {
      setInlineSuggestionsEnabled(prev => !prev);
  }

  const toggleContextualHook = () => {
      setContextualHookEnabled(prev => !prev);
  }

  const updateApiConfig = (config: ApiConfiguration) => {
      setApiConfig(config);
  };

  // Persona Handlers
  const addPersona = (persona: Omit<UserPersona, 'id'>) => {
      const newPersona = { ...persona, id: Date.now().toString() };
      setPersonas(prev => [...prev, newPersona]);
      setActivePersonaId(newPersona.id);
  };

  const setActivePersona = (id: string) => {
      setActivePersonaId(id);
  };

  const deletePersona = (id: string) => {
      if (id === 'default') return; // Cannot delete default
      setPersonas(prev => prev.filter(p => p.id !== id));
      if (activePersonaId === id) setActivePersonaId('default');
  };

  const getActivePersona = () => {
      return personas.find(p => p.id === activePersonaId) || personas[0];
  }

  const createNewChat = () => {
    const newId = Date.now().toString();
    const newChat: Conversation = {
      id: newId,
      title: 'New Chat',
      messages: [],
      updatedAt: Date.now(),
    };
    setConversations(prev => [newChat, ...prev]);
    setCurrentConversationId(newId);
    return newId;
  };

  const selectChat = (id: string) => {
    setCurrentConversationId(id);
  };

  const deleteChat = (id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    if (currentConversationId === id) {
      setCurrentConversationId(null);
    }
  };

  const addMessage = (conversationId: string, message: Message) => {
    setConversations(prev => {
      const updated = prev.map(c => {
        if (c.id === conversationId) {
          const updatedMessages = [...c.messages, message];
          // Auto-generate title if it's the first user message
          let newTitle = c.title;
          if (c.messages.length === 0 && message.role === 'user') {
              newTitle = message.content.slice(0, 30) + (message.content.length > 30 ? '...' : '');
          }
          
          return {
            ...c,
            messages: updatedMessages,
            title: newTitle,
            updatedAt: Date.now()
          };
        }
        return c;
      });
      
      // Only sort if the active conversation changed (to move it to top)
      const activeConvIdx = updated.findIndex(c => c.id === conversationId);
      if (activeConvIdx > 0) {
        const [activeConv] = updated.splice(activeConvIdx, 1);
        updated.unshift(activeConv);
      }
      
      return updated;
    });
  };

  const updateLastMessage = (conversationId: string, content: string, suggestions?: string[]) => {
    setConversations(prev => prev.map(c => {
      if (c.id === conversationId && c.messages.length > 0) {
        const lastMessageIndex = c.messages.length - 1;
        const messages = [...c.messages];
        messages[lastMessageIndex] = {
            ...messages[lastMessageIndex],
            content: content,
            ...(suggestions ? { suggestions } : {})
        };
        return {
          ...c,
          messages,
          updatedAt: Date.now()
        };
      }
      return c;
    }));
  };

  const currentMessages = conversations.find(c => c.id === currentConversationId)?.messages || [];

  return (
    <ChatContext.Provider value={{
      conversations,
      currentConversationId,
      createNewChat,
      selectChat,
      deleteChat,
      addMessage,
      updateLastMessage,
      currentMessages,
      suggestionsEnabled,
      toggleSuggestions,
      inlineSuggestionsEnabled,
      toggleInlineSuggestions,
      contextualHookEnabled,
      toggleContextualHook,
      personas,
      activePersonaId,
      addPersona,
      setActivePersona,
      deletePersona,
      getActivePersona,
      apiConfig,
      updateApiConfig
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
