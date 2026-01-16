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
