import { NextResponse } from 'next/server';
import { AzureOpenAI } from 'openai';
import { suggestionPrompt } from './suggestionPrompt';
import { inlineSuggestionPrompt } from './inlineSuggestionPrompt';

export async function POST(req: Request) {
  try {
    const { 
        mainContent, 
        suggestionsEnabled, 
        inlineSuggestionsEnabled, 
        activePersona,
        history // Optional: conversation history if needed for context
    } = await req.json();

    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const apiKey = process.env.AZURE_OPENAI_API_KEY;
    const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;
    const apiVersion = process.env.AZURE_OPENAI_API_VERSION;

    if (!endpoint || !apiKey || !deployment) {
      return NextResponse.json({ error: 'Config missing' }, { status: 500 });
    }

    const client = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment });

    // --- STEP 2: HYDRATE & PERSONALIZE ---
    let finalSuggestions: string[] = [];
    let hydratedContent = mainContent;

    // Only proceed if we have either inline anchors to fill OR suggestions to generate
    const hasAnchors = mainContent.includes('(__ANCHOR__)');
    
    if (suggestionsEnabled || (inlineSuggestionsEnabled && hasAnchors)) {
        
        let personalizationPrompt = `You are a smart Personalization Engine. Your goal is to select the BEST follow-up actions based on the content.
        
        PRIORITY 1: Content Relevance. The suggestion must make sense for the topic discussed.
        PRIORITY 2: Persona Alignment. ONLY if the suggestion is relevant, adapt its phrasing to the persona.
        
        CRITICAL RULE: Do NOT force a persona-based question if it feels unnatural or irrelevant to the text. It is better to have NO suggestion than a bad one.`;
        
        if (activePersona && activePersona.id !== 'default') {
            personalizationPrompt += `\n**User Persona**: ${activePersona.role} (${activePersona.context})\n`;
        } else {
             personalizationPrompt += `\n**User Persona**: General User\n`;
        }

        if (inlineSuggestionsEnabled && hasAnchors) {
            personalizationPrompt += `\n\n${inlineSuggestionPrompt}\n\nINSTRUCTION: Return a JSON object where potential keys are the anchor terms and values are the generated questions. Only include keys for anchors you decided to keep.`;
        }
        
        if (suggestionsEnabled) {
            personalizationPrompt += `\n\n${suggestionPrompt}\n\nINSTRUCTION: Return a JSON array named "pills".`;
        }

        personalizationPrompt += `\n\n**Output Format** (JSON ONLY):\n{
            ${(inlineSuggestionsEnabled && hasAnchors) ? '"anchors": { "Term Name From Text": "Personalized Question", ... }' : ''}
            ${(inlineSuggestionsEnabled && hasAnchors && suggestionsEnabled) ? ',' : ''}
            ${suggestionsEnabled ? '"pills": ["Question 1", "Question 2", ...]' : ''}
        }`;

        const personalizationCompletion = await client.chat.completions.create({
            messages: [
                { role: 'system', content: personalizationPrompt },
                { role: 'user', content: `Here is the Assistant's response:\n"${mainContent}"` } 
            ],
            model: deployment,
            response_format: { type: "json_object" } 
        });

        try {
            const rawJson = personalizationCompletion.choices[0].message.content || "{}";
            const personalizationData = JSON.parse(rawJson);

            // 1. Hydrate Inline Anchors
            if (personalizationData.anchors) {
                // Better approach: Regex replace `\[(.*?)\]\(__ANCHOR__\)`
                hydratedContent = hydratedContent.replace(/\[(.*?)\]\(__ANCHOR__\)/g, (match: string, term: string) => {
                    // Try to find exact match
                    let question = personalizationData.anchors[term];
                    
                    // Fallback: Try case-insensitive
                    if (!question) {
                        const key = Object.keys(personalizationData.anchors).find((k: string) => k.toLowerCase() === term.toLowerCase());
                        if (key) question = personalizationData.anchors[key];
                    }

                    // Fallback: If still no question, revert to plain text
                    if (!question) return term; 

                    return `[${term}](suggestion:${question})`;
                });
            } else {
                 // Cleanup if no anchors returned: remove brackets and marker
                 hydratedContent = hydratedContent.replace(/\[([^\]]*)\]\(__ANCHOR__\)/g, '$1');
            }

            // 2. Set Pills
            if (suggestionsEnabled && personalizationData.pills && Array.isArray(personalizationData.pills)) {
                finalSuggestions = personalizationData.pills;
            }

        } catch (e) {
            console.error("Failed to parse personalization JSON", e);
            hydratedContent = hydratedContent.replace(/\[([^\]]*)\]\(__ANCHOR__\)/g, '$1');
        }
    } else {
        hydratedContent = hydratedContent.replace(/\[([^\]]*)\]\(__ANCHOR__\)/g, '$1');
    }

    return NextResponse.json({
        content: hydratedContent,
        suggestions: finalSuggestions
    });

  } catch (error: any) {
    console.error('Error in personalization API:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
