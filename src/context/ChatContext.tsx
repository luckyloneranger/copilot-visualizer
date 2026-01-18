'use client';

import React from 'react';
import { ConversationContextValue, ConversationProvider, useConversations } from './ConversationContext';
import { FeatureFlagsContextValue, FeatureFlagsProvider, useFeatureFlags } from './FeatureFlagsContext';
import { PersonaContextValue, PersonaProvider, usePersonas } from './PersonaContext';
import { ConfigContextValue, ConfigProvider, useConfig } from './ConfigContext';
import { PromptOverridesContextValue, PromptOverridesProvider, usePromptOverrides } from './PromptOverridesContext';

type ChatContextType = ConversationContextValue & FeatureFlagsContextValue & PersonaContextValue & ConfigContextValue & PromptOverridesContextValue;

export const ChatProvider = ({ children }: { children: React.ReactNode }) => (
  <ConversationProvider>
    <FeatureFlagsProvider>
      <PersonaProvider>
        <ConfigProvider>
          <PromptOverridesProvider>
            {children}
          </PromptOverridesProvider>
        </ConfigProvider>
      </PersonaProvider>
    </FeatureFlagsProvider>
  </ConversationProvider>
);

export const useChat = (): ChatContextType => {
  const conversations = useConversations();
  const featureFlags = useFeatureFlags();
  const personas = usePersonas();
  const config = useConfig();
  const promptOverrides = usePromptOverrides();

  return {
    ...conversations,
    ...featureFlags,
    ...personas,
    ...config,
    ...promptOverrides,
  };
};
