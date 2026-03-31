/**
 * Upserts Hogan HPI / HDS / MVPI assessments for the existing seed persona
 * "John Simple" (first person matching that name).
 *
 * Run: npx tsx --env-file=.env.local src/server/db/upsert-hogan-for-seed-user.ts
 */

import { db } from "./index";
import { assessments, people } from "./schema";
import { and, eq, inArray } from "drizzle-orm";
import {
  hoganHdsSeedData,
  hoganHpiSeedData,
  hoganMvpiSeedData,
} from "./hogan-seed-payloads";

const HOGAN_TYPES = ["hogan_hpi", "hogan_hds", "hogan_mvpi"] as const;

async function upsertHoganForSeedUser() {
  const [person] = await db
    .select({ id: people.id, firstName: people.firstName, lastName: people.lastName })
    .from(people)
    .where(and(eq(people.firstName, "John"), eq(people.lastName, "Simple")))
    .limit(1);

  if (!person) {
    console.error(
      'No person found with firstName "John" and lastName "Simple". Create the seed user first or adjust this script.',
    );
    process.exit(1);
  }

  await db
    .delete(assessments)
    .where(
      and(
        eq(assessments.personId, person.id),
        inArray(assessments.type, [...HOGAN_TYPES]),
      ),
    );

  await db.insert(assessments).values([
    { personId: person.id, type: "hogan_hpi", data: hoganHpiSeedData },
    { personId: person.id, type: "hogan_hds", data: hoganHdsSeedData },
    { personId: person.id, type: "hogan_mvpi", data: hoganMvpiSeedData },
  ]);

  console.log(
    `Upserted Hogan assessments (HPI, HDS, MVPI) for ${person.firstName} ${person.lastName} (${person.id}).`,
  );
  process.exit(0);
}

upsertHoganForSeedUser().catch((err) => {
  console.error("Upsert failed:", err);
  process.exit(1);
});
