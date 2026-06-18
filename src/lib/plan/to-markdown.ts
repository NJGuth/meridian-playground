import type { DevelopmentPlan } from "./schema";

/**
 * Serializes a typed development plan to markdown.
 *
 * Used to produce the initial `docMarkdown` snapshot at creation time (server-side,
 * with no ProseMirror dependency). Once the user edits the tiptap document, the
 * client derives markdown from the editor (via tiptap-markdown) and overrides this.
 */
export function planSchemaToMarkdown(plan: DevelopmentPlan): string {
  const lines: string[] = [];

  lines.push(`# ${plan.title || "Development Plan"}`);
  lines.push("");

  if (plan.summary) {
    lines.push(plan.summary);
    lines.push("");
  }

  plan.goals.forEach((goal, index) => {
    lines.push(`## Goal ${index + 1}: ${goal.skillName}`);
    lines.push("");

    if (goal.rationale) {
      lines.push(goal.rationale);
      lines.push("");
    }

    lines.push("### SMART");
    lines.push(`- Specific: ${goal.smart.specific}`);
    lines.push(`- Measurable: ${goal.smart.measurable}`);
    lines.push(`- Achievable: ${goal.smart.achievable}`);
    lines.push(`- Relevant: ${goal.smart.relevant}`);
    lines.push(`- Time-bound: ${goal.smart.timeBound}`);
    lines.push("");

    if (goal.actionSteps.length > 0) {
      lines.push("### Action Steps");
      for (const step of goal.actionSteps) {
        lines.push(`- ${step}`);
      }
      lines.push("");
    }

    if (goal.timeline) {
      lines.push(`**Timeline:** ${goal.timeline}`);
      lines.push("");
    }
  });

  return lines.join("\n").trim();
}
