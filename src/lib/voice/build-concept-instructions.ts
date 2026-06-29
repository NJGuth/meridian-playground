import {
  describeMoodState,
  type MoodState,
  type MoodTrigger,
} from "./concept-dynamics";

export type VoiceConceptConfig = {
  persona: string;
  script: string;
  rules: string[];
  openingLine: string;
  contextNotes: string;
  /** Baseline demeanor (may be session-varied at runtime). */
  mood: MoodState;
  volatility: number;
  tolerance: number;
  reactivityEnabled: boolean;
  moodTriggers: MoodTrigger[];
  hiddenAgenda: string;
  agendaUnlockCondition: string;
  targetDurationMinutes: number | null;
  autoEndOnExpiry: boolean;
};

export const BUILTIN_VOICE_CONCEPT_RULES = [
  "Always speak in English.",
] as const;

function describeVolatility(value: number): string {
  if (value <= 25) return "Your mood is very stable and changes slowly.";
  if (value <= 50) return "Your mood shifts moderately in response to the trainee.";
  if (value <= 75) return "Your mood shifts noticeably and fairly quickly.";
  return "Your mood shifts rapidly and dramatically in response to the trainee.";
}

function describeTolerance(value: number): string {
  if (value <= 25) {
    return "You have very low tolerance. If pushed too far you may shut down, become curt, or end the conversation by walking out. Use the shiftMood tool with walkOut=true when you have had enough.";
  }
  if (value <= 50) {
    return "You have moderate tolerance. Repeated poor handling will cause you to withdraw or become hostile.";
  }
  if (value <= 75) {
    return "You have good tolerance and can handle some friction before reacting strongly.";
  }
  return "You have high tolerance and stay engaged even when the trainee handles you poorly.";
}

function buildTriggersBlock(triggers: MoodTrigger[]): string {
  if (triggers.length === 0) return "";
  const lines = triggers.map((t, i) => {
    const deltas = [
      t.warmthDelta !== 0 ? `warmth ${t.warmthDelta > 0 ? "+" : ""}${t.warmthDelta}` : null,
      t.cooperativenessDelta !== 0
        ? `cooperativeness ${t.cooperativenessDelta > 0 ? "+" : ""}${t.cooperativenessDelta}`
        : null,
      t.aggressionDelta !== 0
        ? `aggression ${t.aggressionDelta > 0 ? "+" : ""}${t.aggressionDelta}`
        : null,
      t.patienceDelta !== 0
        ? `patience ${t.patienceDelta > 0 ? "+" : ""}${t.patienceDelta}`
        : null,
    ]
      .filter(Boolean)
      .join(", ");
    return `${i + 1}. IF ${t.condition} → shift mood (${deltas || "minor adjustment"})`;
  });
  return `# Reactivity triggers\nWhen these occur, adjust your tone accordingly and call shiftMood to record the change:\n${lines.join("\n")}`;
}

export function buildConceptInstructions(config: VoiceConceptConfig): string {
  const parts: string[] = [
    "You are in a spoken voice conversation simulating a real person in a training scenario. Keep responses concise and conversational — they will be spoken aloud. Use short sentences. Avoid markdown, bullet lists, code blocks, and special formatting.",
  ];

  if (config.persona.trim()) {
    parts.push(`# Identity\n${config.persona.trim()}`);
  }

  if (config.script.trim()) {
    parts.push(`# Your task\n${config.script.trim()}`);
  }

  parts.push(
    `# Demeanor (baseline)\n${describeMoodState(config.mood)}\nEmbody this baseline in how you speak. Do not announce your mood — show it through tone, word choice, and willingness to engage.`,
  );

  if (config.reactivityEnabled) {
    parts.push(
      `# Dynamic reactivity\n${describeVolatility(config.volatility)}\n${describeTolerance(config.tolerance)}`,
    );
    const triggersBlock = buildTriggersBlock(config.moodTriggers);
    if (triggersBlock) parts.push(triggersBlock);
    parts.push(
      `# Mood tool\nWhen your mood shifts significantly, call the shiftMood tool with updated axis values (0-100) and a brief reason. If you walk out of the conversation, call shiftMood with walkOut=true, deliver a brief closing line, and stop engaging.`,
    );
  } else {
    parts.push(
      `# Demeanor stability\nMaintain your baseline demeanor throughout unless the trainee does something extreme. You may still call shiftMood if you walk out due to low tolerance.`,
    );
  }

  if (config.hiddenAgenda.trim()) {
    const unlock = config.agendaUnlockCondition.trim()
      ? `Only reveal this when: ${config.agendaUnlockCondition.trim()}. When you reveal it, call shiftMood with agendaRevealed=true.`
      : "Do not volunteer this unless the trainee earns your trust.";
    parts.push(
      `# Hidden agenda (do not volunteer)\n${config.hiddenAgenda.trim()}\n${unlock}`,
    );
  }

  const allRules = [...BUILTIN_VOICE_CONCEPT_RULES, ...config.rules];
  if (allRules.length > 0) {
    const rulesList = allRules
      .map((rule, index) => `${index + 1}. ${rule}`)
      .join("\n");
    parts.push(`# Rules\nYou must follow these rules:\n${rulesList}`);
  }

  if (config.contextNotes.trim()) {
    parts.push(
      `# Reference knowledge\nUse this information when relevant:\n${config.contextNotes.trim()}`,
    );
  }

  if (config.targetDurationMinutes && config.targetDurationMinutes > 0) {
    parts.push(
      `# Time awareness\nThis conversation has a target duration of approximately ${config.targetDurationMinutes} minutes. Pace yourself naturally. When you receive time cues, begin wrapping up without breaking character.`,
    );
  }

  if (config.openingLine.trim()) {
    parts.push(
      `# Opening\nWhen the conversation begins, your first spoken turn must start with something like:\n"${config.openingLine.trim()}"\nThen continue naturally according to your task and demeanor.`,
    );
  } else {
    parts.push(
      "# Opening\nWhen the conversation begins, introduce yourself briefly and begin according to your task and demeanor.",
    );
  }

  return parts.join("\n\n");
}
