# Meridian — Framework Injection

## Overview

This document specifies how to load and inject the three static knowledge frameworks into every LLM system prompt.

| Framework                  | Source file                   | Format               | Role                                                            |
| -------------------------- | ----------------------------- | -------------------- | --------------------------------------------------------------- |
| AIIR Coaching Guide        | `data/aiir-coaching-guide.md` | XML                  | Coaching methodology, session structure, development principles |
| LD12 Leadership Framework  | `data/ld12-definitions.ts`    | TypeScript constants | All 45 skill definitions, 12 dimensions, 3 domains              |
| Values Navigator Framework | `data/values-definitions.ts`  | TypeScript constants | All 26 sub-dimensions and 10 dimensions                         |

### Core principle

Frameworks are the LLM's vocabulary. They are **always injected on every request** — there are no toggles, no conditional inclusion, no user or operator control over which frameworks are present. Asking Meridian a question without the frameworks is like asking someone to discuss a book they haven't read.

Framework content is loaded once at **module initialisation**, serialised to string, and held in memory. Every request reuses the same strings — no file reads, no rebuilds, no per-request overhead.

---

## File Locations

All framework source files live in `data/`:

```
data/
  aiir-coaching-guide.md       ← already exists, already XML-structured
  ld12-definitions.ts          ← already exists, exports DOMAINS / DIMENSIONS / SKILLS
  values-definitions.ts        ← already exists, exports VALUES_DIMENSIONS / VALUES_SUB_DIMENSIONS
```

The coaching guide is already structured as XML wrapped in an `<aiir-coaching-guide>` tag. It does not need transformation — load it as a raw string and inject it directly.

---

## Loading

### 1. AIIR Coaching Guide

The coaching guide is an `.md` file that contains XML. Load it as a raw string using `fs.readFileSync` at module load.

```ts
// lib/frameworks/loadCoachingGuide.ts

import { readFileSync } from "fs";
import { join } from "path";

// Loaded once at module initialisation — held in memory for the process lifetime
export const AIIR_COACHING_GUIDE = readFileSync(
  join(process.cwd(), "data/aiir-coaching-guide.md"),
  "utf-8",
);
```

Alternatively, configure Next.js to import `.md` files as raw strings at build time, which avoids any runtime file access:

```js
// next.config.js
const nextConfig = {
  webpack: (config) => {
    config.module.rules.push({ test: /\.md$/, type: "asset/source" });
    return config;
  },
};
```

```ts
// lib/frameworks/loadCoachingGuide.ts (build-time variant)
import coachingGuide from "@/data/aiir-coaching-guide.md";
export const AIIR_COACHING_GUIDE = coachingGuide as string;
```

Either approach is acceptable. The build-time import is preferred for Vercel deployments.

---

### 2. LD12 Framework

Serialise from `ld12-definitions.ts` at module load. The serialiser builds a structured XML representation of all domains, dimensions, and skills.

```ts
// lib/frameworks/serializeLD12.ts

import { DOMAINS, DIMENSIONS, SKILLS } from "@/data/ld12-definitions";

function serializeLD12Framework(): string {
  const domainBlocks = DOMAINS.map((domain) => {
    const domainDimensions = DIMENSIONS.filter((d) => d.domainId === domain.id);

    const dimensionBlocks = domainDimensions
      .map((dim) => {
        const dimSkills = SKILLS.filter((s) => s.dimensionId === dim.id);

        const skillLines = dimSkills
          .map(
            (s) => `
      <skill id="${s.id}" name="${s.name}">
        <definition>${s.description}</definition>
      </skill>`,
          )
          .join("");

        return `
    <dimension name="${dim.name}">
      <description>${dim.description}</description>
      ${skillLines}
    </dimension>`;
      })
      .join("");

    return `
  <domain name="${domain.name}">
    <description>${domain.description}</description>
    ${dimensionBlocks}
  </domain>`;
  }).join("");

  return `<ld12-framework>
  ${domainBlocks}
</ld12-framework>`;
}

// Serialised once at module load
export const LD12_FRAMEWORK_XML = serializeLD12Framework();
```

**What to omit:** Do not include `strengthDescription` or `opportunityDescription` in this serialisation. Those fields already appear in the per-user enriched assessment XML, attached to specific scores where they carry meaning. Including them here doubles the token cost and detaches the interpretation text from its context.

---

### 3. Values Framework

Same pattern — serialise from `values-definitions.ts` at module load.

```ts
// lib/frameworks/serializeValues.ts

import {
  VALUES_DIMENSIONS,
  VALUES_SUB_DIMENSIONS,
} from "@/data/values-definitions";

function serializeValuesFramework(): string {
  const dimensionBlocks = VALUES_DIMENSIONS.map((dim) => {
    const subDims = VALUES_SUB_DIMENSIONS.filter(
      (s) => s.dimensionKey === dim.key,
    );

    const subLines = subDims
      .map(
        (s) => `
    <value key="${s.key}" name="${s.title}">
      <description>${s.description}</description>
    </value>`,
      )
      .join("");

    return `
  <dimension key="${dim.key}" name="${dim.title}">
    <description>${dim.description}</description>
    ${subLines}
  </dimension>`;
  }).join("");

  return `<values-framework>
  ${dimensionBlocks}
</values-framework>`;
}

// Serialised once at module load
export const VALUES_FRAMEWORK_XML = serializeValuesFramework();
```

