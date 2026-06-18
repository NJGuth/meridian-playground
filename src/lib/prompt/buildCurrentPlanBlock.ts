/**
 * Builds the system-prompt block exposing the latest development plan (including
 * any edits the user made in the tiptap editor) so the coach can reference and
 * refine the actual current plan.
 */
export function buildCurrentPlanBlock(
  planMarkdown: string | null,
): string | null {
  const trimmed = planMarkdown?.trim();
  if (!trimmed) return null;

  return `<current-development-plan
  usage="This is the user's current development plan, including any edits they have made. When the user asks about or wants to refine their plan, reference this exact content. To create a brand-new plan, call the createDevelopmentPlan tool; otherwise discuss and suggest edits conversationally."
>
${trimmed}
</current-development-plan>`;
}
