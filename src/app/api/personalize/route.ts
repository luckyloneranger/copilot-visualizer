import { NextResponse } from 'next/server';
import { createAzureClient } from '@/services/openaiClient';
import { buildPersonalizationPrompt, safeParseJson } from '@/services/promptPipeline';

export async function POST(req: Request) {
  try {
        const { 
            mainContent,
            userMessage, // New field 
            suggestionsEnabled, 
            inlineSuggestionsEnabled, 
            activePersona,
            apiConfig,
            promptOverrides
        } = await req.json();

        const { client, config } = createAzureClient(apiConfig);

    // --- STEP 2: HYDRATE & PERSONALIZE ---
    let finalSuggestions: string[] = [];
    let hydratedContent = mainContent;

    const personaBlurb = activePersona && activePersona.id !== 'default'
      ? `${activePersona.role} (${activePersona.context})`
      : 'General User';

    // Only proceed if we have either inline anchors to fill OR suggestions to generate
    const hasAnchors = mainContent.includes('(__ANCHOR__)');
    
    if (suggestionsEnabled || (inlineSuggestionsEnabled && hasAnchors)) {
        
        const personalizationPrompt = buildPersonalizationPrompt(promptOverrides, {
          inlineSuggestionsEnabled,
          suggestionsEnabled,
          hasAnchors,
          personaBlurb,
        });

        const personalizationCompletion = await client.chat.completions.create({
            messages: [
                { role: 'system', content: personalizationPrompt },
                { role: 'user', content: `Original User Query: "${userMessage || 'Unknown'}"\n\nAssistant's Response:\n"${mainContent}"` } 
            ],
            model: config.deployment,
            response_format: { type: "json_object" } 
        });

        try {
            const rawJson = personalizationCompletion.choices[0].message.content || "{}";
            const personalizationData = safeParseJson<Record<string, any>>(rawJson, {});

            // 1. Hydrate Inline Anchors
            if (personalizationData.anchors) {
                // Better approach: Regex replace `\[(.*?)\]\(__ANCHOR__\)`
                hydratedContent = hydratedContent.replace(/\[(.*?)\]\(__ANCHOR__\)/g, (match: string, rawTerm: string) => {
                    // Clean the term for lookup (remove markdown bold/italic)
                    const cleanKey = rawTerm.replace(/[\*_`]/g, '').trim();
                    
                    // Try to find exact match with cleaned key
                    let question = personalizationData.anchors[cleanKey];
                    // Also try with original raw term just in case
                    if (!question) question = personalizationData.anchors[rawTerm];
                    
                    // Fallback: Try case-insensitive on cleaned key
                    if (!question) {
                        const key = Object.keys(personalizationData.anchors).find((k: string) => k.toLowerCase() === cleanKey.toLowerCase());
                        if (key) question = personalizationData.anchors[key];
                    }

                    // Fallback: Try case-insensitive on raw term
                    if (!question) {
                         const key = Object.keys(personalizationData.anchors).find((k: string) => k.toLowerCase() === rawTerm.toLowerCase());
                         if (key) question = personalizationData.anchors[key];
                    }

                    // Fallback: If still no question, return the term (keeping formatting from regex capture if any) inside the result? 
                    // No, if we return `rawTerm`, it replaces `[rawTerm](__ANCHOR__)` with just `rawTerm`.
                    // The user wants it to look like an anchor if it fails? 
                    // Wait, the client side fix I made earlier handles `href="__ANCHOR__"`! 
                    // So if personalization FAILS for a specific term, we should probably keep it as an anchor 
                    // But here we are returning `term` which STRIPS the anchor markdown.
                    
                    if (!question) return `[${rawTerm}](__ANCHOR__)`; 

                    return `[${rawTerm}](suggestion:${question})`;
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
            // In case of error, preserve the original anchors so they still render as interactive pivots
            // do nothing, let hydratedContent stay as is (which contains anchors)
        }
    } else {
        hydratedContent = hydratedContent.replace(/\[([^\]]*)\]\(__ANCHOR__\)/g, '$1');
    }

    return NextResponse.json({
        content: hydratedContent,
        suggestions: finalSuggestions
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error in personalization API:', error);
    return NextResponse.json({ 
      error: 'Personalization failed', 
      details: errorMessage 
    }, { status: 500 });
  }
}
