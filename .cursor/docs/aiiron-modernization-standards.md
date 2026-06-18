# Aiiron Modernisation Standards

A pathway for upgrading Aiiron from its current stack to a modern, durable
chatbot architecture. This document is self-contained: it describes **standards
and patterns**, not a specific codebase. The team can implement it from scratch
in their own repository.

---

## The three problems we are solving

1. **Out-of-date AI SDK.** The chat layer is pinned to an old SDK with patterns
   that no longer reflect how streaming, messages, and tools are modelled today.
2. **Coupled to the OpenAI Assistants API**, which is being deprecated. State
   (threads, assistants, runs) lives inside a single vendor's product.
3. **System prompt is not intelligent enough.** A single hand-written prompt
   string can't ground responses in each user's data the way a structured,
   enriched prompt can.

The fixes are three standards: **a modern streaming SDK**, **a stateless,
model-agnostic backend**, and **a structured system prompt built from enriched
data**. A fourth standard — **prompt caching discipline** — keeps it affordable.

---

## Standard 1 — Modern streaming AI SDK

Adopt the current generation of the AI SDK (server streaming primitives plus a
React hook for the client). The shape below is vendor-neutral; the same concepts
apply regardless of which model provider you use.

### Server: stream from a single function

```ts
// POST /api/chat
import { streamText, convertToModelMessages, type UIMessage } from "ai";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: "anthropic/claude-sonnet-4-6", // provider-prefixed string (see Standard 2)
    system: buildSystemPrompt(/* ... */),  // see Standard 3
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse({ sendReasoning: true });
}
```

**Standards to adopt:**

- **Two message shapes, one boundary.** UI messages (what the client renders and
  persists) are distinct from model messages (what the provider receives).
  Convert at the API boundary; never blur the two.
- **Messages are part-based.** A message is an array of typed `parts`
  (`text`, `reasoning`, `tool-*`) — not a single string. This is what lets you
  stream reasoning, render tool UI, and persist everything losslessly.
- **Stream, don't block.** Return a streamed response so the UI renders tokens
  as they arrive.

### Client: one hook, a configurable transport

```ts
const transport = useMemo(
  () => new DefaultChatTransport({
    api: "/api/chat",
    body: () => bodyRef.current, // always sends the latest config each turn
  }),
  [],
);

const { messages, sendMessage, status, stop } = useChat({
  transport,
  messages: initialMessages, // rehydrate a saved conversation
  onFinish: ({ message }) => persistMessage(message),
});
```

**Standards to adopt:**

- Use the SDK's chat hook rather than hand-rolled fetch + state.
- Send per-turn config (model, user id, options) via a `body` callback so the
  transport always reads current values without being re-created.
- Render by iterating `message.parts` and switching on `part.type`. Don't
  flatten to a string.

### Tools

Declare tools inline with a typed input schema (use a schema library such as
Zod). Tools that the **UI resolves** (e.g. "let the user pick an option") have
no server-side `execute` — the client returns the result and generation
resumes automatically. Tools that the **server resolves** include an `execute`
function. Keep tool definitions next to the route that uses them.

---

## Standard 2 — Stateless and model-agnostic backend

This is the standard that removes the Assistants-API dependency. The principle:

> The server holds no conversation state. Every request is self-contained. You
> own the history. The model is a swappable string.

### Own your conversation state

Store conversations and messages in **your own database** — not in a vendor's
thread store. Persist each message as its array of `parts` (jsonb / json) so
reasoning and tool calls round-trip.

```
chats     (id, title, created_at, ...)
messages  (id, chat_id, role, parts jsonb, metadata jsonb, created_at)
```

A request flow becomes:

1. Client sends the message history (or you load it from the DB by chat id).
2. Server assembles the system prompt and streams a response.
3. Each completed message is written back to the DB.

This **replaces** "create assistant → create thread → add message → run → poll".
There are no threads and no assistants to deprecate.

