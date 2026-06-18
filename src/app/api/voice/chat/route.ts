import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  tool,
  type UIMessage,
} from "ai";
import { z } from "zod";
import {
  buildInterviewSystemPrompt,
  INTERVIEW_QUESTION_COUNT,
} from "@/lib/voice/interview-script";

const SYSTEM_PROMPT = `You are a helpful voice assistant prototype. Keep responses concise and conversational — they will be spoken aloud. Use short sentences. Avoid markdown, bullet lists, code blocks, and special formatting.`;

type InterviewParams = {
  coacheeName?: string;
  currentIndex?: number;
};

export async function POST(req: Request) {
  const {
    messages,
    interview,
  }: { messages: UIMessage[]; interview?: InterviewParams } = await req.json();

  const modelMessages = await convertToModelMessages(messages);

  if (interview) {
    const coacheeName = interview.coacheeName?.trim() || "the coachee";
    const currentIndex = Math.max(
      0,
      Math.min(interview.currentIndex ?? 0, INTERVIEW_QUESTION_COUNT - 1),
    );

    const result = streamText({
      model: "anthropic/claude-sonnet-4-6",
      system: buildInterviewSystemPrompt({ coacheeName, currentIndex }),
      messages: modelMessages,
      tools: {
        recordAnswer: tool({
          description:
            "Record the respondent's answer to the CURRENT question and advance the interview. Call exactly once when you are ready to move on.",
          inputSchema: z.object({
            questionIndex: z
              .number()
              .int()
              .describe(
                "0-based index of the question being recorded. Must equal the current question index.",
              ),
            status: z
              .enum(["answered", "partial", "skipped"])
              .describe(
                "answered = met the rubric; partial = advanced after probing but still thin; skipped = respondent declined or could not answer.",
              ),
            summary: z
              .string()
              .describe(
                "A concise 1-2 sentence summary of what the respondent said.",
              ),
          }),
          execute: async () => ({ ok: true }),
        }),
      },
      stopWhen: stepCountIs(3),
    });

    return result.toUIMessageStreamResponse();
  }

  const result = streamText({
    model: "anthropic/claude-sonnet-4-6",
    system: SYSTEM_PROMPT,
    messages: modelMessages,
  });

  return result.toUIMessageStreamResponse();
}
