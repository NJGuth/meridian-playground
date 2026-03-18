# Meridian Playground — Session Context & Assessment Data

## Overview

This document specifies how to:

1. Select a talent in the playground UI
2. Fetch their profile and assessment scores from the database
3. Enrich those scores server-side
4. Inject the enriched data into the LLM system prompt

The enrichment pipeline already exists. This document describes how to wire the playground UI to it.

---

## What Lives in the Database

| Table                | Relevant columns                                            | Used for                                    |
| -------------------- | ----------------------------------------------------------- | ------------------------------------------- |
| `talents`            | `id`, `first_name`, `last_name`, `job_title`, `function_id` | User profile                                |
| `skill_assessments`  | `talent_id`, `skill_id`, `score`                            | LD12 assessment scores                      |
| `values_assessments` | `talent_id`, `sub_dimension_key`, `score`                   | Values Navigator scores                     |
| `functions`          | `id`, `name`, `description`                                 | Resolves `function_id` → name + description |

Assessment data is keyed by `talent_id`. A talent may have LD12 scores, values scores, both, or neither. The pipeline handles all four states — never assume data exists.

---

## Playground UI — Talent Selector

### Field spec

| Property       | Value                                                   |
| -------------- | ------------------------------------------------------- |
| Label          | Select talent                                           |
| Input type     | Searchable select / combobox                            |
| Data source    | `GET /api/playground/talents`                           |
| Display format | `"{first_name} {last_name} — {job_title}"`              |
| On change      | Triggers assessment data fetch for selected `talent_id` |

### Talent list endpoint

```ts
// app/api/playground/talents/route.ts
// Returns the full talent list for the selector dropdown.
// This is playground-only — not used in production chat.

import { db } from "@/lib/db";

export async function GET() {
  const talents = await db.query(`
    SELECT
      t.id,
      t.first_name,
      t.last_name,
      t.job_title,
      f.name AS function_name
    FROM talents t
    LEFT JOIN functions f ON f.id = t.function_id
    ORDER BY t.last_name, t.first_name
  `);

  return Response.json(talents.rows);
}
```

---

## Fetching Assessment Data

### Rules

- **Always fetch in parallel.** Talent profile, LD12 scores, and values scores are independent queries. Use `Promise.all` — never await them sequentially.
- **Never block the chat on missing data.** If a talent has no LD12 scores, pass `null` to the enrichment pipeline. The prompt assembler handles the null case with a `status="not-completed"` block.
- **Fetch on the server, inside the API route.** Assessment scores must never be fetched client-side and passed in the request body. The client sends only `talentId` — the server fetches everything.
- **Do not cache assessment scores per request.** Scores are per-user and change when a new assessment is completed. Fetch fresh on every chat session start.

### DB query functions

These already exist as stubs in `app/api/chat/route.ts`. Replace the mock return values with real queries:

```ts
// lib/db/assessments.ts

import { db } from "@/lib/db";
import type { RawSkillScore } from "@/lib/assessment/types";
import type { RawValuesScore } from "@/lib/assessment/valuesEnrichment";

export async function fetchTalent(talentId: string) {
  const result = await db.query(
    `SELECT id, first_name, last_name, job_title, function_id
     FROM talents
     WHERE id = $1`,
    [talentId],
  );
  return result.rows[0] ?? null;
}

export async function fetchLD12Scores(
  talentId: string,
): Promise<RawSkillScore[] | null> {
  const result = await db.query(
    `SELECT skill_id AS "skillId", score
     FROM skill_assessments
     WHERE talent_id = $1`,
    [talentId],
  );
  return result.rows.length > 0 ? result.rows : null;
}

export async function fetchValuesScores(
  talentId: string,
): Promise<RawValuesScore[] | null> {
  const result = await db.query(
    `SELECT sub_dimension_key AS "subDimensionKey", score
     FROM values_assessments
     WHERE talent_id = $1`,
    [talentId],
  );
  return result.rows.length > 0 ? result.rows : null;
}
```

### Parallel fetch pattern in the route

```ts
// app/api/chat/route.ts — POST handler

const [talent, rawLD12Scores, rawValuesScores] = await Promise.all([
  fetchTalent(talentId),
  fetchLD12Scores(talentId),
  fetchValuesScores(talentId),
]);

if (!talent) {
  return new Response("Talent not found", { status: 404 });
}
```

---

## Enrichment Pipeline

The enrichment pipeline is already built. Do not modify it for the playground — just call it with the fetched data.

### LD12 enrichment

```ts
import {
  buildProfile,
  serializeProfileToXML,
} from "@/lib/assessment/enrichment";

const ld12XML = rawLD12Scores
  ? serializeProfileToXML(
      buildProfile(
        String(talent.id),
        "ld12",
        rawLD12Scores,
        new Date().toISOString(),
        skillIndex, // built at module load — do not rebuild per request
      ),
    )
  : null;
```

### Values enrichment

