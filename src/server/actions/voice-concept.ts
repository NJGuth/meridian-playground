"use server";

import { db } from "@/server/db";
import { voiceConcepts } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { MoodTrigger } from "@/lib/voice/concept-dynamics";
import { isOpenAiRealtimeVoice } from "@/lib/voice/voice-options";

export type VoiceConceptUpdate = {
  title?: string;
  voice?: string;
  persona?: string;
  script?: string;
  rules?: string[];
  openingLine?: string;
  introText?: string;
  contextNotes?: string;
  warmth?: number;
  cooperativeness?: number;
  aggression?: number;
  patience?: number;
  volatility?: number;
  tolerance?: number;
  reactivityEnabled?: boolean;
  moodTriggers?: MoodTrigger[];
  hiddenAgenda?: string;
  agendaUnlockCondition?: string;
  targetDurationMinutes?: number | null;
  autoEndOnExpiry?: boolean;
  variationEnabled?: boolean;
};

function clampAxis(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export async function createVoiceConcept() {
  const [concept] = await db
    .insert(voiceConcepts)
    .values({ title: "Untitled" })
    .returning();

  redirect(`/hub/voice-concepts/${concept.id}`);
}

export async function updateVoiceConcept(id: string, update: VoiceConceptUpdate) {
  if (!id) return;

  const values: Partial<typeof voiceConcepts.$inferInsert> = {};

  if (update.title !== undefined) {
    values.title = update.title.trim() || "Untitled";
  }
  if (update.voice !== undefined && isOpenAiRealtimeVoice(update.voice)) {
    values.voice = update.voice;
  }
  if (update.persona !== undefined) {
    values.persona = update.persona.trim();
  }
  if (update.script !== undefined) {
    values.script = update.script.trim();
  }
  if (update.rules !== undefined) {
    values.rules = update.rules.map((rule) => rule.trim()).filter(Boolean);
  }
  if (update.openingLine !== undefined) {
    values.openingLine = update.openingLine.trim();
  }
  if (update.introText !== undefined) {
    values.introText = update.introText.trim();
  }
  if (update.contextNotes !== undefined) {
    values.contextNotes = update.contextNotes.trim();
  }
  if (update.warmth !== undefined) {
    values.warmth = clampAxis(update.warmth);
  }
  if (update.cooperativeness !== undefined) {
    values.cooperativeness = clampAxis(update.cooperativeness);
  }
  if (update.aggression !== undefined) {
    values.aggression = clampAxis(update.aggression);
  }
  if (update.patience !== undefined) {
    values.patience = clampAxis(update.patience);
  }
  if (update.volatility !== undefined) {
    values.volatility = clampAxis(update.volatility);
  }
  if (update.tolerance !== undefined) {
    values.tolerance = clampAxis(update.tolerance);
  }
  if (update.reactivityEnabled !== undefined) {
    values.reactivityEnabled = update.reactivityEnabled ? 1 : 0;
  }
  if (update.moodTriggers !== undefined) {
    values.moodTriggers = update.moodTriggers.map((t) => ({
      condition: t.condition.trim(),
      warmthDelta: t.warmthDelta,
      cooperativenessDelta: t.cooperativenessDelta,
      aggressionDelta: t.aggressionDelta,
      patienceDelta: t.patienceDelta,
    }));
  }
  if (update.hiddenAgenda !== undefined) {
    values.hiddenAgenda = update.hiddenAgenda.trim();
  }
  if (update.agendaUnlockCondition !== undefined) {
    values.agendaUnlockCondition = update.agendaUnlockCondition.trim();
  }
  if (update.targetDurationMinutes !== undefined) {
    values.targetDurationMinutes =
      update.targetDurationMinutes === null || update.targetDurationMinutes <= 0
        ? null
        : update.targetDurationMinutes;
  }
  if (update.autoEndOnExpiry !== undefined) {
    values.autoEndOnExpiry = update.autoEndOnExpiry ? 1 : 0;
  }
  if (update.variationEnabled !== undefined) {
    values.variationEnabled = update.variationEnabled ? 1 : 0;
  }

  if (Object.keys(values).length === 0) return;

  await db.update(voiceConcepts).set(values).where(eq(voiceConcepts.id, id));

  revalidatePath(`/hub/voice-concepts/${id}`);
  revalidatePath("/hub/voice-concepts");
}

export async function deleteVoiceConcept(id: string) {
  if (!id) return;

  await db.delete(voiceConcepts).where(eq(voiceConcepts.id, id));

  revalidatePath("/hub/voice-concepts");
  redirect("/hub/voice-concepts");
}

export async function duplicateVoiceConcept(id: string) {
  if (!id) return;

  const [concept] = await db
    .select()
    .from(voiceConcepts)
    .where(eq(voiceConcepts.id, id));
  if (!concept) return;

  await db.insert(voiceConcepts).values({
    title: `${concept.title} (copy)`,
    voice: concept.voice,
    persona: concept.persona,
    script: concept.script,
    rules: concept.rules,
    openingLine: concept.openingLine,
    introText: concept.introText,
    contextNotes: concept.contextNotes,
    warmth: concept.warmth,
    cooperativeness: concept.cooperativeness,
    aggression: concept.aggression,
    patience: concept.patience,
    volatility: concept.volatility,
    tolerance: concept.tolerance,
    reactivityEnabled: concept.reactivityEnabled,
    moodTriggers: concept.moodTriggers,
    hiddenAgenda: concept.hiddenAgenda,
    agendaUnlockCondition: concept.agendaUnlockCondition,
    targetDurationMinutes: concept.targetDurationMinutes,
    autoEndOnExpiry: concept.autoEndOnExpiry,
    variationEnabled: concept.variationEnabled,
  });

  revalidatePath("/hub/voice-concepts");
}
