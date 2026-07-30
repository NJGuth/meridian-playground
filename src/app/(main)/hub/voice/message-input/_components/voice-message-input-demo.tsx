"use client";

import { useChat } from "@ai-sdk/react";
import type { Experimental_TranscriptionResult as TranscriptionResult } from "ai";
import { DefaultChatTransport } from "ai";
import { ArrowUp, AudioLines, Square, Volume2, VolumeX } from "lucide-react";
import {
  type SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AudioPlayer,
  AudioPlayerControlBar,
  AudioPlayerDurationDisplay,
  AudioPlayerElement,
  AudioPlayerPlayButton,
  AudioPlayerTimeDisplay,
  AudioPlayerTimeRange,
} from "@/components/ai-elements/audio-player";
import { SpeechInput } from "@/components/ai-elements/speech-input";
import {
  Transcription,
  TranscriptionSegment,
} from "@/components/ai-elements/transcription";
import {
  VoiceSelector,
  VoiceSelectorAccent,
  VoiceSelectorAge,
  VoiceSelectorAttributes,
  VoiceSelectorBullet,
  VoiceSelectorContent,
  VoiceSelectorEmpty,
  VoiceSelectorGender,
  VoiceSelectorInput,
  VoiceSelectorItem,
  VoiceSelectorList,
  VoiceSelectorName,
  VoiceSelectorPreview,
  VoiceSelectorTrigger,
} from "@/components/ai-elements/voice-selector";
import { Button } from "@/components/ui/button";
import {
  ChatContainerContent,
  ChatContainerRoot,
  ChatContainerScrollAnchor,
} from "@/components/ui/chat-container";
import { Message, MessageContent } from "@/components/ui/message";
import { MicSelector } from "@/components/ui/mic-selector";
import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/ui/prompt-input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  OPENAI_VOICE_OPTIONS,
  type OpenAISpeechVoice,
} from "@/lib/voice/providers";
import { getMessageText } from "@/lib/voice/sentence-stream";
import { synthesizeTranscriptionSegments } from "@/lib/voice/synthesize-transcription-segments";

type TranscriptionSegmentData = TranscriptionResult["segments"][number];

const PREVIEW_SAMPLE =
  "Hi — this is a short preview of the selected OpenAI voice.";

async function fetchSpeechBlob(text: string, voice: string) {
  const response = await fetch("/api/voice/speak", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text,
      provider: "openai",
      voice,
    }),
  });

  if (!response.ok) {
    throw new Error("Speech synthesis failed");
  }

  return response.blob();
}

