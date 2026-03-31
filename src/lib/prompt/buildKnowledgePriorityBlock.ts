export function buildKnowledgePriorityBlock(
  hasExamples: boolean = false,
  hasHoganKnowledge: boolean = false,
): string {
  const items = [
    "1. Session context (user profile + assessment data) — always ground responses in this user's specific data.",
    "2. AIIR Coaching Guide — governs coaching methodology, session structure, and development principles.",
    "3. LD12 Leadership Framework — defines skill names, dimensions, and domains. Never rename or paraphrase skills.",
    "4. Values Navigator Framework — defines values dimensions and sub-dimensions. Use for motivational context.",
  ];

  if (hasHoganKnowledge) {
    items.push(
      "5. Hogan Interpretation Guide — authoritative Hogan methodology: reputation vs identity, HPI/HDS/MVPI interpretation, configural patterns, and feedback language. Use whenever discussing this user's Hogan results in session context.",
      "6. Hogan Assessment Scales — exact primary scale names, subscales, clusters, and percentile band rules for HPI, HDS, and MVPI.",
    );
  }

  items.push(
    `${hasHoganKnowledge ? "7" : "5"}. Identity and tone settings — shape how you communicate, not what you communicate.`,
  );

  if (hasExamples) {
    items.push(
      `${hasHoganKnowledge ? "8" : "6"}. Response examples — when provided, these define the formatting, structure, and stylistic approach for your responses. They override output-formatting defaults.`,
    );
  }

  return `<knowledge-priority>\n  ${items.join("\n  ")}\n</knowledge-priority>`;
}
