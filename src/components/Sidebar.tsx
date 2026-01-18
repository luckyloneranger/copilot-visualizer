'use client';

import React, { useEffect, useState } from 'react';
import { MessageSquare, Compass, LayoutGrid, Plus, Trash2 } from 'lucide-react';
import { useChat } from '@/context/ChatContext';
import SettingsModal from './SettingsModal';
import { SidebarNavItem } from './SidebarNavItem';
import PromptEditorModal from './PromptEditorModal';

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

        {/* Navigation Items */}
        <nav className="space-y-1 mb-4">
          <SidebarNavItem icon={<Compass size={20} />} label="Discover" active={!currentConversationId} />
          <SidebarNavItem icon={<MessageSquare size={20} />} label="Imagine" badge="New" />
          <SidebarNavItem icon={<LayoutGrid size={20} />} label="Library" />
          <SidebarNavItem icon={<LayoutGrid size={20} />} label="Labs" />
        </nav>

        {/* Recent Chats Section */}
         <div className="flex-1 overflow-y-auto">
            <h3 className="text-xs font-semibold text-gray-500 mb-2 px-3">Recent</h3>
            <div className="space-y-1">
              {conversations.length === 0 ? (
                <div className="text-sm text-gray-400 px-3 py-2 italic transition-opacity">
                  No conversations yet.
                </div>
              ) : (
                conversations.map((chat) => (
                  <div 
                    key={chat.id}
                    onClick={() => selectChat(chat.id)}
                    className={`group flex items-center justify-between text-sm px-3 py-2 rounded-lg cursor-pointer transition-colors ${currentConversationId === chat.id ? 'bg-white shadow-sm text-black font-medium' : 'text-gray-600 hover:bg-gray-200'}`}
                  >
                    <span className="truncate flex-1 pr-2">{chat.title}</span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteChat(chat.id); }}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-300 rounded text-gray-500 transition-opacity"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
        </div>
      </div>

          {/* Footer Controls */}
          <div className="mt-auto space-y-3">
        <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm space-y-2">
          <button
            onClick={() => setShowFeatures((v) => !v)}
            className="flex items-center justify-between w-full px-1 text-xs font-semibold text-gray-600"
          >
            <span>Features</span>
            <span className={`transition-transform text-gray-400 ${showFeatures ? 'rotate-180' : ''}`}>
              ˅
            </span>
          </button>
          {showFeatures && (
            <div className="space-y-2">
              {[{
                label: 'Suggestion Pills',
                icon: '✨',
                enabled: suggestionsEnabled,
                onToggle: toggleSuggestions,
                title: 'Toggle regular suggestions at the end of messages'
              }, {
                label: 'Inline Suggestions',
                icon: '🔗',
                enabled: inlineSuggestionsEnabled,
                onToggle: toggleInlineSuggestions,
                title: 'Toggle inline highlighted topic suggestions'
              }, {
                label: 'Contextual Hooks',
                icon: '🧠',
                enabled: contextualHookEnabled,
                onToggle: toggleContextualHook,
                title: 'Toggle contextual suggestions based on history'
              }].map((item) => (
                <button
                  key={item.label}
                  onClick={item.onToggle}
                  className="flex items-center justify-between w-full p-2 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-700"
                  title={item.title}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-gray-600">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${item.enabled ? 'bg-blue-600' : 'bg-gray-300'}`}>
                    <div className={`w-3 h-3 bg-white rounded-full shadow-sm transition-transform ${item.enabled ? 'translate-x-4' : 'translate-x-0'}`} />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
          </div>

      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <PromptEditorModal isOpen={showPromptEditor} onClose={() => setShowPromptEditor(false)} />
    </div>
  );
};

export default Sidebar;
