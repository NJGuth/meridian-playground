import {
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const playgrounds = pgTable("playgrounds", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  model: text("model").notNull().default("anthropic/claude-sonnet-4-6"),
  roleDescription: text("role_description")
    .notNull()
    .default(
      "AI leadership coach specializing in the AIIR Leadership Framework",
    ),
  feedbackStyle: text("feedback_style").notNull().default("Reflective"),
  coachingPosture: text("coaching_posture").notNull().default("Exploratory"),
  disabledRuleIds: jsonb("disabled_rule_ids")
    .$type<string[]>()
    .notNull()
    .default([]),
  customRules: jsonb("custom_rules").$type<string[]>().notNull().default([]),
  welcomeMessage: text("welcome_message")
    .notNull()
    .default("Hi {firstName}, my name is {coachName}."),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const prompts = pgTable("prompts", {
  id: uuid("id").defaultRandom().primaryKey(),
  content: text("content").notNull().default(""),
  positiveExamples: jsonb("positive_examples")
    .$type<string[]>()
    .notNull()
    .default([]),
  negativeExamples: jsonb("negative_examples")
    .$type<string[]>()
    .notNull()
    .default([]),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const chats = pgTable("chats", {
  id: uuid("id").defaultRandom().primaryKey(),
  playgroundId: uuid("playground_id")
    .notNull()
    .references(() => playgrounds.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const people = pgTable("people", {
  id: uuid("id").defaultRandom().primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  jobTitle: text("job_title").notNull().default(""),
  function: text("function").notNull().default(""),
  level: text("level").notNull().default(""),
  company: text("company").notNull().default(""),
  industry: text("industry").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const assessments = pgTable("assessments", {
  id: uuid("id").defaultRandom().primaryKey(),
  personId: uuid("person_id")
    .notNull()
    .references(() => people.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  data: jsonb("data").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const messages = pgTable("messages", {
  id: text("id").primaryKey(),
  chatId: uuid("chat_id")
    .notNull()
    .references(() => chats.id, { onDelete: "cascade" }),
  role: text("role").notNull(),
  parts: jsonb("parts").$type<unknown[]>().notNull(),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const developmentPlans = pgTable("development_plans", {
  id: uuid("id").defaultRandom().primaryKey(),
  chatId: uuid("chat_id")
    .notNull()
    .references(() => chats.id, { onDelete: "cascade" }),
  personId: uuid("person_id").references(() => people.id, {
    onDelete: "set null",
  }),
  title: text("title").notNull().default(""),
  summary: text("summary").notNull().default(""),
  schemaJson: jsonb("schema_json").notNull(),
  docJson: jsonb("doc_json").notNull(),
  docMarkdown: text("doc_markdown").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const voiceConcepts = pgTable("voice_concepts", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull().default("Untitled"),
  voice: text("voice").notNull().default("alloy"),
  persona: text("persona").notNull().default(""),
  script: text("script").notNull().default(""),
  rules: jsonb("rules").$type<string[]>().notNull().default([]),
  openingLine: text("opening_line").notNull().default(""),
  introText: text("intro_text").notNull().default(""),
  contextNotes: text("context_notes").notNull().default(""),
  warmth: integer("warmth").notNull().default(50),
  cooperativeness: integer("cooperativeness").notNull().default(50),
  aggression: integer("aggression").notNull().default(50),
  patience: integer("patience").notNull().default(50),
  volatility: integer("volatility").notNull().default(50),
  tolerance: integer("tolerance").notNull().default(50),
  reactivityEnabled: integer("reactivity_enabled").notNull().default(0),
  moodTriggers: jsonb("mood_triggers")
    .$type<
      {
        condition: string;
        warmthDelta: number;
        cooperativenessDelta: number;
        aggressionDelta: number;
        patienceDelta: number;
      }[]
    >()
    .notNull()
    .default([]),
  hiddenAgenda: text("hidden_agenda").notNull().default(""),
  agendaUnlockCondition: text("agenda_unlock_condition").notNull().default(""),
  targetDurationMinutes: integer("target_duration_minutes"),
  autoEndOnExpiry: integer("auto_end_on_expiry").notNull().default(0),
  variationEnabled: integer("variation_enabled").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const scoringConfig = pgTable("scoring_config", {
  id: uuid("id").defaultRandom().primaryKey(),
  ld12HighThreshold: integer("ld12_high_threshold").notNull().default(75),
  ld12GoodThreshold: integer("ld12_good_threshold").notNull().default(25),
  profileShapeDevelopingMean: integer("profile_shape_developing_mean")
    .notNull()
    .default(35),
  profileShapeSpikyStdDev: integer("profile_shape_spiky_std_dev")
    .notNull()
    .default(20),
  valuesHighThreshold: integer("values_high_threshold").notNull().default(75),
  valuesModerateThreshold: integer("values_moderate_threshold")
    .notNull()
    .default(25),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