### Make the model a string, isolate provider quirks

Store the model as a **provider-prefixed string** (e.g. `anthropic/...`,
`openai/...`) rather than wiring code to one vendor's SDK. Route any
provider-specific behaviour behind a small prefix check:

```ts
const model = chat.model ?? "anthropic/claude-sonnet-4-6";
const isAnthropic = model.startsWith("anthropic/");

streamText({
  model,
  system,
  messages,
  providerOptions: {
    ...(isAnthropic && { anthropic: { cacheControl: { type: "ephemeral" } } }),
  },
});
```

Swapping or A/B-testing providers becomes a config change, not a rewrite.

**Standards to adopt:**

- No vendor-managed conversation state. Your DB is the source of truth.
- Stateless API route: it takes the history in and streams a response out.
- Model identity is data (a string), not hardcoded SDK calls.
- Provider-specific options live behind a single capability check.

---

## Standard 3 — Structured, enriched system prompt

A more intelligent assistant does **not** come from a longer prompt. It comes
from **structure** and from **pre-processing the user's data** before the model
sees it. Adopt four sub-standards.

### 3a. Assemble the prompt from small, ordered blocks

Never write the system prompt as one literal string. Compose it from pure
functions, each emitting a self-contained, XML-tagged block, in a fixed order:

```ts
function buildSystemPrompt(params): string {
  return [
    knowledgeBlocks(),              // 1. Static domain knowledge / vocabulary
    identityBlock(),                // 2. Who the assistant is
    sessionContextBlock(params),    // 3. THIS user's enriched data
    knowledgePriorityBlock(),       // 4. How to resolve conflicts
    groundingRules(),               // 5. Behavioural constraints
  ].join("\n\n");
}
```

- Use **XML-style tags** (`<knowledge>`, `<session-context>`, `<rules>`). Tags
  give the model unambiguous structure to reason against.
- **Order matters.** Foundational knowledge first, the user's data next,
  constraints last. Earlier content is weighted more heavily.
- Each `<knowledge>` block carries a short **`usage` attribute** telling the
  model *when and how* to use it — this instruction text does a lot of the work.

### 3b. Enrich the user's data server-side (the core idea)

This is the single biggest lever for perceived intelligence. **Do not hand the
model raw rows or raw numbers.** Transform them on the server into a labelled,
pre-interpreted block. The model should *interpret*, never *compute*.

For each piece of personalisation data, the server should:

- **Classify** raw values into named bands (e.g. `High` / `Medium` / `Low`)
  using thresholds you control.
- **Surface** the highlights up front (top strengths, key gaps, notable items).
- **Derive** any summary shape or pattern (e.g. "balanced" vs "spiky").
- **Attach** human-written interpretation text to the items that matter.
- **Embed an interpretation guide** so the model knows exactly what each label
  means.

Illustrative output the model receives:

```xml
<user-data type="assessment" completedAt="2025-09-01" shape="spiky">
  <highlights>
    <item name="Strategic Thinking" value="88" label="High" />
    <item name="Delegation"          value="14" label="Low"  />
  </highlights>
  <scores>
    <item name="Delegation" value="14" label="Low"
          note="Tends to hold onto work; coach toward trust and handoff." />
    <!-- ... -->
  </scores>
  <interpretation-guide>
    High (>=75): a clear strength to leverage.
    Medium (25-74): adequate; develop if the role demands it.
    Low (<25): a development priority.
    shape="spiky": significant variance — notable peaks and valleys.
  </interpretation-guide>
</user-data>
```

Because the server has already classified, ranked, and explained the data, the
model's output is accurate, consistent, and free of invented numbers.

### 3c. Handle missing data explicitly — never omit it

When a user has no data for a section, **inject an explicit placeholder**
rather than leaving the block out:

```xml
<user-data type="assessment" status="not-completed">
  No data available for this user. Do not reference or invent values.
  If asked, say the assessment has not been completed.
</user-data>
```

