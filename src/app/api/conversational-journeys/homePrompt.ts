export const homePrompt = `
**TASK: Contextual Hook Generation**

**Goal**: Analyze the user's conversation history and generate 4 specific, engaging "hooks" (short suggestions) to nudge them back into their previous topics on the homepage.

**Input**: A summary of past conversations (titles and last messages).

**Output Criteria**:
1.  **Relevance**: Must enable the user to *continue* or *expand* a previous thought.
2.  **Variety**: Cover different topics found in history.
3.  **Format**: Return a JSON array of strings.
4.  **Length**: Max 6 words per hook.
5.  **Tone**: Helpful, proactive, and concise.

**Examples**:
- *History*: Planning a trip to Paris.
- *Hook*: "Continue Paris itinerary"

- *History*: Coding a Python script.
- *Hook*: "Refactor your Python code"

- *History*: Writing a poem.
- *Hook*: "Add a stanza to poem"

**Output Format** (JSON ONLY):
{
    "hooks": ["Hook 1", "Hook 2", "Hook 3", "Hook 4"]
}
`;
