'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { STORAGE_CONSTANTS } from '@/constants';
import { storage } from '@/utils/storage';
import { isBoolean } from '@/utils/validators';

interface FeatureFlagsContextValue {
  suggestionsEnabled: boolean;
  toggleSuggestions: () => void;
  inlineSuggestionsEnabled: boolean;
  toggleInlineSuggestions: () => void;
  contextualHookEnabled: boolean;
  toggleContextualHook: () => void;
}

const FeatureFlagsContext = createContext<FeatureFlagsContextValue | undefined>(undefined);

export const FeatureFlagsProvider = ({ children }: { children: React.ReactNode }) => {
  const [suggestionsEnabled, setSuggestionsEnabled] = useState(true);
  const [inlineSuggestionsEnabled, setInlineSuggestionsEnabled] = useState(false);
  const [contextualHookEnabled, setContextualHookEnabled] = useState(false);

  useEffect(() => {
    const savedSuggestions = storage.load<boolean>(STORAGE_CONSTANTS.KEYS.SUGGESTIONS_ENABLED, isBoolean);
    if (typeof savedSuggestions === 'boolean') setSuggestionsEnabled(savedSuggestions);

    const savedInlineSuggestions = storage.load<boolean>(STORAGE_CONSTANTS.KEYS.INLINE_SUGGESTIONS_ENABLED, isBoolean);
    if (typeof savedInlineSuggestions === 'boolean') setInlineSuggestionsEnabled(savedInlineSuggestions);

    const savedContextualHook = storage.load<boolean>(STORAGE_CONSTANTS.KEYS.CONTEXTUAL_HOOK_ENABLED, isBoolean);
    if (typeof savedContextualHook === 'boolean') setContextualHookEnabled(savedContextualHook);
  }, []);

  useEffect(() => {
    storage.save(STORAGE_CONSTANTS.KEYS.SUGGESTIONS_ENABLED, suggestionsEnabled);
    storage.save(STORAGE_CONSTANTS.KEYS.INLINE_SUGGESTIONS_ENABLED, inlineSuggestionsEnabled);
    storage.save(STORAGE_CONSTANTS.KEYS.CONTEXTUAL_HOOK_ENABLED, contextualHookEnabled);
  }, [suggestionsEnabled, inlineSuggestionsEnabled, contextualHookEnabled]);

  const toggleSuggestions = () => setSuggestionsEnabled((prev) => !prev);
  const toggleInlineSuggestions = () => setInlineSuggestionsEnabled((prev) => !prev);
  const toggleContextualHook = () => setContextualHookEnabled((prev) => !prev);

  return (
    <FeatureFlagsContext.Provider
      value={{
        suggestionsEnabled,
        toggleSuggestions,
        inlineSuggestionsEnabled,
        toggleInlineSuggestions,
        contextualHookEnabled,
        toggleContextualHook,
      }}
    >
      {children}
    </FeatureFlagsContext.Provider>
  );
};

export const useFeatureFlags = () => {
  const context = useContext(FeatureFlagsContext);
  if (context === undefined) {
    throw new Error('useFeatureFlags must be used within a FeatureFlagsProvider');
  }
  return context;
};

export type { FeatureFlagsContextValue };
