import { auth } from "@clerk/nextjs/server";
import { generateText } from "ai";
import {
  getInterviewConcept,
  listInterviews,
  saveReport,
} from "@/server/interview-service";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Not authorized" }, { status: 403 });
  }

  const { conceptId } = (await req.json()) as { conceptId?: string };
  if (!conceptId) {
    return Response.json({ error: "conceptId is required" }, { status: 400 });
  }

  const concept = await getInterviewConcept(conceptId);
  if (!concept) {
    return Response.json({ error: "Interview not found" }, { status: 404 });
  }

  const all = await listInterviews(conceptId);
  const completed = all.filter(
    (interview) =>
      interview.status === "complete" && interview.transcript.length > 0,
  );

  if (completed.length < 2) {
    return Response.json(
      { error: "At least 2 completed interviews are required." },
      { status: 400 },
    );
  }

  const corpus = completed
    .map((interview, index) => {
      const body = interview.transcript
        .map(
          (entry) =>
            `${entry.role === "user" ? "Respondent" : "Interviewer"}: ${entry.text}`,
        )
        .join("\n");
      return `=== Interview ${index + 1} (respondent: ${interview.intervieweeName}) ===\n${body}`;
    })
    .join("\n\n");

  const result = await generateText({
    model: "anthropic/claude-sonnet-4-6",
    system: `You are an organizational psychologist synthesizing multiple 360-degree feedback interviews about one subject. Write in plain text with clear ALL-CAPS section headers (no markdown symbols). Be candid, specific, and balanced. When you quote, use the respondent's actual words in quotation marks, but keep quotes anonymous (do not attribute to a named person). Only use what is present in the transcripts.`,
    prompt: `Subject: ${concept.subjectName}
Number of interviews: ${completed.length}

Produce a synthesized 360 feedback report with these sections:

OVERALL THEMES
The cross-cutting patterns that recur across interviews.

STRENGTHS
What people consistently appreciate. Include 3-5 short verbatim quotes (anonymous, in quotation marks).

DEVELOPMENT AREAS
Candid growth areas and criticisms. Include 3-5 short verbatim quotes (anonymous, in quotation marks).

UNIFIED PERSPECTIVE
A cohesive qualitative narrative of how the interviewees, taken together, think about ${concept.subjectName}.

Interviews:
${corpus}`,
  });

  const report = result.text.trim();
  await saveReport(conceptId, report);

  return Response.json({ report, reportGeneratedAt: new Date().toISOString() });
}
