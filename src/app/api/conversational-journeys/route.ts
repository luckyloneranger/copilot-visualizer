import { NextResponse } from 'next/server';
import { Conversation, RichHook } from '@/types';
import { createAzureClient } from '@/services/openaiClient';
import { resolveHomePrompt, safeParseJson } from '@/services/promptPipeline';

export async function POST(req: Request) {
  try {
    const { conversations, apiConfig, promptOverrides } = await req.json();

    if (!Array.isArray(conversations) || conversations.length === 0) {
      return NextResponse.json({ hooks: [] });
    }

    const normalizeConversations = (items: Conversation[]) =>
      items
        .filter((c) => Array.isArray(c.messages) && c.messages.length >= 1)
        .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
        .slice(0, 10);

    const findLastUserMessage = (c: Conversation): string => {
      const lastUser = [...c.messages].reverse().find((m) => m.role === 'user');
      return (lastUser?.content || '').trim();
    };

    const findLastAssistantMessage = (c: Conversation): string => {
      const lastAssistant = [...c.messages].reverse().find((m) => m.role === 'assistant');
      return (lastAssistant?.content || '').trim();
    };

    const formatText = (value: string, limit = 220) => {
      if (!value) return '';
      return value.length > limit ? `${value.slice(0, limit)}...` : value;
    };

    const formatRecentWindow = (c: Conversation, limit = 6) => {
      const window = c.messages.slice(-limit);
      return window
        .map((m) => {
          const content = formatText(m.content.trim(), 180);
          return `${m.role.toUpperCase()}: ${content}`;
        })
        .join(' \n ');
    };

    const normalized = normalizeConversations(conversations);

    if (normalized.length === 0) {
      return NextResponse.json({ hooks: [] });
    }

    const historySummary = normalized
      .map((c) => {
        const lastUser = formatText(findLastUserMessage(c));
        const lastAssistant = formatText(findLastAssistantMessage(c));
        const closed = /\b(thanks|thank you|done|found it|goodbye|bye)\b/i.test(lastUser || lastAssistant);
        const title = c.title?.trim() || 'Untitled';
        const recentWindow = formatRecentWindow(c);
        return `- Title: "${title}" | messages: ${c.messages.length} | closed_phrase: ${closed} | last_user: "${lastUser}" | last_assistant: "${lastAssistant}" | recent_window: [${recentWindow}]`;
      })
      .join('\n');

    const { client, config } = createAzureClient(apiConfig);

    const homePromptSource = resolveHomePrompt(promptOverrides);

    const completion = await client.chat.completions.create({
      messages: [
        { role: 'system', content: homePromptSource },
        { role: 'user', content: `Here is the user's conversation history:\n\n${historySummary}` }
      ],
      model: config.deployment,
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0].message.content || '{}';
    const data = safeParseJson<Record<string, unknown>>(content, {});

    const isValidHook = (item: unknown): item is RichHook => {
      if (!item || typeof item !== 'object') return false;
      const { title, description, prompt } = item as Partial<RichHook>;
      return [title, description, prompt].every((v) => typeof v === 'string' && v.trim().length > 0);
    };

    const hooks = Array.isArray((data as any).hooks) ? (data as any).hooks.filter(isValidHook) : [];

    return NextResponse.json({ hooks });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error in contextual suggestions API:', error, errorMessage);
    return NextResponse.json({ hooks: [] }); // Fallback to empty on error
  }
}
