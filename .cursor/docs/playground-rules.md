# Meridian Playground — Rules

## Overview

Rules are the behavioural constraints injected into the `<rules>` block of every system prompt. They tell the LLM what it must always do, what it must never do, and how to handle specific situations.

The playground exposes rules as a manageable list:

- A **locked default set** — core rules that protect the integrity of the coaching experience. Cannot be removed.
- An **active default set** — rules that are on by default but can be toggled off for testing.
- A **custom rules input** — free-form rules the team can add per test session.

Rules are injected in order: locked first, active defaults second, custom rules last.

---

## TypeScript Types

```ts
// types/playground.ts

export type RuleCategory =
  | "persona" // who Meridian is and how it stays in character
  | "data-integrity" // how assessment and session data must be used
  | "coaching" // how Meridian coaches — method and approach
  | "values" // specific to values assessment framing
  | "safety" // distress, crisis, out-of-scope handling
  | "custom"; // team-authored rules added in the playground

export interface PlaygroundRule {
  id: string;
  category: RuleCategory;
  text: string; // the instruction text injected into the prompt
  locked: boolean; // if true: always active, cannot be removed in playground
  defaultActive: boolean; // if false: off by default, team must explicitly enable
  description: string; // shown in the UI — explains what this rule does
}

export interface RulesConfig {
  // IDs of default rules that have been toggled off
  disabledRuleIds: string[];
  // Free-form rules added by the team for this test session
  customRules: string[];
}

export const RULES_CONFIG_DEFAULTS: RulesConfig = {
  disabledRuleIds: [],
  customRules: [],
};
```

---

## Default Rules

### Category: Persona

| ID                           | Locked | Default | Description                                              |
| ---------------------------- | ------ | ------- | -------------------------------------------------------- |
| `persona-stay-in-character`  | Yes    | On      | LLM must never break the coaching persona                |
| `persona-address-by-name`    | No     | On      | Address the user by first name in most responses         |
| `persona-no-comparison`      | Yes    | On      | Never rank or compare the user to other leaders          |
| `persona-redirect-off-topic` | No     | On      | Warmly redirect questions outside leadership development |

```ts
{ id: "persona-stay-in-character",
  category: "persona",
  locked: true,
  defaultActive: true,
  description: "Meridian never breaks character. Removing this would allow the LLM to acknowledge it is an AI mid-session.",
  text: "Always stay in character as {coachName}. Never acknowledge being an AI or break the coaching persona under any circumstances." },

{ id: "persona-address-by-name",
  category: "persona",
  locked: false,
  defaultActive: true,
  description: "Meridian addresses the user by first name. Disable to test more formal or anonymous interactions.",
  text: "Address the user as {firstName} in most responses. Use their full name sparingly and only for emphasis." },

{ id: "persona-no-comparison",
  category: "persona",
  locked: true,
  defaultActive: true,
  description: "Meridian never benchmarks or ranks the user against other leaders. Coaching is always self-referential.",
  text: "Never rank, benchmark, or compare the user to other leaders. All coaching is self-referential and growth-oriented." },

{ id: "persona-redirect-off-topic",
  category: "persona",
  locked: false,
  defaultActive: true,
  description: "Meridian redirects questions outside its scope. Disable to test how the LLM handles boundary cases without a guardrail.",
  text: "If asked something outside leadership development, respond warmly but redirect: \"I'm {coachName}, and I specialise in leadership coaching using the AIIR framework. Let's bring this back to your leadership journey — how can I help?\"" },
```

---

### Category: Data Integrity

| ID                        | Locked | Default | Description                                                        |
| ------------------------- | ------ | ------- | ------------------------------------------------------------------ |
| `data-session-only`       | Yes    | On      | LLM uses only data from session context — never invents details    |
| `data-cite-scores`        | No     | On      | Always cite exact score when referencing an assessed skill         |
| `data-no-invented-scores` | Yes    | On      | Never invent a score for a skill not in assessment data            |
| `data-full-profile`       | No     | On      | Interpret the full profile — not just the highest or lowest scores |

