"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/server/db";
import { interviews } from "@/server/db/schema";
import {
  getOrCreateInterviewConcept,
  listInterviews,
  type Interview,
  type InterviewConcept,
} from "@/server/interview-service";

export async function loadInterviewConcept(): Promise<{
  concept: InterviewConcept;
  interviews: Interview[];
}> {
  const concept = await getOrCreateInterviewConcept();
  const rows = await listInterviews(concept.id);
  return { concept, interviews: rows };
}

/** Called by the client after an interview completes or a report is generated. */
export async function revalidateInterviewConcept(): Promise<void> {
  revalidatePath("/hub/360-interview");
}

/** Removes an interview from the process. */
export async function deleteInterview(id: string): Promise<void> {
  if (!id) return;
  await db.delete(interviews).where(eq(interviews.id, id));
  revalidatePath("/hub/360-interview");
}
