import { Message, ApiConfiguration, UserPersona, Conversation, SuggestionItem } from '@/types';

export const apiService = {
  async fetchConversationalHooks(conversations: Conversation[], apiConfig: ApiConfiguration): Promise<SuggestionItem[]> {
    try {
      const response = await fetch('/api/conversational-journeys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversations, apiConfig })
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
    apiConfig: ApiConfiguration
  ) {
    const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            messages,
            suggestionsEnabled,
            inlineSuggestionsEnabled,
            activePersona,
            apiConfig
        }),
    });
    return response.json();
  },

  async personalizeResponse(
    mainContent: string,
    suggestionsEnabled: boolean,
    inlineSuggestionsEnabled: boolean,
    activePersona: UserPersona | undefined,
    apiConfig: ApiConfiguration
  ) {
    const response = await fetch('/api/personalize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            mainContent,
            suggestionsEnabled,
            inlineSuggestionsEnabled,
            activePersona,
            apiConfig
        })
    });
    if (!response.ok) throw new Error('Personalization failed');
    return response.json();
  }
};