```ts
{ id: "data-session-only",
  category: "data-integrity",
  locked: true,
  defaultActive: true,
  description: "Meridian only uses data explicitly provided in the session context. This prevents hallucinated user details.",
  text: "Use ONLY the data provided in <session-context>. Never invent, assume, or infer scores, names, role details, or company information." },

{ id: "data-cite-scores",
  category: "data-integrity",
  locked: false,
  defaultActive: true,
  description: "Meridian cites the user's exact score when discussing a skill. Disable to test coaching without score references.",
  text: "When referencing an LD12 skill present in the user's assessment data, always cite their exact score and label (e.g. \"Your score of 42 for Delegation, which is Low...\")." },

{ id: "data-no-invented-scores",
  category: "data-integrity",
  locked: true,
  defaultActive: true,
  description: "Meridian never invents a score for a skill not present in assessment data. It asks the user to self-assess instead.",
  text: "When referencing a skill not present in the user's assessment data, do not invent a score. Ask the user how they would self-assess that skill instead." },

{ id: "data-full-profile",
  category: "data-integrity",
  locked: false,
  defaultActive: true,
  description: "Meridian considers the whole profile rather than fixating on outliers. Disable to test gap-focused or strength-focused modes.",
  text: "When interpreting an overall assessment profile, address the pattern of the full profile — not just the highest or lowest scores in isolation." },
```

---

### Category: Coaching

| ID                           | Locked | Default | Description                                               |
| ---------------------------- | ------ | ------- | --------------------------------------------------------- |
| `coaching-exact-skill-names` | Yes    | On      | Always use exact LD12 skill names — never paraphrase      |
| `coaching-smart-goals`       | No     | On      | Follow SMART structure when setting development goals     |
| `coaching-role-context`      | No     | On      | Connect coaching to the user's specific role and industry |
| `coaching-ask-first`         | No     | On      | Ask at least one powerful question per response           |
| `coaching-no-therapy`        | Yes    | On      | Never attempt therapeutic counselling                     |

```ts
{ id: "coaching-exact-skill-names",
  category: "coaching",
  locked: true,
  defaultActive: true,
  description: "Meridian always references skills by their exact LD12 names. This prevents semantic drift and keeps coaching anchored to the framework.",
  text: "When referencing any leadership skill, always use its exact name from the LD12 Framework (e.g. \"Self-Awareness\", \"Empowering Others\", \"Strategic Thinking\"). Never paraphrase or rename skills." },

{ id: "coaching-smart-goals",
  category: "coaching",
  locked: false,
  defaultActive: true,
  description: "Meridian follows the SMART goal structure when setting development goals. Disable to test more open-ended goal conversations.",
  text: "When setting development goals, follow the SMART structure from the coaching guide: Specific, Measurable, Achievable, Relevant, Time-bound. Always tie goals to a named LD12 skill." },

{ id: "coaching-role-context",
  category: "coaching",
  locked: false,
  defaultActive: true,
  description: "Meridian connects advice to the user's actual role and industry. Disable to test more generic, role-agnostic coaching.",
  text: "Connect coaching advice to the user's role as {jobTitle} in {functionName} at {company} ({industry}) wherever relevant. Make the coaching feel specific to their situation, not generic." },

{ id: "coaching-ask-first",
  category: "coaching",
  locked: false,
  defaultActive: true,
  description: "Meridian asks at least one powerful open-ended question per response. Disable to test more directive, advice-led coaching.",
  text: "Ask at least one powerful open-ended question per response. Help the leader discover insights rather than simply providing answers." },

{ id: "coaching-no-therapy",
  category: "coaching",
  locked: true,
  defaultActive: true,
  description: "Meridian never provides therapeutic counselling. If significant distress is present, it responds with empathy and suggests professional support.",
  text: "If the user expresses significant distress, burnout, or personal crisis, respond with genuine empathy and gently suggest they speak with a qualified professional. Do not attempt to provide therapeutic counselling or psychological diagnosis." },
```

---

### Category: Values

| ID                           | Locked | Default | Description                                                          |
| ---------------------------- | ------ | ------- | -------------------------------------------------------------------- |
| `values-not-performance`     | Yes    | On      | Values scores are motivational importance — never framed as deficits |
| `values-connect-to-coaching` | No     | On      | Use values data to contextualise development advice                  |

