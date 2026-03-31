"use server";

import { db } from "@/server/db";
import { assessments, people } from "@/server/db/schema";
import { eq, and } from "drizzle-orm";

export async function getPeopleForSelector() {
  return db
    .select({
      id: people.id,
      firstName: people.firstName,
      lastName: people.lastName,
      jobTitle: people.jobTitle,
      function: people.function,
    })
    .from(people)
    .orderBy(people.lastName, people.firstName);
}

export async function fetchPersonForChat(personId: string) {
  const [person] = await db
    .select()
    .from(people)
    .where(eq(people.id, personId))
    .limit(1);
  return person ?? null;
}

export interface LD12AssessmentResult {
  pctileScores: Record<string, number>;
  completedAt: string;
}

export async function fetchLD12Assessment(
  personId: string,
): Promise<LD12AssessmentResult | null> {
  const [row] = await db
    .select({
      data: assessments.data,
      createdAt: assessments.createdAt,
    })
    .from(assessments)
    .where(
      and(eq(assessments.personId, personId), eq(assessments.type, "ld12")),
    )
    .limit(1);

  if (!row) return null;

  const data = row.data as { pctileScores?: Record<string, number> };
  if (!data.pctileScores) return null;

  const allZeroes = Object.values(data.pctileScores).every((v) => v === 0);
  if (allZeroes) return null;

  return {
    pctileScores: data.pctileScores,
    completedAt: row.createdAt.toISOString(),
  };
}

export interface ValuesAssessmentResult {
  pctileScores: Record<string, number>;
  completedAt: string;
}

export async function fetchValuesAssessment(
  personId: string,
): Promise<ValuesAssessmentResult | null> {
  const [row] = await db
    .select({
      data: assessments.data,
      createdAt: assessments.createdAt,
    })
    .from(assessments)
    .where(
      and(eq(assessments.personId, personId), eq(assessments.type, "values")),
    )
    .limit(1);

  if (!row) return null;

  const data = row.data as { pctileScores?: Record<string, number> };
  if (!data.pctileScores) return null;

  const allZeroes = Object.values(data.pctileScores).every((v) => v === 0);
  if (allZeroes) return null;

  return {
    pctileScores: data.pctileScores,
    completedAt: row.createdAt.toISOString(),
  };
}

export interface HoganAssessmentResult {
  pctileScores: Record<string, number>;
  completedAt: string;
}

export async function fetchHPIAssessment(
  personId: string,
): Promise<HoganAssessmentResult | null> {
  return fetchHoganInstrument(personId, "hogan_hpi");
}

export async function fetchHDSAssessment(
  personId: string,
): Promise<HoganAssessmentResult | null> {
  return fetchHoganInstrument(personId, "hogan_hds");
}

export async function fetchMVPIAssessment(
  personId: string,
): Promise<HoganAssessmentResult | null> {
  return fetchHoganInstrument(personId, "hogan_mvpi");
}

async function fetchHoganInstrument(
  personId: string,
  type: "hogan_hpi" | "hogan_hds" | "hogan_mvpi",
): Promise<HoganAssessmentResult | null> {
  const [row] = await db
    .select({
      data: assessments.data,
      createdAt: assessments.createdAt,
    })
    .from(assessments)
    .where(and(eq(assessments.personId, personId), eq(assessments.type, type)))
    .limit(1);

  if (!row) return null;

  const data = row.data as { pctileScores?: Record<string, number> };
  if (!data.pctileScores) return null;

  const allZeroes = Object.values(data.pctileScores).every((v) => v === 0);
  if (allZeroes) return null;

  return {
    pctileScores: data.pctileScores,
    completedAt: row.createdAt.toISOString(),
  };
}
