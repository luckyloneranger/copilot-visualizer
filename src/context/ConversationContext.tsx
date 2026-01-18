'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Conversation, Message } from '@/types';
import { STORAGE_CONSTANTS } from '@/constants';
import { storage } from '@/utils/storage';
import { isConversationList } from '@/utils/validators';

interface ConversationContextValue {
  conversations: Conversation[];
  currentConversationId: string | null;
  createNewChat: () => string;
  selectChat: (id: string) => void;
  deleteChat: (id: string) => void;
  addMessage: (conversationId: string, message: Message) => void;
  updateLastMessage: (conversationId: string, content: string, suggestions?: string[]) => void;
  currentMessages: Message[];
}

const ConversationContext = createContext<ConversationContextValue | undefined>(undefined);

export const ConversationProvider = ({ children }: { children: React.ReactNode }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);

  const saveConversations = useMemo(
    () => storage.createDebouncedSaver<Conversation[]>(
      STORAGE_CONSTANTS.KEYS.CONVERSATIONS,
      STORAGE_CONSTANTS.DEBOUNCE_DELAY,
      isConversationList
    ),
    []
  );

  useEffect(() => {
    const savedConversations = storage.load<Conversation[]>(STORAGE_CONSTANTS.KEYS.CONVERSATIONS, isConversationList);
    if (savedConversations) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setConversations(savedConversations);
    }
  }, []);

  useEffect(() => {
    saveConversations(conversations.length > 0 ? conversations : null);
  }, [conversations, saveConversations]);

  const createNewChat = () => {
    const newId = Date.now().toString();
    const newChat: Conversation = {
      id: newId,
      title: 'New Chat',
      messages: [],
      updatedAt: Date.now(),
    };
    setConversations((prev) => [newChat, ...prev]);
    setCurrentConversationId(newId);
    return newId;
  };

  const selectChat = (id: string) => {
    setCurrentConversationId(id);
  };

  const deleteChat = (id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (currentConversationId === id) {
      setCurrentConversationId(null);
    }
  };

  const addMessage = (conversationId: string, message: Message) => {
    setConversations((prev) => {
      const updated = prev.map((c) => {
        if (c.id === conversationId) {
          const updatedMessages = [...c.messages, message];
          let newTitle = c.title;
          if (c.messages.length === 0 && message.role === 'user') {
            newTitle = message.content.slice(0, 30) + (message.content.length > 30 ? '...' : '');
          }

          return {
            ...c,
            messages: updatedMessages,
            title: newTitle,
            updatedAt: Date.now(),
          };
        }
        return c;
      });

      const activeConvIdx = updated.findIndex((c) => c.id === conversationId);
      if (activeConvIdx > 0) {
        const [activeConv] = updated.splice(activeConvIdx, 1);
        updated.unshift(activeConv);
      }

      return updated;
    });
  };

  const updateLastMessage = (conversationId: string, content: string, suggestions?: string[]) => {
    setConversations((prev) => prev.map((c) => {
      if (c.id === conversationId && c.messages.length > 0) {
        const lastMessageIndex = c.messages.length - 1;
        const messages = [...c.messages];
        messages[lastMessageIndex] = {
          ...messages[lastMessageIndex],
          content,
          ...(suggestions ? { suggestions } : {}),
        };
        return {
          ...c,
          messages,
          updatedAt: Date.now(),
        };
      }
      return c;
    }));
  };

  const currentMessages = conversations.find((c) => c.id === currentConversationId)?.messages || [];

  return (
    <ConversationContext.Provider
      value={{
        conversations,
        currentConversationId,
        createNewChat,
        selectChat,
        deleteChat,
        addMessage,
        updateLastMessage,
        currentMessages,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
};

export const useConversations = () => {
  const context = useContext(ConversationContext);
  if (context === undefined) {
    throw new Error('useConversations must be used within a ConversationProvider');
  }
  return context;
};

export type { ConversationContextValue };