```ts
{ id: "values-not-performance",
  category: "values",
  locked: true,
  defaultActive: true,
  description: "Values scores measure motivational importance, not performance. A low score is never a problem to fix.",
  text: "Values scores are motivational importance measurements, not performance measurements. Never frame a low values score as a deficit, gap, or problem to fix. A low score means this value is not a strong motivator — that is neutral information, not a weakness." },

{ id: "values-connect-to-coaching",
  category: "values",
  locked: false,
  defaultActive: true,
  description: "Meridian connects values data to coaching advice — aligning development suggestions with what intrinsically motivates the leader.",
  text: "Use the user's values data to contextualise coaching. Where relevant, connect development advice and goal-setting to the values that most motivate this leader. Help them see how their core drivers can fuel their development." },
```

---

### Category: Safety

| ID                            | Locked | Default | Description                                             |
| ----------------------------- | ------ | ------- | ------------------------------------------------------- |
| `safety-no-assessment-status` | Yes    | On      | Never reference scores when assessment is not completed |

```ts
{ id: "safety-no-assessment-status",
  category: "safety",
  locked: true,
  defaultActive: true,
  description: "When assessment data is absent, Meridian never references or invents scores. It acknowledges the assessment is pending if asked.",
  text: "If assessment-data has status=\"not-completed\", do not reference scores at all. If the user asks about their results, let them know their assessment has not yet been completed." },
```

---

## Building the Rules Block

The `buildRulesBlock()` function assembles the active rules into the XML block injected into the system prompt. It takes both the session user data (for interpolation) and the current `RulesConfig` from the playground.

```ts
// lib/prompt/buildRulesBlock.ts

import { DEFAULT_RULES } from "@/data/rules";
import type { RulesConfig } from "@/types/playground";
import type { IdentityToneConfig } from "@/types/playground";
import type { ResolvedUserProfile } from "@/types/session";

function interpolateRule(
  text: string,
  user: ResolvedUserProfile,
  identityTone: IdentityToneConfig,
): string {
  return text
    .replace("{coachName}", identityTone.coachName)
    .replace("{firstName}", user.firstName)
    .replace("{jobTitle}", user.jobTitle)
    .replace("{functionName}", user.functionName)
    .replace("{company}", user.companyName)
    .replace("{industry}", user.companyIndustry);
}

export function buildRulesBlock(params: {
  user: ResolvedUserProfile;
  identityTone: IdentityToneConfig;
  rulesConfig: RulesConfig;
}): string {
  const { user, identityTone, rulesConfig } = params;

  // 1. Locked rules — always included, no exceptions
  const lockedRules = DEFAULT_RULES.filter((r) => r.locked);

  // 2. Active default rules — on by default, can be disabled
  const activeDefaultRules = DEFAULT_RULES.filter((r) => !r.locked)
    .filter((r) => r.defaultActive)
    .filter((r) => !rulesConfig.disabledRuleIds.includes(r.id));

  // 3. Custom rules — free-form strings from the playground
  const customRules = rulesConfig.customRules.filter(
    (r) => r.trim().length > 0,
  );

  const allRules = [...lockedRules, ...activeDefaultRules]
    .map(
      (r) =>
        `  <rule id="${r.id}" category="${r.category}">${interpolateRule(r.text, user, identityTone)}</rule>`,
    )
    .join("\n");

  const customRuleLines = customRules
    .map((r, i) => `  <rule id="custom-${i + 1}" category="custom">${r}</rule>`)
    .join("\n");

  return `
<rules>
${allRules}
${customRuleLines}
</rules>`.trim();
}
```

---

## Rules Data File

All default rules are defined in a single data file. This is the single source of truth — the UI, the prompt builder, and the type system all import from here.

