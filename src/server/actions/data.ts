"use server";

import { db } from "@/server/db";
import { assessments, people } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const ARCHETYPE_KEYS = [
  "Connector",
  "Cultivator",
  "Visionary",
  "Coach",
  "Innovator",
  "Driver",
];

const COMPETENCY_KEYS = [
  "Self_Care",
  "Self_Awareness",
  "Confidence",
  "Resilience",
  "Emotion_Management",
  "Focus",
  "Prioritization",
  "Time_Management",
  "Delegation",
  "Curiosity",
  "Problem_Solving",
  "Decision_Quality",
  "Career_Development",
  "Gaining_Expertise",
  "Executive_Presence",
  "Personal_Brand",
  "Authenticity",
  "Trust",
  "Empathy",
  "Listening",
  "Building_Relationships",
  "Strengthening_Relationships",
  "Managing_Conflict",
  "Influence",
  "Communication",
  "Accountability",
  "Coaching",
  "Developing_Talent",
  "Motivating_Others",
  "Empowering_Others",
  "Collaboration",
  "Team_Productivity",
  "Team_Culture",
  "Team_Leadership",
  "Setting_Vision",
  "Innovation",
  "Inspiration",
  "Strategic_Thinking",
  "Strategic_Management",
  "Stakeholder_Management",
  "Navigating_Change",
  "Leadership_Flexibility",
  "Execution",
  "Culture_Building",
  "Inclusive_Leadership",
];

const DIMENSION_KEYS = [
  "Dimension_Self_Management",
  "Dimension_Time_And_Energy",
  "Dimension_Decision_Making",
  "Dimension_Leadership_Brand",
  "Dimension_Building_Trust",
  "Dimension_Social_Acumen",
  "Dimension_Managing_Performance",
  "Dimension_Team_Effectiveness",
  "Dimension_Visioning",
  "Dimension_Strategic_Leadership",
  "Dimension_Driving_Change",
  "Dimension_Culture_Shaping",
];

const DOMAIN_KEYS = [
  "Domain_leading_self",
  "Domain_leading_others",
  "Domain_leading_organizations",
];

const VALUES_KEYS = [
  "Financial_Security",
  "Job_Security",
  "Predictability",
  "History",
  "Hierarchy",
  "Routine",
  "Acknowledgement",
  "Praise",
  "Leadership",
  "Status",
  "Competition",
  "Science",
  "Data",
  "Logic",
  "Nature",
  "Design",
  "Experience",
  "Altruism",
  "Affiliation",
  "Freedom",
  "Individuality",
  "Indulgence",
  "Entertainment",
  "Self_Care",
  "Life_Integration",
  "Support_System",
];

const VALUES_THEME_KEYS = [
  "Stability",
  "Tradition",
  "Visibility",
  "Power",
  "Rationality",
  "Aesthetic_Appreciation",
  "Community",
  "Autonomy",
  "Enjoyment",
  "Well_Being",
];

const ALL_PCTILE_KEYS = [
  ...COMPETENCY_KEYS,
  ...DIMENSION_KEYS,
  ...DOMAIN_KEYS,
];

function buildEmptyLd12() {
  const archetypeScores: Record<string, number> = {};
  for (const k of ARCHETYPE_KEYS) archetypeScores[k] = 0;
  const pctileScores: Record<string, number> = {};
  for (const k of ALL_PCTILE_KEYS) pctileScores[k] = 0;
  return { archetypeScores, pctileScores };
}

function buildEmptyLd12360() {
  const data: Record<string, unknown> = {
    strengths: { manager: "" },
    opportunities: { manager: "" },
  };
  for (const k of ALL_PCTILE_KEYS) {
    data[k] = { self: 0, manager: 0, other: 0, overall: 0 };
  }
  return data;
}

function buildEmptyValues() {
  const pctileScores: Record<string, number> = {};
  for (const k of [...VALUES_KEYS, ...VALUES_THEME_KEYS]) pctileScores[k] = 0;
  return { pctileScores };
}

function rand(min: number, max: number, decimals = 1) {
  const val = Math.random() * (max - min) + min;
  const factor = 10 ** decimals;
  return Math.round(val * factor) / factor;
}

function randPctile() {
  return rand(0, 100, 1);
}

function randScore() {
  return rand(1, 6, 1);
}

