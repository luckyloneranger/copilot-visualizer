import { NextResponse } from 'next/server';
import { AzureOpenAI } from 'openai';
import { systemPrompt } from './systemPrompt';
import { anchorPrompt } from './anchorPrompt';

export async function POST(req: Request) {
  try {
    const { messages, inlineSuggestionsEnabled } = await req.json();

    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const apiKey = process.env.AZURE_OPENAI_API_KEY;
    const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;
    const apiVersion = process.env.AZURE_OPENAI_API_VERSION;

    if (!endpoint || !apiKey || !deployment) {
      return NextResponse.json(
        { error: 'Azure OpenAI environment variables are not configured.' },
        { status: 500 }
      );
    }

    const client = new AzureOpenAI({
      endpoint,
      apiKey,
      apiVersion,
      deployment,
    });

    // --- STEP 1: Generate OBJECTIVE Main Content ---
    let contentSystemPrompt = systemPrompt;

    // Strict instruction for Call 1
    contentSystemPrompt += `\n\n**CRITICAL INSTRUCTION**: Your response must be **OBJECTIVE, NEUTRAL, and STANDARD**. 
    - Do NOT adapt your tone, style, or depth to any specific user persona. 
    - Provide a general-purpose explanation suitable for a wide audience.
    - Do NOT provide code blocks unless specifically asked for in the user's message.
    - Do NOT provide "next steps" or "recommendations" lists at the end of your response.`;

    if (inlineSuggestionsEnabled) {
        contentSystemPrompt += `\n\n${anchorPrompt}`;
    }

    const completion = await client.chat.completions.create({
      messages: [{ role: 'system', content: contentSystemPrompt }, ...messages],
      model: deployment,
    });

    const mainContent = completion.choices[0].message.content || "";

    return NextResponse.json({
      role: 'assistant',
      content: mainContent,
    });
  } catch (error: any) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request.', details: error.message },
      { status: 500 }
    );
  }
}
