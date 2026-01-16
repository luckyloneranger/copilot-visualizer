import { NextResponse } from 'next/server';
import { AzureOpenAI } from 'openai';
import { homePrompt } from './homePrompt';

export async function POST(req: Request) {
  try {
    const { conversations, apiConfig } = await req.json();

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
    const historySummary = conversations.slice(0, 5).map((c: any) => {
        const lastMsg = c.messages[c.messages.length - 1]?.content || "";
        return `- Chat Title: "${c.title}". Last User Input/Context: "${lastMsg.slice(0, 100)}..."`;
    }).join('\n');

    const client = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment });

    const completion = await client.chat.completions.create({
      messages: [
        { role: 'system', content: homePrompt },
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

  } catch (error: any) {
    console.error('Error in contextual suggestions API:', error);
    return NextResponse.json({ hooks: [] }); // Fallback to empty on error
  }
}
