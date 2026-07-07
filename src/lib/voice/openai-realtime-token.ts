import "server-only";

import { VOICE_PROVIDER_CONFIG } from "@/lib/voice/providers";
import {
  isOpenAiRealtimeVoice,
  type OpenAiRealtimeVoice,
} from "@/lib/voice/voice-options";

export type MintedRealtimeToken = {
  token: string;
  model: string;
  voice: OpenAiRealtimeVoice;
};

export type MintRealtimeTokenResult =
  | { ok: true; data: MintedRealtimeToken }
  | { ok: false; status: number; error: string };

/**
 * Mints an ephemeral OpenAI Realtime client secret on the server. The API key
 * never leaves the server; the returned token is short-lived and safe to hand
 * to the browser. Shared by the authenticated voice route and the public,
 * passcode-guarded interview route.
 */
export async function mintOpenAiRealtimeToken(
  requestedVoice?: string,
): Promise<MintRealtimeTokenResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return { ok: false, status: 500, error: "OPENAI_API_KEY is not set" };
  }

  const { realtimeSpeechModel, realtimeSpeechVoice } =
    VOICE_PROVIDER_CONFIG.openai;
  const model = realtimeSpeechModel ?? "gpt-realtime";
  const defaultVoice = realtimeSpeechVoice ?? "alloy";

  let voice: OpenAiRealtimeVoice = isOpenAiRealtimeVoice(defaultVoice)
    ? defaultVoice
    : "alloy";
  if (requestedVoice && isOpenAiRealtimeVoice(requestedVoice)) {
    voice = requestedVoice;
  }

  try {
    const res = await fetch(
      "https://api.openai.com/v1/realtime/client_secrets",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session: {
            type: "realtime",
            model,
            audio: { output: { voice } },
          },
        }),
      },
    );

    if (!res.ok) {
      const detail = await res.text();
      return {
        ok: false,
        status: 502,
        error: `OpenAI realtime token request failed: ${detail}`,
      };
    }

    const data = (await res.json()) as {
      value?: string;
      client_secret?: { value?: string };
    };
    const token = data.value ?? data.client_secret?.value;

    if (!token) {
      return {
        ok: false,
        status: 502,
        error: "OpenAI realtime token response missing client secret",
      };
    }

    return { ok: true, data: { token, model, voice } };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to mint realtime session token";
    return { ok: false, status: 500, error: message };
  }
}
