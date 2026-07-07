import {
  getInterviewConcept,
  verifyPasscode,
} from "@/server/interview-service";

export async function POST(req: Request) {
  const { conceptId, passcode } = (await req.json()) as {
    conceptId?: string;
    passcode?: string;
  };

  if (!conceptId) {
    return Response.json({ error: "conceptId is required" }, { status: 400 });
  }

  const concept = await getInterviewConcept(conceptId);
  if (!concept) {
    return Response.json({ error: "Interview not found" }, { status: 404 });
  }

  return Response.json({ ok: verifyPasscode(concept, passcode) });
}
