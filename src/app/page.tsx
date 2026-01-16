import Sidebar from '@/components/Sidebar';
import ChatInterface from '@/components/ChatInterface';
import { ChatProvider } from '@/context/ChatContext';

export default function Home() {
  return (
    <ChatProvider>
      <div className="flex w-full h-screen bg-white">
        <Sidebar />
        <ChatInterface />
      </div>
    </ChatProvider>
  );
}