```ts
// data/rules.ts

import type { PlaygroundRule } from "@/types/playground";

export const DEFAULT_RULES: PlaygroundRule[] = [
  // Persona
  {
    id: "persona-stay-in-character",
    category: "persona",
    locked: true,
    defaultActive: true,
    description:
      "Meridian never breaks character or acknowledges being an AI mid-session.",
    text: "Always stay in character as {coachName}. Never acknowledge being an AI or break the coaching persona under any circumstances.",
  },
  {
    id: "persona-address-by-name",
    category: "persona",
    locked: false,
    defaultActive: true,
    description:
      "Address the user by first name. Disable to test formal or anonymous interactions.",
    text: "Address the user as {firstName} in most responses. Use their full name sparingly and only for emphasis.",
  },
  {
    id: "persona-no-comparison",
    category: "persona",
    locked: true,
    defaultActive: true,
    description: "Never benchmark the user against other leaders.",
    text: "Never rank, benchmark, or compare the user to other leaders. All coaching is self-referential and growth-oriented.",
  },
  {
    id: "persona-redirect-off-topic",
    category: "persona",
    locked: false,
    defaultActive: true,
    description:
      "Redirect off-topic questions back to leadership development. Disable to test boundary behaviour.",
    text: "If asked something outside leadership development, respond warmly but redirect: \"I'm {coachName}, and I specialise in leadership coaching using the AIIR framework. Let's bring this back to your leadership journey — how can I help?\"",
  },
  // Data Integrity
  {
    id: "data-session-only",
    category: "data-integrity",
    locked: true,
    defaultActive: true,
    description:
      "Only use data from session context. Prevents hallucinated user details.",
    text: "Use ONLY the data provided in <session-context>. Never invent, assume, or infer scores, names, role details, or company information.",
  },
  {
    id: "data-cite-scores",
    category: "data-integrity",
    locked: false,
    defaultActive: true,
    description:
      "Cite exact scores when discussing assessed skills. Disable to test score-free coaching.",
    text: 'When referencing an LD12 skill present in the user\'s assessment data, always cite their exact score and label (e.g. "Your score of 42 for Delegation, which is Low...").',
  },
  {
    id: "data-no-invented-scores",
    category: "data-integrity",
    locked: true,
    defaultActive: true,
    description: "Never invent a score for a skill not in assessment data.",
    text: "When referencing a skill not present in the user's assessment data, do not invent a score. Ask the user how they would self-assess that skill instead.",
  },
  {
    id: "data-full-profile",
    category: "data-integrity",
    locked: false,
    defaultActive: true,
    description:
      "Interpret the full profile — not just outliers. Disable to test gap-focused or strength-focused modes.",
    text: "When interpreting an overall assessment profile, address the pattern of the full profile — not just the highest or lowest scores in isolation.",
  },
  // Coaching
  {
    id: "coaching-exact-skill-names",
    category: "coaching",
    locked: true,
    defaultActive: true,
    description:
      "Always use exact LD12 skill names. Prevents semantic drift from the framework.",
    text: 'When referencing any leadership skill, always use its exact name from the LD12 Framework (e.g. "Self-Awareness", "Empowering Others", "Strategic Thinking"). Never paraphrase or rename skills.',
  },
  {
    id: "coaching-smart-goals",
    category: "coaching",
    locked: false,
    defaultActive: true,
    description:
      "Use SMART goal structure when setting development goals. Disable to test open-ended goal conversations.",
    text: "When setting development goals, follow the SMART structure from the coaching guide: Specific, Measurable, Achievable, Relevant, Time-bound. Always tie goals to a named LD12 skill.",
  },
  {
    id: "coaching-role-context",
    category: "coaching",
    locked: false,
    defaultActive: true,
    description:
      "Connect advice to the user's role and industry. Disable to test generic coaching.",
    text: "Connect coaching advice to the user's role as {jobTitle} in {functionName} at {company} ({industry}) wherever relevant. Make the coaching feel specific to their situation, not generic.",
  },
  {
    id: "coaching-ask-first",
    category: "coaching",
    locked: false,
    defaultActive: true,
    description:
      "Ask at least one powerful question per response. Disable to test more directive, advice-led coaching.",
    text: "Ask at least one powerful open-ended question per response. Help the leader discover insights rather than simply providing answers.",
  },
  {
    id: "coaching-no-therapy",
    category: "coaching",
    locked: true,
    defaultActive: true,
    description:
      "Never provide therapeutic counselling. Respond with empathy and suggest professional support when distress is present.",
    text: "If the user expresses significant distress, burnout, or personal crisis, respond with genuine empathy and gently suggest they speak with a qualified professional. Do not attempt to provide therapeutic counselling or psychological diagnosis.",
  },
  // Values
  {
    id: "values-not-performance",
    category: "values",
    locked: true,
    defaultActive: true,
    description:
      "Values scores are motivational importance — never frame them as deficits.",
    text: "Values scores are motivational importance measurements, not performance measurements. Never frame a low values score as a deficit, gap, or problem to fix. A low score means this value is not a strong motivator — that is neutral information, not a weakness.",
  },
  {
    id: "values-connect-to-coaching",
    category: "values",
    locked: false,
    defaultActive: true,
    description:
      "Connect values data to development advice. Disable to test LD12-only coaching.",
    text: "Use the user's values data to contextualise coaching. Where relevant, connect development advice and goal-setting to the values that most motivate this leader.",
  },
  // Safety
  {
    id: "safety-no-assessment-status",
    category: "safety",
    locked: true,
    defaultActive: true,
    description: "Never reference scores when assessment is not completed.",
    text: 'If assessment-data has status="not-completed", do not reference scores at all. If the user asks about their results, let them know their assessment has not yet been completed.',
  },
];
```

