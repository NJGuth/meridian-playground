"use client";

import type { RealtimeSession } from "@openai/agents/realtime";
import { useCallback, useRef, useState } from "react";
import { z } from "zod";
import {
  buildRealtimeInterviewInstructions,
  INTERVIEW_QUESTION_COUNT,
  renderClosing,
  renderQuestions,
} from "./interview-script";

export type RealtimeInterviewStatus = "idle" | "connecting" | "live" | "error";
export type RealtimeAnswerStatus = "answered" | "partial" | "skipped";

type RealtimeInterviewCallbacks = {
  /** Record the answer captured for a given question slot. */
  onApplyAnswer: (
    slot: number,
    status: RealtimeAnswerStatus,
    summary: string,
  ) => void;
  /** The client-owned question index advanced to. */
  onIndexChange: (index: number) => void;
  /** All questions have been recorded. */
  onComplete: () => void;
};

/**
 * Drives the 360 interview over a single OpenAI Realtime (speech-to-speech)
 * session via the Agents SDK + WebRTC.
 *
 * The client still owns the question index: the model never picks the next
 * question. After each answer it calls `recordAnswer`, whose RESULT tells it the
 * exact next question to ask. That keeps the on-script safeguards intact in the
 * low-latency speech-to-speech path.
 */
export function useRealtimeInterview(callbacks: RealtimeInterviewCallbacks) {
  const [status, setStatus] = useState<RealtimeInterviewStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [isAssistantSpeaking, setIsAssistantSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  // True only while the mic is actually capturing (live, not muted, and the
  // assistant isn't speaking). Mirrors the half-duplex gate exactly.
  const [isMicActive, setIsMicActive] = useState(false);

  const sessionRef = useRef<RealtimeSession | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const indexRef = useRef(0);
  // The user's manual mute intent, kept separate from the automatic half-duplex
  // gate below so toggling it composes correctly.
  const userMutedRef = useRef(false);
  const assistantSpeakingRef = useRef(false);
  const unmuteTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cbRef = useRef(callbacks);
  cbRef.current = callbacks;

  // Half-duplex gate: the mic is only live when the assistant is NOT speaking
  // (and the user hasn't manually muted). This is what stops the model from
  // hearing its own voice through the speakers and "answering itself".
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

  const stop = useCallback(() => {
    clearUnmuteTimer();
    try {
      sessionRef.current?.close();
    } catch {
      // already closed / never connected
    }
    sessionRef.current = null;
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
  }, [clearUnmuteTimer]);

  const start = useCallback(
    async (coacheeName: string, deviceId?: string) => {
      if (sessionRef.current) return;

      setError(null);
      setStatus("connecting");
      indexRef.current = 0;

      try {
        const res = await fetch("/api/voice/realtime-session", {
          method: "POST",
        });
        const data = (await res.json()) as {
          token?: string;
          model?: string;
          voice?: string;
          error?: string;
        };

        if (!res.ok || !data.token) {
          throw new Error(data.error ?? "Failed to start realtime session");
        }

        const {
          RealtimeAgent,
          RealtimeSession: RealtimeSessionCtor,
          OpenAIRealtimeWebRTC,
          tool,
        } = await import("@openai/agents/realtime");

        // Acquire the mic ourselves so we can (a) force echo cancellation /
        // noise suppression and (b) honour the device picked in the mic selector.
        // The default transport just calls getUserMedia({ audio: true }).
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
            ...(deviceId ? { deviceId: { exact: deviceId } } : {}),
          },
        });
        micStreamRef.current = mediaStream;

        const questions = renderQuestions(coacheeName);
        const closing = renderClosing(coacheeName);
        const voice = data.voice ?? "alloy";

        const recordAnswer = tool({
          name: "recordAnswer",
          description:
            "Record the respondent's answer to the CURRENT question and advance the interview. Call this exactly once when you are ready to move on.",
          parameters: z.object({
            status: z
              .enum(["answered", "partial", "skipped"])
              .describe(
                'Use "answered" when the answer met the rubric, "partial" when advancing after probing but the answer is still thin, "skipped" when the respondent declined or could not answer.',
              ),
            summary: z
              .string()
              .describe(
                "A concise 1-2 sentence summary of what the respondent said.",
              ),
          }),
          execute: async ({ status: answerStatus, summary }) => {
            const slot = indexRef.current;
            cbRef.current.onApplyAnswer(slot, answerStatus, summary);

            const next = slot + 1;
            if (next >= INTERVIEW_QUESTION_COUNT) {
              indexRef.current = next;
              cbRef.current.onIndexChange(next);
              cbRef.current.onComplete();
              return `All ${INTERVIEW_QUESTION_COUNT} questions are complete. Deliver this closing now, then stop and ask nothing further: "${closing}"`;
            }

            indexRef.current = next;
            cbRef.current.onIndexChange(next);
            return `Answer recorded. You are now on question ${
              next + 1
            } of ${INTERVIEW_QUESTION_COUNT}. With a brief, natural transition, ask the respondent exactly this, in your own warm voice: "${questions[next]}". Do not summarize their previous answer, and do not ask anything else.`;
          },
        });

        const agent = new RealtimeAgent({
          name: "360 Interviewer",
          instructions: buildRealtimeInterviewInstructions(coacheeName),
          tools: [recordAnswer],
          voice,
        });

        const session = new RealtimeSessionCtor(agent, {
          transport: new OpenAIRealtimeWebRTC({ mediaStream }),
          model: data.model ?? "gpt-realtime",
          config: {
            audio: {
              input: { turnDetection: { type: "server_vad" } },
              output: { voice },
            },
          },
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
          // Small delay so the tail of the speaker playback finishes before the
          // mic reopens, otherwise the residual audio can re-trigger VAD.
          clearUnmuteTimer();
          unmuteTimerRef.current = setTimeout(() => {
            unmuteTimerRef.current = null;
            applyMicState();
          }, 150);
        };
        session.on("audio_stopped", handleAssistantDone);
        session.on("audio_interrupted", handleAssistantDone);
        session.on("error", (event) => {
          const raw = (event as { error?: unknown }).error;
          const message =
            raw instanceof Error
              ? raw.message
              : typeof raw === "string"
                ? raw
                : "Realtime session error";
          setError(message);
        });

        sessionRef.current = session;

        await session.connect({ apiKey: data.token });

        userMutedRef.current = false;
        assistantSpeakingRef.current = false;
        setIsMuted(false);
        setStatus("live");
        applyMicState();

        // Trigger the opening turn: the model speaks the intro + question 1 from
        // its instructions. From here, server VAD drives every following turn.
        session.transport.sendEvent({ type: "response.create" });
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to start realtime session";
        setError(message);
        setStatus("error");
        clearUnmuteTimer();
        try {
          sessionRef.current?.close();
        } catch {
          // ignore
        }
        sessionRef.current = null;
        for (const track of micStreamRef.current?.getTracks() ?? []) {
          track.stop();
        }
        micStreamRef.current = null;
      }
    },
    [applyMicState, clearUnmuteTimer],
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
  };
}
