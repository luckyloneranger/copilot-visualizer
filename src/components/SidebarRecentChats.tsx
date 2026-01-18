import React from 'react';
import { Conversation } from '@/types';
import { Trash2 } from 'lucide-react';

interface SidebarRecentChatsProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export const SidebarRecentChats = ({ conversations, currentConversationId, onSelect, onDelete }: SidebarRecentChatsProps) => (
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
            onClick={() => onSelect(chat.id)}
            className={`group flex items-center justify-between text-sm px-3 py-2 rounded-lg cursor-pointer transition-colors ${currentConversationId === chat.id ? 'bg-white shadow-sm text-black font-medium' : 'text-gray-600 hover:bg-gray-200'}`}
          >
            <span className="truncate flex-1 pr-2">{chat.title}</span>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(chat.id); }}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-300 rounded text-gray-500 transition-opacity"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))
      )}
    </div>
  </div>
);
