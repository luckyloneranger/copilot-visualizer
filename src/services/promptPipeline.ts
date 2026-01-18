import { PromptOverrides } from '@/types';
import { DEFAULT_PROMPTS } from '@/prompts/defaultPrompts';

type PromptKey = keyof PromptOverrides;

const resolvePrompt = (overrides: PromptOverrides | undefined, key: PromptKey): string => {
  const value = overrides?.[key];
  return value && value.trim() ? value : DEFAULT_PROMPTS[key];
};

const buildChatSystemPrompt = (overrides: PromptOverrides | undefined, inlineSuggestionsEnabled: boolean): string => {
  const systemPromptSource = resolvePrompt(overrides, 'systemPrompt');
  const anchorPromptSource = resolvePrompt(overrides, 'anchorPrompt');

  let prompt = systemPromptSource;
  prompt += `\n\n**CRITICAL INSTRUCTION**: Your response must be **OBJECTIVE, NEUTRAL, and STANDARD**. 
    - Do NOT adapt your tone, style, or depth to any specific user persona. 
    - Provide a general-purpose explanation suitable for a wide audience.
    - Do NOT provide code blocks unless specifically asked for in the user's message.
    - Do NOT provide "next steps" or "recommendations" lists at the end of your response.`;

  if (inlineSuggestionsEnabled) {
    prompt += `\n\n${anchorPromptSource}`;
  }

  return prompt;
};

const buildPersonalizationPrompt = (
  overrides: PromptOverrides | undefined,
  options: { inlineSuggestionsEnabled: boolean; suggestionsEnabled: boolean; hasAnchors: boolean; personaBlurb: string }
) => {
  const inlinePromptSource = resolvePrompt(overrides, 'inlineSuggestionPrompt');
  const suggestionPromptSource = resolvePrompt(overrides, 'suggestionPrompt');
  const { inlineSuggestionsEnabled, suggestionsEnabled, hasAnchors, personaBlurb } = options;

  let personalizationPrompt = `You are a smart Personalization Engine. Your goal is to select the BEST follow-up actions based on the content.
  
  PRIORITY 1: Content Relevance. The suggestion must make sense for the topic discussed.
  PRIORITY 2: Persona Alignment. ONLY if the suggestion is relevant, adapt its phrasing to the persona.
  
  CRITICAL RULE: Do NOT force a persona-based question if it feels unnatural or irrelevant to the text. It is better to have NO suggestion than a bad one.
  \n**User Persona**: ${personaBlurb}`;

  if (inlineSuggestionsEnabled && hasAnchors) {
    personalizationPrompt += `\n\n${inlinePromptSource}\n\nINSTRUCTION: Return a JSON object where potential keys are the anchor terms and values are the generated questions. Only include keys for anchors you decided to keep.`;
  }

  if (suggestionsEnabled) {
    personalizationPrompt += `\n\n${suggestionPromptSource}\n\nINSTRUCTION: Return a JSON array named "pills".`;
  }

  personalizationPrompt += `\n\n**Output Format** (JSON ONLY):\n{${(inlineSuggestionsEnabled && hasAnchors) ? '\n  "anchors": { "Term Name From Text": "Personalized Question", ... }' : ''}${(inlineSuggestionsEnabled && hasAnchors && suggestionsEnabled) ? ',' : ''}${suggestionsEnabled ? '\n  "pills": ["Question 1", "Question 2", ...]' : ''}\n}`;

  return personalizationPrompt;
};

const resolveHomePrompt = (overrides: PromptOverrides | undefined): string => resolvePrompt(overrides, 'homePrompt');
const resolveInlinePrompt = (overrides: PromptOverrides | undefined): string => resolvePrompt(overrides, 'inlineSuggestionPrompt');
const resolveSuggestionPrompt = (overrides: PromptOverrides | undefined): string => resolvePrompt(overrides, 'suggestionPrompt');

const safeParseJson = <T>(content: string, fallback: T): T => {
  try {
    return JSON.parse(content) as T;
  } catch {
    return fallback;
  }
};

export {
  buildChatSystemPrompt,
  buildPersonalizationPrompt,
  resolveHomePrompt,
  resolveInlinePrompt,
  resolveSuggestionPrompt,
  resolvePrompt,
  safeParseJson,
};
