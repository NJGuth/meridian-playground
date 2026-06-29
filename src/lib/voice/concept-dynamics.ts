export type MoodAxis =
  | "warmth"
  | "cooperativeness"
  | "aggression"
  | "patience";

export type MoodState = Record<MoodAxis, number>;

export type MoodTrigger = {
  condition: string;
  warmthDelta: number;
  cooperativenessDelta: number;
  aggressionDelta: number;
  patienceDelta: number;
};

export type SessionOutcome = {
  walkedOut: boolean;
  agendaRevealed: boolean;
  endingMood: MoodState;
};

export const MOOD_AXES: { key: MoodAxis; label: string; low: string; high: string }[] = [
  { key: "warmth", label: "Warmth", low: "cold", high: "warm" },
  {
    key: "cooperativeness",
    label: "Cooperativeness",
    low: "evasive",
    high: "forthcoming",
  },
  {
    key: "aggression",
    label: "Aggression",
    low: "passive",
    high: "confrontational",
  },
  { key: "patience", label: "Patience", low: "impatient", high: "patient" },
];

export const DEFAULT_MOOD: MoodState = {
  warmth: 50,
  cooperativeness: 50,
  aggression: 50,
  patience: 50,
};

export function clampMoodValue(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function clampMoodState(state: MoodState): MoodState {
  return {
    warmth: clampMoodValue(state.warmth),
    cooperativeness: clampMoodValue(state.cooperativeness),
    aggression: clampMoodValue(state.aggression),
    patience: clampMoodValue(state.patience),
  };
}

export function describeAxis(value: number, low: string, high: string): string {
  if (value <= 25) return `very ${low}`;
  if (value <= 40) return low;
  if (value >= 75) return `very ${high}`;
  if (value >= 60) return high;
  return "neutral";
}

export function describeMoodState(state: MoodState): string {
  return MOOD_AXES.map(({ key, low, high }) => {
    const label = MOOD_AXES.find((a) => a.key === key)?.label ?? key;
    return `${label}: ${describeAxis(state[key], low, high)} (${state[key]}/100)`;
  }).join("; ");
}

/** Apply small per-run jitter when variation is enabled. */
export function applySessionVariation(
  state: MoodState,
  enabled: boolean,
): MoodState {
  if (!enabled) return state;
  const jitter = () => Math.floor(Math.random() * 21) - 10;
  return clampMoodState({
    warmth: state.warmth + jitter(),
    cooperativeness: state.cooperativeness + jitter(),
    aggression: state.aggression + jitter(),
    patience: state.patience + jitter(),
  });
}

export function createDefaultTrigger(condition: string): MoodTrigger {
  return {
    condition,
    warmthDelta: 0,
    cooperativenessDelta: 0,
    aggressionDelta: 0,
    patienceDelta: 0,
  };
}
