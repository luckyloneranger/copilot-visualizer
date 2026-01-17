'use client';

import React, { useState } from 'react';
import { MessageSquare, Compass, FlaskConical, LayoutGrid, Plus, Trash2, Settings } from 'lucide-react';
import { useChat } from '@/context/ChatContext';
import SettingsModal from './SettingsModal';
import { SidebarNavItem } from './SidebarNavItem';
import { PersonaList } from './PersonaList';

const Sidebar = () => {
  const { 
      conversations, currentConversationId, selectChat, createNewChat, deleteChat, 
      suggestionsEnabled, toggleSuggestions, inlineSuggestionsEnabled, toggleInlineSuggestions, contextualHookEnabled, toggleContextualHook
  } = useChat();
  
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="w-[260px] h-screen bg-[#f3f3f3] flex flex-col justify-between p-4 border-r border-gray-200">
      <div className="flex-1 flex flex-col min-h-0">
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
        <nav className="space-y-1 mb-6">
          <SidebarNavItem icon={<Compass size={20} />} label="Discover" active={!currentConversationId} />
          <SidebarNavItem icon={<MessageSquare size={20} />} label="Imagine" badge="New" />
          <SidebarNavItem icon={<LayoutGrid size={20} />} label="Library" />
          <SidebarNavItem icon={<FlaskConical size={20} />} label="Labs" />
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

        {/* User / Footer */}
      <div className="mt-auto space-y-2">
        
        {/* Personas Section */}
        <PersonaList />

        {/* Toggle Suggestions */}


        {/* Toggle Suggestions */}
        <button 
            onClick={toggleSuggestions}
            className="flex items-center justify-between w-full p-2 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700"
            title="Toggle regular suggestions at the end of messages"
        >
            <div className="flex items-center gap-3">
                <span className="text-gray-600">✨</span>
                <span>Suggestion Pills</span>
            </div>
            <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${suggestionsEnabled ? 'bg-blue-600' : 'bg-gray-300'}`}>
                <div className={`w-3 h-3 bg-white rounded-full shadow-sm transition-transform ${suggestionsEnabled ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
        </button>

         {/* Toggle Inline Suggestions */}
         <button 
            onClick={toggleInlineSuggestions}
            className="flex items-center justify-between w-full p-2 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700"
            title="Toggle inline highlighted topic suggestions"
        >
            <div className="flex items-center gap-3">
                <span className="text-gray-600">🔗</span>
                <span>Inline Suggestions</span>
            </div>
            <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${inlineSuggestionsEnabled ? 'bg-blue-600' : 'bg-gray-300'}`}>
                <div className={`w-3 h-3 bg-white rounded-full shadow-sm transition-transform ${inlineSuggestionsEnabled ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
        </button>

         {/* Toggle Contextual Hook */}
         <button 
            onClick={toggleContextualHook}
            className="flex items-center justify-between w-full p-2 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700"
            title="Toggle contextual suggestions based on history"
        >
            <div className="flex items-center gap-3">
                <span className="text-gray-600">🧠</span>
                <span>Contextual Hooks</span>
            </div>
            <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${contextualHookEnabled ? 'bg-blue-600' : 'bg-gray-300'}`}>
                <div className={`w-3 h-3 bg-white rounded-full shadow-sm transition-transform ${contextualHookEnabled ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
        </button>

        <button 
            onClick={() => setShowSettings(true)}
            className="flex items-center gap-3 w-full p-2 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 mt-2"
        >
          <Settings size={20} className="text-gray-600" />
          <span>Settings</span>
        </button>
      </div>

      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
};

export default Sidebar;
