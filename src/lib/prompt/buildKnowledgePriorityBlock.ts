export function buildKnowledgePriorityBlock(
  hasExamples: boolean = false,
): string {
  const items = [
    "1. Session context (user profile + assessment data) — always ground responses in this user's specific data.",
    "2. AIIR Coaching Guide — governs coaching methodology, session structure, and development principles.",
    "3. LD12 Leadership Framework — defines skill names, dimensions, and domains. Never rename or paraphrase skills.",
    "4. Values Navigator Framework — defines values dimensions and sub-dimensions. Use for motivational context.",
    "5. Identity and tone settings — shape how you communicate, not what you communicate.",
  ];

  if (hasExamples) {
    items.push(
      "6. Response examples — when provided, these define the formatting, structure, and stylistic approach for your responses. They override output-formatting defaults.",
    );
  }

  return `<knowledge-priority>\n  ${items.join("\n  ")}\n</knowledge-priority>`;
}
