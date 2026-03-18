"use server";

import { db } from "@/server/db";
import { prompts } from "@/server/db/schema";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPrompt() {
  const [prompt] = await db
    .insert(prompts)
    .values({ content: "" })
    .returning();

  redirect(`/dashboard/prompts/${prompt.id}`);
}

export async function updatePromptContent(id: string, content: string) {
  if (!id) return;

  await db
    .update(prompts)
    .set({ content, updatedAt: new Date() })
    .where(eq(prompts.id, id));

  revalidatePath(`/dashboard/prompts/${id}`);
  revalidatePath("/dashboard/prompts");
}

export async function addExample(
  id: string,
  type: "positive" | "negative",
  content: string,
) {
  if (!id || !content?.trim()) return;

  const column =
    type === "positive" ? prompts.positiveExamples : prompts.negativeExamples;

  await db
    .update(prompts)
    .set({
      [type === "positive" ? "positiveExamples" : "negativeExamples"]: sql`${column} || ${JSON.stringify([content.trim()])}::jsonb`,
      updatedAt: new Date(),
    })
    .where(eq(prompts.id, id));

  revalidatePath(`/dashboard/prompts/${id}`);
  revalidatePath("/dashboard/prompts");
}

export async function removeExample(
  id: string,
  type: "positive" | "negative",
  index: number,
) {
  if (!id || index < 0) return;

  const column =
    type === "positive" ? prompts.positiveExamples : prompts.negativeExamples;

  await db
    .update(prompts)
    .set({
      [type === "positive" ? "positiveExamples" : "negativeExamples"]: sql`${column} - ${index}`,
      updatedAt: new Date(),
    })
    .where(eq(prompts.id, id));

  revalidatePath(`/dashboard/prompts/${id}`);
  revalidatePath("/dashboard/prompts");
}

export async function deletePrompt(id: string) {
  if (!id) return;

  await db.delete(prompts).where(eq(prompts.id, id));

  revalidatePath("/dashboard/prompts");
  redirect("/dashboard/prompts");
}

export async function duplicatePrompt(id: string) {
  if (!id) return;

  const [prompt] = await db
    .select()
    .from(prompts)
    .where(eq(prompts.id, id));
  if (!prompt) return;

  await db.insert(prompts).values({
    content: prompt.content,
    positiveExamples: prompt.positiveExamples,
    negativeExamples: prompt.negativeExamples,
  });

  revalidatePath("/dashboard/prompts");
}

export async function getAllPrompts() {
  return db.select().from(prompts);
}

export async function getPromptById(id: string) {
  const [prompt] = await db
    .select()
    .from(prompts)
    .where(eq(prompts.id, id));
  return prompt ?? null;
}
