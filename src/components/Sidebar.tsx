'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { LayoutGrid, Plus } from 'lucide-react';
import { useChat } from '@/context/ChatContext';
import SettingsModal from './SettingsModal';
import PromptEditorModal from './PromptEditorModal';
import { SidebarNav } from './SidebarNav';
import { SidebarRecentChats } from './SidebarRecentChats';
import { SidebarFeatureToggles } from './SidebarFeatureToggles';

const Sidebar = () => {
  const { 
      conversations, currentConversationId, selectChat, createNewChat, deleteChat, 
      suggestionsEnabled, toggleSuggestions, inlineSuggestionsEnabled, toggleInlineSuggestions, contextualHookEnabled, toggleContextualHook
  } = useChat();
  
  const [showSettings, setShowSettings] = useState(false);
  const [showPromptEditor, setShowPromptEditor] = useState(false);
  const [showFeatures, setShowFeatures] = useState(true);

  // Allow other areas (e.g., top-right actions) to open modals via custom events
  useEffect(() => {
    const openSettings = () => setShowSettings(true);
    const openPromptLab = () => setShowPromptEditor(true);
    window.addEventListener('open-settings-modal', openSettings);
    window.addEventListener('open-prompt-lab', openPromptLab);
    return () => {
      window.removeEventListener('open-settings-modal', openSettings);
      window.removeEventListener('open-prompt-lab', openPromptLab);
    };
  }, []);

  const featureToggleConfig = useMemo(() => ([
    {
      label: 'Suggestion Pills',
      icon: '✨',
      enabled: suggestionsEnabled,
      onToggle: toggleSuggestions,
      title: 'Toggle regular suggestions at the end of messages'
    },
    {
      label: 'Inline Suggestions',
      icon: '🔗',
      enabled: inlineSuggestionsEnabled,
      onToggle: toggleInlineSuggestions,
      title: 'Toggle inline highlighted topic suggestions'
    },
    {
      label: 'Contextual Hooks',
      icon: '🧠',
      enabled: contextualHookEnabled,
      onToggle: toggleContextualHook,
      title: 'Toggle contextual suggestions based on history'
    }
  ]), [contextualHookEnabled, inlineSuggestionsEnabled, suggestionsEnabled, toggleContextualHook, toggleInlineSuggestions, toggleSuggestions]);

  return (
    <div className="w-[260px] h-screen bg-[#f3f3f3] flex flex-col justify-between p-4 border-r border-gray-200">
      <div className="flex-1 flex flex-col min-h-0 gap-4">
        {/* Header / New Chat */}
        <div className="flex items-center justify-between mb-6 pl-2">
            <div className="flex items-center gap-2 font-semibold text-gray-700">
                <span>Copilot</span>
            </div>
            <div className="flex gap-2">
                 <button className="p-2 hover:bg-gray-200 rounded-lg">
                    <LayoutGrid size={20} className="text-gray-600"/>
                 </button>
                <button 
                  onClick={createNewChat}
                  className="p-2 hover:bg-gray-200 rounded-lg"
                  title="New Chat"
                >
                    <Plus size={20} className="text-gray-600"/>
                </button>
            </div>
        </div>

        <SidebarNav isHome={!currentConversationId} />

        <SidebarRecentChats
          conversations={conversations}
          currentConversationId={currentConversationId}
          onSelect={selectChat}
          onDelete={deleteChat}
        />
      </div>

          {/* Footer Controls */}
          <div className="mt-auto space-y-3">
        <SidebarFeatureToggles
          showFeatures={showFeatures}
          onToggleVisibility={() => setShowFeatures((v) => !v)}
          toggles={featureToggleConfig}
        />
          </div>

      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <PromptEditorModal isOpen={showPromptEditor} onClose={() => setShowPromptEditor(false)} />
    </div>
  );
};

export default Sidebar;
