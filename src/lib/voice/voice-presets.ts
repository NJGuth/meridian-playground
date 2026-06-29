import type { MoodState, MoodTrigger } from "./concept-dynamics";

export type DynamicsPreset = {
  label: string;
  description: string;
  mood: Partial<MoodState>;
  volatility?: number;
  tolerance?: number;
  reactivityEnabled?: boolean;
  moodTriggers?: MoodTrigger[];
};

export const REACTIVITY_ARCHETYPES: Record<string, DynamicsPreset> = {
  "hot-headed": {
    label: "Hot-headed",
    description: "Quick to anger, slow to calm.",
    mood: { warmth: 30, aggression: 75, patience: 25 },
    volatility: 80,
    tolerance: 25,
    reactivityEnabled: true,
    moodTriggers: [
      {
        condition: "The trainee interrupts or talks over you",
        warmthDelta: -15,
        cooperativenessDelta: -10,
        aggressionDelta: 20,
        patienceDelta: -15,
      },
      {
        condition: "The trainee acknowledges your frustration calmly",
        warmthDelta: 10,
        cooperativenessDelta: 5,
        aggressionDelta: -15,
        patienceDelta: 10,
      },
    ],
  },
  "slow-to-trust": {
    label: "Slow to trust",
    description: "Guarded until rapport is earned.",
    mood: { warmth: 35, cooperativeness: 30, aggression: 25, patience: 55 },
    volatility: 45,
    tolerance: 60,
    reactivityEnabled: true,
    moodTriggers: [
      {
        condition: "The trainee asks thoughtful, open questions",
        warmthDelta: 10,
        cooperativenessDelta: 15,
        aggressionDelta: -5,
        patienceDelta: 5,
      },
      {
        condition: "The trainee pushes for answers too quickly",
        warmthDelta: -10,
        cooperativenessDelta: -20,
        aggressionDelta: 10,
        patienceDelta: -10,
      },
    ],
  },
  "people-pleaser": {
    label: "People-pleaser",
    description: "Agreeable but avoids hard topics.",
    mood: { warmth: 70, cooperativeness: 55, aggression: 15, patience: 65 },
    volatility: 35,
    tolerance: 75,
    reactivityEnabled: true,
    moodTriggers: [
      {
        condition: "The trainee raises a difficult or uncomfortable topic directly",
        warmthDelta: -5,
        cooperativenessDelta: -15,
        aggressionDelta: 5,
        patienceDelta: -10,
      },
      {
        condition: "The trainee creates psychological safety",
        warmthDelta: 10,
        cooperativenessDelta: 20,
        aggressionDelta: -5,
        patienceDelta: 5,
      },
    ],
  },
  stonewaller: {
    label: "Stonewaller",
    description: "Withdraws and gives minimal answers when pressured.",
    mood: { warmth: 25, cooperativeness: 15, aggression: 20, patience: 30 },
    volatility: 50,
    tolerance: 30,
    reactivityEnabled: true,
    moodTriggers: [
      {
        condition: "The trainee applies pressure or demands specifics",
        warmthDelta: -15,
        cooperativenessDelta: -25,
        aggressionDelta: 5,
        patienceDelta: -15,
      },
      {
        condition: "The trainee gives space and validates your perspective",
        warmthDelta: 15,
        cooperativenessDelta: 20,
        aggressionDelta: -10,
        patienceDelta: 10,
      },
    ],
  },
};

export const DIFFICULTY_PRESETS: Record<string, DynamicsPreset> = {
  warm: {
    label: "Warm & open",
    description: "Cooperative and patient — good for beginners.",
    mood: { warmth: 75, cooperativeness: 70, aggression: 15, patience: 70 },
    volatility: 25,
    tolerance: 80,
    reactivityEnabled: false,
  },
  "tough-fair": {
    label: "Tough but fair",
    description: "Direct and skeptical but willing to engage.",
    mood: { warmth: 45, cooperativeness: 45, aggression: 40, patience: 50 },
    volatility: 50,
    tolerance: 55,
    reactivityEnabled: true,
    moodTriggers: REACTIVITY_ARCHETYPES["slow-to-trust"].moodTriggers,
  },
  hostile: {
    label: "Hostile",
    description: "Cold, confrontational, low tolerance.",
    mood: { warmth: 20, cooperativeness: 25, aggression: 80, patience: 20 },
    volatility: 70,
    tolerance: 25,
    reactivityEnabled: true,
    moodTriggers: REACTIVITY_ARCHETYPES["hot-headed"].moodTriggers,
  },
  evasive: {
    label: "Evasive stonewaller",
    description: "Withholds information, shuts down under pressure.",
    mood: { warmth: 30, cooperativeness: 15, aggression: 25, patience: 35 },
    volatility: 55,
    tolerance: 30,
    reactivityEnabled: true,
    moodTriggers: REACTIVITY_ARCHETYPES.stonewaller.moodTriggers,
  },
};
