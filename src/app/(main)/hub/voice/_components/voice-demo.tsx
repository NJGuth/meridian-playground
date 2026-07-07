"use client";

import { useChat } from "@ai-sdk/react";
import type { UIMessage } from "ai";
import { DefaultChatTransport } from "ai";
import {
  ArrowUp,
  ClipboardList,
  Loader2,
  Mic,
  Play,
  Radio,
  RotateCcw,
  Square,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChatContainerContent,
  ChatContainerRoot,
  ChatContainerScrollAnchor,
} from "@/components/ui/chat-container";
import { Input } from "@/components/ui/input";
import { LiveWaveform } from "@/components/ui/live-waveform";
import { Message, MessageContent } from "@/components/ui/message";
import { MicSelector } from "@/components/ui/mic-selector";
import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/ui/prompt-input";
import { cn } from "@/lib/utils";
import {
  DEFAULT_COACHEE_NAME,
  INTERVIEW_BEGIN_TOKEN,
  INTERVIEW_QUESTION_COUNT,
  renderQuestions,
} from "@/lib/voice/interview-script";
import {
  VOICE_PROVIDER_LABELS,
  VOICE_PROVIDERS,
  type VoiceProvider,
} from "@/lib/voice/providers";
import {
  extractFinalRemainder,
  extractNewSentences,
  getMessageText,
} from "@/lib/voice/sentence-stream";
import { useAudioQueue } from "@/lib/voice/use-audio-queue";
import { useRealtimeInterview } from "@/lib/voice/use-realtime-interview";
import { useRealtimeTranscription } from "@/lib/voice/use-realtime-transcription";

type InterviewMode = "pipeline" | "realtime";

type MessageMetrics = {
  provider: VoiceProvider;
  timeToFirstAudioMs: number | null;
};

type AnswerStatus = "answered" | "partial" | "skipped";
type InterviewResponse = { status: AnswerStatus; summary: string } | null;
type InterviewPhase = "idle" | "running" | "complete";
type RecordAnswerInput = {
  questionIndex?: number;
  status?: AnswerStatus;
  summary?: string;
};

const STATUS_LABELS: Record<AnswerStatus, string> = {
  answered: "Answered",
  partial: "Partial",
  skipped: "Skipped",
};

function getAssistantText(message: UIMessage) {
  return getMessageText(message.parts);
}

