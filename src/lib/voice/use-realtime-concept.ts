"use client";

import type { RealtimeSession } from "@openai/agents/realtime";
import { useCallback, useEffect, useRef, useState } from "react";
import { z } from "zod";
import {
  buildConceptInstructions,
  type VoiceConceptConfig,
} from "./build-concept-instructions";
import {
  clampMoodState,
  type MoodState,
  type SessionOutcome,
} from "./concept-dynamics";
import type { OpenAiRealtimeVoice } from "./voice-options";
import { ENGLISH_REALTIME_TRANSCRIPTION } from "./providers";
import { MeridianOpenAIRealtimeWebRTC } from "./meridian-realtime-webrtc";
import {
  formatRealtimeConnectError,
  getRealtimeSpeechModel,
  mintRealtimeSessionToken,
} from "./realtime-webrtc";
import { extractTranscript, type TranscriptEntry } from "./transcript";

export type RealtimeConceptStatus = "idle" | "connecting" | "live" | "error";

export type { TranscriptEntry };

export type RealtimeSessionConfig = VoiceConceptConfig & {
  voice: OpenAiRealtimeVoice;
};

type RealtimeConceptCallbacks = {
  onTranscriptUpdate: (entries: TranscriptEntry[]) => void;
  onMoodUpdate?: (mood: MoodState, reason: string) => void;
  onWalkOut?: (reason: string) => void;
  onAgendaRevealed?: () => void;
  onTimeExpired?: () => void;
  onRemainingSeconds?: (seconds: number | null) => void;
};

function sendTimeCue(session: RealtimeSession, message: string) {
  session.sendMessage({
    type: "message",
    role: "user",
    content: [{ type: "input_text", text: `[SYSTEM TIME CUE: ${message}]` }],
  });
}

