import { auth } from "@clerk/nextjs/server";
import { generateText } from "ai";
import type { TranscriptEntry } from "@/lib/voice/transcript";
import {
  completeInterview,
  getInterviewConcept,
  verifyPasscode,
} from "@/server/interview-service";

export async function POST(req: Request) {
  const { conceptId, passcode, interviewId, transcript } =
    (await req.json()) as {
      conceptId?: string;
      passcode?: string;
      interviewId?: string;
      transcript?: TranscriptEntry[];
    };

  if (!conceptId || !interviewId) {
    return Response.json(
      { error: "conceptId and interviewId are required" },
      { status: 400 },
    );
  }

  const concept = await getInterviewConcept(conceptId);
  if (!concept) {
    return Response.json({ error: "Interview not found" }, { status: 404 });
  }

  const { userId } = await auth();
  if (!userId && !verifyPasscode(concept, passcode)) {
    return Response.json({ error: "Not authorized" }, { status: 403 });
  }

  const entries = Array.isArray(transcript) ? transcript : [];

  let summary = "";
  if (entries.length > 0) {
    const formatted = entries
      .map(
        (entry) =>
          `${entry.role === "user" ? "Respondent" : "Interviewer"}: ${entry.text}`,
      )
      .join("\n\n");

    try {
      const result = await generateText({
        model: "anthropic/claude-sonnet-4-6",
        system:
          "You summarize a 360-degree feedback interview for the respondent who just completed it. Write in warm, plain text (no markdown). Be concise and second-person (\"you\").",
        prompt: `The respondent gave spoken feedback about ${concept.subjectName}. Summarize the conversation in 3-5 sentences: the main points they raised, the strengths they highlighted, and any development areas they mentioned. Do not invent anything not in the transcript.\n\nTranscript:\n${formatted}`,
      });
      summary = result.text.trim();
    } catch {
      summary = "";
    }
  }

  await completeInterview(interviewId, entries, summary);

  return Response.json({ summary });
}
