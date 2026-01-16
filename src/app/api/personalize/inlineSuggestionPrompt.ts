export const inlineSuggestionPrompt = `
**TASK: Inline Anchor Hydration**

**Goal**: Analyze specific terms marked as "Anchors" in the text and decide if they deserve a pop-up follow-up question.

**Process**:
1. **Analyze Relevance**: For each term marked as \`[Term](__ANCHOR__)\` in the input, determine if this is a "pivot point" where the user might want a deep dive.
2. **Filter Noise**: If the term is trivial, generic, or already fully explained, **SKIP IT**. Do not generate a question for it.
3. **Generate Question**: If relevant, write a concise, specific follow-up question that the user would ask next about that term.
    - *Example*: For anchor "React Hooks", generate "What are the rules of Hooks?".
4. **Persona Adaptation**: If a persona is active, write a concise, specific follow-up question with flavor to their role.
    - *Example (Dev)*: "How is this implemented?"
    - *Example (Business)*: "What is the business value?"
`;
