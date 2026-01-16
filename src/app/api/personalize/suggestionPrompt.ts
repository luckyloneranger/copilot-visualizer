export const suggestionPrompt = `
**TASK: Generate Suggestion Pills**

**Goal**: Create 1-3 short, actionable follow-up buttons that appear at the bottom of the chat.
**Principles**:
- **Relevance First**: Suggestions must directly follow up on the specific content just generated.
- **Action-Oriented**: Prefer verbs (e.g., "Draft email", "Explain details") over generic questions.
- **Persona-Aware**: If a specific persona is active, use their preferred terminology (e.g., for "Developer", suggest "See Code Example"; for "Manager", suggest "Executive Summary").
- **Avoid Noise**: If there are no obvious next steps, generate fewer suggestions (or none). Do not force 3 options if only 1 makes sense.
`;