Omitting a block invites hallucination. An explicit "not-completed" block tells
the model the data is genuinely absent.

### 3d. State a priority hierarchy and fixed grounding rules

Tell the model what wins when blocks disagree, and constrain its behaviour with
a small set of **fixed** rules (in code, not user-configurable):

```xml
<knowledge-priority>
  1. The user's own data — always ground responses in it.
  2. Domain methodology / framework knowledge.
  3. Identity and tone — shape how you communicate, not what.
</knowledge-priority>

<rules>
  <rule>Use ONLY the data in the user-data block. Never invent values or details.</rule>
  <rule>When citing a value, use the exact number and label provided.</rule>
  <rule>If an item is absent, ask the user rather than inventing a value.</rule>
  <rule>If a block is status="not-completed", do not reference values.</rule>
  <rule>Round all numbers to whole values.</rule>
</rules>
```

Keep these as constants. Configurability (toggleable rules, swappable persona,
prompt examples) is useful for an internal experimentation playground but is
**not needed** for a production assistant — leave it out to keep the prompt
stable and predictable.

---

## Standard 4 — Prompt caching discipline

The knowledge + rules portion of the prompt is large and re-sent on every turn
(the model has no memory between turns, so this is correct, not a bug). Most
providers can **cache a stable prefix** of the prompt and re-bill it at a steep
discount. To benefit, the system prompt must be **byte-stable between turns of a
session.**

```ts
providerOptions: {
  anthropic: { cacheControl: { type: "ephemeral" } },
}
```

The most common way to silently break caching:

```ts
// BAD — a new value every turn; the cache never matches, full price every turn
enrich(data, new Date().toISOString());

// GOOD — a stable value sourced from the database
enrich(data, record.completedAt);
```

**Standards to adopt:**

- Any timestamp or id embedded in the prompt must come from a **stable source**
  (the DB), never `new Date()` or a random id generated per request.
- Fetch and enrich a user's data **once per session**, then reuse it for every
  turn — don't re-query and re-serialise on each message.
- Only the `messages` array should change between turns.

---

## Migration sequence

1. **Upgrade the SDK.** Move the chat route to the streaming primitives and the
   client to the chat hook + configurable transport. (Standard 1)
2. **Take ownership of state.** Create `chats` / `messages` tables that store
   message `parts`. Make the API route stateless. (Standard 2)
3. **Retire the Assistants API.** Replace assistant/thread/run orchestration
   with "load history → assemble prompt → stream → persist". (Standard 2)
4. **Make the model a stored string** and isolate provider options behind a
   capability check. (Standard 2)
5. **Decompose the system prompt** into ordered, XML-tagged builder functions.
   (Standard 3a)
6. **Add a server-side enrichment step** that turns raw user data into labelled,
   interpreted blocks, with explicit handling for missing data. (Standard 3b/3c)
7. **Add a priority hierarchy and fixed grounding rules.** (Standard 3d)
8. **Enable prompt caching** and enforce prompt stability. (Standard 4)

---

## Acceptance checklist

- [ ] Chat route streams via the modern SDK; client uses the chat hook.
- [ ] Messages persisted as `parts` in our own database; conversations rehydrate.
- [ ] No Assistants API, threads, runs, or vendor-managed state anywhere.
- [ ] Model is a provider-prefixed string; provider options behind a check.
- [ ] System prompt assembled from ordered, XML-tagged blocks.
- [ ] User data is classified, ranked, and explained **server-side** before the
      model sees it; the model never receives raw, unlabelled numbers.
- [ ] Missing data renders an explicit `status="not-completed"` block.
- [ ] A knowledge-priority block and fixed grounding rules are present.
- [ ] Prompt caching enabled; no `new Date()` / per-request ids in the prompt.
- [ ] User data is fetched and enriched once per session, not per turn.
