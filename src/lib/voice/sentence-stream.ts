// A sentence boundary is one or more terminal punctuation marks ([.!?])
// immediately followed by whitespace. Requiring trailing whitespace means we
// only split when a sentence is provably complete, so decimals (3.5),
// abbreviations (U.S.) and clusters (?! ...) don't trigger a premature split.
const SENTENCE_BOUNDARY = /[.!?]+(?=\s)/g;

export function extractNewSentences(
  fullText: string,
  processedLength: number,
): { sentences: string[]; newProcessedLength: number } {
  const chunk = fullText.slice(processedLength);
  if (!chunk) {
    return { sentences: [], newProcessedLength: processedLength };
  }

  const sentences: string[] = [];
  // Index within `chunk` up to which text has been emitted. Sentences are
  // contiguous slices [lastBoundary, end), so no characters are ever skipped
  // and newProcessedLength never advances past un-emitted text.
  let lastBoundary = 0;

  SENTENCE_BOUNDARY.lastIndex = 0;
  let match: RegExpExecArray | null = SENTENCE_BOUNDARY.exec(chunk);
  while (match !== null) {
    const end = match.index + match[0].length;
    const sentence = chunk.slice(lastBoundary, end).trim();
    if (sentence) {
      sentences.push(sentence);
    }
    lastBoundary = end;
    match = SENTENCE_BOUNDARY.exec(chunk);
  }

  return {
    sentences,
    newProcessedLength: processedLength + lastBoundary,
  };
}

export function extractFinalRemainder(
  fullText: string,
  processedLength: number,
): string | null {
  const remainder = fullText.slice(processedLength).trim();
  return remainder.length > 0 ? remainder : null;
}

export function getMessageText(parts: Array<{ type: string; text?: string }>) {
  return parts
    .filter((part) => part.type === "text")
    .map((part) => part.text ?? "")
    .join("");
}
