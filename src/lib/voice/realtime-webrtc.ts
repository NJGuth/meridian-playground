import { VOICE_PROVIDER_CONFIG } from "@/lib/voice/providers";
import { isOpenAiRealtimeVoice } from "@/lib/voice/voice-options";

export function getRealtimeSpeechModel(): string {
  return VOICE_PROVIDER_CONFIG.openai.realtimeSpeechModel ?? "gpt-realtime";
}

export function formatRealtimeConnectError(error: unknown): string {
  const message =
    error instanceof Error ? error.message : "Failed to start realtime session";

  if (
    message.includes("Expect line: v=") ||
    message.includes("not recognized as SDP")
  ) {
    return "Could not connect to the voice server. The realtime API returned an error instead of a valid session — check your OpenAI API key, model access, and network, then try again.";
  }

  return message;
}

export type RealtimeSessionToken = {
  token: string;
  model: string;
  voice: string;
};

export async function mintRealtimeSessionToken(
  voice: string,
): Promise<RealtimeSessionToken> {
  const res = await fetch("/api/voice/realtime-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ voice }),
  });

  const data = (await res.json()) as RealtimeSessionToken & { error?: string };

  if (!res.ok || !data.token) {
    throw new Error(data.error ?? "Failed to start realtime session");
  }

  if (!data.token.startsWith("ek_")) {
    throw new Error("Invalid realtime session token from server.");
  }

  return data;
}
