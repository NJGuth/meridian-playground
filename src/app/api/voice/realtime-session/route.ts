import { VOICE_PROVIDER_CONFIG } from "@/lib/voice/providers";

/**
 * Mints an ephemeral client secret for an OpenAI Realtime (speech-to-speech)
 * session, used by the live "Realtime" interview mode. The secret is short-lived
 * and safe to hand to the browser; the API key never leaves the server.
 */
export async function POST() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "OPENAI_API_KEY is not set" },
      { status: 500 },
    );
  }

  const { realtimeSpeechModel, realtimeSpeechVoice } =
    VOICE_PROVIDER_CONFIG.openai;
  const model = realtimeSpeechModel ?? "gpt-realtime";

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
          },
        }),
      },
    );

    if (!res.ok) {
      const detail = await res.text();
      return Response.json(
        { error: `OpenAI realtime token request failed: ${detail}` },
        { status: 502 },
      );
    }

    const data = (await res.json()) as {
      value?: string;
      client_secret?: { value?: string };
    };
    const token = data.value ?? data.client_secret?.value;

    if (!token) {
      return Response.json(
        { error: "OpenAI realtime token response missing client secret" },
        { status: 502 },
      );
    }

    return Response.json({
      token,
      model,
      voice: realtimeSpeechVoice ?? "alloy",
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to mint realtime session token";
    return Response.json({ error: message }, { status: 500 });
  }
}
