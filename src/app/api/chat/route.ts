import { NextResponse } from 'next/server';
import { createAzureClient } from '@/services/openaiClient';
import { buildChatSystemPrompt } from '@/services/promptPipeline';

export async function POST(req: Request) {
  try {
    const { messages, inlineSuggestionsEnabled, apiConfig, promptOverrides } = await req.json();

    const { client, config } = createAzureClient(apiConfig);

    // --- STEP 1: Generate OBJECTIVE Main Content ---
    const contentSystemPrompt = buildChatSystemPrompt(promptOverrides, inlineSuggestionsEnabled);

    const completion = await client.chat.completions.create({
      messages: [{ role: 'system', content: contentSystemPrompt }, ...messages],
      model: config.deployment,
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
