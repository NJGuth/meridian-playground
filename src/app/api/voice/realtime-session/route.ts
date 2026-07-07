import { mintOpenAiRealtimeToken } from "@/lib/voice/openai-realtime-token";

/**
 * Mints an ephemeral client secret for an OpenAI Realtime (speech-to-speech)
 * session. The secret is short-lived and safe to hand to the browser; the API
 * key never leaves the server.
 */
export async function POST(req: Request) {
  let requestedVoice: string | undefined;
  try {
    const body = (await req.json()) as { voice?: string };
    requestedVoice = body.voice;
  } catch {
    // Empty body is fine — use default voice.
  }

  const result = await mintOpenAiRealtimeToken(requestedVoice);
  if (!result.ok) {
    return Response.json({ error: result.error }, { status: result.status });
  }

  return Response.json(result.data);
}
