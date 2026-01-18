import { PromptOverrides } from '@/types';
import { systemPrompt } from './systemPrompt';
import { anchorPrompt } from './anchorPrompt';
import { suggestionPrompt } from './suggestionPrompt';
import { inlineSuggestionPrompt } from './inlineSuggestionPrompt';
import { homePrompt } from './homePrompt';

export const DEFAULT_PROMPTS: PromptOverrides = {
  systemPrompt,
  anchorPrompt,
  suggestionPrompt,
  inlineSuggestionPrompt,
  homePrompt,
};
