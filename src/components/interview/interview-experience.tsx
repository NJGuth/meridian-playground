"use client";

import { Loader2, Mic, Play, Square } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LiveWaveform } from "@/components/ui/live-waveform";
import { Message, MessageContent } from "@/components/ui/message";
import { ScrollArea } from "@/components/ui/scroll-area";
import { INTERVIEW_QUESTION_COUNT } from "@/lib/voice/interview-script";
import type { RealtimeSessionToken } from "@/lib/voice/realtime-webrtc";
import type { TranscriptEntry } from "@/lib/voice/transcript";
import { useRealtimeInterview } from "@/lib/voice/use-realtime-interview";
import { cn } from "@/lib/utils";

type Phase = "ready" | "active" | "ended";

type SessionResponse = RealtimeSessionToken & {
  interviewId?: string;
  error?: string;
};

export function InterviewExperience({
  conceptId,
  subjectName,
  intervieweeName,
  passcode,
  onCompleted,
}: {
  conceptId: string;
  subjectName: string;
  intervieweeName: string;
  passcode?: string;
  onCompleted?: () => void;
}) {
  const [phase, setPhase] = useState<Phase>("ready");
  const [completing, setCompleting] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [summary, setSummary] = useState<string | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [startError, setStartError] = useState<string | null>(null);

  const interviewIdRef = useRef<string | null>(null);
  const transcriptRef = useRef<TranscriptEntry[]>([]);
  const endingRef = useRef(false);
  const finishRef = useRef<() => Promise<void>>(async () => {});
  // Fallback: if the spoken closing never fires onClosingFinished, tear down
  // anyway so the interview can't hang in the "wrapping up" state.
  const closingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const realtime = useRealtimeInterview({
    onApplyAnswer: () => {},
    onIndexChange: setCurrentIndex,
    onComplete: () => {
      // Final question recorded. Keep the session alive so the SDK can send the
      // tool output and the model can speak its closing; teardown happens in
      // onClosingFinished (or the fallback timer below).
      setCompleting(true);
      if (closingTimerRef.current) clearTimeout(closingTimerRef.current);
      closingTimerRef.current = setTimeout(() => {
        void finishRef.current();
      }, 20000);
    },
    onClosingFinished: () => {
      void finishRef.current();
    },
    onTranscriptUpdate: (entries) => {
      transcriptRef.current = entries;
      setTranscript(entries);
    },
  });

  const finish = useCallback(async () => {
    if (endingRef.current) return;
    endingRef.current = true;
    if (closingTimerRef.current) {
      clearTimeout(closingTimerRef.current);
      closingTimerRef.current = null;
    }
    realtime.stop();
    setCompleting(false);
    setPhase("ended");
    setSummaryLoading(true);

    try {
      const res = await fetch("/api/interview/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conceptId,
          passcode,
          interviewId: interviewIdRef.current,
          transcript: transcriptRef.current,
        }),
      });
      const data = (await res.json()) as { summary?: string };
      setSummary(data.summary ?? "");
    } catch {
      setSummary("");
    } finally {
      setSummaryLoading(false);
      onCompleted?.();
    }
  }, [conceptId, passcode, realtime, onCompleted]);

  finishRef.current = finish;

  const handleStart = useCallback(async () => {
    setStartError(null);
    setTranscript([]);
    transcriptRef.current = [];
    setSummary(null);
    setCurrentIndex(0);
    setCompleting(false);
    endingRef.current = false;
    interviewIdRef.current = null;
    if (closingTimerRef.current) {
      clearTimeout(closingTimerRef.current);
      closingTimerRef.current = null;
    }

    const mintToken = async (voice: string): Promise<RealtimeSessionToken> => {
      const res = await fetch("/api/interview/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conceptId, passcode, intervieweeName, voice }),
      });
      const data = (await res.json()) as SessionResponse;
      if (!res.ok || !data.token) {
        throw new Error(data.error ?? "Could not start the interview.");
      }
      interviewIdRef.current = data.interviewId ?? null;
      return { token: data.token, model: data.model, voice: data.voice };
    };

    setPhase("active");
    try {
      await realtime.start(subjectName, { mintToken });
    } catch (error) {
      setPhase("ready");
      setStartError(
        error instanceof Error ? error.message : "Could not start the interview.",
      );
    }
  }, [conceptId, passcode, intervieweeName, subjectName, realtime]);

  const statusLabel = (() => {
    if (realtime.error) return realtime.error;
    if (completing) return "Wrapping up…";
    if (realtime.status === "connecting") return "Connecting…";
    if (realtime.status === "live") {
      if (realtime.isMuted) return "Mic muted";
      if (realtime.isAssistantSpeaking) return "Speaking";
      if (realtime.isMicActive) return "Listening";
      return "Mic paused while the interviewer speaks";
    }
    return null;
  })();

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col">
      <ScrollArea className="min-h-0 flex-1">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-6 py-8">
          <div className="flex flex-col items-center gap-3 text-center">
            <Avatar className="size-16 after:border-0">
              <AvatarFallback className="bg-slate-700 text-white">
                <Mic className="size-6" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-semibold text-foreground">
                360 Interview
              </h2>
              <p className="text-sm text-muted-foreground">
                Feedback about {subjectName}
              </p>
            </div>

            {phase === "active" && (
              <>
                <p className="text-xs font-medium tabular-nums text-muted-foreground">
                  Question {Math.min(currentIndex + 1, INTERVIEW_QUESTION_COUNT)}{" "}
                  of {INTERVIEW_QUESTION_COUNT}
                </p>
                {statusLabel && (
                  <p
                    className={cn(
                      "text-sm",
                      realtime.error
                        ? "text-destructive"
                        : realtime.isMicActive
                          ? "font-medium text-emerald-600 dark:text-emerald-400"
                          : "text-muted-foreground",
                    )}
                  >
                    {statusLabel}
                  </p>
                )}
                {(realtime.status === "connecting" ||
                  realtime.status === "live") && (
                  <div className="h-12 w-full max-w-sm rounded-lg bg-muted/40 px-3 py-2">
                    <LiveWaveform
                      active={
                        realtime.isMicActive || realtime.isAssistantSpeaking
                      }
                    />
                  </div>
                )}
              </>
            )}

            {phase === "ready" && (
              <div className="flex flex-col items-center gap-3">
                <Button
                  type="button"
                  size="lg"
                  className="mt-2 min-w-40"
                  onClick={handleStart}
                >
                  <Play className="size-4" />
                  Start interview
                </Button>
                {startError && (
                  <p className="text-sm text-destructive">{startError}</p>
                )}
              </div>
            )}
          </div>

          {(phase === "active" || phase === "ended") && transcript.length > 0 && (
            <div className="flex flex-col gap-5 border-t border-border pt-6">
              {transcript.map((entry) => (
                <Message
                  key={entry.id}
                  className={
                    entry.role === "user" ? "flex-row-reverse" : undefined
                  }
                >
                  <MessageContent
                    className={
                      entry.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : undefined
                    }
                  >
                    {entry.text}
                  </MessageContent>
                </Message>
              ))}
            </div>
          )}

          {phase === "ended" && (
            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <h3 className="text-sm font-medium text-foreground">
                Summary of your conversation
              </h3>
              {summaryLoading ? (
                <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="size-3.5 animate-spin" />
                  Generating summary…
                </div>
              ) : summary ? (
                <p className="mt-2 whitespace-pre-wrap text-sm/6 text-muted-foreground">
                  {summary}
                </p>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">
                  Thanks for your feedback. Your interview has been recorded.
                </p>
              )}
            </div>
          )}
        </div>
      </ScrollArea>

      {phase === "active" && (
        <div className="flex justify-center border-t border-border bg-background/95 p-4">
          <div className="flex w-full max-w-2xl items-center justify-between gap-3">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={realtime.toggleMute}
              disabled={realtime.status !== "live"}
            >
              {realtime.isMuted ? "Unmute" : "Mute"}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              onClick={() => void finish()}
            >
              <Square className="size-4" />
              End interview
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
