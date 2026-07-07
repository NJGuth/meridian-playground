import "server-only";

import { desc, eq } from "drizzle-orm";
import { db } from "@/server/db";
import { interviewConcepts, interviews } from "@/server/db/schema";
import type { TranscriptEntry } from "@/lib/voice/transcript";

export type InterviewConcept = typeof interviewConcepts.$inferSelect;
export type Interview = typeof interviews.$inferSelect;

export const DEFAULT_SUBJECT_NAME = "Nicholas Guthrie";

function defaultIntroText(subjectName: string): string {
  return `You'll be giving candid, confidential feedback about ${subjectName}. A voice assistant will ask you a series of questions — just answer out loud and naturally. Plan for about 15-20 minutes. There are no right or wrong answers; your honest perspective is what's valuable.`;
}

function generatePasscode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Returns the single 360 interview concept, creating it on first access. This
 * is a single-subject testing concept, so we keep exactly one row.
 */
export async function getOrCreateInterviewConcept(): Promise<InterviewConcept> {
  const [existing] = await db
    .select()
    .from(interviewConcepts)
    .orderBy(interviewConcepts.createdAt)
    .limit(1);

  if (existing) return existing;

  const [created] = await db
    .insert(interviewConcepts)
    .values({
      title: "360 Interview",
      subjectName: DEFAULT_SUBJECT_NAME,
      passcode: generatePasscode(),
      introText: defaultIntroText(DEFAULT_SUBJECT_NAME),
    })
    .returning();

  return created;
}

export async function getInterviewConcept(
  id: string,
): Promise<InterviewConcept | null> {
  const [concept] = await db
    .select()
    .from(interviewConcepts)
    .where(eq(interviewConcepts.id, id))
    .limit(1);

  return concept ?? null;
}

export function verifyPasscode(
  concept: InterviewConcept,
  passcode: string | undefined | null,
): boolean {
  if (!concept.passcode) return false;
  return (passcode ?? "").trim() === concept.passcode;
}

export async function listInterviews(conceptId: string): Promise<Interview[]> {
  return db
    .select()
    .from(interviews)
    .where(eq(interviews.conceptId, conceptId))
    .orderBy(desc(interviews.createdAt));
}

export async function createInterview(
  conceptId: string,
  intervieweeName: string,
): Promise<Interview> {
  const [row] = await db
    .insert(interviews)
    .values({
      conceptId,
      intervieweeName: intervieweeName.trim() || "Anonymous",
      status: "in_progress",
    })
    .returning();

  return row;
}

export async function completeInterview(
  interviewId: string,
  transcript: TranscriptEntry[],
  summary: string,
): Promise<void> {
  await db
    .update(interviews)
    .set({
      transcript,
      summary,
      status: "complete",
      completedAt: new Date(),
    })
    .where(eq(interviews.id, interviewId));
}

export async function saveReport(
  conceptId: string,
  report: string,
): Promise<void> {
  await db
    .update(interviewConcepts)
    .set({ report, reportGeneratedAt: new Date() })
    .where(eq(interviewConcepts.id, conceptId));
}
