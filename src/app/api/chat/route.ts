import { NextResponse } from 'next/server';
import { AzureOpenAI } from 'openai';
import { systemPrompt } from './systemPrompt';
import { anchorPrompt } from './anchorPrompt';

export async function POST(req: Request) {
  try {
    const { messages, inlineSuggestionsEnabled, apiConfig } = await req.json();

    const endpoint = apiConfig?.endpoint || process.env.AZURE_OPENAI_ENDPOINT;
    const apiKey = apiConfig?.apiKey || process.env.AZURE_OPENAI_API_KEY;
    const deployment = apiConfig?.deployment || process.env.AZURE_OPENAI_DEPLOYMENT;
    const apiVersion = apiConfig?.apiVersion || process.env.AZURE_OPENAI_API_VERSION;

    if (!endpoint || !apiKey || !deployment) {
      return NextResponse.json(
        { error: 'Azure OpenAI credentials are not configured. Please set them in the settings or environment variables.' },
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
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request.', details: errorMessage },
      { status: 500 }
    );
  }
}
