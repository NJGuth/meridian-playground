# Meridian — Session Context & Assessment Data

## Overview

This document specifies how to:

1. Select a talent in the playground UI
2. Fetch their profile and assessment scores from the database
3. Enrich those scores server-side
4. Inject the enriched data into the LLM system prompt
5. Keep the system prompt cache-stable across conversation turns

The enrichment pipeline already exists. This document describes how to wire the playground UI to it and how to avoid the caching pitfalls that silently inflate cost.

---

## What Lives in the Database

| Table                | Relevant columns                                            | Used for                                    |
| -------------------- | ----------------------------------------------------------- | ------------------------------------------- |
| `talents`            | `id`, `first_name`, `last_name`, `job_title`, `function_id` | User profile                                |
| `skill_assessments`  | `talent_id`, `skill_id`, `score`, `completed_at`            | LD12 scores + completion timestamp          |
| `values_assessments` | `talent_id`, `sub_dimension_key`, `score`, `completed_at`   | Values scores + completion timestamp        |
| `functions`          | `id`, `name`, `description`                                 | Resolves `function_id` → name + description |

`completed_at` is required on both assessment tables. It is used as the stable timestamp in the enriched XML — without it, the system prompt changes on every request and breaks prompt caching. Add this column now if it does not exist.

```sql
ALTER TABLE skill_assessments ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;
ALTER TABLE values_assessments ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;
```

---

## Playground UI — Talent Selector

| Property       | Value                                                    |
| -------------- | -------------------------------------------------------- |
| Label          | Select talent                                            |
| Input type     | Searchable select / combobox                             |
| Data source    | `GET /api/playground/talents`                            |
| Display format | `"{first_name} {last_name} — {job_title}"`               |
| On change      | Triggers a new chat session for the selected `talent_id` |

```ts
// app/api/playground/talents/route.ts
// Playground-only endpoint — not used in production chat.

import { db } from "@/lib/db";

export async function GET() {
  const result = await db.query(`
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
  return Response.json(result.rows);
}
```

---

## Fetching Assessment Data

### Rules

- **Always fetch in parallel.** Talent profile, LD12 scores, and values scores are independent queries. Use `Promise.all` — never await them sequentially.
- **Never block on missing data.** If a talent has no LD12 scores, pass `null` to the enrichment pipeline. The prompt assembler handles all null states gracefully.
- **Fetch on the server only.** Assessment scores must never be fetched client-side and passed in the request body. The client sends only `talentId` — the server resolves everything else.
- **Fetch once per session start, not per turn.** Scores do not change mid-conversation. Fetch on the first message of a session and hold the result in the session. Do not re-query the DB on every turn.

### DB query functions

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

export interface LD12AssessmentResult {
  scores: RawSkillScore[];
  completedAt: string;
}

export async function fetchLD12Scores(
  talentId: string,
): Promise<LD12AssessmentResult | null> {
  const result = await db.query(
    `SELECT
       skill_id        AS "skillId",
       score,
       completed_at    AS "completedAt"
     FROM skill_assessments
     WHERE talent_id = $1`,
    [talentId],
  );
  if (result.rows.length === 0) return null;

  return {
    scores: result.rows.map((r) => ({ skillId: r.skillId, score: r.score })),
    // Use the first row's timestamp — all rows share the same assessment completion date
    completedAt: result.rows[0].completedAt ?? new Date().toISOString(),
  };
}

export interface ValuesAssessmentResult {
  scores: RawValuesScore[];
  completedAt: string;
}

export async function fetchValuesScores(
  talentId: string,
): Promise<ValuesAssessmentResult | null> {
  const result = await db.query(
    `SELECT
       sub_dimension_key  AS "subDimensionKey",
       score,
       completed_at       AS "completedAt"
     FROM values_assessments
     WHERE talent_id = $1`,
    [talentId],
  );
  if (result.rows.length === 0) return null;

  return {
    scores: result.rows.map((r) => ({
      subDimensionKey: r.subDimensionKey,
      score: r.score,
    })),
    completedAt: result.rows[0].completedAt ?? new Date().toISOString(),
  };
}
```

### Parallel fetch in the route

```ts
// app/api/chat/route.ts — POST handler

const [talent, ld12Assessment, valuesAssessment] = await Promise.all([
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

The enrichment pipeline is already built. Do not modify it for the playground — call it with the fetched data.

### LD12 enrichment

```ts
import {
  buildProfile,
  serializeProfileToXML,
} from "@/lib/assessment/enrichment";

