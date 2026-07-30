export type VoiceProvider = "openai" | "elevenlabs";

export const VOICE_PROVIDERS: VoiceProvider[] = ["openai", "elevenlabs"];

/** OpenAI TTS voices supported by gpt-4o-mini-tts / tts-1. */
export const OPENAI_SPEECH_VOICES = [
  "alloy",
  "ash",
  "ballad",
  "coral",
  "echo",
  "fable",
  "nova",
  "onyx",
  "sage",
  "shimmer",
] as const;

export type OpenAISpeechVoice = (typeof OPENAI_SPEECH_VOICES)[number];

export function isOpenAISpeechVoice(value: string): value is OpenAISpeechVoice {
  return (OPENAI_SPEECH_VOICES as readonly string[]).includes(value);
}

export type OpenAIVoiceOption = {
  id: OpenAISpeechVoice;
  name: string;
  gender: "male" | "female" | "non-binary";
  accent: "american" | "british";
  age: string;
  description: string;
};

/** Curated metadata for Voice Selector demos (not from the OpenAI API). */
export const OPENAI_VOICE_OPTIONS: OpenAIVoiceOption[] = [
  {
    id: "alloy",
    name: "Alloy",
    gender: "non-binary",
    accent: "american",
    age: "30s",
    description: "Balanced, neutral default",
  },
  {
    id: "ash",
    name: "Ash",
    gender: "male",
    accent: "american",
    age: "30s",
    description: "Clear and steady",
  },
  {
    id: "ballad",
    name: "Ballad",
    gender: "male",
    accent: "british",
    age: "40s",
    description: "Warm narrative tone",
  },
  {
    id: "coral",
    name: "Coral",
    gender: "female",
    accent: "american",
    age: "30s",
    description: "Bright and engaging",
  },
  {
    id: "echo",
    name: "Echo",
    gender: "male",
    accent: "american",
    age: "30s",
    description: "Resonant and calm",
  },
  {
    id: "fable",
    name: "Fable",
    gender: "male",
    accent: "british",
    age: "30s",
    description: "Expressive storyteller",
  },
  {
    id: "nova",
    name: "Nova",
    gender: "female",
    accent: "american",
    age: "20s",
    description: "Energetic and friendly",
  },
  {
    id: "onyx",
    name: "Onyx",
    gender: "male",
    accent: "american",
    age: "40s",
    description: "Deep and authoritative",
  },
  {
    id: "sage",
    name: "Sage",
    gender: "female",
    accent: "american",
    age: "30s",
    description: "Thoughtful and measured",
  },
  {
    id: "shimmer",
    name: "Shimmer",
    gender: "female",
    accent: "american",
    age: "20s",
    description: "Light and upbeat",
  },
];

export const VOICE_PROVIDER_LABELS: Record<VoiceProvider, string> = {
  openai: "OpenAI",
  elevenlabs: "ElevenLabs",
};

export const VOICE_PROVIDER_CONFIG = {
  openai: {
    transcriptionModel: "gpt-4o-transcribe",
    speechModel: "gpt-4o-mini-tts",
    voice: "alloy",
    // `instructions` is supported by gpt-4o-mini-tts (not tts-1/tts-1-hd) and
    // steers tone/pacing. Keep it neutral so it suits the 360 interviewer.
    speechInstructions:
      "Speak in a warm, calm, and professional tone, like a thoughtful interviewer. Use natural pacing, clear enunciation, and a steady, neutral delivery.",
    // WAV is OpenAI's recommended low-latency format and avoids client-side MP3
    // decode overhead.
    speechFormat: "wav",
    realtimeModel: "gpt-4o-transcribe",
    realtimeSampleRate: 24000,
    // Speech-to-speech model used by the live "Realtime" interview mode.
    realtimeSpeechModel: "gpt-realtime",
    realtimeSpeechVoice: "alloy",
  },
  elevenlabs: {
    transcriptionModel: "scribe_v1",
    speechModel: "eleven_flash_v2_5",
    voice: "21m00Tcm4TlvDq8ikWAM",
    realtimeModel: "scribe_v2_realtime",
    realtimeSampleRate: 16000,
  },
} as const satisfies Record<
  VoiceProvider,
  {
    transcriptionModel: string;
    speechModel: string;
    voice: string;
    speechInstructions?: string;
    speechFormat?: string;
    realtimeModel: string;
    realtimeSampleRate: number;
    realtimeSpeechModel?: string;
    realtimeSpeechVoice?: string;
  }
>;

export function isVoiceProvider(value: string): value is VoiceProvider {
  return value === "openai" || value === "elevenlabs";
}

/** Realtime input transcription — English-only for voice training sessions. */
export const ENGLISH_REALTIME_TRANSCRIPTION = {
  model: "gpt-4o-mini-transcribe",
  language: "en",
} as const;
