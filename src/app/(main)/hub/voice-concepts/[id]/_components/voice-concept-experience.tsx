"use client";

import {
  Loader2,
  Play,
  RotateCcw,
  Square,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LiveWaveform } from "@/components/ui/live-waveform";
import { Message, MessageContent } from "@/components/ui/message";
import { MicSelector } from "@/components/ui/mic-selector";
import { SpeakerSelector } from "@/components/ui/speaker-selector";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import {
  applySessionVariation,
  MOOD_AXES,
  type MoodState,
  type SessionOutcome,
} from "@/lib/voice/concept-dynamics";
import {
  type RealtimeSessionConfig,
  type TranscriptEntry,
  useRealtimeConcept,
} from "@/lib/voice/use-realtime-concept";
import {
  getCharacterInitial,
  VOICE_AVATAR_STYLES,
  type OpenAiRealtimeVoice,
} from "@/lib/voice/voice-options";
import { useVoiceConcept, conceptConfigToMood, type ConceptConfig } from "./voice-concept-config-context";

type ViewPhase = "intro" | "active" | "ended";

function buildSessionConfig(config: ConceptConfig): RealtimeSessionConfig {
  const mood = applySessionVariation(
    conceptConfigToMood(config),
    config.variationEnabled,
  );

  return {
    persona: config.persona,
    script: config.script,
    rules: config.rules,
    openingLine: config.openingLine,
    contextNotes: config.contextNotes,
    voice: config.voice,
    mood,
    volatility: config.volatility,
    tolerance: config.tolerance,
    reactivityEnabled: config.reactivityEnabled,
    moodTriggers: config.moodTriggers,
    hiddenAgenda: config.hiddenAgenda,
    agendaUnlockCondition: config.agendaUnlockCondition,
    targetDurationMinutes: config.targetDurationMinutes,
    autoEndOnExpiry: config.autoEndOnExpiry,
  };
}