function buildRandomLd12() {
  const archetypeScores: Record<string, number> = {};
  for (const k of ARCHETYPE_KEYS) archetypeScores[k] = randPctile();
  const pctileScores: Record<string, number> = {};
  for (const k of ALL_PCTILE_KEYS) pctileScores[k] = randPctile();
  return { archetypeScores, pctileScores };
}

function buildRandomLd12360() {
  const data: Record<string, unknown> = {
    strengths: { manager: "" },
    opportunities: { manager: "" },
  };
  for (const k of ALL_PCTILE_KEYS) {
    data[k] = {
      self: randScore(),
      manager: Math.random() > 0.1 ? randScore() : null,
      other: randScore(),
      overall: randScore(),
    };
  }
  return data;
}

function buildRandomValues() {
  const pctileScores: Record<string, number> = {};
  for (const k of [...VALUES_KEYS, ...VALUES_THEME_KEYS])
    pctileScores[k] = randPctile();
  return { pctileScores };
}

export async function getPeople() {
  return db.select().from(people).orderBy(people.createdAt);
}

export async function getPerson(id: string) {
  const [person] = await db.select().from(people).where(eq(people.id, id));

  if (!person) return null;

  const personAssessments = await db
    .select()
    .from(assessments)
    .where(eq(assessments.personId, id))
    .orderBy(assessments.createdAt);

  return { ...person, assessments: personAssessments };
}

export async function createPerson(formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  if (!firstName?.trim() || !lastName?.trim()) return;

  const jobTitle = (formData.get("jobTitle") as string)?.trim() ?? "";
  const fn = (formData.get("function") as string)?.trim() ?? "";
  const level = (formData.get("level") as string)?.trim() ?? "";
  const company = (formData.get("company") as string)?.trim() ?? "";
  const industry = (formData.get("industry") as string)?.trim() ?? "";

  const [person] = await db
    .insert(people)
    .values({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      jobTitle,
      function: fn,
      level,
      company,
      industry,
    })
    .returning();

  await db.insert(assessments).values([
    { personId: person.id, type: "ld12", data: buildEmptyLd12() },
    { personId: person.id, type: "ld12_360", data: buildEmptyLd12360() },
    { personId: person.id, type: "values", data: buildEmptyValues() },
  ]);

  revalidatePath("/dashboard/data");
  redirect(`/dashboard/data/${person.id}`);
}

type PersonField =
  | "firstName"
  | "lastName"
  | "jobTitle"
  | "function"
  | "level"
  | "company"
  | "industry";

export async function updatePersonField(
  id: string,
  field: PersonField,
  value: string,
) {
  if (!id) return;
  const trimmed = value?.trim() ?? "";

  if ((field === "firstName" || field === "lastName") && !trimmed) return;

  await db
    .update(people)
    .set({ [field]: trimmed })
    .where(eq(people.id, id));

  revalidatePath("/dashboard/data");
  revalidatePath(`/dashboard/data/${id}`);
}

export async function deletePerson(id: string) {
  if (!id) return;

  await db.delete(people).where(eq(people.id, id));

  revalidatePath("/dashboard/data");
  redirect("/dashboard/data");
}

export async function duplicatePerson(id: string) {
  if (!id) return;

  const [person] = await db.select().from(people).where(eq(people.id, id));
  if (!person) return;

  const [newPerson] = await db
    .insert(people)
    .values({
      firstName: person.firstName,
      lastName: `${person.lastName} (copy)`,
      jobTitle: person.jobTitle,
      function: person.function,
      level: person.level,
      company: person.company,
      industry: person.industry,
    })
    .returning();

  const personAssessments = await db
    .select()
    .from(assessments)
    .where(eq(assessments.personId, id));

  if (personAssessments.length > 0) {
    await db.insert(assessments).values(
      personAssessments.map((a) => ({
        personId: newPerson.id,
        type: a.type,
        data: a.data,
      })),
    );
  }

  revalidatePath("/dashboard/data");
}

export async function generateRandomAssessments(personId: string) {
  if (!personId) return;

  await db.delete(assessments).where(eq(assessments.personId, personId));

  await db.insert(assessments).values([
    { personId, type: "ld12", data: buildRandomLd12() },
    { personId, type: "ld12_360", data: buildRandomLd12360() },
    { personId, type: "values", data: buildRandomValues() },
  ]);

  revalidatePath(`/dashboard/data/${personId}`);
}
