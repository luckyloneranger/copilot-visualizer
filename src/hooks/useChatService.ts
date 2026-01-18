import { useState, useRef, useEffect } from 'react';
import { useChat } from '@/context/ChatContext';
import { Message } from '@/types';
import { apiService } from '@/services/api';
import { STREAMING_CONSTANTS } from '@/constants';

export const useChatService = () => {
    const { 
        currentMessages, 
        addMessage, 
        updateLastMessage, 
        currentConversationId, 
        createNewChat, 
        suggestionsEnabled, 
        inlineSuggestionsEnabled, 
        getActivePersona,
        apiConfig,
        promptOverrides
    } = useChat();

    const [isLoading, setIsLoading] = useState(false);
    
    // Track active chat ID ref to handle context updates during async ops
    const activeChatIdRef = useRef<string | null>(null);
    useEffect(() => {
        activeChatIdRef.current = currentConversationId;
    }, [currentConversationId]);

    const sendMessage = async (text: string) => {
        if (!text.trim()) return;

        let chatId = activeChatIdRef.current;
        if (!chatId) {
            chatId = createNewChat();
        }

        const userMessage: Message = { role: 'user', content: text };
        addMessage(chatId, userMessage);
        
        setIsLoading(true);

        try {
            const historyForApi = [...currentMessages, userMessage]; 
            const activePersona = getActivePersona();

            const data = await apiService.sendChatMessage(
                historyForApi, 
                suggestionsEnabled, 
                inlineSuggestionsEnabled, 
                activePersona, 
                apiConfig,
                promptOverrides
            );

            if (data.content && chatId) {
                const mainContent = data.content;
                
                addMessage(chatId, { 
                    role: 'assistant', 
                    content: '',
                    suggestions: []
                });

                setIsLoading(false); // Simulate streaming start

                // Simulate streaming
                let currentText = '';
                const chunkSize = STREAMING_CONSTANTS.DEFAULT_CHUNK_SIZE;
                
                for (let i = 0; i < mainContent.length; i += chunkSize) {
                    const chunk = mainContent.slice(i, i + chunkSize);
                    currentText += chunk;
                    updateLastMessage(chatId, currentText);
                    
                    let delay: number = STREAMING_CONSTANTS.DEFAULT_DELAY;
                    if (chunk.includes('.')) delay = STREAMING_CONSTANTS.PERIOD_DELAY;
                    if (chunk.includes(',')) delay = STREAMING_CONSTANTS.COMMA_DELAY;
                    await new Promise(resolve => setTimeout(resolve, delay));
                }

                // Call Personalization API
                try {
                    const personalData = await apiService.personalizeResponse(
                        mainContent,
                        text, // Pass original user query
                        suggestionsEnabled,
                        inlineSuggestionsEnabled,
                        activePersona,
                        apiConfig,
                        promptOverrides
                    );
                    updateLastMessage(chatId, personalData.content, personalData.suggestions);
                } catch {
                     // Fallback if personalization fails:  
                     // Keep the original anchors so they still render as clickable "Pivot Points" 
                     // (handled by MessageBubble's __ANCHOR__ renderer)
                    updateLastMessage(chatId, mainContent);
                }

            } else {
                console.error('Error:', data.error);
                if(chatId) addMessage(chatId, { 
                    role: 'assistant', 
                    content: data.error ? `Error: ${data.error}` : "Sorry, I encountered an error. Please check your settings." 
                });
            }
        } catch (error) {
            console.error('Fetch error:', error);
            if(chatId) addMessage(chatId, { 
                role: 'assistant', 
                content: "Sorry, I couldn't reach the server. Please check your connection or settings." 
            });
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        sendMessage
    };
};

