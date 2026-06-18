import type { DevelopmentPlan } from "@/lib/plan/schema";

export const SAMPLE_DEVELOPMENT_PLAN: DevelopmentPlan = {
  title: "Q2 Leadership Development Plan",
  summary:
    "Focus on strengthening delegation and strategic thinking to support the transition into a broader leadership role. Profile shows strong execution and relationship skills with opportunities to scale impact through others.",
  goals: [
    {
      skillName: "Delegation",
      rationale:
        "LD12 profile indicates a tendency to retain high-value work. Delegating more will free capacity for strategic priorities and develop direct reports.",
      smart: {
        specific:
          "Delegate at least two recurring operational responsibilities to direct reports with clear ownership and check-in cadence.",
        measurable:
          "Track weekly: number of tasks delegated, follow-through rate on delegated outcomes, and time reclaimed for strategic work.",
        achievable:
          "Two manageable workstreams can be handed off incrementally over 30 days without disrupting team delivery.",
        relevant:
          "Supports the shift from individual contributor habits to people-leader effectiveness in the current role.",
        timeBound: "90 days with a formal review at day 60.",
      },
      actionSteps: [
        "List all recurring tasks and classify by delegate-ability.",
        "Pair each delegate-able task with a named owner and success criteria.",
        "Schedule bi-weekly delegation retrospectives with direct reports.",
        "Use coaching conversations to reinforce accountability without re-taking work.",
      ],
      timeline: "First delegation live by week 3; full handoff by end of quarter.",
    },
    {
      skillName: "Strategic Thinking",
      rationale:
        "Strong tactical execution can overshadow longer-horizon planning. Building deliberate strategic habits will improve prioritization and stakeholder alignment.",
      smart: {
        specific:
          "Dedicate protected time each week to strategic planning and produce a one-page quarterly priorities brief.",
        measurable:
          "Weekly strategic block on calendar; monthly priorities brief shared with manager and key stakeholders.",
        achievable:
          "A 90-minute weekly block and lightweight one-pager template make this sustainable alongside current workload.",
        relevant:
          "Aligns development with expanded scope and expectations for enterprise-level contribution.",
        timeBound: "First priorities brief due within 30 days; iterate monthly.",
      },
      actionSteps: [
        "Block 90 minutes every Friday for strategic review.",
        "Adopt a one-page priorities template: context, bets, trade-offs, asks.",
        "Review priorities brief with manager in monthly 1:1.",
        "Solicit feedback from two cross-functional partners on clarity and focus.",
      ],
      timeline: "First brief in 30 days; monthly cadence thereafter.",
    },
  ],
};
