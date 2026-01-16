export const anchorPrompt = `
**TASK: Inline Anchor Identification (Rich Text Annotation)**

**Objective**: Enhance the user's reading experience by identifying specific "Pivot Points" in your response—concepts that are likely to spark curiosity or a desire for deeper explanation. These will become interactive tooltips.

**CRITICAL INSTRUCTION - INTEGRATION**:
You are NOT generating a list. You are generating the **system/assistant response** with these special markers embedded directly in the text.

**Selection Principles (The "Deep Dive" Test)**:
1.  **The "Wikipedia Title" Standard**: Only select terms that would be the *title* of their own Wikipedia page or a specific section in technical documentation.
2.  **Logical Spans & Compound Terms**:
    -   Anchor the **full phrase** that constitutes the concept. Do not chop it up.
    -   *Yes*: "Convolutional Neural Networks", "Text on the image", "Verbal disclosure in the episode".
    -   *No*: "Networks", "Text", "disclosure".
3.  **Domain Specificity**: Prioritize specific tools, protocols, named theories, or defined methodologies relevant to the topic.
    -   *Tech*: "OAuth 2.0", "Dijkstra's Algorithm", "Kubernetes".
    -   *Business/Legal*: "ROI", "NDA", "GDPR", "Verbal Disclosure", "Affiliate Link".
    -   *Creative*: "Hero's Journey", "Rule of Thirds".
    -   *Bad*: "Authentication", "Algorithm", "Containerization" (Too generic unless comparing).
4.  **Actionable Frameworks**: Highlight techniques users can apply immediately.
    -   *Good*: "Pomodoro Technique", "SMART Goals", "Zero Trust Architecture".

**Persona-Aware Anchoring**:
-   **For Beginners**: Anchor fundamental concepts (e.g., "API", "HTTP").
-   **For Experts**: informative concepts only. Skip basics. Anchor advanced nuances (e.g., "Idempotency", "Race Condition", "Asymptotic Analysis").

**Formatting Rules (STRICT)**:
1.  **Syntax**: Wrap the selected term STRICTLY in this format: \`[Key Term](__ANCHOR__)\`.
2.  **No Text Changes**: Do NOT change the text of the term itself.
3.  **Punctuation**: Keep punctuation *outside* the brackets.
    -   *Correct*: ...using [React](__ANCHOR__).
    -   *Incorrect*: ...using [React.](__ANCHOR__)
4.  **Code Blocks**: **NEVER** add anchors inside \`code blocks\` or \`\`\`code snippets\`\`\`. This breaks syntax highlighting.

**Types of "Bad" Anchors (Anti-Patterns)**:
-   **Broad/Empty Words**: "Efficiency", "Security", "Scalability", "solutions", "approaches".
-   **Marketing Fluff**: "Seamless experience", "Powerful tools", "Next-gen".
-   **Verbs/Adjectives**: "optimize", "robust", "fast", "deploy".
-   **Connectors**: "However", "Therefore", "In conclusion".

**Density Guidelines**:
-   **Limit**: Maximum **1-2 anchors** per paragraph. Do not clutter the text.
-   **Lists**: For bulleted lists, you MAY include **1 anchor per list item** if it contains a key concept.
-   **Distribution**: Spread them out. Do not put two anchors in the same sentence unless investigating a direct comparison.
-   **Last Sentence Exception**: The final sentence is special. You may identify up to 2 useful anchors in the very last sentence to provide robust next steps.

**Example Output (Demonstrating Pivot Points)**:
"When placing ads effectively, consider the platform's constraints. For image-first platforms, ensure the disclosure appears as [Text on the image](__ANCHOR__) rather than buried in the caption.

**FTC Guidelines for Social Media**:
*   **Podcasts**: Include a [Verbal disclosure in the episode](__ANCHOR__) at the start.
*   **Blogs**: Place the statement immediately adjacent to the [Affiliate Link](__ANCHOR__).

To ensure full compliance, would you like to review the specific [Safe Harbor Provisions](__ANCHOR__) or generate a [Disclosure Template](__ANCHOR__)?"
`;
