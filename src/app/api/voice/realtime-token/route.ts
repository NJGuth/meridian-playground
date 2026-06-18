import { isVoiceProvider, VOICE_PROVIDER_CONFIG } from "@/lib/voice/providers";

export async function POST(req: Request) {
  const body = (await req.json()) as { provider?: string };
  const { provider } = body;

  if (typeof provider !== "string" || !isVoiceProvider(provider)) {
    return Response.json({ error: "Invalid provider" }, { status: 400 });
  }

  try {
    return provider === "openai"
      ? await mintOpenAIToken()
      : await mintElevenLabsToken();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to mint realtime token";
    return Response.json({ error: message }, { status: 500 });
  }
}

async function mintOpenAIToken() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "OPENAI_API_KEY is not set" },
      {
        status: 500,
      },
    );
  }

  const { realtimeModel, realtimeSampleRate } = VOICE_PROVIDER_CONFIG.openai;

  const res = await fetch("https://api.openai.com/v1/realtime/client_secrets", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      session: {
        type: "transcription",
        audio: {
          input: {
            format: { type: "audio/pcm", rate: realtimeSampleRate },
            transcription: { model: realtimeModel },
            turn_detection: { type: "server_vad" },
          },
        },
      },
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    return Response.json(
      { error: `OpenAI token request failed: ${detail}` },
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
      { error: "OpenAI token response missing client secret" },
      { status: 502 },
    );
  }

  return Response.json({
    provider: "openai",
    token,
    url: "wss://api.openai.com/v1/realtime?intent=transcription",
    model: realtimeModel,
    sampleRate: realtimeSampleRate,
  });
}

async function mintElevenLabsToken() {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "ELEVENLABS_API_KEY is not set" },
      {
        status: 500,
      },
    );
  }

  const { realtimeModel, realtimeSampleRate } =
    VOICE_PROVIDER_CONFIG.elevenlabs;

  const res = await fetch(
    "https://api.elevenlabs.io/v1/single-use-token/realtime_scribe",
    {
      method: "POST",
      headers: { "xi-api-key": apiKey },
    },
  );

  if (!res.ok) {
    const detail = await res.text();
    return Response.json(
      { error: `ElevenLabs token request failed: ${detail}` },
      { status: 502 },
    );
  }

  const data = (await res.json()) as {
    token?: string;
    single_use_token?: string;
  };
  const token = data.token ?? data.single_use_token;

  if (!token) {
    return Response.json(
      { error: "ElevenLabs token response missing token" },
      { status: 502 },
    );
  }

  const url = new URL("wss://api.elevenlabs.io/v1/speech-to-text/realtime");
  url.searchParams.set("model_id", realtimeModel);
  // Default commit strategy is "manual" → nothing ever commits → no
  // transcripts. Use VAD so speech segments auto-commit as the user talks.
  url.searchParams.set("commit_strategy", "vad");

  return Response.json({
    provider: "elevenlabs",
    token,
    url: url.toString(),
    model: realtimeModel,
    sampleRate: realtimeSampleRate,
  });
}
