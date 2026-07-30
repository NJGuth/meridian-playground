"use client";

import { MicIcon, SquareIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

type SpeechInputMode = "speech-recognition" | "media-recorder" | "none";

export type SpeechInputProps = ComponentProps<typeof Button> & {
  onTranscriptionChange?: (text: string) => void;
  /**
   * Callback for when audio is recorded using MediaRecorder.
   * Required for reliable capture in browsers where Web Speech is a stub
   * (Brave/Arc) or unavailable (Firefox/Safari). Return transcribed text.
   */
  onAudioRecorded?: (audioBlob: Blob) => Promise<string>;
  /** Preferred microphone deviceId for MediaRecorder capture. */
  audioDeviceId?: string;
  /** Called when capture fails (permission, network STT, etc.). */
  onCaptureError?: (message: string) => void;
  lang?: string;
};

const RECOVERABLE_SPEECH_ERRORS = new Set([
  "aborted",
  "no-speech",
  "audio-capture",
]);

/**
 * Prefer MediaRecorder when a server transcription callback exists.
 * Many Chromium forks expose SpeechRecognition but immediately fail with
 * `network` (no Google STT access) — which looks like a mic that pulses off.
 */
const detectSpeechInputMode = (hasAudioRecorded: boolean): SpeechInputMode => {
  if (typeof window === "undefined") {
    return "none";
  }

  const canRecord = "MediaRecorder" in window && "mediaDevices" in navigator;

  if (hasAudioRecorded && canRecord) {
    return "media-recorder";
  }

  if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
    return "speech-recognition";
  }

  if (canRecord) {
    return "media-recorder";
  }

  return "none";
};

function playStartCue() {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = 880;
    gain.gain.value = 0.05;
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start();
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
    oscillator.stop(ctx.currentTime + 0.12);
    window.setTimeout(() => {
      void ctx.close();
    }, 200);
  } catch {
    // Audio cue is best-effort.
  }
}

function buildAudioConstraints(
  deviceId?: string,
): MediaTrackConstraints | true {
  if (!deviceId) return true;
  return {
    deviceId: { ideal: deviceId },
    echoCancellation: true,
    noiseSuppression: true,
  };
}

