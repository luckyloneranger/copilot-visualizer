import { useState, useRef, useEffect } from 'react';
import { useChat } from '@/context/ChatContext';
import { Message } from '@/types';
import { apiService } from '@/services/api';

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
        apiConfig 
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
                apiConfig
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
                const chunkSize = 4;
                
                for (let i = 0; i < mainContent.length; i += chunkSize) {
                    const chunk = mainContent.slice(i, i + chunkSize);
                    currentText += chunk;
                    updateLastMessage(chatId, currentText);
                    
                    let delay = 10;
                    if (chunk.includes('.')) delay = 30;
                    if (chunk.includes(',')) delay = 20;
                    await new Promise(resolve => setTimeout(resolve, delay));
                }

                // Call Personalization API
                try {
                    const personalData = await apiService.personalizeResponse(
                        mainContent,
                        suggestionsEnabled,
                        inlineSuggestionsEnabled,
                        activePersona,
                        apiConfig
                    );
                    updateLastMessage(chatId, personalData.content, personalData.suggestions);
                } catch (e) {
                     // Fallback if personalization fails
                    const cleaned = mainContent.replace(/\(__ANCHOR__\)/g, '');
                    updateLastMessage(chatId, cleaned);
                }

            } else {
                console.error('Error:', data.error);
                if(chatId) addMessage(chatId, { role: 'assistant', content: "Sorry, I encountered an error." });
            }
        } catch (error) {
            console.error('Fetch error:', error);
            if(chatId) addMessage(chatId, { role: 'assistant', content: "Sorry, I couldn't reach the server." });
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        sendMessage
    };
};

