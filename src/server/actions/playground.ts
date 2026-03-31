"use server";

import { db } from "@/server/db";
import { playgrounds } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { FeedbackStyle, CoachingPosture } from "@/lib/types/identity-tone";
import type { RulesConfig } from "@/lib/types/playground-rules";

export async function createPlayground() {
  const [playground] = await db
    .insert(playgrounds)
    .values({ title: "Untitled" })
    .returning();

  redirect(`/playground/${playground.id}/chats`);
}

export async function updatePlayground(formData: FormData) {
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  if (!id || !title?.trim()) return;

  await db
    .update(playgrounds)
    .set({ title: title.trim() })
    .where(eq(playgrounds.id, id));

  revalidatePath(`/playground/${id}`);
  revalidatePath("/dashboard/playgrounds");
}

export async function updatePlaygroundModel(id: string, model: string) {
  if (!id || !model?.trim()) return;

  await db
    .update(playgrounds)
    .set({ model: model.trim() })
    .where(eq(playgrounds.id, id));

  revalidatePath(`/playground/${id}`);
  revalidatePath("/dashboard/playgrounds");
}

export async function updatePlaygroundIdentityTone(
  id: string,
  config: {
    roleDescription: string;
    feedbackStyle: FeedbackStyle;
    coachingPosture: CoachingPosture;
    welcomeMessage: string;
  },
) {
  if (!id) return;

  await db
    .update(playgrounds)
    .set({
      roleDescription: config.roleDescription.trim(),
      feedbackStyle: config.feedbackStyle,
      coachingPosture: config.coachingPosture,
      welcomeMessage: config.welcomeMessage.trim(),
    })
    .where(eq(playgrounds.id, id));

  revalidatePath(`/playground/${id}`);
}

export async function updatePlaygroundFeedbackStyle(
  id: string,
  feedbackStyle: FeedbackStyle,
) {
  if (!id) return;

  await db
    .update(playgrounds)
    .set({ feedbackStyle })
    .where(eq(playgrounds.id, id));

  revalidatePath(`/playground/${id}`);
}

export async function updatePlaygroundRules(
  id: string,
  config: RulesConfig,
) {
  if (!id) return;

  await db
    .update(playgrounds)
    .set({
      disabledRuleIds: config.disabledRuleIds,
      customRules: config.customRules,
    })
    .where(eq(playgrounds.id, id));

  revalidatePath(`/playground/${id}`);
}

export async function deletePlayground(id: string) {
  if (!id) return;

  await db.delete(playgrounds).where(eq(playgrounds.id, id));

  revalidatePath("/dashboard/playgrounds");
  redirect("/dashboard/playgrounds");
}

export async function duplicatePlayground(id: string) {
  if (!id) return;

  const [pg] = await db
    .select()
    .from(playgrounds)
    .where(eq(playgrounds.id, id));
  if (!pg) return;

  await db.insert(playgrounds).values({
    title: `${pg.title} (copy)`,
    model: pg.model,
    roleDescription: pg.roleDescription,
    feedbackStyle: pg.feedbackStyle,
    coachingPosture: pg.coachingPosture,
    disabledRuleIds: pg.disabledRuleIds,
    customRules: pg.customRules,
    welcomeMessage: pg.welcomeMessage,
  });

  revalidatePath("/dashboard/playgrounds");
}
