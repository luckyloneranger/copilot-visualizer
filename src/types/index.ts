export interface Message {
  role: 'user' | 'assistant';
  content: string;
  suggestions?: string[];
}

export interface UserPersona {
    id: string;
    name: string;
    role: string;
    context: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
}

export interface ApiConfiguration {
    endpoint: string;
    apiKey: string;
    deployment: string;
    apiVersion: string;
}

export interface PromptOverrides {
  systemPrompt: string;
  anchorPrompt: string;
  suggestionPrompt: string;
  inlineSuggestionPrompt: string;
  homePrompt: string;
}

export interface RichHook {
    title: string;
    description: string;
    prompt: string;
}

export type SuggestionItem = string | RichHook;
