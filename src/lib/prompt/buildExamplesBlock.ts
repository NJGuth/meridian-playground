interface PromptWithExamples {
  content: string;
  positiveExamples: string[];
  negativeExamples: string[];
}

export function buildExamplesBlock(
  prompts: PromptWithExamples[],
): string {
  const goodLines: string[] = [];
  const badLines: string[] = [];

  for (const p of prompts) {
    const promptLabel = p.content.trim() || "general";

    for (const ex of p.positiveExamples) {
      if (ex.trim()) {
        goodLines.push(
          `    <example prompt="${promptLabel}">${ex.trim()}</example>`,
        );
      }
    }

    for (const ex of p.negativeExamples) {
      if (ex.trim()) {
        badLines.push(
          `    <example prompt="${promptLabel}">${ex.trim()}</example>`,
        );
      }
    }
  }

  if (goodLines.length === 0 && badLines.length === 0) return "";

  const sections: string[] = [];

  sections.push(`  <instructions>
    These examples define how you MUST style and format your responses.
    When a user message matches a prompt label, mirror the corresponding example's structure, tone, formatting, and style exactly.
    Examples labeled "general" apply to all responses unless a more specific prompt label matches.
    If an example's style conflicts with other instructions (e.g. output-formatting or rules), the example takes precedence for formatting, structure, length, and stylistic choices.
    Content rules (accuracy, coaching methodology, data integrity) still apply — but HOW you present the content should match these examples.
  </instructions>`);

  if (goodLines.length > 0) {
    sections.push(
      `  <good-responses>\n${goodLines.join("\n")}\n  </good-responses>`,
    );
  }

  if (badLines.length > 0) {
    sections.push(
      `  <bad-responses>\n${badLines.join("\n")}\n  </bad-responses>`,
    );
  }

  return `<response-examples>\n${sections.join("\n")}\n</response-examples>`;
}
