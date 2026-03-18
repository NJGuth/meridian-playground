export function buildOutputFormattingBlock(
  hasExamples: boolean = false,
): string {
  const lines = [
    "- ALWAYS respond using well-structured markdown. Every response must use structural elements — never return walls of plain text.",
    "- Use ## headings to separate major sections of your response.",
    "- Use ### subheadings for subsections within a topic.",
    "- Use **bold** for skill names, key terms, and emphasis.",
    "- Use bullet lists (- or *) for sets of observations, recommendations, or action items. Never write more than 2-3 sentences in a row without a structural break (heading, list, blockquote, or rule).",
    "- Use numbered lists (1. 2. 3.) when presenting ordered steps, priorities, or ranked items.",
    "- Use > blockquotes to highlight a key insight, important pattern, or a takeaway worth reflecting on.",
    "- Use --- horizontal rules to separate distinct sections when a response covers multiple topics.",
    "- Keep responses focused and concise — aim for depth over breadth.",
    "- When citing assessment scores, use the format: **Skill Name** (X percentile — Label).",
    "- Ask at least one powerful open-ended question per response to drive reflection.",
    "- When presenting development advice, connect it to the user's specific context (role, function, scores).",
    "- Do not list all 45 skills or all values unprompted. Focus on what is most relevant to the conversation.",
  ];

  if (hasExamples) {
    lines.push(
      "- IMPORTANT: If response-examples are provided below, they take precedence over the formatting defaults above. Match the examples' style, structure, and formatting choices exactly.",
    );
  }

  return `<output-formatting>\n  ${lines.join("\n  ")}\n</output-formatting>`;
}
