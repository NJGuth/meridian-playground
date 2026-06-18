import type { DevelopmentPlan } from "./schema";

export interface ProseMirrorNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: ProseMirrorNode[];
  marks?: { type: string }[];
  text?: string;
}

function text(value: string, marks?: { type: string }[]): ProseMirrorNode {
  return marks
    ? { type: "text", text: value, marks }
    : { type: "text", text: value };
}

function paragraph(content: ProseMirrorNode[]): ProseMirrorNode {
  return { type: "paragraph", content };
}

function heading(level: number, value: string): ProseMirrorNode {
  return {
    type: "heading",
    attrs: { level },
    content: [text(value)],
  };
}

function bulletList(items: string[]): ProseMirrorNode {
  return {
    type: "bulletList",
    content: items.map((item) => ({
      type: "listItem",
      content: [paragraph([text(item)])],
    })),
  };
}

function labelledParagraph(label: string, value: string): ProseMirrorNode {
  return paragraph([text(`${label}: `, [{ type: "bold" }]), text(value)]);
}

/**
 * Serializes a typed development plan into a ProseMirror document (tiptap JSON).
 * This is a one-time scaffold; after creation the tiptap doc is the source of truth.
 */
export function planSchemaToProseMirror(
  plan: DevelopmentPlan,
): ProseMirrorNode {
  const content: ProseMirrorNode[] = [
    heading(1, plan.title || "Development Plan"),
  ];

  if (plan.summary) {
    content.push(paragraph([text(plan.summary)]));
  }

  plan.goals.forEach((goal, index) => {
    content.push(heading(2, `Goal ${index + 1}: ${goal.skillName}`));

    if (goal.rationale) {
      content.push(paragraph([text(goal.rationale)]));
    }

    content.push(heading(3, "SMART"));
    content.push(
      bulletList([
        `Specific: ${goal.smart.specific}`,
        `Measurable: ${goal.smart.measurable}`,
        `Achievable: ${goal.smart.achievable}`,
        `Relevant: ${goal.smart.relevant}`,
        `Time-bound: ${goal.smart.timeBound}`,
      ]),
    );

    if (goal.actionSteps.length > 0) {
      content.push(heading(3, "Action Steps"));
      content.push(bulletList(goal.actionSteps));
    }

    if (goal.timeline) {
      content.push(labelledParagraph("Timeline", goal.timeline));
    }
  });

  return { type: "doc", content };
}