---

## Single Export Point

Import all framework content from one place throughout the codebase:

```ts
// lib/frameworks/index.ts

export { AIIR_COACHING_GUIDE } from "./loadCoachingGuide";
export { LD12_FRAMEWORK_XML } from "./serializeLD12";
export { VALUES_FRAMEWORK_XML } from "./serializeValues";
```

```ts
// app/api/chat/route.ts
import {
  AIIR_COACHING_GUIDE,
  LD12_FRAMEWORK_XML,
  VALUES_FRAMEWORK_XML,
} from "@/lib/frameworks";
```

---

## Prompt Injection

All three frameworks are wrapped in `<knowledge>` tags and injected at the top of every system prompt. The `usage` attribute is instruction text for the LLM — it tells Claude specifically when and how to consult each block.

```ts
// lib/frameworks/buildFrameworkBlocks.ts

import {
  AIIR_COACHING_GUIDE,
  LD12_FRAMEWORK_XML,
  VALUES_FRAMEWORK_XML,
} from "@/lib/frameworks";

export function buildFrameworkBlocks(): string {
  return `
<knowledge type="methodology" name="AIIR Coaching Guide"
  usage="Governs your coaching approach, session structure, assessment interpretation, goal setting, and development principles. Consult this on every response to ensure your coaching is methodologically grounded.">
${AIIR_COACHING_GUIDE}
</knowledge>

<knowledge type="framework" name="LD12 Leadership Framework"
  usage="Defines all 45 skills, 12 dimensions, and 3 domains. Always use exact skill names from this document. Do not paraphrase, rename, or invent skill names. Consult this whenever a user asks about any leadership skill or behaviour.">
${LD12_FRAMEWORK_XML}
</knowledge>

<knowledge type="framework" name="Values Navigator Framework"
  usage="Defines all 10 values dimensions and 26 sub-dimensions. Consult this when interpreting values assessment data or connecting coaching advice to what intrinsically motivates this leader. Values scores are motivational importance — not performance.">
${VALUES_FRAMEWORK_XML}
</knowledge>`.trim();
}
```

---

## Prompt Assembly Order

Framework blocks are always first. Claude weights earlier content more heavily — the frameworks are the foundation everything else is read against.

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
    buildFrameworkBlocks(), // 1. Frameworks — always first, always all three
    buildIdentityBlock(identityTone), // 2. Who Meridian is
    buildToneBlock(identityTone), // 3. How Meridian communicates
    buildSessionContextBlock({
      // 4. This user's profile + enriched assessment data
      user,
      ld12XML,
      valuesXML,
    }),
    buildKnowledgePriorityBlock(), // 5. Conflict resolution hierarchy
    buildRulesBlock({
      user, // 6. Behavioural constraints
      identityTone,
    }),
    buildOutputFormattingBlock(), // 7. Response structure
  ].join("\n\n");
}
```

Note that `buildFrameworkBlocks()` takes no arguments. There are no parameters to pass, no conditions to evaluate, no toggles to check. It always returns all three blocks.

---

## Token Budget

| Block                                | Approximate tokens |
| ------------------------------------ | ------------------ |
| AIIR Coaching Guide                  | ~2,000             |
| LD12 Framework (definitions only)    | ~3,500             |
| Values Framework (definitions only)  | ~2,500             |
| Enriched LD12 assessment XML         | ~1,800             |
| Enriched Values assessment XML       | ~1,200             |
| Identity + Tone + Rules + Formatting | ~400               |
| **Total**                            | **~11,400**        |

Claude Sonnet's context window is 200K tokens. The full framework payload is ~5.7% of that. This is not a constraint that requires optimisation today.

The framework blocks are re-sent on every turn of the conversation — this is correct behaviour, not a bug. Claude has no memory between turns, so the frameworks must be present in every request. Factor this into cost modelling for long conversations.

---

## Future: Intent-Based Selective Injection

If the framework payload grows significantly — through additional client-specific content, industry overlays, or role-specific coaching guides — selective injection based on message intent becomes worth implementing. The pattern would be:

```
User message → lightweight intent classifier → select relevant chunks → inject subset
```

This is not needed now. When it becomes necessary, the `buildFrameworkBlocks()` function is the only thing that changes — the rest of the pipeline is unaffected. Design the classifier at that point using the natural chunk boundaries already present in the data (skill, dimension, domain, coaching-guide section).

---

## Behaviour Notes for Cursor

- `AIIR_COACHING_GUIDE`, `LD12_FRAMEWORK_XML`, and `VALUES_FRAMEWORK_XML` are module-level constants defined outside any function or request handler. Do not move them inside the POST handler or any per-request function.
- `buildFrameworkBlocks()` is a pure function with no parameters. Do not add parameters to it. If you find yourself wanting to pass a toggle, that is a signal to reconsider the approach.
- The coaching guide is injected first because it governs how the LLM reasons. LD12 follows because it provides the skill vocabulary. Values follows because it provides the motivational vocabulary. This order is intentional — do not reorder.
- The `usage` attribute on each `<knowledge>` tag is read by the LLM. Keep it concise, behavioural, and specific about when to consult each block. Do not make it a general description of the content.
- Do not store framework content in environment variables. They are too large and environment variables are not the right mechanism for static assets.
- Do not inject `ld12-definitions.ts` as TypeScript source code. Always use the serialised XML output of `serializeLD12()`.
