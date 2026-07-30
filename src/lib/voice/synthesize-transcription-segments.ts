import type { Experimental_TranscriptionResult as TranscriptionResult } from "ai";

type TranscriptionSegment = TranscriptionResult["segments"][number];

/**
 * Build proportional segment timings from plain text + audio duration.
 * Good enough for demo karaoke highlighting; not word-accurate.
 */
export function synthesizeTranscriptionSegments(
  text: string,
  durationSeconds: number,
): TranscriptionSegment[] {
  const trimmed = text.trim();
  if (!trimmed || durationSeconds <= 0) return [];

  const parts = trimmed
    .match(/[^.!?]+[.!?]+(?:\s+|$)|[^.!?]+$/g)
    ?.map((part) => part.trim()) ?? [trimmed];

  const clauses = parts.filter(Boolean);
  if (clauses.length === 0) return [];

  const totalChars = clauses.reduce((sum, part) => sum + part.length, 0);
  let cursor = 0;

  return clauses.map((clause) => {
    const share = clause.length / totalChars;
    const startSecond = cursor;
    const endSecond = Math.min(
      durationSeconds,
      cursor + share * durationSeconds,
    );
    cursor = endSecond;

    return {
      text: clause,
      startSecond,
      endSecond: endSecond === startSecond ? startSecond + 0.05 : endSecond,
    };
  });
}