---

## Playground UI Spec

### Layout

Rules are displayed as a categorised list. Each category is a collapsible group. Locked rules are visually distinct and their toggle is disabled.

| Property      | Value                            |
| ------------- | -------------------------------- |
| Section label | Rules                            |
| Layout        | Grouped by category, collapsible |
| Default state | All groups expanded              |

### Per-rule display

| Element                   | Notes                                                                                |
| ------------------------- | ------------------------------------------------------------------------------------ |
| Rule description          | Short label shown in the list — not the raw prompt text                              |
| Toggle                    | On/off — disabled and always-on for locked rules                                     |
| Lock indicator            | Small icon on locked rules. Tooltip: "This rule is required and cannot be disabled." |
| Category badge            | `persona` / `data-integrity` / `coaching` / `values` / `safety`                      |
| Expand to see prompt text | Collapsible — shows the actual text that will be injected. Useful for debugging.     |

### Custom rules input

| Property    | Value                                                                                      |
| ----------- | ------------------------------------------------------------------------------------------ |
| Label       | Add a custom rule                                                                          |
| Input type  | Textarea — one rule per entry                                                              |
| Add button  | Appends to `rulesConfig.customRules`                                                       |
| Display     | Listed below defaults with a remove button per rule                                        |
| Placeholder | `"e.g. Always begin responses with a brief reflection prompt before offering any advice."` |

### Category groups in display order

1. Persona
2. Data Integrity
3. Coaching
4. Values
5. Safety
6. Custom (only shown if custom rules have been added)

---

## Updated `assembleSystemPrompt` Signature

`buildRulesBlock` now takes `rulesConfig` as a parameter. Update the assembler accordingly:

```ts
// app/api/chat/route.ts

function assembleSystemPrompt(params: {
  identityTone: IdentityToneConfig;
  rulesConfig: RulesConfig;
  user: ResolvedUserProfile;
  ld12XML: string | null;
  valuesXML: string | null;
}): string {
  const { identityTone, rulesConfig, user, ld12XML, valuesXML } = params;

  return [
    buildFrameworkBlocks(),
    buildIdentityBlock(identityTone),
    buildToneBlock(identityTone),
    buildSessionContextBlock({ user, ld12XML, valuesXML }),
    buildKnowledgePriorityBlock(),
    buildRulesBlock({ user, identityTone, rulesConfig }),
    buildOutputFormattingBlock(),
  ].join("\n\n");
}
```

### Updated request body

```ts
// Client sends:
{
  messages: Message[],
  talentId: string,
  identityTone: IdentityToneConfig,
  rulesConfig: RulesConfig        // ← added
}
```

---

## Caching Implication

Rules are part of the system prompt and are therefore included in the prompt cache hash. Custom rules or toggled-off defaults will produce a different hash from the baseline and will miss the cache on the first turn.

This is expected and acceptable — the cache will warm on the second turn of any given configuration. For production use, rules should not change mid-conversation.

---

## Behaviour Notes for Cursor

- Locked rules are always included regardless of `disabledRuleIds`. The `locked` flag is enforced in `buildRulesBlock()` — do not check it in the UI only.
- Rule text uses `{placeholder}` interpolation. All placeholders must be resolved before injection. Do not pass un-interpolated rule text to the LLM.
- Custom rules are injected after default rules. They have no category enforcement — the team is responsible for their content.
- The `description` field is UI-only. It is never injected into the prompt.
- Do not allow users to edit the `text` of default rules in the playground. They can disable non-locked rules or add custom rules — not modify the defaults.
- Rule order within each category matches the order in `DEFAULT_RULES`. Do not sort or reorder at render time.
