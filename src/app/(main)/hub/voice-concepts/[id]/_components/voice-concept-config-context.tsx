"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { updateVoiceConcept } from "@/server/actions/voice-concept";
import {
  DEFAULT_MOOD,
  type MoodState,
  type MoodTrigger,
} from "@/lib/voice/concept-dynamics";
import type { OpenAiRealtimeVoice } from "@/lib/voice/voice-options";
import type { voiceConcepts } from "@/server/db/schema";

type VoiceConcept = typeof voiceConcepts.$inferSelect;

export type ConceptConfig = {
  title: string;
  voice: OpenAiRealtimeVoice;
  persona: string;
  script: string;
  rules: string[];
  openingLine: string;
  introText: string;
  contextNotes: string;
  warmth: number;
  cooperativeness: number;
  aggression: number;
  patience: number;
  volatility: number;
  tolerance: number;
  reactivityEnabled: boolean;
  moodTriggers: MoodTrigger[];
  hiddenAgenda: string;
  agendaUnlockCondition: string;
  targetDurationMinutes: number | null;
  autoEndOnExpiry: boolean;
  variationEnabled: boolean;
};

export function conceptConfigToMood(config: ConceptConfig): MoodState {
  return {
    warmth: config.warmth,
    cooperativeness: config.cooperativeness,
    aggression: config.aggression,
    patience: config.patience,
  };
}

type VoiceConceptContextValue = {
  config: ConceptConfig;
  setField: <K extends keyof ConceptConfig>(
    key: K,
    value: ConceptConfig[K],
  ) => void;
  commitField: (key: keyof ConceptConfig) => void;
  commit: (patch: Partial<ConceptConfig>) => void;
};

const VoiceConceptContext = createContext<VoiceConceptContextValue | null>(null);

function toBool(value: number): boolean {
  return value === 1;
}

function toConfig(concept: VoiceConcept): ConceptConfig {
  return {
    title: concept.title,
    voice: concept.voice as OpenAiRealtimeVoice,
    persona: concept.persona,
    script: concept.script,
    rules: concept.rules,
    openingLine: concept.openingLine,
    introText: concept.introText,
    contextNotes: concept.contextNotes,
    warmth: concept.warmth,
    cooperativeness: concept.cooperativeness,
    aggression: concept.aggression,
    patience: concept.patience,
    volatility: concept.volatility,
    tolerance: concept.tolerance,
    reactivityEnabled: toBool(concept.reactivityEnabled),
    moodTriggers: concept.moodTriggers,
    hiddenAgenda: concept.hiddenAgenda,
    agendaUnlockCondition: concept.agendaUnlockCondition,
    targetDurationMinutes: concept.targetDurationMinutes,
    autoEndOnExpiry: toBool(concept.autoEndOnExpiry),
    variationEnabled: toBool(concept.variationEnabled),
  };
}

export function VoiceConceptProvider({
  concept,
  children,
}: {
  concept: VoiceConcept;
  children: React.ReactNode;
}) {
  const [config, setConfig] = useState<ConceptConfig>(() => toConfig(concept));
  const configRef = useRef(config);
  configRef.current = config;
  const savedRef = useRef<ConceptConfig>(toConfig(concept));

  const setField = useCallback(
    <K extends keyof ConceptConfig>(key: K, value: ConceptConfig[K]) => {
      setConfig((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const commit = useCallback(
    (patch: Partial<ConceptConfig>) => {
      setConfig((prev) => ({ ...prev, ...patch }));
      savedRef.current = { ...savedRef.current, ...patch };
      void updateVoiceConcept(concept.id, patch);
    },
    [concept.id],
  );

  const commitField = useCallback(
    (key: keyof ConceptConfig) => {
      const value = configRef.current[key];
      if (value === savedRef.current[key]) return;
      savedRef.current = { ...savedRef.current, [key]: value };
      void updateVoiceConcept(concept.id, { [key]: value });
    },
    [concept.id],
  );

  return (
    <VoiceConceptContext.Provider
      value={{ config, setField, commitField, commit }}
    >
      {children}
    </VoiceConceptContext.Provider>
  );
}

export function useVoiceConcept() {
  const context = useContext(VoiceConceptContext);
  if (!context) {
    throw new Error(
      "useVoiceConcept must be used within a VoiceConceptProvider",
    );
  }
  return context;
}

export { DEFAULT_MOOD };
