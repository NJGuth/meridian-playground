"use client";

import { useCallback, useRef, useState } from "react";
import type { VoiceProvider } from "@/lib/voice/providers";

export type RealtimeStatus = "idle" | "connecting" | "listening" | "error";

type TokenResponse = {
  provider: VoiceProvider;
  token: string;
  url: string;
  model: string;
  sampleRate: number;
};

function downsampleToMono(
  input: Float32Array,
  inputRate: number,
  outputRate: number,
): Float32Array {
  if (outputRate >= inputRate) return input;
  const ratio = inputRate / outputRate;
  const outLength = Math.floor(input.length / ratio);
  const output = new Float32Array(outLength);
  for (let i = 0; i < outLength; i++) {
    output[i] = input[Math.floor(i * ratio)];
  }
  return output;
}

function floatToPCM16(input: Float32Array): ArrayBuffer {
  const buffer = new ArrayBuffer(input.length * 2);
  const view = new DataView(buffer);
  for (let i = 0; i < input.length; i++) {
    const sample = Math.max(-1, Math.min(1, input[i]));
    view.setInt16(i * 2, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
  }
  return buffer;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

export function useRealtimeTranscription({
  onTranscript,
}: {
  onTranscript: (text: string) => void;
}) {
  const [status, setStatus] = useState<RealtimeStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);

  const committedRef = useRef("");
  const partialRef = useRef("");
  const onTranscriptRef = useRef(onTranscript);
  onTranscriptRef.current = onTranscript;

  const emit = useCallback(() => {
    const combined = `${committedRef.current}${partialRef.current}`.trim();
    onTranscriptRef.current(combined);
  }, []);

  const teardown = useCallback(() => {
    processorRef.current?.disconnect();
    processorRef.current = null;
    sourceRef.current?.disconnect();
    sourceRef.current = null;
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      void audioContextRef.current.close();
    }
    audioContextRef.current = null;
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      streamRef.current = null;
    }
    setStream(null);
    if (wsRef.current && wsRef.current.readyState <= WebSocket.OPEN) {
      wsRef.current.close();
    }
    wsRef.current = null;
  }, []);

  const handleMessage = useCallback(
    (provider: VoiceProvider, raw: string) => {
      let msg: Record<string, unknown>;
      try {
        msg = JSON.parse(raw);
      } catch {
        return;
      }

      const type = String(msg.type ?? msg.message_type ?? "");

      if (provider === "openai") {
        if (type.includes("input_audio_transcription.delta")) {
          partialRef.current += String(msg.delta ?? "");
          emit();
        } else if (type.includes("input_audio_transcription.completed")) {
          committedRef.current += `${String(msg.transcript ?? "")} `;
          partialRef.current = "";
          emit();
        }
        return;
      }

      // ElevenLabs Scribe v2 realtime message types.
      const text = String(msg.text ?? msg.transcript ?? "");
      if (type === "partial_transcript") {
        partialRef.current = text;
        emit();
      } else if (type === "committed_transcript") {
        if (text) committedRef.current += `${text} `;
        partialRef.current = "";
        emit();
      }
    },
    [emit],
  );

  const startAudioPipeline = useCallback(
    (
      stream: MediaStream,
      provider: VoiceProvider,
      targetRate: number,
      ws: WebSocket,
    ) => {
      const AudioContextCtor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const audioContext = new AudioContextCtor();
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      sourceRef.current = source;

      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = (event) => {
        if (ws.readyState !== WebSocket.OPEN) return;
        const channelData = event.inputBuffer.getChannelData(0);
        const downsampled = downsampleToMono(
          channelData,
          audioContext.sampleRate,
          targetRate,
        );
        const pcm = floatToPCM16(downsampled);
        const base64 = arrayBufferToBase64(pcm);

        if (provider === "openai") {
          ws.send(
            JSON.stringify({
              type: "input_audio_buffer.append",
              audio: base64,
            }),
          );
        } else {
          ws.send(
            JSON.stringify({
              message_type: "input_audio_chunk",
              audio_base_64: base64,
              commit: false,
              sample_rate: targetRate,
            }),
          );
        }
      };

      // Route through a muted gain node so onaudioprocess fires without echo.
      const sink = audioContext.createGain();
      sink.gain.value = 0;
      source.connect(processor);
      processor.connect(sink);
      sink.connect(audioContext.destination);
    },
    [],
  );

  const stop = useCallback(() => {
    teardown();
    setStatus("idle");
  }, [teardown]);

  const start = useCallback(
    async (provider: VoiceProvider, deviceId?: string) => {
      committedRef.current = "";
      partialRef.current = "";
      setError(null);
      setStatus("connecting");

      try {
        const tokenRes = await fetch("/api/voice/realtime-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ provider }),
        });

        if (!tokenRes.ok) {
          const detail = (await tokenRes.json()) as { error?: string };
          throw new Error(detail.error ?? "Failed to get realtime token");
        }

        const { token, url, sampleRate } =
          (await tokenRes.json()) as TokenResponse;

        const micStream = await navigator.mediaDevices.getUserMedia({
          audio: deviceId
            ? {
                deviceId: { exact: deviceId },
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true,
              }
            : {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true,
              },
        });
        streamRef.current = micStream;
        setStream(micStream);

        // GA Realtime API: authenticate with the ephemeral token via subprotocol.
        // Do NOT send the "openai-beta.realtime-v1" subprotocol — it forces the
        // retired Beta shape and the server closes the socket. The transcription
        // session is already configured by the ephemeral token, so no
        // session.update is required.
        const ws =
          provider === "openai"
            ? new WebSocket(url, [
                "realtime",
                `openai-insecure-api-key.${token}`,
              ])
            : new WebSocket(`${url}&token=${encodeURIComponent(token)}`);
        wsRef.current = ws;

        ws.onopen = () => {
          startAudioPipeline(micStream, provider, sampleRate, ws);
          setStatus("listening");
        };

        ws.onmessage = (event) => {
          if (typeof event.data === "string") {
            handleMessage(provider, event.data);
          }
        };

        ws.onerror = () => {
          setError("Realtime connection error.");
          setStatus("error");
        };

        ws.onclose = (event) => {
          if (!event.wasClean && event.code !== 1000 && event.code !== 1005) {
            const reason = event.reason ? `: ${event.reason}` : "";
            setError(`Realtime connection closed (${event.code})${reason}`);
            setStatus("error");
          }
        };
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to start.");
        setStatus("error");
        teardown();
      }
    },
    [handleMessage, startAudioPipeline, teardown],
  );

  return { start, stop, status, error, stream };
}