const ld12XML = ld12Assessment
  ? serializeProfileToXML(
      buildProfile(
        String(talent.id),
        "ld12",
        ld12Assessment.scores,
        ld12Assessment.completedAt, // stable DB timestamp — not new Date()
        skillIndex,
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

const valuesXML = valuesAssessment
  ? serializeValuesProfileToXML(
      buildValuesProfile(
        String(talent.id),
        valuesAssessment.scores,
        valuesAssessment.completedAt, // stable DB timestamp — not new Date()
        valuesIndex,
      ),
    )
  : null;
```

### What the enrichment pipeline produces

Both functions produce pre-labelled XML. The LLM receives:

- Scores with `label="High|Good|Low"` already applied — the LLM never classifies raw numbers
- `topStrengths` and `criticalGaps` surfaced at the top of the block
- Pre-written `strength_description` / `opportunity_description` text attached to relevant skills
- A `profileShape` attribute (`Balanced | Spiky | Developing`) on the root element
- An `interpretation-guide` that tells the LLM exactly what each label means

---

## Prompt Caching

Anthropic's API supports caching the system prompt between turns of the same conversation. Cached tokens are re-processed at ~10% of the normal input token price. At ~11,400 framework + session context tokens per turn, this is the primary cost lever for conversational use.

### How caching works

The API hashes the system prompt on the first turn. On subsequent turns, if the hash matches, the cached version is used. **If anything in the system prompt changes between turns, the cache misses and you pay full price.**

### What must stay stable between turns

| Part of the prompt              | Stable?     | Notes                                          |
| ------------------------------- | ----------- | ---------------------------------------------- |
| Framework blocks                | Yes         | Module-level constants — never change          |
| Identity + tone blocks          | Yes         | Set at session start from `IdentityToneConfig` |
| `user-profile` attributes       | Yes         | Set once from DB at session start              |
| `completedAt` in assessment XML | **Must be** | Use DB timestamp — never `new Date()`          |
| Assessment scores               | Yes         | Fetched once, held for session lifetime        |
| `status="not-completed"` blocks | Yes         | Static strings                                 |

### What legitimately changes between turns

Only the `messages` array changes between turns — that is expected and does not affect the system prompt cache.

### Enabling caching in the Vercel AI SDK

```ts
// app/api/chat/route.ts

const result = streamText({
  model: anthropic("claude-sonnet-4-20250514"),
  system: systemPrompt,
  messages,
  providerOptions: {
    anthropic: {
      cacheControl: { type: "ephemeral" }, // cache TTL: 5 minutes
    },
  },
});
```

The ephemeral cache persists for 5 minutes of inactivity. For a typical coaching session with regular back-and-forth, this means the system prompt is cached for the entire conversation and you pay full price only on the first turn.

### The `new Date()` anti-pattern

This is the most common way to silently break caching:

```ts
// ❌ Busts the cache on every single turn
buildProfile(id, "ld12", scores, new Date().toISOString(), skillIndex);

// ✅ Stable — same value on every turn of the session
buildProfile(id, "ld12", scores, ld12Assessment.completedAt, skillIndex);
```

`new Date().toISOString()` produces a different string every call. That one field change means the system prompt hash never matches, the cache misses on every turn, and you pay full input token price throughout the entire conversation.

---

## Prompt Injection — Session Context Block

```ts
// lib/prompt/buildSessionContextBlock.ts

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

Never skip a block entirely — always inject the `status="not-completed"` placeholder when data is absent. This explicitly tells the LLM the data is missing, preventing score hallucination.

---

## Prompt Assembly

```ts
// app/api/chat/route.ts — assembleSystemPrompt

function assembleSystemPrompt(params: {
  identityTone: IdentityToneConfig;
  user: ResolvedUserProfile;
  ld12XML: string | null;
  valuesXML: string | null;
}): string {
  const { identityTone, user, ld12XML, valuesXML } = params;

  return [
    buildFrameworkBlocks(), // always all three — no parameters
    buildIdentityBlock(identityTone),
    buildToneBlock(identityTone),
    buildSessionContextBlock({ user, ld12XML, valuesXML }),
    buildKnowledgePriorityBlock(),
    buildRulesBlock({ user, identityTone }),
    buildOutputFormattingBlock(),
  ].join("\n\n");
}
```

Note: `buildFrameworkBlocks()` takes no arguments. There are no framework toggles. See `playground-framework-injection-v2.md`.

---

## LLM Rules for Session Context

These rules belong in the `<rules>` block of every assembled prompt:

```
- Use ONLY the data in <session-context>. Never invent or assume scores, names, or role details.
- Address the user as {firstName} in most responses.
- When referencing an LD12 skill in the assessment data, always cite the exact score and label.
- When referencing a skill not present in assessment data, do not invent a score — ask the user to self-assess.
- LD12 scores are performance measurements. High = strength to leverage. Low = development priority.
- Values scores are motivational importance, not performance. Never frame a low values score as a deficit.
- Use values data to connect coaching advice to what intrinsically motivates this leader.
- If assessment-data has status="not-completed", do not reference scores. Acknowledge the assessment is pending if asked.
- Connect coaching to the user's role ({jobTitle}) and function ({functionName}) wherever relevant.
```

---

## Request Body Shape

```ts
// Client sends — nothing more
{
  messages: Message[],
  talentId: string,
  identityTone: IdentityToneConfig
}

// Server fetches, enriches, assembles, and caches — nothing comes from the client
```

---

## Null / Empty State Handling

| State            | LD12    | Values  | Behaviour                                      |
| ---------------- | ------- | ------- | ---------------------------------------------- |
| Full data        | present | present | Both XML blocks injected                       |
| LD12 only        | present | null    | LD12 injected, values `status="not-completed"` |
| Values only      | null    | present | Values injected, LD12 `status="not-completed"` |
| No assessments   | null    | null    | Both blocks `status="not-completed"`           |
| Talent not found | —       | —       | 404 before prompt assembly                     |

---

## Behaviour Notes for Cursor

- `skillIndex`, `functionIndex`, and `valuesIndex` are module-level constants. Never rebuild them inside the request handler.
- DB fetch functions live in `lib/db/assessments.ts`. Keep DB logic separate from prompt assembly logic.
- Assessment data is fetched once at session start and reused for all turns. Do not re-query the DB on every message.
- `completedAt` must come from the database. Never use `new Date().toISOString()` — it busts the prompt cache on every turn.
- The `assembleSystemPrompt` signature has no `frameworkToggles` parameter. Frameworks are always injected. Do not add toggle logic.
- `talentId` comes from the client and must be validated server-side before use in DB queries.
