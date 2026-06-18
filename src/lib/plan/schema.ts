import { z } from "zod";

export const smartSchema = z.object({
  specific: z.string().describe("What specifically will be done."),
  measurable: z
    .string()
    .describe("Observable behaviors or metrics used to track progress."),
  achievable: z
    .string()
    .describe("Why this is realistic given the person's current level."),
  relevant: z
    .string()
    .describe("How this connects to their role and development needs."),
  timeBound: z
    .string()
    .describe("The timeframe for progress and review (e.g. '90 days')."),
});

export const goalSchema = z.object({
  skillName: z
    .string()
    .describe(
      "The name of the LD12 skill this goal develops (e.g. 'Delegation', 'Strategic Thinking').",
    ),
  rationale: z
    .string()
    .describe(
      "Why this skill is a development priority, grounded in the LD12 profile.",
    ),
  smart: smartSchema,
  actionSteps: z
    .array(z.string())
    .describe("Concrete, practical action steps the person can take."),
  timeline: z
    .string()
    .describe(
      "A short timeline or cadence for this goal (e.g. 'Next quarter').",
    ),
});

export const developmentPlanSchema = z.object({
  title: z.string().describe("A concise title for the development plan."),
  summary: z
    .string()
    .describe(
      "A short narrative summary of the plan, including the overall focus and profile shape.",
    ),
  goals: z
    .array(goalSchema)
    .describe("The prioritized development goals, each tied to an LD12 skill."),
});

export type Smart = z.infer<typeof smartSchema>;
export type Goal = z.infer<typeof goalSchema>;
export type DevelopmentPlan = z.infer<typeof developmentPlanSchema>;
