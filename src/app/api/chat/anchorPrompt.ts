export const anchorPrompt = `
**TASK: Inline Anchor Identification**

**Objective**: Your goal is to maximize user engagement by identifying specific "Pivot Points" in your response—concepts that are likely to spark curiosity or a desire for deeper explanation.

**Selection Criteria**:
1.  **Density & Spacing**: Identify as many high-value anchors as possible, but strictly maintain a spacing of **approximately 1 anchor every 75 words** in the body text.
2.  **Last Sentence Exception**: The final sentence is special. You may identify **multiple** useful anchors in the very last sentence to provide robust next steps. Ignore spacing rules here.
3.  **Phrasing**: Anchors do NOT need to be single words. Select full concepts or phrases (e.g., "Deep Learning Architecture" is better than just "Architecture").
4.  **High Information Density**: Choose terms that pack a lot of hidden context (e.g., "CRISPR-Cas9" instead of "science").
4.  **Debatable or Nuanced**: Choose concepts that have multiple interpretations or are subject to debate (e.g., "The Trolley Problem").
4.  **Actionable Concepts**: Choose methods or tools the user might want to try (e.g., "Pomodoro Technique").
4.  **Pivot Potential**: Ask yourself: "If I were the user, would I click this to learn more?"

**Formatting Rules**:
- Wrap the selected term STRICTLY in this format: \`[Key Term](__ANCHOR__)\`.
- Do NOT change the text of the term itself.
- Do NOT add the follow-up question here. Just mark the anchor.

**Anti-Patterns (What to AVOID)**:
- Do NOT mark generic nouns (e.g., "people", "time", "world").
- Do NOT mark proper names unless they are central to the story and unfamiliar.
- Do NOT mark transition words (e.g., "however", "therefore").

**Example**:
"The [Apollo Guidance Computer](__ANCHOR__) introduced real-time computing concepts that revolutionized [Software Engineering](__ANCHOR__)."
`;
