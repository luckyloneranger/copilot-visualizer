import { Message, ApiConfiguration, UserPersona, Conversation, SuggestionItem, PromptOverrides } from '@/types';

export const apiService = {
  async fetchConversationalHooks(conversations: Conversation[], apiConfig: ApiConfiguration, promptOverrides: PromptOverrides): Promise<SuggestionItem[]> {
    try {
      const response = await fetch('/api/conversational-journeys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversations, apiConfig, promptOverrides })
      });
      const data = await response.json();
      return Array.isArray(data.hooks) ? data.hooks : [];
    } catch (error) {
      console.error("Failed to fetch contextual hooks", error);
      return [];
    }
  },

  async sendChatMessage(
    messages: Message[], 
    suggestionsEnabled: boolean, 
    inlineSuggestionsEnabled: boolean, 
    activePersona: UserPersona | undefined, 
    apiConfig: ApiConfiguration,
    promptOverrides: PromptOverrides
  ) {
    const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            messages,
            suggestionsEnabled,
            inlineSuggestionsEnabled,
            activePersona,
            apiConfig,
            promptOverrides
        }),
    });
    return response.json();
  },

  async personalizeResponse(
    mainContent: string,
    userMessage: string,
    suggestionsEnabled: boolean,
    inlineSuggestionsEnabled: boolean,
    activePersona: UserPersona | undefined,
    apiConfig: ApiConfiguration,
    promptOverrides: PromptOverrides
  ) {
    const response = await fetch('/api/personalize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            mainContent,
            userMessage,
            suggestionsEnabled,
            inlineSuggestionsEnabled,
            activePersona,
        apiConfig,
        promptOverrides
        })
    });
    if (!response.ok) throw new Error('Personalization failed');
    return response.json();
  }
};
