import type { RealtimeItem } from "@openai/agents/realtime";

export type TranscriptEntry = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

/**
 * Flattens an OpenAI Realtime history into an ordered list of user/assistant
 * transcript entries. Shared by the concept and interview realtime engines.
 */
export function extractTranscript(history: RealtimeItem[]): TranscriptEntry[] {
  const entries: TranscriptEntry[] = [];

  for (const item of history) {
    if (item.type !== "message") continue;

    if (item.role === "user") {
      const textParts: string[] = [];
      for (const content of item.content) {
        if (content.type === "input_text" && content.text.trim()) {
          if (content.text.startsWith("[SYSTEM TIME CUE:")) continue;
          textParts.push(content.text.trim());
        }
        if (content.type === "input_audio" && content.transcript?.trim()) {
          textParts.push(content.transcript.trim());
        }
      }
      const text = textParts.join(" ").trim();
      if (text) {
        entries.push({ id: item.itemId, role: "user", text });
      }
    }

    if (item.role === "assistant") {
      const textParts: string[] = [];
      for (const content of item.content) {
        if (content.type === "output_text" && content.text.trim()) {
          textParts.push(content.text.trim());
        }
        if (content.type === "output_audio" && content.transcript?.trim()) {
          textParts.push(content.transcript.trim());
        }
      }
      const text = textParts.join(" ").trim();
      if (text) {
        entries.push({ id: item.itemId, role: "assistant", text });
      }
    }
  }

  return entries;
}
