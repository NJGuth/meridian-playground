export function buildOutputFormattingBlock(
  hasExamples: boolean = false,
): string {
  const lines = [
    "- Use markdown for structure: headings, bold, bullet points.",
    "- Keep responses focused and concise — aim for depth over breadth.",
    "- When citing assessment scores, use the format: **Skill Name** (Xth percentile — Label).",
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
