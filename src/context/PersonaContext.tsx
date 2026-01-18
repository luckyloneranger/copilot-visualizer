'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserPersona } from '@/types';
import { DEFAULT_PERSONAS, STORAGE_CONSTANTS } from '@/constants';
import { storage } from '@/utils/storage';
import { isPersonaList, isString } from '@/utils/validators';

interface PersonaContextValue {
  personas: UserPersona[];
  activePersonaId: string | null;
  addPersona: (persona: Omit<UserPersona, 'id'>) => void;
  setActivePersona: (id: string) => void;
  deletePersona: (id: string) => void;
  getActivePersona: () => UserPersona | undefined;
}

const PersonaContext = createContext<PersonaContextValue | undefined>(undefined);

export const PersonaProvider = ({ children }: { children: React.ReactNode }) => {
  const [personas, setPersonas] = useState<UserPersona[]>([...DEFAULT_PERSONAS]);
  const [activePersonaId, setActivePersonaId] = useState<string>('default');

  useEffect(() => {
    const savedPersonas = storage.load<UserPersona[]>(STORAGE_CONSTANTS.KEYS.PERSONAS, isPersonaList);
    if (savedPersonas) setPersonas(savedPersonas);

    const savedActivePersona = storage.load<string>(STORAGE_CONSTANTS.KEYS.ACTIVE_PERSONA, isString);
    if (savedActivePersona) setActivePersonaId(savedActivePersona);
  }, []);

  useEffect(() => {
    storage.save(STORAGE_CONSTANTS.KEYS.PERSONAS, personas);
    storage.save(STORAGE_CONSTANTS.KEYS.ACTIVE_PERSONA, activePersonaId);
  }, [personas, activePersonaId]);

  const addPersona = (persona: Omit<UserPersona, 'id'>) => {
    const newPersona = { ...persona, id: Date.now().toString() };
    setPersonas((prev) => [...prev, newPersona]);
    setActivePersonaId(newPersona.id);
  };

  const setActivePersona = (id: string) => {
    setActivePersonaId(id);
  };

  const deletePersona = (id: string) => {
    if (id === 'default') return;
    setPersonas((prev) => prev.filter((p) => p.id !== id));
    if (activePersonaId === id) setActivePersonaId('default');
  };

  const getActivePersona = () => personas.find((p) => p.id === activePersonaId) || personas[0];

  return (
    <PersonaContext.Provider value={{ personas, activePersonaId, addPersona, setActivePersona, deletePersona, getActivePersona }}>
      {children}
    </PersonaContext.Provider>
  );
};

export const usePersonas = () => {
  const context = useContext(PersonaContext);
  if (context === undefined) {
    throw new Error('usePersonas must be used within a PersonaProvider');
  }
  return context;
};

export type { PersonaContextValue };
