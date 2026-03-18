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
  customRules: jsonb("custom_rules")
    .$type<string[]>()
    .notNull()
    .default([]),
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
