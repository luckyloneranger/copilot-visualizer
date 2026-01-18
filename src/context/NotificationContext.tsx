'use client';

import React, { createContext, useContext, useMemo, useState } from 'react';
import { NotificationItem, NotificationTone } from '@/types';

interface NotificationContextValue {
  notifications: NotificationItem[];
  notify: (message: string, tone?: NotificationTone) => void;
  dismiss: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const notify = (message: string, tone: NotificationTone = 'info') => {
    const id = Date.now().toString();
    setNotifications((prev) => [...prev, { id, message, tone }]);
    setTimeout(() => dismiss(id), 4000);
  };

  const dismiss = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const value = useMemo(() => ({ notifications, notify, dismiss }), [notifications]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