export function VoiceDemo() {
  const [input, setInput] = useState("");
  const [provider, setProvider] = useState<VoiceProvider>("openai");
  const [selectedMicId, setSelectedMicId] = useState("");
  const [messageMetrics, setMessageMetrics] = useState<
    Record<string, MessageMetrics>
  >({});

  const [interviewPhase, setInterviewPhase] = useState<InterviewPhase>("idle");
  const [interviewMode, setInterviewMode] = useState<InterviewMode>("pipeline");
  const [coacheeName, setCoacheeName] = useState(DEFAULT_COACHEE_NAME);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<InterviewResponse[]>(() =>
    Array(INTERVIEW_QUESTION_COUNT).fill(null),
  );

  const processedLengthRef = useRef(0);
  const activeAssistantIdRef = useRef<string | null>(null);
  const speakQueueRef = useRef<Promise<void>>(Promise.resolve());
  const providerRef = useRef(provider);
  const mutedRef = useRef(false);
  const baseInputRef = useRef("");

  const interviewActiveRef = useRef(false);
  const coacheeNameRef = useRef(coacheeName);
  const currentIndexRef = useRef(0);
  const processedToolIdsRef = useRef<Set<string>>(new Set());

  coacheeNameRef.current = coacheeName;

  const questionTexts = useMemo(
    () => renderQuestions(coacheeName),
    [coacheeName],
  );

  const {
    enqueue,
    stop: stopAudio,
    isPlaying,
    isMuted,
    toggleMute,
    timeToFirstAudio,
    resetMetrics,
  } = useAudioQueue();

  providerRef.current = provider;
  mutedRef.current = isMuted;

  const handleTranscript = useCallback((text: string) => {
    const base = baseInputRef.current.trim();
    const separator = base && text ? " " : "";
    setInput(`${base}${separator}${text}`);
  }, []);

  const {
    start: startRealtime,
    stop: stopRealtime,
    status: realtimeStatus,
    error: realtimeError,
    stream: micStream,
  } = useRealtimeTranscription({ onTranscript: handleTranscript });

  const isRecording =
    realtimeStatus === "connecting" || realtimeStatus === "listening";

  const realtime = useRealtimeInterview({
    onApplyAnswer: (slot, answerStatus, summary) => {
      setResponses((prev) => {
        const next = [...prev];
        if (slot >= 0 && slot < next.length) {
          next[slot] = { status: answerStatus, summary };
        }
        return next;
      });
    },
    onIndexChange: (index) => {
      currentIndexRef.current = index;
      setCurrentIndex(index);
    },
    onComplete: () => {
      setInterviewPhase("complete");
    },
  });

  const isRealtimeMode = interviewMode === "realtime";
  const isRealtimeBusy =
    realtime.status === "connecting" || realtime.status === "live";
  const interviewRunning = isRealtimeMode
    ? isRealtimeBusy
    : interviewPhase === "running";

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/voice/chat",
        body: () =>
          interviewActiveRef.current
            ? {
                interview: {
                  coacheeName: coacheeNameRef.current,
                  currentIndex: currentIndexRef.current,
                },
              }
            : {},
      }),
    [],
  );

  const { messages, sendMessage, setMessages, stop, status } = useChat({
    transport,
  });

  const isStreaming = status === "streaming";
  const isPending = status === "submitted";
  const isBusy = isStreaming || isPending;

  const synthesizeSentence = useCallback(
    (text: string) => {
      // The chain only enforces playback ORDER. Each step must always resolve:
      // if one synth fails (network reject, abort, non-ok status) it must skip
      // only that sentence, never reject the shared chain — a rejected chain
      // silently swallows every subsequent sentence (truncated narration).
      speakQueueRef.current = speakQueueRef.current.then(async () => {
        try {
          if (mutedRef.current) return;

          const response = await fetch("/api/voice/speak", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              text,
              provider: providerRef.current,
            }),
          });

          if (!response.ok) return;

          const blob = await response.blob();
          enqueue(blob);
        } catch (error) {
          console.warn("Voice narration: failed to synthesize sentence", error);
        }
      });
    },
    [enqueue],
  );

  const narrateText = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      synthesizeSentence(trimmed);
    },
    [synthesizeSentence],
  );

  const handleToggleRecord = () => {
    if (isRecording) {
      stopRealtime();
      return;
    }
    if (isBusy) return;
    baseInputRef.current = input;
    stopAudio();
    speakQueueRef.current = Promise.resolve();
    void startRealtime(provider, selectedMicId || undefined);
  };

  const stopRealtimeInterview = realtime.stop;
  useEffect(() => {
    return () => {
      stopRealtime();
      stopRealtimeInterview();
    };
  }, [stopRealtime, stopRealtimeInterview]);

  useEffect(() => {
    const lastMessage = messages.at(-1);
    if (!lastMessage || lastMessage.role !== "assistant") return;

    if (activeAssistantIdRef.current !== lastMessage.id) {
      activeAssistantIdRef.current = lastMessage.id;
      processedLengthRef.current = 0;
      resetMetrics();
      stopAudio();
      speakQueueRef.current = Promise.resolve();
    }

    const text = getAssistantText(lastMessage);
    const { sentences, newProcessedLength } = extractNewSentences(
      text,
      processedLengthRef.current,
    );

    if (sentences.length > 0) {
      processedLengthRef.current = newProcessedLength;
      for (const sentence of sentences) {
        narrateText(sentence);
      }
    }
  }, [messages, narrateText, resetMetrics, stopAudio]);

  useEffect(() => {
    if (isStreaming || isPending) return;

    const lastMessage = messages.at(-1);
    if (!lastMessage || lastMessage.role !== "assistant") return;

    const text = getAssistantText(lastMessage);
    const remainder = extractFinalRemainder(text, processedLengthRef.current);

    if (remainder) {
      processedLengthRef.current = text.length;
      narrateText(remainder);
    }

    setMessageMetrics((current) => {
      const existing = current[lastMessage.id];
      return {
        ...current,
        [lastMessage.id]: {
          provider: providerRef.current,
          timeToFirstAudioMs:
            timeToFirstAudio ?? existing?.timeToFirstAudioMs ?? null,
        },
      };
    });
  }, [isPending, isStreaming, messages, narrateText, timeToFirstAudio]);

  // Drive the interview from recordAnswer tool calls. The client owns the
  // question index (advances by exactly one per recorded answer) so the model
  // cannot skip ahead or lose its place.
  useEffect(() => {
    if (!interviewActiveRef.current) return;

    for (const message of messages) {
      if (message.role !== "assistant") continue;
      for (const part of message.parts) {
        if (part.type !== "tool-recordAnswer") continue;
        const toolPart = part as unknown as {
          toolCallId: string;
          state: string;
          input?: RecordAnswerInput;
        };
        if (
          toolPart.state !== "input-available" &&
          toolPart.state !== "output-available"
        ) {
          continue;
        }
        if (processedToolIdsRef.current.has(toolPart.toolCallId)) continue;
        processedToolIdsRef.current.add(toolPart.toolCallId);

        const slot = currentIndexRef.current;
        const status = toolPart.input?.status ?? "answered";
        const summary = toolPart.input?.summary ?? "";

        setResponses((prev) => {
          const next = [...prev];
          if (slot >= 0 && slot < next.length) {
            next[slot] = { status, summary };
          }
          return next;
        });

        const advanceTo = slot + 1;
        if (advanceTo >= INTERVIEW_QUESTION_COUNT) {
          interviewActiveRef.current = false;
          setInterviewPhase("complete");
        } else {
          currentIndexRef.current = advanceTo;
          setCurrentIndex(advanceTo);
        }
      }
    }
  }, [messages]);

  const startInterview = () => {
    const name = coacheeName.trim() || DEFAULT_COACHEE_NAME;
    setCoacheeName(name);
    coacheeNameRef.current = name;

    stopRealtime();
    realtime.stop();
    stopAudio();
    speakQueueRef.current = Promise.resolve();
    resetMetrics();
    processedLengthRef.current = 0;
    activeAssistantIdRef.current = null;
    processedToolIdsRef.current = new Set();

    setMessages([]);
    setMessageMetrics({});
    setResponses(Array(INTERVIEW_QUESTION_COUNT).fill(null));
    setCurrentIndex(0);
    currentIndexRef.current = 0;
    setInput("");

    if (isRealtimeMode) {
      // The WebRTC session owns the mic + the question loop; the chat pipeline
      // stays idle (interviewActiveRef off) so its tool/narration effects don't
      // fire.
      interviewActiveRef.current = false;
      setInterviewPhase("running");
      void realtime.start(name, { deviceId: selectedMicId || undefined });
      return;
    }

    interviewActiveRef.current = true;
    setInterviewPhase("running");
    sendMessage({ text: INTERVIEW_BEGIN_TOKEN });
  };

  const stopInterview = () => {
    interviewActiveRef.current = false;
    setInterviewPhase("idle");
    if (isRealtimeMode) {
      realtime.stop();
      return;
    }
    stop();
    stopRealtime();
    stopAudio();
    speakQueueRef.current = Promise.resolve();
  };

  const handleSelectMode = (mode: InterviewMode) => {
    if (mode === interviewMode || interviewRunning) return;
    stopRealtime();
    realtime.stop();
    stopAudio();
    speakQueueRef.current = Promise.resolve();
    setInterviewMode(mode);
  };

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed || isBusy || isRecording) return;

    // Do NOT reset processedLengthRef / activeAssistantIdRef here. Submitting
    // triggers a re-render while the previous assistant message is still the
    // last one; clearing these makes the narration effect treat it as new and
    // re-speak it. The narration effect resets them when the next assistant
    // message arrives (on id change).
    stopAudio();
    speakQueueRef.current = Promise.resolve();
    resetMetrics();
    sendMessage({ text: trimmed });
    setInput("");
  };

  const handleReplay = (message: UIMessage) => {
    const text = getAssistantText(message);
    if (!text.trim()) return;

    stopAudio();
    speakQueueRef.current = Promise.resolve();
    resetMetrics();
    narrateText(text);
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="mx-auto flex w-full max-w-3xl shrink-0 flex-col gap-3 px-6 pt-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-foreground">Mode</span>
            <Button
              type="button"
              size="sm"
              variant={!isRealtimeMode ? "default" : "outline"}
              onClick={() => handleSelectMode("pipeline")}
              disabled={interviewRunning}
            >
              Pipeline
            </Button>
            <Button
              type="button"
              size="sm"
              variant={isRealtimeMode ? "default" : "outline"}
              onClick={() => handleSelectMode("realtime")}
              disabled={interviewRunning}
            >
              <Radio className="size-4" />
              Realtime
            </Button>
          </div>

          {isRealtimeMode ? (
            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={realtime.toggleMute}
                disabled={realtime.status !== "live"}
              >
                {realtime.isMuted ? (
                  <VolumeX className="size-4" />
                ) : (
                  <Volume2 className="size-4" />
                )}
                {realtime.isMuted ? "Unmute mic" : "Mute mic"}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={realtime.interrupt}
                disabled={!realtime.isAssistantSpeaking}
              >
                <Square className="size-3 fill-current" />
                Stop talking
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={toggleMute}
              >
                {isMuted ? (
                  <VolumeX className="size-4" />
                ) : (
                  <Volume2 className="size-4" />
                )}
                {isMuted ? "Unmute" : "Mute"}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={stopAudio}
                disabled={!isPlaying}
              >
                <Square className="size-3 fill-current" />
                Stop audio
              </Button>
            </div>
          )}
        </div>

        {!isRealtimeMode && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-foreground">
              Voice provider
            </span>
            {VOICE_PROVIDERS.map((option) => (
              <Button
                key={option}
                type="button"
                size="sm"
                variant={provider === option ? "default" : "outline"}
                onClick={() => setProvider(option)}
                disabled={isRecording}
              >
                {VOICE_PROVIDER_LABELS[option]}
              </Button>
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {isRealtimeMode ? (
            <>
              <Badge variant="secondary">
                OpenAI Realtime (speech-to-speech)
              </Badge>
              {realtime.status === "connecting" && (
                <span className="flex items-center gap-1">
                  <Loader2 className="size-3 animate-spin" />
                  Connecting…
                </span>
              )}
              {realtime.status === "live" &&
                (realtime.isAssistantSpeaking ? (
                  <Badge variant="default" className="animate-pulse">
                    Speaking
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="animate-pulse">
                    Listening
                  </Badge>
                ))}
              {realtime.error && (
                <span className="text-destructive">{realtime.error}</span>
              )}
            </>
          ) : (
            <>
              <Badge variant="secondary">
                {VOICE_PROVIDER_LABELS[provider]}
              </Badge>
              {timeToFirstAudio !== null && (
                <span>Time to first audio: {timeToFirstAudio}ms</span>
              )}
              {realtimeStatus === "connecting" && (
                <span>Connecting mic...</span>
              )}
              {realtimeStatus === "listening" && (
                <Badge variant="destructive" className="animate-pulse">
                  Listening
                </Badge>
              )}
              {realtimeError && (
                <span className="text-destructive">{realtimeError}</span>
              )}
            </>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-border pt-3">
          <Input
            value={coacheeName}
            onChange={(event) => setCoacheeName(event.target.value)}
            placeholder="Coachee name"
            className="h-8 w-44"
            disabled={interviewRunning}
          />
          {interviewRunning ? (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={stopInterview}
            >
              <X className="size-4" />
              {isRealtimeMode ? "End session" : "Stop interview"}
            </Button>
          ) : (
            <Button type="button" size="sm" onClick={startInterview}>
              <Play className="size-4" />
              Run 360 interview
            </Button>
          )}
          {interviewPhase !== "idle" && (
            <span className="text-xs text-muted-foreground">
              {interviewPhase === "complete"
                ? "Interview complete"
                : `Question ${Math.min(
                    currentIndex + 1,
                    INTERVIEW_QUESTION_COUNT,
                  )} of ${INTERVIEW_QUESTION_COUNT}`}
            </span>
          )}
        </div>

        {isRealtimeMode && (interviewRunning || realtime.status === "live") && (
          <div className="flex items-center gap-2 text-xs">
            {realtime.status === "connecting" ? (
              <>
                <Loader2 className="size-3.5 animate-spin text-muted-foreground" />
                <span className="text-muted-foreground">
                  Connecting microphone…
                </span>
              </>
            ) : realtime.isMuted ? (
              <>
                <span className="flex size-2.5 rounded-full bg-destructive" />
                <span className="text-muted-foreground">Mic muted</span>
              </>
            ) : realtime.isMicActive ? (
              <>
                <span className="flex size-2.5 animate-pulse rounded-full bg-emerald-500" />
                <span className="font-medium text-emerald-600 dark:text-emerald-400">
                  Mic active — go ahead and speak
                </span>
              </>
            ) : (
              <>
                <span className="flex size-2.5 rounded-full bg-amber-500" />
                <span className="text-muted-foreground">
                  Mic paused while the interviewer speaks
                </span>
              </>
            )}
          </div>
        )}

        {interviewPhase !== "idle" && (
          <div className="rounded-lg border border-border bg-muted/30 p-3">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
              <ClipboardList className="size-4" />
              360 Responses
              <span className="text-xs font-normal text-muted-foreground">
                {responses.filter(Boolean).length}/{INTERVIEW_QUESTION_COUNT}{" "}
                captured
              </span>
            </div>
            <div className="max-h-44 space-y-2 overflow-auto pr-1">
              {questionTexts.map((question, index) => {
                const response = responses[index];
                const isCurrent =
                  index === currentIndex && interviewPhase === "running";
                return (
                  <div
                    key={question}
                    className="flex items-start gap-2 text-xs"
                  >
                    <span className="w-4 shrink-0 text-right text-muted-foreground">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p
                        className={cn(
                          "truncate text-muted-foreground",
                          isCurrent && "font-medium text-foreground",
                        )}
                      >
                        {question}
                      </p>
                      {response?.summary && (
                        <p className="mt-0.5 text-muted-foreground">
                          {response.summary}
                        </p>
                      )}
                    </div>
                    {response ? (
                      <Badge
                        variant={
                          response.status === "skipped"
                            ? "outline"
                            : "secondary"
                        }
                      >
                        {STATUS_LABELS[response.status]}
                      </Badge>
                    ) : isCurrent ? (
                      <Badge variant="default">Current</Badge>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <ChatContainerRoot className="flex-1">
        <ChatContainerContent className="mx-auto w-full max-w-3xl gap-8 px-6 py-6">
          {messages.length === 0 && !isPending && (
            <div className="flex flex-1 items-center justify-center text-center text-sm text-muted-foreground">
              {isRealtimeMode
                ? interviewRunning
                  ? "You're live. Just talk — the interviewer listens and responds in realtime. Watch the responses panel above as answers are captured."
                  : "Realtime mode runs a live, speech-to-speech 360 interview over OpenAI gpt-realtime. Set the coachee name and press Run 360 interview."
                : "Toggle the mic on to start talking — your words transcribe live. Toggle off, review, then send."}
            </div>
          )}

          {messages.map((message) => {
            if (message.role === "user") {
              const text = getAssistantText(message);
              if (!text || text === INTERVIEW_BEGIN_TOKEN) return null;

              return (
                <Message key={message.id} className="flex-row-reverse">
                  <MessageContent className="bg-primary text-primary-foreground">
                    {text}
                  </MessageContent>
                </Message>
              );
            }

            const text = getAssistantText(message);
            if (!text) return null;

            const metrics = messageMetrics[message.id];

            return (
              <Message key={message.id}>
                <div className="flex min-w-0 flex-col gap-2">
                  <MessageContent variant="prose">{text}</MessageContent>
                  <div className="flex flex-wrap items-center gap-2">
                    {metrics && (
                      <Badge variant="outline">
                        {VOICE_PROVIDER_LABELS[metrics.provider]}
                      </Badge>
                    )}
                    {metrics?.timeToFirstAudioMs != null && (
                      <span className="text-xs text-muted-foreground">
                        First audio: {metrics.timeToFirstAudioMs}ms
                      </span>
                    )}
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-7 gap-1.5 px-2 text-xs"
                      onClick={() => handleReplay(message)}
                    >
                      <RotateCcw className="size-3.5" />
                      Replay
                    </Button>
                  </div>
                </div>
              </Message>
            );
          })}

          {isPending && (
            <Message>
              <MessageContent className="text-muted-foreground">
                Thinking...
              </MessageContent>
            </Message>
          )}

          <ChatContainerScrollAnchor />
        </ChatContainerContent>
      </ChatContainerRoot>

      {isRealtimeMode ? (
        <div className="mx-auto w-full max-w-3xl shrink-0 px-6 pb-6">
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-muted/40 px-4 py-3">
            <div className="flex items-center gap-2 text-sm">
              {realtime.status === "connecting" && (
                <>
                  <Loader2 className="size-4 animate-spin text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Connecting to the realtime interviewer…
                  </span>
                </>
              )}
              {realtime.status === "live" && (
                <>
                  <span
                    className={cn(
                      "flex size-2.5 rounded-full",
                      realtime.isAssistantSpeaking
                        ? "animate-pulse bg-primary"
                        : "animate-pulse bg-destructive",
                    )}
                  />
                  <span className="font-medium text-foreground">
                    {realtime.isAssistantSpeaking
                      ? "Interviewer speaking…"
                      : "Listening — go ahead and answer"}
                  </span>
                </>
              )}
              {realtime.status === "idle" && (
                <>
                  <MicSelector
                    value={selectedMicId}
                    onValueChange={setSelectedMicId}
                    requestOnMount
                  />
                  <span className="text-muted-foreground">
                    Press Run 360 interview to begin a live session.
                  </span>
                </>
              )}
              {realtime.status === "error" && (
                <span className="text-destructive">
                  {realtime.error ?? "Realtime session error"}
                </span>
              )}
            </div>
            {realtime.status === "live" && (
              <div className="flex items-center gap-2">
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
                  {realtime.isMuted ? "Unmute mic" : "Mute mic"}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={stopInterview}
                >
                  <X className="size-4" />
                  End session
                </Button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="mx-auto w-full max-w-3xl shrink-0 px-6 pb-6">
          <PromptInput
            value={input}
            onValueChange={setInput}
            onSubmit={handleSubmit}
            isLoading={isBusy}
          >
            <PromptInputTextarea placeholder="Type or toggle the mic to dictate..." />
            {isRecording && (
              <div className="px-3 pt-2">
                <LiveWaveform
                  active={realtimeStatus === "listening"}
                  processing={realtimeStatus === "connecting"}
                  stream={micStream}
                  deviceId={selectedMicId || undefined}
                  height={48}
                  mode="static"
                  barColor="var(--primary)"
                  className="rounded-xl bg-muted/40"
                />
              </div>
            )}
            <PromptInputActions className="justify-between px-2 pb-2">
              <div className="flex items-center gap-1">
                <MicSelector
                  value={selectedMicId}
                  onValueChange={setSelectedMicId}
                  disabled={isRecording}
                  requestOnMount
                />
                <PromptInputAction
                  tooltip={isRecording ? "Stop recording" : "Start recording"}
                >
                  <Button
                    type="button"
                    variant={isRecording ? "destructive" : "ghost"}
                    size="icon"
                    className="size-8 rounded-full"
                    disabled={!isRecording && isBusy}
                    onClick={handleToggleRecord}
                  >
                    {isRecording ? (
                      <Square className="size-3 fill-current" />
                    ) : (
                      <Mic className="size-4" />
                    )}
                  </Button>
                </PromptInputAction>
              </div>
              <div className="flex items-center">
                {isStreaming ? (
                  <PromptInputAction tooltip="Stop generating">
                    <Button
                      type="button"
                      variant="default"
                      size="icon"
                      className="size-8 rounded-full"
                      onClick={stop}
                    >
                      <Square className="size-3 fill-current" />
                    </Button>
                  </PromptInputAction>
                ) : (
                  <PromptInputAction tooltip="Send message">
                    <Button
                      type="button"
                      variant="default"
                      size="icon"
                      className="size-8 rounded-full"
                      disabled={!input.trim() || isBusy || isRecording}
                      onClick={handleSubmit}
                    >
                      <ArrowUp className="size-4" />
                    </Button>
                  </PromptInputAction>
                )}
              </div>
            </PromptInputActions>
          </PromptInput>
        </div>
      )}
    </div>
  );
}
