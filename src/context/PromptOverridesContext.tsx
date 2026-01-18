'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { PromptOverrides } from '@/types';
import { DEFAULT_PROMPTS } from '@/prompts/defaultPrompts';
import { STORAGE_CONSTANTS } from '@/constants';
import { storage } from '@/utils/storage';
import { isPromptOverrides } from '@/utils/validators';

interface PromptOverridesContextValue {
  promptOverrides: PromptOverrides;
  updatePromptOverrides: (overrides: Partial<PromptOverrides>) => void;
  resetPromptOverrides: () => void;
}

const PromptOverridesContext = createContext<PromptOverridesContextValue | undefined>(undefined);

export const PromptOverridesProvider = ({ children }: { children: React.ReactNode }) => {
  const [promptOverrides, setPromptOverrides] = useState<PromptOverrides>({ ...DEFAULT_PROMPTS });

  useEffect(() => {
    const savedPromptOverrides = storage.load<PromptOverrides>(STORAGE_CONSTANTS.KEYS.PROMPT_OVERRIDES, isPromptOverrides);
    if (savedPromptOverrides) {
      setPromptOverrides({ ...DEFAULT_PROMPTS, ...savedPromptOverrides });
    }
  }, []);

  useEffect(() => {
    storage.save(STORAGE_CONSTANTS.KEYS.PROMPT_OVERRIDES, promptOverrides);
  }, [promptOverrides]);

  const updatePromptOverrides = (overrides: Partial<PromptOverrides>) => {
    setPromptOverrides((prev) => ({ ...prev, ...overrides }));
  };

  const resetPromptOverrides = () => {
    setPromptOverrides({ ...DEFAULT_PROMPTS });
  };

  return (
    <PromptOverridesContext.Provider value={{ promptOverrides, updatePromptOverrides, resetPromptOverrides }}>
      {children}
    </PromptOverridesContext.Provider>
  );
};

export const usePromptOverrides = () => {
  const context = useContext(PromptOverridesContext);
  if (context === undefined) {
    throw new Error('usePromptOverrides must be used within a PromptOverridesProvider');
  }
  return context;
};

export type { PromptOverridesContextValue };
