 'use client';

import React from 'react';
import { useNotifications } from '@/context/NotificationContext';

const toneStyles: Record<string, string> = {
  info: 'bg-white border-gray-200 text-gray-800',
  success: 'bg-green-50 border-green-200 text-green-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  error: 'bg-red-50 border-red-200 text-red-800',
};

export const NotificationHost = () => {
  const { notifications, dismiss } = useNotifications();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-80">
      {notifications.map((note) => (
        <div
          key={note.id}
          className={`border shadow-sm rounded-lg px-3 py-2 text-sm flex items-start justify-between gap-2 ${toneStyles[note.tone] || toneStyles.info}`}
        >
          <span className="flex-1 leading-snug">{note.message}</span>
          <button
            aria-label="Dismiss notification"
            className="text-xs text-gray-400 hover:text-gray-600"
            onClick={() => dismiss(note.id)}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};
