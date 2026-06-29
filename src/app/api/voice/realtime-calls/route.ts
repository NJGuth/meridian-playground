import { VOICE_PROVIDER_CONFIG } from "@/lib/voice/providers";
import { isOpenAiRealtimeVoice } from "@/lib/voice/voice-options";

/**
 * Proxies WebRTC SDP negotiation to OpenAI using the unified /realtime/calls
 * interface (multipart form with session config + server API key). Avoids
 * browser-direct calls that surface JSON error bodies as opaque SDP parse
 * failures in RTCPeerConnection.setRemoteDescription.
 */
export async function POST(req: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "OPENAI_API_KEY is not set" },
      { status: 500 },
    );
  }

  const { searchParams } = new URL(req.url);
  const voiceParam = searchParams.get("voice");
  const defaultVoice = VOICE_PROVIDER_CONFIG.openai.realtimeSpeechVoice ?? "alloy";
  const voice =
    voiceParam && isOpenAiRealtimeVoice(voiceParam) ? voiceParam : defaultVoice;
  const model = VOICE_PROVIDER_CONFIG.openai.realtimeSpeechModel ?? "gpt-realtime";

  const sdp = await req.text();
  if (!sdp.trim()) {
    return Response.json({ error: "SDP offer is required" }, { status: 400 });
  }

  const sessionConfig = JSON.stringify({
    type: "realtime",
    model,
    audio: {
      output: { voice },
    },
  });

  const form = new FormData();
  form.set("sdp", sdp);
  form.set("session", sessionConfig);

  try {
    const res = await fetch("https://api.openai.com/v1/realtime/calls", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body: form,
    });

    const body = await res.text();

    if (!res.ok) {
      let detail = body;
      try {
        const parsed = JSON.parse(body) as { error?: { message?: string } };
        detail = parsed.error?.message ?? body;
      } catch {
        // keep raw body
      }
      console.error("[realtime-calls] OpenAI error:", res.status, detail);
      return Response.json(
        { error: `OpenAI realtime call failed: ${detail}` },
        { status: res.status },
      );
    }

    if (!body.trimStart().startsWith("v=")) {
      console.error("[realtime-calls] Non-SDP response:", body.slice(0, 200));
      return Response.json(
        { error: "OpenAI returned an invalid SDP answer" },
        { status: 502 },
      );
    }

    return new Response(body, {
      status: 200,
      headers: { "Content-Type": "application/sdp" },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to negotiate WebRTC";
    console.error("[realtime-calls] Proxy error:", message);
    return Response.json({ error: message }, { status: 502 });
  }
}
