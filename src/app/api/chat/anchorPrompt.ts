export const anchorPrompt = `
**TASK: Inline Anchor Identification**

**Objective**: Your goal is to maximize user engagement by identifying specific "Pivot Points" in your response—concepts that are likely to spark curiosity or a desire for deeper explanation.

**Selection Principles (The "Deep Dive" Test)**:
1.  **The Wikipedia Standard**: Only select terms that would be the *title* of their own Wikipedia page or technical documentation section.
2.  **Compound Nouns over Single Words**: Prefer "Convolutional Neural Networks" over "Networks". Prefer "Azure Blob Storage" over "Storage".
3.  **Novelty & Tech-Specificity**: Prioritize specific tools, protocols, theories, or named entities over general concepts.
    - *Good*: "OAuth 2.0", "Dijkstra's Algorithm", "Kubernetes", "The Halo Effect".
    - *Bad*: "Authentication", "Algorithm", "Containerization", "Psychology".
4.  **Actionable Methods**: Highlight specific techniques the user can apply.
    - *Good*: "Pomodoro Technique", "SMART Goals", "Test-Driven Development".

**Density & Spacing Rules**:
1.  **One Anchor per Paragraph (approx)**: Aim for 1 anchor every 60-80 words. Do NOT clutter the text.
2.  **Last Sentence Exception**: The final sentence is special. You may identify up to 2 useful anchors in the very last sentence to provide robust next steps.
3.  **Natural Flow**: The anchor must fit grammatically into the sentence. Do not change the text.

**formatting Rules**:
- Wrap the selected term STRICTLY in this format: \`[Key Term](__ANCHOR__)\`.
- Do NOT change the text of the term itself.
- Do NOT add the follow-up question here. Just mark the anchor.
- **CRITICAL**: Do NOT create a separate list of anchors. Do NOT label them with "Anchor:". They **must** be embedded naturally within the flow of the paragraph.

**Anti-Patterns (STRICTLY PROHIBITED)**:
- **Broad Categories**: "Efficiency", "Security", "Scalability", "Integration".
- **Marketing Fluff**: "Seamless experience", "Powerful tools", "Next-gen solution".
- **Common Verbs**: "optimize", "configure", "deploy".
- **Generic Connectors**: "However", "Therefore", "In conclusion".
- **Too Wide**: "Computer Science", "Business", "Marketing" (unless comparing fields).

**Good Examples**:

1.  *Technical*: "To improve latency, we implemented [Edge Computing](__ANCHOR__) nodes closer to the user, reducing reliance on the central [Cloud Availability Zone](__ANCHOR__)."
2.  *Business*: "The company's [Go-To-Market Strategy](__ANCHOR__) relies heavily on [Product-Led Growth](__ANCHOR__) rather than traditional sales."
3.  *Creative*: "The protagonist suffers from a classic [Hero's Journey](__ANCHOR__) conflict, mirroring the archetype of [The Reluctant Hero](__ANCHOR__)."
`;
