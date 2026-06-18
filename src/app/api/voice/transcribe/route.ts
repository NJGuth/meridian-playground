import { elevenlabs } from "@ai-sdk/elevenlabs";
import { openai } from "@ai-sdk/openai";
import { experimental_transcribe as transcribe } from "ai";
import {
  isVoiceProvider,
  VOICE_PROVIDER_CONFIG,
  type VoiceProvider,
} from "@/lib/voice/providers";

export async function POST(req: Request) {
  const startedAt = Date.now();

  try {
    const formData = await req.formData();
    const audio = formData.get("audio");
    const provider = formData.get("provider");

    if (!(audio instanceof Blob)) {
      return Response.json({ error: "Missing audio blob" }, { status: 400 });
    }

    if (typeof provider !== "string" || !isVoiceProvider(provider)) {
      return Response.json({ error: "Invalid provider" }, { status: 400 });
    }

    const config = VOICE_PROVIDER_CONFIG[provider];
    const audioData = new Uint8Array(await audio.arrayBuffer());
    const model = getTranscriptionModel(provider, config.transcriptionModel);

    const { text } = await transcribe({
      model,
      audio: audioData,
    });

    return Response.json({
      text: text.trim(),
      ms: Date.now() - startedAt,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Transcription failed";
    return Response.json({ error: message }, { status: 500 });
  }
}

function getTranscriptionModel(provider: VoiceProvider, modelId: string) {
  if (provider === "openai") {
    return openai.transcription(modelId);
  }

  return elevenlabs.transcription(modelId);
}
