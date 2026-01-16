'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Message, UserPersona, Conversation } from '@/types';

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
  
  // Personas
  personas: UserPersona[];
  activePersonaId: string | null;
  addPersona: (persona: Omit<UserPersona, 'id'>) => void;
  setActivePersona: (id: string) => void;
  deletePersona: (id: string) => void;
  getActivePersona: () => UserPersona | undefined;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [suggestionsEnabled, setSuggestionsEnabled] = useState(true);
  const [inlineSuggestionsEnabled, setInlineSuggestionsEnabled] = useState(false);
  
  // Persona State
  const [personas, setPersonas] = useState<UserPersona[]>([
      { id: 'default', name: 'Default', role: 'General User', context: 'Standard responses.' },
      { id: 'dev', name: 'Developer', role: 'Software Engineer', context: 'Prefer technical, code-heavy, and concise responses.' },
      { id: 'creative', name: 'Creative', role: 'Writer', context: 'Use vivid language, metaphors, and elaborated explanations.' }
  ]);
  const [activePersonaId, setActivePersonaId] = useState<string>('default');

  // Load from database (localStorage for now)
  useEffect(() => {
    const saved = localStorage.getItem('copilot-conversations');
    const savedSuggestions = localStorage.getItem('copilot-suggestions-enabled');
    const savedInlineSuggestions = localStorage.getItem('copilot-inline-suggestions-enabled');
    const savedPersonas = localStorage.getItem('copilot-personas');
    const savedActivePersona = localStorage.getItem('copilot-active-persona');

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
    if (savedPersonas) setPersonas(JSON.parse(savedPersonas));
    if (savedActivePersona) setActivePersonaId(savedActivePersona);
  }, []);

  // Save to database
  useEffect(() => {
    if (conversations.length > 0) localStorage.setItem('copilot-conversations', JSON.stringify(conversations));
  }, [conversations]);
  
  useEffect(() => {
      localStorage.setItem('copilot-suggestions-enabled', String(suggestionsEnabled));
      localStorage.setItem('copilot-inline-suggestions-enabled', String(inlineSuggestionsEnabled));
      localStorage.setItem('copilot-personas', JSON.stringify(personas));
      localStorage.setItem('copilot-active-persona', activePersonaId);
  }, [suggestionsEnabled, inlineSuggestionsEnabled, personas, activePersonaId]);

  const toggleSuggestions = () => {
      setSuggestionsEnabled(prev => !prev);
  }

  const toggleInlineSuggestions = () => {
      setInlineSuggestionsEnabled(prev => !prev);
  }

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
    setConversations(prev => prev.map(c => {
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
    }).sort((a, b) => b.updatedAt - a.updatedAt)); // Move active chat to top
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
      personas,
      activePersonaId,
      addPersona,
      setActivePersona,
      deletePersona,
      getActivePersona
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
