import { NextResponse } from 'next/server';
import { Conversation } from '@/types';
import { createAzureClient } from '@/services/openaiClient';
import { resolveHomePrompt, safeParseJson } from '@/services/promptPipeline';

export async function POST(req: Request) {
  try {
    const { conversations, apiConfig, promptOverrides } = await req.json();

    if (!conversations || conversations.length === 0) {
        return NextResponse.json({ hooks: [] });
    }

    // Format history for the prompt (limit to last 5 chats or titles)
    const historySummary = conversations.slice(0, 5).map((c: Conversation) => {
      const lastMsg = c.messages[c.messages.length - 1]?.content || "";
      return `- Chat Title: "${c.title}". Last User Input/Context: "${lastMsg.slice(0, 100)}..."`;
    }).join('\n');

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

    const content = completion.choices[0].message.content || "{}";
    const data = safeParseJson<Record<string, unknown>>(content, {});

    return NextResponse.json({
        hooks: Array.isArray((data as any).hooks) ? (data as any).hooks : []
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error in contextual suggestions API:', error, errorMessage);
    return NextResponse.json({ hooks: [] }); // Fallback to empty on error
  }
}
