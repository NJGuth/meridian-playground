import { auth } from "@clerk/nextjs/server";
import { mintOpenAiRealtimeToken } from "@/lib/voice/openai-realtime-token";
import {
  createInterview,
  getInterviewConcept,
  verifyPasscode,
} from "@/server/interview-service";

/**
 * Starts an interview: validates access (authenticated staff OR a correct
 * passcode), creates the interview row, and mints an OpenAI realtime token.
 */
export async function POST(req: Request) {
  const { conceptId, passcode, intervieweeName, voice } =
    (await req.json()) as {
      conceptId?: string;
      passcode?: string;
      intervieweeName?: string;
      voice?: string;
    };

  if (!conceptId) {
    return Response.json({ error: "conceptId is required" }, { status: 400 });
  }

  const concept = await getInterviewConcept(conceptId);
  if (!concept) {
    return Response.json({ error: "Interview not found" }, { status: 404 });
  }

  const { userId } = await auth();
  const isStaff = Boolean(userId);
  if (!isStaff && !verifyPasscode(concept, passcode)) {
    return Response.json({ error: "Invalid passcode" }, { status: 403 });
  }

  if (!intervieweeName?.trim()) {
    return Response.json(
      { error: "Please enter your name" },
      { status: 400 },
    );
  }

  const token = await mintOpenAiRealtimeToken(voice);
  if (!token.ok) {
    return Response.json({ error: token.error }, { status: token.status });
  }

  const interview = await createInterview(conceptId, intervieweeName);

  return Response.json({
    interviewId: interview.id,
    token: token.data.token,
    model: token.data.model,
    voice: token.data.voice,
  });
}
