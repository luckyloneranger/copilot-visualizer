'use client';

import React from 'react';
import { Home, MessageSquare, Compass, FlaskConical, LayoutGrid, Plus, User, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useChat } from '@/context/ChatContext';

const Sidebar = () => {
  const { 
      conversations, currentConversationId, selectChat, createNewChat, deleteChat, 
      suggestionsEnabled, toggleSuggestions, inlineSuggestionsEnabled, toggleInlineSuggestions,
      activePersonaId, personas, setActivePersona, addPersona, deletePersona 
  } = useChat();

  const [showPersonas, setShowPersonas] = React.useState(false);
  const [isAddingPersona, setIsAddingPersona] = React.useState(false);
  const [newPersonaName, setNewPersonaName] = React.useState('');
  const [newPersonaRole, setNewPersonaRole] = React.useState('');
  const [newPersonaContext, setNewPersonaContext] = React.useState('');

  const handleAddPersona = () => {
      if (!newPersonaName || !newPersonaContext) return;
      addPersona({
          name: newPersonaName,
          role: newPersonaRole || 'User',
          context: newPersonaContext
      });
      setIsAddingPersona(false);
      setNewPersonaName('');
      setNewPersonaRole('');
      setNewPersonaContext('');
  };

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
          <NavItem icon={<Compass size={20} />} label="Discover" active={!currentConversationId} />
          <NavItem icon={<MessageSquare size={20} />} label="Imagine" badge="New" />
          <NavItem icon={<LayoutGrid size={20} />} label="Library" />
          <NavItem icon={<FlaskConical size={20} />} label="Labs" />
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
        <div className="border-t border-gray-200 pt-2 mb-2">
            <button 
                onClick={() => setShowPersonas(!showPersonas)}
                className="flex items-center justify-between w-full p-2 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 mb-1"
            >
                <div className="flex items-center gap-3">
                    <User size={18} className="text-gray-600"/>
                    <span>{personas.find(p => p.id === activePersonaId)?.name || 'Persona'}</span>
                </div>
                <div className={`transition-transform duration-200 ${showPersonas ? 'rotate-180' : ''}`}>
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
            </button>

            {showPersonas && (
                <div className="pl-2 pr-1 space-y-1 mb-3">
                    {personas.map(p => (
                        <div key={p.id} className="flex items-center group">
                            <button 
                                onClick={() => setActivePersona(p.id)}
                                className={`flex-1 text-left px-3 py-1.5 rounded-md text-xs transition-colors ${activePersonaId === p.id ? 'bg-white shadow-sm text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-200'}`}
                            >
                                {p.name}
                                <span className="block text-[10px] text-gray-400 font-normal truncate">{p.role}</span>
                            </button>
                            {p.id !== 'default' && (
                                <button 
                                    onClick={(e) => { e.stopPropagation(); deletePersona(p.id); }}
                                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <Trash2 size={12}/>
                                </button>
                            )}
                        </div>
                    ))}
                    
                    {!isAddingPersona ? (
                        <button 
                            onClick={() => setIsAddingPersona(true)}
                            className="w-full text-left px-3 py-1.5 text-xs text-blue-600 hover:bg-blue-50 rounded-md font-medium flex items-center gap-1 mt-2"
                        >
                            <Plus size={12}/> New Persona
                        </button>
                    ) : (
                        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 mt-2 space-y-2">
                            <input 
                                className="w-full text-xs p-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-gray-900 placeholder-gray-400"
                                placeholder="Name (e.g. Student)"
                                value={newPersonaName}
                                onChange={(e) => setNewPersonaName(e.target.value)}
                            />
                            <input 
                                className="w-full text-xs p-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-gray-900 placeholder-gray-400"
                                placeholder="Role (e.g. Learner)"
                                value={newPersonaRole}
                                onChange={(e) => setNewPersonaRole(e.target.value)}
                            />
                            <textarea 
                                className="w-full text-xs p-2 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none text-gray-900 placeholder-gray-400"
                                placeholder="Context/Preferences..."
                                rows={2}
                                value={newPersonaContext}
                                onChange={(e) => setNewPersonaContext(e.target.value)}
                            />
                            <div className="flex gap-2 pt-1">
                                <button onClick={handleAddPersona} className="flex-1 bg-blue-600 text-white text-xs py-1 rounded hover:bg-blue-700">Add</button>
                                <button onClick={() => setIsAddingPersona(false)} className="flex-1 bg-gray-100 text-gray-600 text-xs py-1 rounded hover:bg-gray-200">Cancel</button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>

        {/* Toggle Suggestions */}
        <button 
            onClick={toggleSuggestions}
            className="flex items-center justify-between w-full p-2 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700"
            title="Toggle regular suggestions at the end of messages"
        >
            <div className="flex items-center gap-3">
                <span className="text-gray-600">✨</span>
                <span>Suggestions</span>
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
                <span>In-text Links</span>
            </div>
            <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${inlineSuggestionsEnabled ? 'bg-blue-600' : 'bg-gray-300'}`}>
                <div className={`w-3 h-3 bg-white rounded-full shadow-sm transition-transform ${inlineSuggestionsEnabled ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
        </button>

        <button className="flex items-center gap-3 w-full p-2 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700">
          <User size={20} className="text-gray-600" />
          <span>Sign in</span>
        </button>
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, badge, active }: { icon: any, label: string, badge?: string, active?: boolean }) => {
    return (
        <a href="#" className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${active ? 'bg-gray-200 text-black' : 'text-gray-700 hover:bg-gray-200'}`}>
            <span className="text-gray-600">{icon}</span>
            <span className="flex-1">{label}</span>
            {badge && <span className="text-[10px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded font-bold">{badge}</span>}
        </a>
    )
}

export default Sidebar;
