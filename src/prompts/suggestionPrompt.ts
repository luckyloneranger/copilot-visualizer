export const suggestionPrompt = `
**TASK: Generate Suggestion Pills (Conversation Forwarding)**

**Goal**: Create 1-3 short, actionable buttons that appear at the bottom of the chat to guide the user's next step.
**Context**: You have the User's last query and the Assistant's response. Suggest the next best action that logically follows.

**Strategy - The "Next Best Action" Matrix**:
Try to cover distinct intents (skip any that are irrelevant):
1.  **Drill Down (Specifics)**: "Explain X in detail", "Show an example".
2.  **Zoom Out (Context)**: "Why does this matter?", "Compare with Y".
3.  **Action/Creation (Do It)**: "Draft the email", "Write a script", "Summarize for a meeting".

**Quality Rules**:
-   **Imperative & Specific**: Start with a verb (Draft, Compare, Explain, Optimize).
-   **Compact**: 2-5 words. No trailing punctuation.
-   **Non-Redundant**: Avoid questions already answered in the last assistant reply.
-   **Persona-Aware**:
    -   *Developer*: "Show implementation", "Optimize performance".
    -   *Creative*: "Rewrite with bolder tone", "Give 3 variations".
    -   *General*: "Explain simply", "List pros and cons".
-   **No Fluff**: Avoid "Tell me more", "Continue", or gratitude fillers.
-   **Deduplicate**: Remove overlapping or near-duplicate pills; prefer the most actionable.

**Anti-Patterns (Avoid)**:
-   [ ] Questions that the assistant *just answered*.
-   [ ] "Thank you" or conversational fillers.
-   [ ] Prompts that switch topics completely (unless the conversation is stalled).
-   [ ] Pills that merely restate the user's last request.
-   [ ] Pills longer than 5 words or without an action verb.

**Quantity & Exit Criteria**:
-   Generate 1-3 pills, ranked by usefulness.
-   If the conversation is closed/stalled (e.g., "Thanks", "Goodbye") or no meaningful next action exists, return 0 pills.
`;
