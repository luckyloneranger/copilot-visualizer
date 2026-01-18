// UI Constants
export const SCROLL_CONSTANTS = {
  DISTANCE_TO_DISABLE_AUTO_SCROLL: 50, // px from bottom before auto-scroll stops
  DISTANCE_TO_RE_ENABLE_AUTO_SCROLL: 10, // px from bottom to re-enable auto-scroll
} as const;

// Streaming Constants
export const STREAMING_CONSTANTS = {
  DEFAULT_CHUNK_SIZE: 4,
  DEFAULT_DELAY: 10, // ms
  PERIOD_DELAY: 30, // ms
  COMMA_DELAY: 20, // ms
} as const;

// Persistence Constants
export const STORAGE_CONSTANTS = {
  DEBOUNCE_DELAY: 1000, // ms - delay before saving to localStorage
  KEYS: {
    CONVERSATIONS: 'copilot-conversations',
    SUGGESTIONS_ENABLED: 'copilot-suggestions-enabled',
    INLINE_SUGGESTIONS_ENABLED: 'copilot-inline-suggestions-enabled',
    CONTEXTUAL_HOOK_ENABLED: 'copilot-contextual-hook-enabled',
    PERSONAS: 'copilot-personas',
    ACTIVE_PERSONA: 'copilot-active-persona',
    API_CONFIG: 'copilot-api-config',
    PROMPT_OVERRIDES: 'copilot-prompt-overrides',
  }
} as const;

// Default Values
export const DEFAULT_CHIPS = [
  "Create an image",
  "Recommend a product",
  "Improve writing",
  "Take a quiz",
  "Write a first draft",
  "Draft a text",
  "Write a speech",
  "Say it with care"
];

export const DEFAULT_PERSONAS = [
  { id: 'default', name: 'Default', role: 'General User', context: 'Standard responses.' },
  { id: 'dev', name: 'Developer', role: 'Software Engineer', context: 'Prefer technical, code-heavy, and concise responses.' },
  { id: 'creative', name: 'Creative', role: 'Writer', context: 'Use vivid language, metaphors, and elaborated explanations.' }
];

export const AZURE_DEFAULT_API_VERSION = '2024-02-15-preview';
