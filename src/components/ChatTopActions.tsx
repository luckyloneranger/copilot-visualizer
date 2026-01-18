import React, { useEffect, useRef, useState } from 'react';
import { FlaskConical, Settings as SettingsIcon, User as UserIcon } from 'lucide-react';
import { UserPersona } from '@/types';

interface ChatTopActionsProps {
  personas: UserPersona[];
  activePersonaId: string | null;
  onSelectPersona: (id: string) => void;
  onAddPersona: () => void;
  onOpenPromptLab: () => void;
  onOpenSettings: () => void;
}

export const ChatTopActions = ({ personas, activePersonaId, onSelectPersona, onAddPersona, onOpenPromptLab, onOpenSettings }: ChatTopActionsProps) => {
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const personaMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (personaMenuRef.current && !personaMenuRef.current.contains(e.target as Node)) {
        setShowPersonaMenu(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  return (
    <div className="absolute top-4 right-4 flex flex-col items-end gap-2 z-10">
      <div className="relative" ref={personaMenuRef}>
        <button
          onClick={() => setShowPersonaMenu((v) => !v)}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50"
        >
          <UserIcon size={16} className="text-gray-600" />
          <span>{personas.find((p) => p.id === activePersonaId)?.name || 'Persona'}</span>
        </button>
        {showPersonaMenu && (
          <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
            <div className="max-h-64 overflow-y-auto">
              {personas.map((p) => (
                <button
                  key={p.id}
                  onClick={() => { onSelectPersona(p.id); setShowPersonaMenu(false); }}
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
              onClick={() => { onAddPersona(); setShowPersonaMenu(false); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 border-t border-gray-100"
            >
              <span className="text-lg leading-none">＋</span>
              <span>Add Persona</span>
            </button>
          </div>
        )}
      </div>
      <button
        onClick={onOpenPromptLab}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50"
      >
        <FlaskConical size={16} className="text-gray-600" />
        <span>Prompt Lab</span>
      </button>
      <button
        onClick={onOpenSettings}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50"
      >
        <SettingsIcon size={16} className="text-gray-600" />
        <span>Settings</span>
      </button>
    </div>
  );
};
