export const anchorPrompt = `
**TASK: Inline Anchor Identification (Conversation Pivot Points)**

**Objective**: Transform standard text into an interactive learning experience by embedding "Pivot Points" that allow users to investigate concepts deeper or branch the conversation in new directions.

**CRITICAL INSTRUCTION**:
You are generating the standard response with markers embedded. Do NOT list anchors separately.

**Selection Principles (The "Tell Me More" Test)**:
1.  **The "Deep Dive" Standard (Specific Spans)**:
    -   Anchor specific terms, acronyms, or named entities where a user might pause and ask "What exactly does this mean?" or "Show me an example of this."
    -   *Examples*: "[Hydration Mismatch](__ANCHOR__)", "[Zero-Knowledge Proof](__ANCHOR__)", "[GDPR](__ANCHOR__)".
    -   *Constraint*: Do NOT anchor generic nouns like "[Website](__ANCHOR__)" or "[Code](__ANCHOR__)" unless they are part of a specific named concept like "[Clean Code Principles](__ANCHOR__)".

2.  **The "Exploration Node" Standard (Action & Nuance)**: 
    -   Anchor concepts that imply *complexity*, *nuance*, or *action*.
    -   *Weak*: "[Database](__ANCHOR__)" (Static definition).
    -   *Strong*: "[ACID Compliance](__ANCHOR__)" (Implies rules/trade-offs) or "[Sharding Strategy](__ANCHOR__)" (Implies implementation).

3.  **The Forking Principle**:
    -   If you present options or trade-offs, anchor the **opposing choices**.
    -   *Example*: "You can choose between [Optimistic Rendering](__ANCHOR__) for speed or [Server Actions](__ANCHOR__) for simplicity."
    -   This invites the user to click one to explore that specific path.

4.  **Methodologies over Tools**:
    -   Prioritize *patterns* and *techniques* users can apply.
    -   *Tech*: "memoization", "debouncing", "dependency injection".
    -   *General*: "Pareto Principle", "Sunk Cost Fallacy", "Active Listening".

**Formatting Rules (STRICT)**:
1.  **Syntax**: \`[Key Term](__ANCHOR__)\`
2.  **No Text Changes**: Do NOT change the text of the term itself.
3.  **Punctuation**: Keep punctuation *outside* the brackets.
    -   *Correct*: ...using [React](__ANCHOR__).
4.  **Code Blocks**: **NEVER** add anchors inside code blocks.
5.  **Multi-word**: Anchor the full meaningful phrase. \`[Graph RAG](__ANCHOR__)\`, not \`[Graph](__ANCHOR__) RAG\`.

**Density & Distribution**:
-   **Golden Rule**: 1-3 anchors per paragraph. High density is okay IF the paragraph lists distinct options.
-   **The "Fork" Closing**: The final sentence of your response is CRITICAL. It must explicitly offer 2-3 distinct directions for the conversation to go, and EVERY option must be anchored.
    -   *Example*: "Would you like to explore the [Security Implications](__ANCHOR__), see a [Code Example](__ANCHOR__), or discuss [Performance Costs](__ANCHOR__)?"

**Types of "Bad" Anchors (Avoid)**:
-   **Generic Verbs**: "optimize", "ensure", "clarify".
-   **Marketing Fluff**: "Seamless integration", "Robust solution".
-   **Stop Words**: "However", "Therefore".
`;

