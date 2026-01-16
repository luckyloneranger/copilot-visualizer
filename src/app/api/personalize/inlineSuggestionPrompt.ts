export const inlineSuggestionPrompt = `
**TASK: Inline Anchor Hydration (Generating "Click-Worthy" Questions)**

**Goal**: You will receive a text with marked anchors like \`[Term](__ANCHOR__)\`. Your job is to generate a **single, short, high-value follow-up question** for each valid anchor. This question appears when the user hovers over the term.

**The "Click-Worthy" Test (Selection Criteria)**:
1.  **Skip Trivial Anchors**: If a term is self-explanatory or generic (e.g., "email", "time", "internet"), return \`null\` or exclude it.
2.  **Anticipate the Next Step (Contextual Logic)**: The question must logically flow from how the anchor is *used* in the sentence.
    -   *Context*: "We used OAuth 2.0 to secure the API." -> *Good*: "How does the token flow work?"
    -   *Context*: "OAuth 2.0 was originally created in 2012." -> *Good*: "What protocols did it replace?"
    -   *CRITICAL*: Ensure the question specifically relates to the **anchor term**. Do not ask a general question about the whole paragraph that ignores the specific anchor.
3.  **Specific > Broad**: Avoid "Tell me more about X". Ask about specific aspects like "Pros/Cons", "Usage", "Cost", or "Implementation".

**Question Style Guidelines**:
-   **Length**: STRICTLY under **8 words**. Short and punchy.
-   **Tone**: Curious, direct, and professional.
-   **Format**: Always a question. No statements.

**Persona Adaptation (CRITICAL)**:
You have been provided with a **User Persona** above. You MUST analyze this persona (Role & Context) to determine the *angle* of the question.

**Relevance Check (The "Don't Force It" Rule)**:
- **Priority**: Contextual Relevance > Persona Alignment.
- **Instruction**: Apply user persona flavor ONLY if it feels natural for the specific term and context.
- **Example**: If a CTO reads about "Integer Overflow", do NOT force a business strategy question. Ask about stability or risk instead.

1.  **Analyze the Role**: Who is asking? (e.g., A CTO cares about strategy, a Junior Dev cares about syntax).
2.  **Analyze the Context**: What are their goals? (e.g., "Debugging" vs "Planning").
3.  **Adapt the Angle**:
    -   *If Technical* (and relevant): Ask about implementation, performance, errors, or syntax.
    -   *If Strategic/Business* (and relevant): Ask about cost, ROI, risk, or timeline.
    -   *If Creative* (and relevant): Ask about style, tone, emotion, or narrative.
    -   *If Educational/Novice*: Ask "How does it work?" or "Why does this matter?".

**Examples of Quality Upgrades**:
| Anchor Term | Context | BAD Question | GOOD Question |
| :--- | :--- | :--- | :--- |
| **Docker** | "We containerized the app using Docker." | What is Docker? | How do I write a Dockerfile? |
| **Inflation** | "The economy is suffering from high inflation." | Tell me about inflation. | How does the Fed control this? |
| **Photosynthesis** | "Plants use photosynthesis to create energy." | How does it work? | What is the role of chlorophyll? |
| **MVP** | "We need to launch an MVP soon." | define MVP. | What features belong in an MVP? |

**Output Instruction**: 
Return a JSON object where keys are the exact anchor text (clean) and values are your generated questions.
`;