export const SpeechInput = ({
  className,
  onTranscriptionChange,
  onAudioRecorded,
  audioDeviceId,
  onCaptureError,
  lang = "en-US",
  onClick,
  disabled,
  ...props
}: SpeechInputProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mode] = useState<SpeechInputMode>(() =>
    detectSpeechInputMode(Boolean(onAudioRecorded)),
  );
  const [isRecognitionReady, setIsRecognitionReady] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const wantsListeningRef = useRef(false);
  const restartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioDeviceIdRef = useRef(audioDeviceId);
  const onTranscriptionChangeRef = useRef(onTranscriptionChange);
  const onAudioRecordedRef = useRef(onAudioRecorded);
  const onCaptureErrorRef = useRef(onCaptureError);

  onTranscriptionChangeRef.current = onTranscriptionChange;
  onAudioRecordedRef.current = onAudioRecorded;
  onCaptureErrorRef.current = onCaptureError;
  audioDeviceIdRef.current = audioDeviceId;

  const clearRestartTimer = useCallback(() => {
    if (restartTimerRef.current) {
      clearTimeout(restartTimerRef.current);
      restartTimerRef.current = null;
    }
  }, []);

  const reportError = useCallback((message: string) => {
    onCaptureErrorRef.current?.(message);
  }, []);

  const startRecognition = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition || !wantsListeningRef.current) return;

    try {
      recognition.start();
    } catch {
      // InvalidStateError when already started — safe to ignore.
    }
  }, []);

  // Web Speech path (only when MediaRecorder callback is unavailable)
  useEffect(() => {
    if (mode !== "speech-recognition") {
      return;
    }

    const SpeechRecognitionCtor =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const speechRecognition = new SpeechRecognitionCtor();

    speechRecognition.continuous = true;
    speechRecognition.interimResults = true;
    speechRecognition.lang = lang;

    const handleStart = () => {
      setIsListening(true);
    };

    const handleEnd = () => {
      if (wantsListeningRef.current) {
        clearRestartTimer();
        restartTimerRef.current = setTimeout(() => {
          startRecognition();
        }, 150);
        return;
      }
      setIsListening(false);
    };

    const handleResult = (event: Event) => {
      const speechEvent = event as SpeechRecognitionEvent;
      let finalTranscript = "";

      for (
        let i = speechEvent.resultIndex;
        i < speechEvent.results.length;
        i += 1
      ) {
        const result = speechEvent.results[i];
        if (result.isFinal) {
          finalTranscript += result[0]?.transcript ?? "";
        }
      }

      if (finalTranscript) {
        onTranscriptionChangeRef.current?.(finalTranscript);
      }
    };

    const handleError = (event: Event) => {
      const error = (event as SpeechRecognitionErrorEvent).error;

      if (RECOVERABLE_SPEECH_ERRORS.has(error) && wantsListeningRef.current) {
        return;
      }

      wantsListeningRef.current = false;
      clearRestartTimer();
      setIsListening(false);

      if (error === "network" || error === "service-not-allowed") {
        reportError(
          "Browser speech recognition is unavailable here. Provide a transcription service (MediaRecorder + Whisper) instead.",
        );
      } else if (error === "not-allowed") {
        reportError("Microphone permission denied for speech recognition.");
      } else {
        reportError(`Speech recognition error: ${error}`);
      }
    };

    speechRecognition.addEventListener("start", handleStart);
    speechRecognition.addEventListener("end", handleEnd);
    speechRecognition.addEventListener("result", handleResult);
    speechRecognition.addEventListener("error", handleError);

    recognitionRef.current = speechRecognition;
    setIsRecognitionReady(true);

    return () => {
      wantsListeningRef.current = false;
      clearRestartTimer();
      speechRecognition.removeEventListener("start", handleStart);
      speechRecognition.removeEventListener("end", handleEnd);
      speechRecognition.removeEventListener("result", handleResult);
      speechRecognition.removeEventListener("error", handleError);
      try {
        speechRecognition.abort();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
      setIsRecognitionReady(false);
      setIsListening(false);
    };
  }, [mode, lang, clearRestartTimer, startRecognition, reportError]);

  useEffect(
    () => () => {
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      }
      if (streamRef.current) {
        for (const track of streamRef.current.getTracks()) {
          track.stop();
        }
      }
    },
    [],
  );

  const startMediaRecorder = useCallback(async () => {
    if (!onAudioRecordedRef.current) {
      reportError(
        "Recording requires an onAudioRecorded transcription handler.",
      );
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: buildAudioConstraints(audioDeviceIdRef.current),
      });
      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : undefined;

      const mediaRecorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);
      audioChunksRef.current = [];

      const handleDataAvailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      const handleStop = async () => {
        for (const track of stream.getTracks()) {
          track.stop();
        }
        streamRef.current = null;
        mediaRecorderRef.current = null;

        const audioBlob = new Blob(audioChunksRef.current, {
          type: mediaRecorder.mimeType || "audio/webm",
        });
        audioChunksRef.current = [];

        if (audioBlob.size === 0) {
          reportError("No audio captured. Check the selected microphone.");
          return;
        }

        if (!onAudioRecordedRef.current) return;

        setIsProcessing(true);
        try {
          const transcript = await onAudioRecordedRef.current(audioBlob);
          if (transcript) {
            onTranscriptionChangeRef.current?.(transcript);
          } else {
            reportError("Transcription returned empty text.");
          }
        } catch {
          reportError(
            "Transcription failed. Check the voice API and try again.",
          );
        } finally {
          setIsProcessing(false);
        }
      };

      const handleError = () => {
        wantsListeningRef.current = false;
        setIsListening(false);
        reportError("MediaRecorder failed while capturing audio.");
        for (const track of stream.getTracks()) {
          track.stop();
        }
        streamRef.current = null;
      };

      mediaRecorder.addEventListener("dataavailable", handleDataAvailable);
      mediaRecorder.addEventListener("stop", handleStop);
      mediaRecorder.addEventListener("error", handleError);

      mediaRecorderRef.current = mediaRecorder;
      // timeslice keeps data flowing; full blob is still assembled on stop
      mediaRecorder.start(1000);
      wantsListeningRef.current = true;
      setIsListening(true);
      playStartCue();
    } catch (error) {
      wantsListeningRef.current = false;
      setIsListening(false);
      const name = error instanceof Error ? error.name : "";
      reportError(
        name === "NotAllowedError" || name === "SecurityError"
          ? "Microphone access blocked. Allow it in your browser settings."
          : "Could not access the microphone.",
      );
    }
  }, [reportError]);

  const stopMediaRecorder = useCallback(() => {
    wantsListeningRef.current = false;
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state === "recording") {
      recorder.stop();
    }
    setIsListening(false);
  }, []);

  const toggleListening = useCallback(() => {
    if (mode === "media-recorder") {
      if (wantsListeningRef.current || isListening) {
        stopMediaRecorder();
      } else {
        void startMediaRecorder();
      }
      return;
    }

    if (mode === "speech-recognition" && recognitionRef.current) {
      if (wantsListeningRef.current || isListening) {
        wantsListeningRef.current = false;
        clearRestartTimer();
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
        setIsListening(false);
      } else {
        wantsListeningRef.current = true;
        setIsListening(true);
        playStartCue();
        startRecognition();
      }
    }
  }, [
    mode,
    isListening,
    startMediaRecorder,
    stopMediaRecorder,
    startRecognition,
    clearRestartTimer,
  ]);

  const isDisabled =
    Boolean(disabled) ||
    mode === "none" ||
    (mode === "speech-recognition" && !isRecognitionReady) ||
    (mode === "media-recorder" && !onAudioRecorded) ||
    isProcessing;

  return (
    <div className="relative inline-flex items-center justify-center">
      {isListening &&
        [0, 1, 2].map((index) => (
          <div
            className="absolute inset-0 animate-ping rounded-full border-2 border-red-400/30"
            key={index}
            style={{
              animationDelay: `${index * 0.3}s`,
              animationDuration: "2s",
            }}
          />
        ))}

      <Button
        className={cn(
          "relative z-10 rounded-full transition-all duration-300",
          isListening
            ? "bg-destructive text-white hover:bg-destructive/80 hover:text-white"
            : "bg-primary text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground",
          className,
        )}
        disabled={isDisabled}
        aria-pressed={isListening}
        onClick={(event) => {
          onClick?.(event);
          if (event.defaultPrevented) return;
          toggleListening();
        }}
        {...props}
      >
        {isProcessing && <Spinner />}
        {!isProcessing && isListening && <SquareIcon className="size-4" />}
        {!(isProcessing || isListening) && <MicIcon className="size-4" />}
      </Button>
    </div>
  );
};