```ts
import {
  buildValuesProfile,
  serializeValuesProfileToXML,
} from "@/lib/assessment/valuesEnrichment";

const valuesXML = rawValuesScores
  ? serializeValuesProfileToXML(
      buildValuesProfile(
        String(talent.id),
        rawValuesScores,
        new Date().toISOString(),
        valuesIndex, // built at module load — do not rebuild per request
      ),
    )
  : null;
```

### What the enrichment pipeline produces

Both functions produce pre-labelled XML blocks. The LLM receives:

- Scores with `label="High|Good|Low"` and `isStrength` / `isGap` flags already applied
- `topStrengths` and `criticalGaps` surfaced at the top of the block
- Pre-written `strength_description` / `opportunity_description` text attached to each relevant skill
- A `profileShape` attribute (`Balanced | Spiky | Developing`) on the root element
- An `interpretation-guide` block that tells the LLM exactly what each label means

The LLM never receives raw numbers and never performs threshold classification itself.

---

## Prompt Injection — Session Context Block

The session context block is assembled from the resolved user profile and the two XML blocks. It is injected **after** the identity/tone blocks and **after** the framework knowledge blocks.

```ts
function buildSessionContextBlock(params: {
  user: ResolvedUserProfile;
  ld12XML: string | null;
  valuesXML: string | null;
}): string {
  const { user, ld12XML, valuesXML } = params;

  const ld12Block =
    ld12XML ??
    `
<assessment-data type="ld12" status="not-completed">
  No LD12 assessment data available for this user.
  Do not reference or invent scores.
  If the user asks about their results, let them know their LD12 assessment has not been completed.
</assessment-data>`.trim();

  const valuesBlock =
    valuesXML ??
    `
<values-assessment-data status="not-completed">
  No Values Navigator data available for this user.
</values-assessment-data>`.trim();

  return `
<session-context>
  <user-profile
    firstName="${user.firstName}"
    fullName="${user.fullName}"
    jobTitle="${user.jobTitle}"
    function="${user.functionName}"
    functionContext="${user.functionDescription}"
    company="${user.companyName}"
    industry="${user.companyIndustry}"
  />

  ${ld12Block}

  ${valuesBlock}
</session-context>`.trim();
}
```

---

## LLM Rules for Session Context

These rules must be present in the `<rules>` block of every assembled prompt. They govern how the LLM uses the session context data:

```
- Use ONLY the data provided in <session-context>. Never invent or assume scores, names, or role details.
- Address the user as {firstName} in most responses.
- When referencing an LD12 skill that appears in the user's assessment data, always cite their exact score and label.
- When referencing a skill NOT present in assessment data, do not invent a score — ask the user to self-assess instead.
- LD12 scores are performance measurements. High is a strength to leverage. Low is a development priority.
- Values scores are motivational importance measurements, not performance. Never frame a low values score as a problem.
- Use values data to contextualise coaching — connect development advice to what intrinsically motivates this leader.
- If assessment-data has status="not-completed", do not reference scores at all. Acknowledge the assessment is pending if asked.
- Connect all coaching to the user's role ({jobTitle}) and function ({functionName}) wherever relevant.
```

---

## Request Body Shape

The playground sends `talentId` in the request body. The server resolves everything else. Never pass enriched scores or profile data from the client.

```ts
// Client sends:
{
  messages: Message[],
  talentId: string,
  identityTone: IdentityToneConfig  // from the Identity & Tone form fields
}

// Server fetches and enriches — nothing else comes from the client
```

---

## Null / Empty State Handling

| State            | LD12 scores | Values scores | Behaviour                                            |
| ---------------- | ----------- | ------------- | ---------------------------------------------------- |
| Full data        | present     | present       | Both XML blocks injected                             |
| LD12 only        | present     | null          | LD12 block injected, values `status="not-completed"` |
| Values only      | null        | present       | Values block injected, LD12 `status="not-completed"` |
| No assessments   | null        | null          | Both blocks injected with `status="not-completed"`   |
| Talent not found | —           | —             | Return 404 before prompt assembly                    |

Never skip a block entirely — always inject the `status="not-completed"` placeholder. This explicitly tells the LLM the data is absent, preventing it from attempting to infer or hallucinate scores.

---

## Behaviour Notes for Cursor

- The `skillIndex`, `functionIndex`, and `valuesIndex` are built once at **module load** in `app/api/chat/route.ts`. Do not rebuild them inside the request handler or inside any fetch function. They are pure reference lookups with no per-user state.
- Assessment fetch functions live in `lib/db/assessments.ts`, not inside the route file. Keep DB logic separate from prompt assembly logic.
- The playground talent selector is the only place `talentId` originates. It must be validated server-side — do not trust it blindly.
- `completedAt` is passed to `buildProfile()` and `buildValuesProfile()`. Fetch this from the DB if your assessments table has a `completed_at` column. Otherwise `new Date().toISOString()` is an acceptable fallback for playground use.