function formatCountdown(seconds: number | null): string | null {
  if (seconds === null) return null;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function MoodMeter({ mood }: { mood: MoodState }) {
  return (
    <div className="grid w-full max-w-sm grid-cols-2 gap-2">
      {MOOD_AXES.map(({ key, label }) => (
        <div key={key} className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-[10px] text-muted-foreground">
            <span>{label}</span>
            <span>{mood[key]}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-300"
              style={{ width: `${mood[key]}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function CharacterAvatar({
  name,
  voice,
  size,
}: {
  name: string;
  voice: OpenAiRealtimeVoice;
  size: "large" | "compact";
}) {
  const styles = VOICE_AVATAR_STYLES[voice];
  const initial = getCharacterInitial(name);
  const isLarge = size === "large";

  return (
    <Avatar
      className={cn(
        "after:border-0",
        isLarge ? "size-28 text-3xl font-semibold" : "size-12 text-base font-semibold",
      )}
    >
      <AvatarFallback
        className={cn(
          styles.bg,
          styles.text,
          isLarge ? "text-3xl" : "text-base",
        )}
      >
        {initial}
      </AvatarFallback>
    </Avatar>
  );
}

function StatusLine({
  status,
  isAssistantSpeaking,
  isMuted,
  isMicActive,
  error,
}: {
  status: ReturnType<typeof useRealtimeConcept>["status"];
  isAssistantSpeaking: boolean;
  isMuted: boolean;
  isMicActive: boolean;
  error: string | null;
}) {
  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }

  if (status === "connecting") {
    return (
      <p className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
        <Loader2 className="size-3.5 animate-spin" />
        Connecting…
      </p>
    );
  }

  if (status === "live") {
    if (isMuted) {
      return <p className="text-sm text-muted-foreground">Mic muted</p>;
    }
    if (isAssistantSpeaking) {
      return (
        <p className="text-sm font-medium text-foreground">Speaking</p>
      );
    }
    if (isMicActive) {
      return (
        <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
          Listening
        </p>
      );
    }
    return (
      <p className="text-sm text-muted-foreground">
        Mic paused while the assistant speaks
      </p>
    );
  }

  return null;
}

export function VoiceConceptExperience() {
  const { config } = useVoiceConcept();
  const [viewPhase, setViewPhase] = useState<ViewPhase>("intro");
  const [selectedMicId, setSelectedMicId] = useState("");
  const [selectedSpeakerId, setSelectedSpeakerId] = useState("");
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [summary, setSummary] = useState<string | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  const [moodReason, setMoodReason] = useState<string | null>(null);
  const [walkOutReason, setWalkOutReason] = useState<string | null>(null);
  const [agendaRevealed, setAgendaRevealed] = useState(false);
  const transcriptRef = useRef<TranscriptEntry[]>([]);
  const endingRef = useRef(false);
  const finishSessionRef = useRef<() => Promise<void>>(async () => {});

  const configRef = useRef(config);
  configRef.current = config;

  const fetchSummary = useCallback(
    async (entries: TranscriptEntry[], sessionOutcome?: SessionOutcome) => {
      if (entries.length === 0) return;

      setSummaryLoading(true);
      setSummaryError(null);

      try {
        const res = await fetch("/api/voice/concepts/summarize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            transcript: entries,
            script: configRef.current.script,
            persona: configRef.current.persona,
            hiddenAgenda: configRef.current.hiddenAgenda,
            agendaUnlockCondition: configRef.current.agendaUnlockCondition,
            targetDurationMinutes: configRef.current.targetDurationMinutes,
            sessionOutcome,
          }),
        });

        const data = (await res.json()) as {
          summary?: string;
          error?: string;
        };

        if (!res.ok || !data.summary) {
          throw new Error(data.error ?? "Failed to generate summary");
        }

        setSummary(data.summary);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to generate summary";
        setSummaryError(message);
      } finally {
        setSummaryLoading(false);
      }
    },
    [],
  );

  const realtime = useRealtimeConcept({
    onTranscriptUpdate: (entries) => {
      transcriptRef.current = entries;
      setTranscript(entries);
    },
    onMoodUpdate: (_mood, reason) => {
      setMoodReason(reason);
    },
    onWalkOut: (reason) => {
      setWalkOutReason(reason);
      window.setTimeout(() => {
        void finishSessionRef.current();
      }, 4000);
    },
    onAgendaRevealed: () => {
      setAgendaRevealed(true);
    },
    onTimeExpired: () => {
      void finishSessionRef.current();
    },
    onRemainingSeconds: setRemainingSeconds,
  });

  const finishSession = useCallback(async () => {
    if (endingRef.current) return;
    endingRef.current = true;
    const sessionOutcome = realtime.getSessionOutcome();
    realtime.stop();
    setViewPhase("ended");
    await new Promise((resolve) => setTimeout(resolve, 300));
    await fetchSummary(transcriptRef.current, sessionOutcome);
  }, [fetchSummary, realtime]);

  finishSessionRef.current = finishSession;

  const showFooter = viewPhase === "active";
  const showWaveform =
    viewPhase === "active" &&
    (realtime.status === "connecting" || realtime.status === "live");
  const countdown = formatCountdown(remainingSeconds);

  const introDisplay =
    config.introText.trim() ||
    "You are about to have a conversation. Configure the intro in settings.";

  const handleStart = useCallback(async () => {
    setSummary(null);
    setSummaryError(null);
    setTranscript([]);
    transcriptRef.current = [];
    setMoodReason(null);
    setWalkOutReason(null);
    setAgendaRevealed(false);
    setRemainingSeconds(null);
    endingRef.current = false;
    setViewPhase("active");
    await realtime.start(
      buildSessionConfig(configRef.current),
      selectedMicId || undefined,
      selectedSpeakerId || undefined,
    );
  }, [realtime, selectedMicId, selectedSpeakerId]);

  const handleSpeakerChange = useCallback(
    (deviceId: string) => {
      setSelectedSpeakerId(deviceId);
      void realtime.setOutputDevice(deviceId);
    },
    [realtime],
  );

  const handleStop = useCallback(async () => {
    await finishSession();
  }, [finishSession]);

  const handleStartAgain = useCallback(() => {
    setTranscript([]);
    transcriptRef.current = [];
    setSummary(null);
    setSummaryError(null);
    setSummaryLoading(false);
    setMoodReason(null);
    setWalkOutReason(null);
    setAgendaRevealed(false);
    setRemainingSeconds(null);
    endingRef.current = false;
    realtime.stop();
    setViewPhase("intro");
  }, [realtime]);

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      <ScrollArea className="min-h-0 flex-1">
        <div
          className={cn(
            "mx-auto flex w-full max-w-3xl flex-col px-6",
            showFooter ? "pb-36 pt-6" : "pb-6 pt-6",
          )}
        >
          {viewPhase === "intro" ? (
            <div className="flex flex-1 flex-col items-center justify-center py-16">
              <div className="flex w-full max-w-md flex-col items-center gap-5 rounded-2xl border border-border bg-card p-8 text-center shadow-xs">
                <CharacterAvatar
                  name={config.title}
                  voice={config.voice}
                  size="large"
                />
                <div className="flex flex-col gap-1">
                  <h2 className="text-xl font-semibold text-foreground">
                    {config.title}
                  </h2>
                </div>
                <p
                  className={cn(
                    "text-sm/6",
                    config.introText.trim()
                      ? "text-muted-foreground"
                      : "text-muted-foreground/70 italic",
                  )}
                >
                  {introDisplay}
                </p>
                <Button
                  type="button"
                  size="lg"
                  className="mt-2 min-w-36"
                  onClick={handleStart}
                >
                  <Play className="size-4" />
                  Start
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center gap-3 border-b border-border pb-6">
                <CharacterAvatar
                  name={config.title}
                  voice={config.voice}
                  size="compact"
                />
                <div className="flex flex-col items-center gap-1 text-center">
                  <h2 className="text-base font-semibold text-foreground">
                    {config.title}
                  </h2>
                  {countdown && viewPhase === "active" && (
                    <p
                      className={cn(
                        "text-xs font-medium tabular-nums",
                        remainingSeconds !== null && remainingSeconds <= 60
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-muted-foreground",
                      )}
                    >
                      {countdown} remaining
                    </p>
                  )}
                  <StatusLine
                    status={realtime.status}
                    isAssistantSpeaking={realtime.isAssistantSpeaking}
                    isMuted={realtime.isMuted}
                    isMicActive={realtime.isMicActive}
                    error={realtime.error}
                  />
                </div>
                {realtime.currentMood && viewPhase === "active" && (
                  <MoodMeter mood={realtime.currentMood} />
                )}
                {moodReason && viewPhase === "active" && (
                  <p className="max-w-sm text-center text-xs text-muted-foreground">
                    Mood shift: {moodReason}
                  </p>
                )}
                {agendaRevealed && viewPhase === "active" && (
                  <p className="rounded-lg bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-700 dark:text-amber-300">
                    Hidden agenda revealed
                  </p>
                )}
                {walkOutReason && viewPhase === "active" && (
                  <p className="rounded-lg bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive">
                    Persona walked out: {walkOutReason}
                  </p>
                )}
                {showWaveform && (
                  <div className="h-12 w-full max-w-sm rounded-lg bg-muted/40 px-3 py-2">
                    <LiveWaveform
                      active={
                        realtime.isMicActive || realtime.isAssistantSpeaking
                      }
                    />
                  </div>
                )}
                {viewPhase === "ended" && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleStartAgain}
                  >
                    <RotateCcw className="size-4" />
                    Start again
                  </Button>
                )}
              </div>

              <div className="flex flex-col gap-6 pt-6">
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

                {(summaryLoading || summary || summaryError) && (
                  <div className="rounded-xl border border-border bg-muted/30 p-4">
                    <h3 className="text-sm font-medium text-foreground">
                      Training scorecard
                    </h3>
                    {summaryLoading && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="size-3.5 animate-spin" />
                        Generating summary…
                      </div>
                    )}
                    {summaryError && (
                      <p className="mt-2 text-sm text-destructive">
                        {summaryError}
                      </p>
                    )}
                    {summary && (
                      <p className="mt-2 whitespace-pre-wrap text-sm/6 text-muted-foreground">
                        {summary}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </ScrollArea>

      {showFooter && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center px-4 pb-4">
          <div className="pointer-events-auto flex w-full max-w-3xl flex-wrap items-center gap-3 rounded-2xl border border-border bg-background/95 p-3 shadow-lg backdrop-blur-sm">
            <MicSelector
              value={selectedMicId}
              onValueChange={setSelectedMicId}
            />

            <SpeakerSelector
              value={selectedSpeakerId}
              onValueChange={handleSpeakerChange}
            />

            <div className="flex min-w-36 flex-1 items-center gap-2">
              <Volume2 className="size-4 shrink-0 text-muted-foreground" />
              <Slider
                value={[realtime.volume]}
                min={0}
                max={100}
                step={1}
                onValueChange={(values) => realtime.setVolume(values[0] ?? 100)}
                className="flex-1"
              />
            </div>

            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={realtime.toggleMute}
            >
              {realtime.isMuted ? (
                <VolumeX className="size-4" />
              ) : (
                <Volume2 className="size-4" />
              )}
              {realtime.isMuted ? "Unmute" : "Mute"}
            </Button>

            {realtime.isAssistantSpeaking && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={realtime.interrupt}
              >
                Interrupt
              </Button>
            )}

            <Button
              type="button"
              size="sm"
              variant="destructive"
              onClick={handleStop}
            >
              <Square className="size-4" />
              End conversation
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
