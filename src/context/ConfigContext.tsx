'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ApiConfiguration } from '@/types';
import { AZURE_DEFAULT_API_VERSION, STORAGE_CONSTANTS } from '@/constants';
import { storage } from '@/utils/storage';
import { isApiConfiguration } from '@/utils/validators';

interface ConfigContextValue {
  apiConfig: ApiConfiguration;
  updateApiConfig: (config: ApiConfiguration) => void;
}

const ConfigContext = createContext<ConfigContextValue | undefined>(undefined);

export const ConfigProvider = ({ children }: { children: React.ReactNode }) => {
  const [apiConfig, setApiConfig] = useState<ApiConfiguration>({
    endpoint: '',
    apiKey: '',
    deployment: '',
    apiVersion: AZURE_DEFAULT_API_VERSION,
  });

  useEffect(() => {
    const savedApiConfig = storage.load<ApiConfiguration>(STORAGE_CONSTANTS.KEYS.API_CONFIG, isApiConfiguration);
    if (savedApiConfig) setApiConfig(savedApiConfig);
  }, []);

  useEffect(() => {
    storage.save(STORAGE_CONSTANTS.KEYS.API_CONFIG, apiConfig);
  }, [apiConfig]);

  const updateApiConfig = (config: ApiConfiguration) => {
    setApiConfig(config);
  };

  return (
    <ConfigContext.Provider value={{ apiConfig, updateApiConfig }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};

export type { ConfigContextValue };
