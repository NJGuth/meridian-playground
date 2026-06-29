export const OPENAI_REALTIME_VOICES = [
  "alloy",
  "ash",
  "ballad",
  "coral",
  "echo",
  "sage",
  "shimmer",
  "verse",
  "marin",
  "cedar",
] as const;

export type OpenAiRealtimeVoice = (typeof OPENAI_REALTIME_VOICES)[number];

export function isOpenAiRealtimeVoice(value: string): value is OpenAiRealtimeVoice {
  return OPENAI_REALTIME_VOICES.includes(value as OpenAiRealtimeVoice);
}

/** Deterministic avatar background per voice (Tailwind bg + text pairs). */
export const VOICE_AVATAR_STYLES: Record<
  OpenAiRealtimeVoice,
  { bg: string; text: string }
> = {
  alloy: { bg: "bg-slate-600", text: "text-white" },
  ash: { bg: "bg-stone-600", text: "text-white" },
  ballad: { bg: "bg-violet-600", text: "text-white" },
  coral: { bg: "bg-rose-500", text: "text-white" },
  echo: { bg: "bg-sky-600", text: "text-white" },
  sage: { bg: "bg-emerald-600", text: "text-white" },
  shimmer: { bg: "bg-amber-500", text: "text-white" },
  verse: { bg: "bg-indigo-600", text: "text-white" },
  marin: { bg: "bg-teal-600", text: "text-white" },
  cedar: { bg: "bg-orange-700", text: "text-white" },
};

export function getCharacterInitial(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "?";
  return trimmed.charAt(0).toUpperCase();
}
