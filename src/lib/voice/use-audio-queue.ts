"use client";

import { useCallback, useRef, useState } from "react";

export function useAudioQueue() {
  const queueRef = useRef<Blob[]>([]);
  const playingRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const mutedRef = useRef(false);
  const streamStartRef = useRef<number | null>(null);
  const firstAudioStartRef = useRef<number | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [timeToFirstAudio, setTimeToFirstAudio] = useState<number | null>(null);

  const playNext = useCallback(() => {
    if (playingRef.current) return;

    const next = queueRef.current.shift();
    if (!next) {
      setIsPlaying(false);
      return;
    }

    playingRef.current = true;
    setIsPlaying(true);

    const url = URL.createObjectURL(next);
    objectUrlRef.current = url;
    const audio = new Audio(url);
    audioRef.current = audio;
    audio.muted = mutedRef.current;

    // `finish` must run exactly once per element and must NOT set `src = ""`:
    // doing so dispatches an `error` event, and a still-attached handler would
    // then advance the queue against the *next* element, skipping it. So we
    // guard against re-entry, detach listeners, and scope cleanup to this exact
    // element + object URL.
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;

      audio.onended = null;
      audio.onerror = null;
      audio.onplay = null;
      audio.pause();

      if (objectUrlRef.current === url) {
        objectUrlRef.current = null;
      }
      URL.revokeObjectURL(url);

      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      playingRef.current = false;
      playNext();
    };

    audio.onplay = () => {
      if (
        firstAudioStartRef.current === null &&
        streamStartRef.current !== null
      ) {
        firstAudioStartRef.current = Date.now();
        setTimeToFirstAudio(
          firstAudioStartRef.current - streamStartRef.current,
        );
      }
    };

    audio.onended = finish;
    audio.onerror = finish;

    void audio.play().catch(finish);
  }, []);

  const enqueue = useCallback(
    (blob: Blob) => {
      queueRef.current.push(blob);
      playNext();
    },
    [playNext],
  );

  const stop = useCallback(() => {
    queueRef.current = [];

    const audio = audioRef.current;
    if (audio) {
      // Detach before pausing so no late event re-enters the queue.
      audio.onended = null;
      audio.onerror = null;
      audio.onplay = null;
      audio.pause();
      audioRef.current = null;
    }
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }

    playingRef.current = false;
    setIsPlaying(false);
  }, []);

  const resetMetrics = useCallback(() => {
    streamStartRef.current = Date.now();
    firstAudioStartRef.current = null;
    setTimeToFirstAudio(null);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((current) => {
      const next = !current;
      mutedRef.current = next;
      if (audioRef.current) {
        audioRef.current.muted = next;
      }
      return next;
    });
  }, []);

  return {
    enqueue,
    stop,
    isPlaying,
    isMuted,
    toggleMute,
    timeToFirstAudio,
    resetMetrics,
  };
}
