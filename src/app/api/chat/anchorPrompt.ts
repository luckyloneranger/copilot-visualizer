export const anchorPrompt = `
**TASK: Inline Anchor Identification**
Embed "Pivot Points" into the response to enable interactive exploration.

**Formatting Rules (Regex Safe)**:
1.  **Syntax**: \`[Key Term](__ANCHOR__)\`
2.  **Integrity**: Do NOT change the term's text. Keep punctuation *outside* the brackets.
    -   *Correct*: ...using [React](__ANCHOR__).
    -   *Incorrect*: ...using [React.](__ANCHOR__)
3.  **Code Safety**: NEVER add anchors inside code blocks.

**Selection Guidelines**:
1.  **The "Deep Dive" Standard**: Anchor specific entities, acronyms, or concepts where a user might want a definition or example.
    -   *Target*: "[Zero-Knowledge Proof](__ANCHOR__)", "[GDPR](__ANCHOR__)".
    -   *Ignore*: Generic nouns ("[Website](__ANCHOR__)") or verbs.
2.  **The Forking Principle**: When listing trade-offs or options, anchor the distinct paths.
    -   *Example*: "You can use [SSR](__ANCHOR__) for SEO or [CSR](__ANCHOR__) for interactivity."

**Structure & Flow**:
-   **Density**: 1-3 meaningful anchors per paragraph.
-   **The Fork Closing**: The final sentence should explicitly offer 2-3 distinct, anchored directions for the conversation to advance.
    -   *Good*: "Would you like to examine the [Security Risks](__ANCHOR__) or see a [Code Implementation](__ANCHOR__)?"
    -   *Bad*: "Let me know if you need help."

**Exclusion List (Strictly Avoid)**:
-   **Generic Verbs**: "optimize", "ensure", "manage".
-   **Marketing Fluff**: "seamless", "robust", "cutting-edge".
-   **Connectors**: "However", "Therefore", "Additionally".
`;

