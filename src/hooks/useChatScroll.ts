import { useEffect, useRef } from 'react';
import { Message } from '@/types';
import { SCROLL_CONSTANTS } from '@/constants';

export const useChatScroll = (
    currentMessages: Message[], 
    isLoading: boolean
) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isAtBottomRef = useRef(true);

  // Scroll to bottom when loading starts and enable sticky scroll
  useEffect(() => {
    if (isLoading && scrollRef.current) {
        isAtBottomRef.current = true; // Enable sticky scroll
        scrollRef.current.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }
  }, [isLoading]);

  // Handle scroll events to detect if user manually scrolls up
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    
    if (distanceFromBottom > SCROLL_CONSTANTS.DISTANCE_TO_DISABLE_AUTO_SCROLL) {
      isAtBottomRef.current = false;
    } else if (distanceFromBottom < SCROLL_CONSTANTS.DISTANCE_TO_RE_ENABLE_AUTO_SCROLL) {
      isAtBottomRef.current = true;
    }
  };

  // Auto-scroll during streaming if user hasn't scrolled up
  useEffect(() => {
    const lastMessage = currentMessages[currentMessages.length - 1];
    // In our specific architecture, isLoading goes false when streaming BEGINS
    // So if it's an assistant message and we are NOT "loading" (fetching), we are likely streaming or done.
    // Since we don't have a specific "isStreaming" state, this heuristic works because 
    // updateLastMessage calls trigger re-renders. 
    const isStreaming = lastMessage?.role === 'assistant' && !isLoading;
    
    if (isStreaming && isAtBottomRef.current && scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentMessages, isLoading]);

  return { scrollRef, handleScroll };
};
