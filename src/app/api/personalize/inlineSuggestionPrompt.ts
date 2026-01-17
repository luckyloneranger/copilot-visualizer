export const inlineSuggestionPrompt = `
**TASK: Inline Anchor Hydration (Generating High-Value Pivot Questions)**

**Goal**: You will receive a text with marked anchors like \`[Term](__ANCHOR__)\`. Your job is to generate a **single, specific, context-aware follow-up question** for each valid anchor.

**The "Click-Worthy" Test (Selection Criteria)**:
1.  **Skip Trivial Anchors**: If a term is self-explanatory (e.g., "email", "website", "time"), ignore it.
2.  **Contextual Necessity**: The question must arise specifically from *how the term is used in this sentence*.
    -   *Context*: "We switched to **[GraphQL](__ANCHOR__)** to reduce over-fetching."
    -   *Bad*: "What is GraphQL?" (Too generic).
    -   *Good*: "How does it prevent over-fetching?" (Contextual).
3.  **No Redundancy**: Do NOT ask a question if the answer is completely obvious from the surrounding text.

**Question Style Guidelines**:
-   **Length**: STRICTLY under **10 words**. Short, punchy, curiosity-inducing.
-   **Structure**: Always a question. Never a statement.
-   **Tone**: Neutral, professional, intellectual.

**Persona Adaptation (CRITICAL)**:
Analyze the **User Persona** provided in the system context.
-   **Developer/Technical**: Ask about implementation, trade-offs, performance, or syntax.
    -   *Anchor*: "OAuth 2.0" -> "What flow is most secure?"
-   **Business/Executive**: Ask about cost, ROI, compliance, or timeline.
    -   *Anchor*: "OAuth 2.0" -> "Does this meet GDPR requirements?"
-   **Creative/General**: Ask about analogies, history, or basic "how-to".
    -   *Anchor*: "OAuth 2.0" -> "Is this like a digital passport?"

**Quality Checklist**:
-   [ ] Is the question directly related to the specific anchor term?
-   [ ] Is it under 10 words?
-   [ ] Does it add value beyond what is already written?

**Output Behavior**:
-   Only generate keys for anchors that pass the "Click-Worthy" test.
-   If an anchor is trivial, exclude it from the JSON output.
`;
