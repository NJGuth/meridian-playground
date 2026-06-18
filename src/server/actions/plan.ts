"use server";

import { eq } from "drizzle-orm";
import { type DevelopmentPlan, developmentPlanSchema } from "@/lib/plan/schema";
import { planSchemaToProseMirror } from "@/lib/plan/to-doc";
import { planSchemaToMarkdown } from "@/lib/plan/to-markdown";
import { db } from "@/server/db";
import { developmentPlans } from "@/server/db/schema";

export interface CreatedPlan {
  planId: string;
  title: string;
  summary: string;
}

export async function createDevelopmentPlan(
  chatId: string,
  personId: string | null,
  plan: DevelopmentPlan,
): Promise<CreatedPlan> {
  const parsed = developmentPlanSchema.parse(plan);

  const docJson = planSchemaToProseMirror(parsed);
  const docMarkdown = planSchemaToMarkdown(parsed);

  const [row] = await db
    .insert(developmentPlans)
    .values({
      chatId,
      personId: personId ?? null,
      title: parsed.title,
      summary: parsed.summary,
      schemaJson: parsed,
      docJson,
      docMarkdown,
    })
    .returning({ id: developmentPlans.id });

  return { planId: row.id, title: parsed.title, summary: parsed.summary };
}

export async function getPlan(planId: string) {
  const [row] = await db
    .select()
    .from(developmentPlans)
    .where(eq(developmentPlans.id, planId))
    .limit(1);
  return row ?? null;
}

export async function updatePlanDoc(
  planId: string,
  docJson: unknown,
  docMarkdown: string,
) {
  await db
    .update(developmentPlans)
    .set({
      docJson,
      docMarkdown,
      updatedAt: new Date(),
    })
    .where(eq(developmentPlans.id, planId));
}
