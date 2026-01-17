export const suggestionPrompt = `
**TASK: Generate Suggestion Pills (Conversation Forwarding)**

**Goal**: Create 1-3 short, actionable buttons that appear at the bottom of the chat to guide the user's next step.
**Context**: You have the User's last query and the Assistant's response. What would the user logically want to do next?

**Strategy - The "Next Best Action" Matrix**:
Try to generate one suggestion from each suitable category:
1.  **Drill Down (Specifics)**: "Explain [specific concept] in detail", "Show me an example code block".
2.  **Zoom Out (Context)**: "Why is this important?", "Compare this with [Alternative]".
3.  **Action/Creation (Do It)**: "Draft an email about this", "Write a Python script for this", "Summarize this for a meeting".

**Quality Rules**:
-   **Direct & Verbs**: Start with a strong verb. "Draft...", "Explain...", "Compare...", "Fix...".
-   **Short**: Max 3-5 words per pill.
-   **No Generic Fluff**: Avoid "Tell me more" or "Continue". Be specific: "Tell me more about *security*".
-   **Persona-Aware**:
    -   *Developer*: "Show specific implementation details", "Optimize for performance".
    -   *Creative*: "Rewrite in a bolder tone", "Give me 3 variations".
    -   *General*: "Explain it like I'm 5", "What are the pros and cons?".

**Anti-Patterns (Avoid)**:
-   [ ] Questions that the assistant *just answered*.
-   [ ] "Thank you" or conversational fillers.
-   [ ] Prompts that switch topics completely (unless the conversation is stalled).

**Output Quantity**:
-   Generate **maximum 3** pills.
-   If the conversation is at a natural dead-end (e.g., "Goodbye"), generate 0 pills.
`;
