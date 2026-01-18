import { ApiConfiguration, Conversation, Message, PromptOverrides, UserPersona } from '@/types';

const isObject = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;
const isString = (value: unknown): value is string => typeof value === 'string';
const isNumber = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);
const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean';

const isMessage = (value: unknown): value is Message => {
  if (!isObject(value)) return false;
  const role = (value as Record<string, unknown>).role;
  const content = (value as Record<string, unknown>).content;
  const suggestions = (value as Record<string, unknown>).suggestions;

  const validRole = role === 'user' || role === 'assistant';
  const validContent = isString(content);
  const validSuggestions = suggestions === undefined || (Array.isArray(suggestions) && suggestions.every(isString));

  return validRole && validContent && validSuggestions;
};

const isConversation = (value: unknown): value is Conversation => {
  if (!isObject(value)) return false;
  const record = value as Record<string, unknown>;
  return (
    isString(record.id) &&
    isString(record.title) &&
    isNumber(record.updatedAt) &&
    Array.isArray(record.messages) &&
    record.messages.every(isMessage)
  );
};

const isConversationList = (value: unknown): value is Conversation[] => Array.isArray(value) && value.every(isConversation);

const isPersona = (value: unknown): value is UserPersona => {
  if (!isObject(value)) return false;
  const record = value as Record<string, unknown>;
  return isString(record.id) && isString(record.name) && isString(record.role) && isString(record.context);
};

const isPersonaList = (value: unknown): value is UserPersona[] => Array.isArray(value) && value.every(isPersona);

const isApiConfiguration = (value: unknown): value is ApiConfiguration => {
  if (!isObject(value)) return false;
  const record = value as Record<string, unknown>;
  return isString(record.endpoint) && isString(record.apiKey) && isString(record.deployment) && isString(record.apiVersion);
};

const isPromptOverrides = (value: unknown): value is PromptOverrides => {
  if (!isObject(value)) return false;
  const record = value as Record<string, unknown>;
  return ['systemPrompt', 'anchorPrompt', 'suggestionPrompt', 'inlineSuggestionPrompt', 'homePrompt'].every((key) => isString(record[key]));
};

export {
  isBoolean,
  isConversation,
  isConversationList,
  isPersona,
  isPersonaList,
  isApiConfiguration,
  isPromptOverrides,
  isString,
};
