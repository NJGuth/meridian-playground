"use server";

import { db } from "@/server/db";
import { scoringConfig } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export interface ScoringConfigData {
  ld12HighThreshold: number;
  ld12GoodThreshold: number;
  profileShapeDevelopingMean: number;
  profileShapeSpikyStdDev: number;
  valuesHighThreshold: number;
  valuesModerateThreshold: number;
}

const DEFAULTS: ScoringConfigData = {
  ld12HighThreshold: 75,
  ld12GoodThreshold: 25,
  profileShapeDevelopingMean: 35,
  profileShapeSpikyStdDev: 20,
  valuesHighThreshold: 75,
  valuesModerateThreshold: 25,
};

export async function getScoringConfig(): Promise<ScoringConfigData> {
  const [row] = await db.select().from(scoringConfig).limit(1);

  if (!row) return { ...DEFAULTS };

  return {
    ld12HighThreshold: row.ld12HighThreshold,
    ld12GoodThreshold: row.ld12GoodThreshold,
    profileShapeDevelopingMean: row.profileShapeDevelopingMean,
    profileShapeSpikyStdDev: row.profileShapeSpikyStdDev,
    valuesHighThreshold: row.valuesHighThreshold,
    valuesModerateThreshold: row.valuesModerateThreshold,
  };
}

export async function updateScoringConfig(data: ScoringConfigData) {
  const [existing] = await db.select().from(scoringConfig).limit(1);

  if (existing) {
    await db
      .update(scoringConfig)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(scoringConfig.id, existing.id));
  } else {
    await db.insert(scoringConfig).values(data);
  }

  revalidatePath("/dashboard/scoring");
}
