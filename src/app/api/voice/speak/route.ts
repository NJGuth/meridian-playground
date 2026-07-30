import { elevenlabs } from "@ai-sdk/elevenlabs";
import { openai } from "@ai-sdk/openai";
import { experimental_generateSpeech as generateSpeech } from "ai";
import {
  isOpenAISpeechVoice,
  isVoiceProvider,
  VOICE_PROVIDER_CONFIG,
  type VoiceProvider,
} from "@/lib/voice/providers";

export async function POST(req: Request) {
  const startedAt = Date.now();

  try {
    const body = (await req.json()) as {
      text?: string;
      provider?: string;
      voice?: string;
    };

    const { text, provider, voice } = body;

    if (!text?.trim()) {
      return Response.json({ error: "Missing text" }, { status: 400 });
    }

    if (typeof provider !== "string" || !isVoiceProvider(provider)) {
      return Response.json({ error: "Invalid provider" }, { status: 400 });
    }

    if (
      voice !== undefined &&
      (typeof voice !== "string" ||
        (provider === "openai" && !isOpenAISpeechVoice(voice)))
    ) {
      return Response.json({ error: "Invalid voice" }, { status: 400 });
    }

    const config = VOICE_PROVIDER_CONFIG[provider];
    const model = getSpeechModel(provider, config.speechModel);
    const resolvedVoice = voice?.trim() || config.voice;

    const { audio } = await generateSpeech({
      model,
      text: text.trim(),
      voice: resolvedVoice,
      // gpt-4o-mini-tts supports instructions + wav output; passing these only
      // when present keeps other providers on their defaults.
      ...("speechInstructions" in config && config.speechInstructions
        ? { instructions: config.speechInstructions }
        : {}),
      ...("speechFormat" in config && config.speechFormat
        ? { outputFormat: config.speechFormat }
        : {}),
    });

    const bytes = Uint8Array.from(audio.uint8Array);

    return new Response(
      new Blob([bytes], {
        type: audio.mediaType ?? "audio/mpeg",
      }),
      {
        headers: {
          "Content-Type": audio.mediaType ?? "audio/mpeg",
          "X-Synthesis-Ms": String(Date.now() - startedAt),
        },
      },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Speech synthesis failed";
    return Response.json({ error: message }, { status: 500 });
  }
}

function getSpeechModel(provider: VoiceProvider, modelId: string) {
  if (provider === "openai") {
    return openai.speech(modelId);
  }

  return elevenlabs.speech(modelId);
}
