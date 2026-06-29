import { generateText } from "ai";
import { describeMoodState, type SessionOutcome } from "@/lib/voice/concept-dynamics";

type TranscriptEntry = {
  role: "user" | "assistant";
  text: string;
};

type ScorecardRequest = {
  transcript: TranscriptEntry[];
  script?: string;
  persona?: string;
  hiddenAgenda?: string;
  agendaUnlockCondition?: string;
  targetDurationMinutes?: number | null;
  sessionOutcome?: SessionOutcome;
};

export async function POST(req: Request) {
  const body = (await req.json()) as ScorecardRequest;
  const {
    transcript,
    script,
    persona,
    hiddenAgenda,
    agendaUnlockCondition,
    targetDurationMinutes,
    sessionOutcome,
  } = body;

  if (!Array.isArray(transcript) || transcript.length === 0) {
    return Response.json(
      { error: "Transcript is required to generate a summary." },
      { status: 400 },
    );
  }

  const formattedTranscript = transcript
    .map(
      (entry) =>
        `${entry.role === "user" ? "Trainee" : "Persona"}: ${entry.text}`,
    )
    .join("\n\n");

  const goalContext = [
    persona?.trim() ? `Persona: ${persona.trim()}` : null,
    script?.trim() ? `Training scenario / task: ${script.trim()}` : null,
    hiddenAgenda?.trim() ? `Hidden agenda: ${hiddenAgenda.trim()}` : null,
    agendaUnlockCondition?.trim()
      ? `Agenda unlock condition: ${agendaUnlockCondition.trim()}`
      : null,
    targetDurationMinutes
      ? `Target duration: ${targetDurationMinutes} minutes`
      : null,
  ]
    .filter(Boolean)
    .join("\n");

  const outcomeContext = sessionOutcome
    ? [
        `Walked out: ${sessionOutcome.walkedOut ? "yes" : "no"}`,
        `Hidden agenda revealed: ${sessionOutcome.agendaRevealed ? "yes" : "no"}`,
        `Ending mood: ${describeMoodState(sessionOutcome.endingMood)}`,
      ].join("\n")
    : "";

  const result = await generateText({
    model: "anthropic/claude-sonnet-4-6",
    system: `You evaluate simulated voice training conversations. The "Trainee" is the person being coached; the "Persona" is the AI role-play character. Write in plain text — no markdown. Be direct and specific.`,
    prompt: `${goalContext ? `${goalContext}\n\n` : ""}${outcomeContext ? `Session outcome:\n${outcomeContext}\n\n` : ""}Transcript:\n${formattedTranscript}

Provide a training scorecard with these sections:

SUMMARY
2-4 sentences on what happened.

PERSONA STATE
How the persona ended (mood, walked out?, agenda revealed?).

SCORES (rate each 1-5 with one sentence rationale)
- De-escalation / rapport
- Hidden agenda surfaced (N/A if none configured)
- Time management
- Goal achievement

OVERALL
2-3 sentences on what the trainee did well and one priority improvement.`,
  });

  return Response.json({ summary: result.text });
}
