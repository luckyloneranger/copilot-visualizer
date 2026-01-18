import Sidebar from '@/components/Sidebar';
import ChatInterface from '@/components/ChatInterface';
import { ChatProvider } from '@/context/ChatContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { NotificationHost } from '@/components/NotificationHost';

export default function Home() {
  return (
    <NotificationProvider>
      <ChatProvider>
        <NotificationHost />
        <div className="flex w-full h-screen bg-white">
          <Sidebar />
          <ChatInterface />
        </div>
      </ChatProvider>
    </NotificationProvider>
  );
}
