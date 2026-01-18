import { NextResponse } from 'next/server';
import { AzureOpenAI } from 'openai';
import { DEFAULT_PROMPTS } from '@/prompts/defaultPrompts';
import { Conversation } from '@/types';

export async function POST(req: Request) {
  try {
    const { conversations, apiConfig, promptOverrides } = await req.json();

    const endpoint = apiConfig?.endpoint || process.env.AZURE_OPENAI_ENDPOINT;
    const apiKey = apiConfig?.apiKey || process.env.AZURE_OPENAI_API_KEY;
    const deployment = apiConfig?.deployment || process.env.AZURE_OPENAI_DEPLOYMENT;
    const apiVersion = apiConfig?.apiVersion || process.env.AZURE_OPENAI_API_VERSION;

    if (!endpoint || !apiKey || !deployment) {
      return NextResponse.json({ error: 'Config missing' }, { status: 500 });
    }

    if (!conversations || conversations.length === 0) {
        return NextResponse.json({ hooks: [] });
    }

    // Format history for the prompt (limit to last 5 chats or titles)
    const historySummary = conversations.slice(0, 5).map((c: Conversation) => {
      const lastMsg = c.messages[c.messages.length - 1]?.content || "";
      return `- Chat Title: "${c.title}". Last User Input/Context: "${lastMsg.slice(0, 100)}..."`;
    }).join('\n');

    const client = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment });

    const homePromptSource = promptOverrides?.homePrompt?.trim() ? promptOverrides.homePrompt : DEFAULT_PROMPTS.homePrompt;

    const completion = await client.chat.completions.create({
      messages: [
        { role: 'system', content: homePromptSource },
        { role: 'user', content: `Here is the user's conversation history:\n\n${historySummary}` }
      ],
      model: deployment,
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0].message.content || "{}";
    const data = JSON.parse(content);

    return NextResponse.json({
        hooks: data.hooks || []
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error in contextual suggestions API:', error, errorMessage);
    return NextResponse.json({ hooks: [] }); // Fallback to empty on error
  }
}