export function useRealtimeConcept(callbacks: RealtimeConceptCallbacks) {
  const [status, setStatus] = useState<RealtimeConceptStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [isAssistantSpeaking, setIsAssistantSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const [volume, setVolumeState] = useState(100);
  const [currentMood, setCurrentMood] = useState<MoodState | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(
    null,
  );

  const sessionRef = useRef<RealtimeSession | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const userMutedRef = useRef(false);
  const assistantSpeakingRef = useRef(false);
  const unmuteTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionStartRef = useRef<number | null>(null);
  const sentCuesRef = useRef<Set<string>>(new Set());
  const sessionConfigRef = useRef<RealtimeSessionConfig | null>(null);
  const connectingRef = useRef(false);
  const outcomeRef = useRef<SessionOutcome>({
    walkedOut: false,
    agendaRevealed: false,
    endingMood: { warmth: 50, cooperativeness: 50, aggression: 50, patience: 50 },
  });
  const cbRef = useRef(callbacks);
  cbRef.current = callbacks;

  useEffect(() => {
    const audio = new Audio();
    audio.volume = 1;
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.srcObject = null;
      audioRef.current = null;
    };
  }, []);

  const clearTimer = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    sessionStartRef.current = null;
    sentCuesRef.current.clear();
    setRemainingSeconds(null);
    cbRef.current.onRemainingSeconds?.(null);
  }, []);

  const setVolume = useCallback((percent: number) => {
    const clamped = Math.max(0, Math.min(100, percent));
    if (audioRef.current) {
      audioRef.current.volume = clamped / 100;
    }
    setVolumeState(clamped);
  }, []);

  const setOutputDevice = useCallback(async (deviceId: string) => {
    const audio = audioRef.current;
    if (!audio || !("setSinkId" in audio)) return;

    try {
      await (
        audio as HTMLAudioElement & {
          setSinkId: (id: string) => Promise<void>;
        }
      ).setSinkId(deviceId);
    } catch {
      // Browser rejected the sink change — keep playing on the current device.
    }
  }, []);

  const applyMicState = useCallback(() => {
    const muted = userMutedRef.current || assistantSpeakingRef.current;
    sessionRef.current?.mute(muted);
    setIsMicActive(Boolean(sessionRef.current) && !muted);
  }, []);

  const clearUnmuteTimer = useCallback(() => {
    if (unmuteTimerRef.current) {
      clearTimeout(unmuteTimerRef.current);
      unmuteTimerRef.current = null;
    }
  }, []);

  const getSessionOutcome = useCallback((): SessionOutcome => {
    return { ...outcomeRef.current };
  }, []);

  const stop = useCallback(() => {
    clearUnmuteTimer();
    clearTimer();
    try {
      sessionRef.current?.close();
    } catch {
      // already closed / never connected
    }
    sessionRef.current = null;
    sessionConfigRef.current = null;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.srcObject = null;
    }
    for (const track of micStreamRef.current?.getTracks() ?? []) {
      track.stop();
    }
    micStreamRef.current = null;
    userMutedRef.current = false;
    assistantSpeakingRef.current = false;
    setIsMuted(false);
    setIsAssistantSpeaking(false);
    setIsMicActive(false);
    setStatus("idle");
    setCurrentMood(null);
  }, [clearTimer, clearUnmuteTimer]);

  const startTimer = useCallback(
    (session: RealtimeSession, config: RealtimeSessionConfig) => {
      const minutes = config.targetDurationMinutes;
      if (!minutes || minutes <= 0) return;

      const totalSeconds = minutes * 60;
      sessionStartRef.current = Date.now();
      sentCuesRef.current.clear();

      const tick = () => {
        if (!sessionStartRef.current) return;
        const elapsed = Math.floor((Date.now() - sessionStartRef.current) / 1000);
        const remaining = Math.max(0, totalSeconds - elapsed);
        setRemainingSeconds(remaining);
        cbRef.current.onRemainingSeconds?.(remaining);

        const half = Math.floor(totalSeconds / 2);
        if (elapsed >= half && !sentCuesRef.current.has("half")) {
          sentCuesRef.current.add("half");
          sendTimeCue(
            session,
            `Roughly half the allotted time (${minutes} minutes) has passed. Keep pacing naturally.`,
          );
        }
        if (remaining <= 120 && !sentCuesRef.current.has("2min")) {
          sentCuesRef.current.add("2min");
          sendTimeCue(
            session,
            "About 2 minutes remain. Begin steering toward a natural close.",
          );
        }
        if (remaining <= 60 && !sentCuesRef.current.has("1min")) {
          sentCuesRef.current.add("1min");
          sendTimeCue(
            session,
            "About 1 minute remains. Wrap up the conversation soon.",
          );
        }
        if (remaining <= 30 && !sentCuesRef.current.has("30sec")) {
          sentCuesRef.current.add("30sec");
          sendTimeCue(
            session,
            "About 30 seconds remain. Deliver a brief closing.",
          );
        }
        if (remaining <= 0 && !sentCuesRef.current.has("expired")) {
          sentCuesRef.current.add("expired");
          if (config.autoEndOnExpiry) {
            cbRef.current.onTimeExpired?.();
          } else {
            sendTimeCue(
              session,
              "Time is up. Close the conversation now with a brief sign-off.",
            );
          }
        }
      };

      tick();
      timerIntervalRef.current = setInterval(tick, 1000);
    },
    [],
  );

  const start = useCallback(
    async (
      config: RealtimeSessionConfig,
      deviceId?: string,
      outputDeviceId?: string,
    ) => {
      if (sessionRef.current || connectingRef.current) return;

      connectingRef.current = true;
      setError(null);
      setStatus("connecting");
      cbRef.current.onTranscriptUpdate([]);

      outcomeRef.current = {
        walkedOut: false,
        agendaRevealed: false,
        endingMood: { ...config.mood },
      };
      setCurrentMood(config.mood);
      sessionConfigRef.current = config;

      try {
        const voice = config.voice;
        const sessionAuth = await mintRealtimeSessionToken(voice);

        const {
          RealtimeAgent,
          RealtimeSession: RealtimeSessionCtor,
          tool,
        } = await import("@openai/agents/realtime");

        const mediaStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
            ...(deviceId ? { deviceId: { exact: deviceId } } : {}),
          },
        });
        micStreamRef.current = mediaStream;

        const instructions = buildConceptInstructions(config);
        const audioElement = audioRef.current ?? undefined;

        if (audioElement) {
          audioElement.volume = volume / 100;
          if (outputDeviceId && "setSinkId" in audioElement) {
            try {
              await (
                audioElement as HTMLAudioElement & {
                  setSinkId: (id: string) => Promise<void>;
                }
              ).setSinkId(outputDeviceId);
            } catch {
              // Fall back to the system default output device.
            }
          }
        }

        const shiftMood = tool({
          name: "shiftMood",
          description:
            "Record a significant shift in your demeanor, reveal the hidden agenda, or walk out of the conversation.",
          parameters: z.object({
            warmth: z.number().min(0).max(100).optional(),
            cooperativeness: z.number().min(0).max(100).optional(),
            aggression: z.number().min(0).max(100).optional(),
            patience: z.number().min(0).max(100).optional(),
            reason: z
              .string()
              .describe("Brief reason for the mood shift or action."),
            walkOut: z
              .boolean()
              .optional()
              .describe("Set true if you are ending the conversation."),
            agendaRevealed: z
              .boolean()
              .optional()
              .describe("Set true when you reveal the hidden agenda."),
          }),
          execute: async ({
            warmth,
            cooperativeness,
            aggression,
            patience,
            reason,
            walkOut,
            agendaRevealed,
          }) => {
            const prev = outcomeRef.current.endingMood;
            const next = clampMoodState({
              warmth: warmth ?? prev.warmth,
              cooperativeness: cooperativeness ?? prev.cooperativeness,
              aggression: aggression ?? prev.aggression,
              patience: patience ?? prev.patience,
            });
            outcomeRef.current.endingMood = next;
            setCurrentMood(next);
            cbRef.current.onMoodUpdate?.(next, reason);

            if (agendaRevealed) {
              outcomeRef.current.agendaRevealed = true;
              cbRef.current.onAgendaRevealed?.();
            }

            if (walkOut) {
              outcomeRef.current.walkedOut = true;
              cbRef.current.onWalkOut?.(reason);
              return "You have walked out. Deliver one brief closing line, then stop speaking entirely.";
            }

            return `Mood updated. Continue in this adjusted tone: warmth ${next.warmth}, cooperativeness ${next.cooperativeness}, aggression ${next.aggression}, patience ${next.patience}.`;
          },
        });

        const agent = new RealtimeAgent({
          name: "Voice Concept",
          instructions,
          tools: [shiftMood],
          voice,
        });

        const session = new RealtimeSessionCtor(agent, {
          transport: new MeridianOpenAIRealtimeWebRTC({
            mediaStream,
            audioElement,
          }),
          model: sessionAuth.model ?? getRealtimeSpeechModel(),
          config: {
            audio: {
              input: {
                turnDetection: { type: "server_vad" },
                transcription: ENGLISH_REALTIME_TRANSCRIPTION,
              },
              output: { voice },
            },
          },
        });

        session.on("history_updated", (history) => {
          cbRef.current.onTranscriptUpdate(extractTranscript(history));
        });

        session.on("audio_start", () => {
          clearUnmuteTimer();
          assistantSpeakingRef.current = true;
          setIsAssistantSpeaking(true);
          applyMicState();
        });

        const handleAssistantDone = () => {
          assistantSpeakingRef.current = false;
          setIsAssistantSpeaking(false);
          clearUnmuteTimer();
          unmuteTimerRef.current = setTimeout(() => {
            unmuteTimerRef.current = null;
            applyMicState();
          }, 150);
        };

        session.on("audio_stopped", handleAssistantDone);
        session.on("audio_interrupted", handleAssistantDone);
        session.on("error", (event) => {
          const raw = event.error;
          const message =
            raw instanceof Error
              ? raw.message
              : typeof raw === "string"
                ? raw
                : "Realtime session error";
          setError(message);
        });

        sessionRef.current = session;

        await session.connect({ apiKey: sessionAuth.token });

        userMutedRef.current = false;
        assistantSpeakingRef.current = false;
        setIsMuted(false);
        setStatus("live");
        applyMicState();
        startTimer(session, config);

        session.transport.sendEvent({ type: "response.create" });
      } catch (err) {
        setError(formatRealtimeConnectError(err));
        setStatus("error");
        clearUnmuteTimer();
        clearTimer();
        try {
          sessionRef.current?.close();
        } catch {
          // ignore
        }
        sessionRef.current = null;
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.srcObject = null;
        }
        for (const track of micStreamRef.current?.getTracks() ?? []) {
          track.stop();
        }
        micStreamRef.current = null;
      } finally {
        connectingRef.current = false;
      }
    },
    [applyMicState, clearTimer, clearUnmuteTimer, startTimer, volume],
  );

  const toggleMute = useCallback(() => {
    if (!sessionRef.current) return;
    userMutedRef.current = !userMutedRef.current;
    setIsMuted(userMutedRef.current);
    applyMicState();
  }, [applyMicState]);

  const interrupt = useCallback(() => {
    sessionRef.current?.interrupt();
    setIsAssistantSpeaking(false);
  }, []);

  return {
    start,
    stop,
    status,
    error,
    isAssistantSpeaking,
    isMuted,
    isMicActive,
    toggleMute,
    interrupt,
    volume,
    setVolume,
    setOutputDevice,
    currentMood,
    remainingSeconds,
    getSessionOutcome,
  };
}