export function VoiceMessageInputDemo() {
  const [input, setInput] = useState("");
  const [selectedMicId, setSelectedMicId] = useState("");
  const [micDenied, setMicDenied] = useState(false);
  const [captureError, setCaptureError] = useState<string | null>(null);
  const [selectedVoice, setSelectedVoice] =
    useState<OpenAISpeechVoice>("alloy");
  const [voiceSelectorOpen, setVoiceSelectorOpen] = useState(false);
  const [speakReplies, setSpeakReplies] = useState(true);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [spokenText, setSpokenText] = useState("");
  const [segments, setSegments] = useState<TranscriptionSegmentData[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [previewVoiceId, setPreviewVoiceId] = useState<string | null>(null);
  const [previewLoadingId, setPreviewLoadingId] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const spokenMessageIdRef = useRef<string | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  const speakRepliesRef = useRef(speakReplies);
  const selectedVoiceRef = useRef(selectedVoice);

  speakRepliesRef.current = speakReplies;
  selectedVoiceRef.current = selectedVoice;

  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.permissions?.query) {
      return;
    }

    let permissionStatus: PermissionStatus | null = null;
    let cancelled = false;

    void navigator.permissions
      .query({ name: "microphone" as PermissionName })
      .then((status) => {
        if (cancelled) return;
        permissionStatus = status;
        setMicDenied(status.state === "denied");
        status.onchange = () => {
          setMicDenied(status.state === "denied");
        };
      })
      .catch(() => {
        // Permissions API unavailable for microphone in some browsers.
      });

    return () => {
      cancelled = true;
      if (permissionStatus) {
        permissionStatus.onchange = null;
      }
    };
  }, []);

  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/voice/chat" }),
    [],
  );

  const { messages, sendMessage, status, stop } = useChat({ transport });

  const isStreaming = status === "streaming";
  const isPending = status === "submitted";
  const isBusy = isStreaming || isPending;

  const revokeAudioUrl = useCallback(() => {
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      revokeAudioUrl();
      previewAudioRef.current?.pause();
      if (previewAudioRef.current?.src) {
        URL.revokeObjectURL(previewAudioRef.current.src);
      }
    };
  }, [revokeAudioUrl]);

  const handleTranscriptionChange = useCallback((text: string) => {
    const transcript = text.trim();
    if (!transcript) return;

    setInput((prev) => {
      const base = prev.trim();
      const separator = base ? " " : "";
      return `${base}${separator}${transcript}`;
    });
  }, []);

  const handleAudioRecorded = useCallback(async (audioBlob: Blob) => {
    setCaptureError(null);
    const formData = new FormData();
    formData.append("audio", audioBlob, "audio.webm");
    formData.append("provider", "openai");

    const response = await fetch("/api/voice/transcribe", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Transcription failed");
    }

    const data = (await response.json()) as { text?: string };
    return data.text?.trim() ?? "";
  }, []);

  const handleCaptureError = useCallback((message: string) => {
    setCaptureError(message);
  }, []);

  const playAssistantSpeech = useCallback(
    async (messageId: string, text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      setIsSynthesizing(true);
      try {
        const blob = await fetchSpeechBlob(trimmed, selectedVoiceRef.current);
        revokeAudioUrl();
        const url = URL.createObjectURL(blob);
        audioUrlRef.current = url;
        setAudioUrl(url);
        setSpokenText(trimmed);
        setCurrentTime(0);
        setSegments([]);
        spokenMessageIdRef.current = messageId;
      } catch (error) {
        console.warn("Voice message input: failed to speak reply", error);
      } finally {
        setIsSynthesizing(false);
      }
    },
    [revokeAudioUrl],
  );

  useEffect(() => {
    if (isBusy || !speakReplies) return;

    const lastMessage = messages.at(-1);
    if (!lastMessage || lastMessage.role !== "assistant") return;
    if (spokenMessageIdRef.current === lastMessage.id) return;

    const text = getMessageText(lastMessage.parts);
    if (!text.trim()) return;

    void playAssistantSpeech(lastMessage.id, text);
  }, [isBusy, messages, playAssistantSpeech, speakReplies]);

  const handleAudioMetadata = useCallback(
    (event: SyntheticEvent<HTMLAudioElement>) => {
      const duration = event.currentTarget.duration;
      if (!Number.isFinite(duration) || duration <= 0) return;
      setSegments(synthesizeTranscriptionSegments(spokenText, duration));
    },
    [spokenText],
  );

  const handleSeek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = time;
    setCurrentTime(time);
  }, []);

  const handlePreviewVoice = useCallback(
    async (voiceId: OpenAISpeechVoice) => {
      const current = previewAudioRef.current;

      if (previewVoiceId === voiceId && current && !current.paused) {
        current.pause();
        setPreviewVoiceId(null);
        return;
      }

      if (current) {
        current.pause();
        if (current.src) URL.revokeObjectURL(current.src);
      }

      setPreviewLoadingId(voiceId);
      try {
        const blob = await fetchSpeechBlob(PREVIEW_SAMPLE, voiceId);
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        previewAudioRef.current = audio;
        audio.onended = () => {
          setPreviewVoiceId(null);
          URL.revokeObjectURL(url);
        };
        await audio.play();
        setPreviewVoiceId(voiceId);
      } catch (error) {
        console.warn("Voice preview failed", error);
        setPreviewVoiceId(null);
      } finally {
        setPreviewLoadingId(null);
      }
    },
    [previewVoiceId],
  );

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed || isBusy) return;
    sendMessage({ text: trimmed });
    setInput("");
  };

  const selectedVoiceLabel =
    OPENAI_VOICE_OPTIONS.find((voice) => voice.id === selectedVoice)?.name ??
    selectedVoice;

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <VoiceSelector
          value={selectedVoice}
          open={voiceSelectorOpen}
          onOpenChange={setVoiceSelectorOpen}
          onValueChange={(value) => {
            if (value && OPENAI_VOICE_OPTIONS.some((v) => v.id === value)) {
              setSelectedVoice(value as OpenAISpeechVoice);
            }
          }}
        >
          <VoiceSelectorTrigger asChild>
            <Button type="button" variant="outline" size="sm">
              <AudioLines className="size-3.5" />
              Voice: {selectedVoiceLabel}
            </Button>
          </VoiceSelectorTrigger>
          <VoiceSelectorContent
            title="Select OpenAI voice"
            className="max-w-md"
          >
            <VoiceSelectorInput placeholder="Search voices..." />
            <VoiceSelectorList>
              <VoiceSelectorEmpty>No voices found.</VoiceSelectorEmpty>
              {OPENAI_VOICE_OPTIONS.map((voice) => (
                <VoiceSelectorItem
                  key={voice.id}
                  value={voice.id}
                  onSelect={() => {
                    setSelectedVoice(voice.id);
                    setVoiceSelectorOpen(false);
                  }}
                >
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <VoiceSelectorName>{voice.name}</VoiceSelectorName>
                      <VoiceSelectorPreview
                        playing={previewVoiceId === voice.id}
                        loading={previewLoadingId === voice.id}
                        onPlay={() => void handlePreviewVoice(voice.id)}
                      />
                    </div>
                    <VoiceSelectorAttributes className="gap-1.5">
                      <VoiceSelectorGender value={voice.gender} />
                      <VoiceSelectorBullet />
                      <VoiceSelectorAccent value={voice.accent} />
                      <VoiceSelectorBullet />
                      <VoiceSelectorAge>{voice.age}</VoiceSelectorAge>
                    </VoiceSelectorAttributes>
                    <p className="text-muted-foreground text-xs">
                      {voice.description}
                    </p>
                  </div>
                </VoiceSelectorItem>
              ))}
            </VoiceSelectorList>
          </VoiceSelectorContent>
        </VoiceSelector>

        <div className="flex items-center gap-2 text-sm">
          <Switch
            checked={speakReplies}
            onCheckedChange={setSpeakReplies}
            aria-label="Speak replies"
          />
          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
            {speakReplies ? (
              <Volume2 className="size-3.5" />
            ) : (
              <VolumeX className="size-3.5" />
            )}
            Speak replies
          </span>
        </div>
      </div>

      {micDenied ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm/6">
          <span className="text-destructive">
            Microphone access is blocked.{" "}
          </span>
          <span className="text-muted-foreground">
            Open your browser site settings, allow the microphone, then use
            Enable microphone in the device picker.
          </span>
        </div>
      ) : null}

      {captureError ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm/6">
          <span className="text-destructive">{captureError}</span>
        </div>
      ) : null}

      <ChatContainerRoot className="min-h-0 flex-1 rounded-xl border">
        <ChatContainerContent className="gap-4 p-4">
          {messages.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 py-16 text-center">
              <p className="font-medium text-sm">Voice → message input</p>
              <p className="max-w-md text-muted-foreground text-sm/6">
                Tap the mic to start (beep), speak, then tap again to stop —
                Whisper inserts the transcript into the composer. When Speak
                replies is on, assistant answers play in the selected voice.
              </p>
            </div>
          ) : null}

          {messages.map((message) => {
            const text = getMessageText(message.parts);
            if (!text.trim()) return null;

            return (
              <Message
                key={message.id}
                className={cn(
                  message.role === "user" ? "items-end" : "items-start",
                )}
              >
                <MessageContent
                  className={cn(
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted",
                  )}
                >
                  {text}
                </MessageContent>
              </Message>
            );
          })}
          <ChatContainerScrollAnchor />
        </ChatContainerContent>
      </ChatContainerRoot>

      {speakReplies && (audioUrl || isSynthesizing) ? (
        <div className="space-y-3 rounded-xl border p-3">
          <div className="flex items-center justify-between gap-2">
            <p className="font-medium text-sm">Assistant speech</p>
            {isSynthesizing ? (
              <p className="text-muted-foreground text-xs">Synthesizing…</p>
            ) : null}
          </div>

          {audioUrl ? (
            <>
              <AudioPlayer className="w-full">
                <AudioPlayerElement
                  ref={audioRef}
                  src={audioUrl}
                  autoPlay
                  onLoadedMetadata={handleAudioMetadata}
                  onTimeUpdate={(event) =>
                    setCurrentTime(event.currentTarget.currentTime)
                  }
                />
                <AudioPlayerControlBar className="w-full gap-1">
                  <AudioPlayerPlayButton />
                  <AudioPlayerTimeDisplay />
                  <AudioPlayerTimeRange className="flex-1" />
                  <AudioPlayerDurationDisplay />
                </AudioPlayerControlBar>
              </AudioPlayer>

              {segments.length > 0 ? (
                <Transcription
                  segments={segments}
                  currentTime={currentTime}
                  onSeek={handleSeek}
                  className="rounded-lg bg-muted/50 p-3"
                >
                  {(segment, index) => (
                    <TranscriptionSegment
                      key={`${segment.startSecond}-${index}`}
                      segment={segment}
                      index={index}
                    />
                  )}
                </Transcription>
              ) : null}
            </>
          ) : null}
        </div>
      ) : null}

      <PromptInput
        value={input}
        onValueChange={setInput}
        onSubmit={handleSubmit}
        isLoading={isBusy}
        className="border-border"
      >
        <PromptInputTextarea
          placeholder="Type a message, or use the mic to dictate…"
          disabled={isBusy}
        />
        <PromptInputActions className="justify-between gap-2 p-2">
          <div className="flex items-center gap-2">
            <PromptInputAction tooltip="Record voice into the message input">
              <SpeechInput
                size="icon-sm"
                {...(isBusy ? { disabled: true } : {})}
                audioDeviceId={selectedMicId || undefined}
                onTranscriptionChange={handleTranscriptionChange}
                onAudioRecorded={handleAudioRecorded}
                onCaptureError={handleCaptureError}
              />
            </PromptInputAction>
            <MicSelector
              value={selectedMicId}
              onValueChange={setSelectedMicId}
              className="w-auto"
            />
          </div>

          <div className="flex items-center gap-1">
            {isBusy ? (
              <PromptInputAction tooltip="Stop">
                <Button
                  type="button"
                  size="icon-sm"
                  variant="outline"
                  onClick={() => stop()}
                >
                  <Square className="size-3.5" />
                </Button>
              </PromptInputAction>
            ) : null}
            <PromptInputAction tooltip="Send">
              <Button
                type="button"
                size="icon-sm"
                disabled={!input.trim() || isBusy}
                onClick={handleSubmit}
              >
                <ArrowUp className="size-3.5" />
              </Button>
            </PromptInputAction>
          </div>
        </PromptInputActions>
      </PromptInput>
    </div>
  );
}
