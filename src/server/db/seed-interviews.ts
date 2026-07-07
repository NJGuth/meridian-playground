import { and, eq, inArray } from "drizzle-orm";
import { db } from "./index";
import { interviewConcepts, interviews } from "./schema";
import { renderQuestions } from "@/lib/voice/interview-script";

/**
 * Seeds three completed example interviews (positive, negative, mixed) so the
 * cross-interview report can be tested without recording live voice sessions.
 * Idempotent: the three example rows are replaced on every run.
 */

type Persona = {
  name: string;
  summary: string;
  /** One answer per interview-script question, in order. */
  answers: string[];
};

const OPENING =
  "Hi, thanks for taking the time today. I'll ask you a series of questions about how you experience working with them. Please be candid — there are no wrong answers.";

const CLOSING =
  "Thank you so much for sharing your honest, thoughtful feedback today. Take care.";

// POSITIVE — consistently strong, warm and specific praise.
const positive: Persona = {
  name: "Priya Nair",
  summary:
    "Overwhelmingly positive. Highlights clarity of vision, genuine listening, and reliability, with only minor growth notes around delegation.",
  answers: [
    "They're excellent at it — they set goals that stretch you but always feel achievable, and they frame them so you understand the why. I've grown more under them than any other leader.",
    "One of the best listeners I've worked with. They put the phone down, make eye contact, and actually reflect back what you said before responding.",
    "Really generously. They share credit publicly and hand real decision-making authority to the team rather than hoarding it.",
    "They come prepared, keep meetings tight, and make sure quieter voices get pulled in. People leave meetings clear on next steps.",
    "Very strong. They can zoom out to a two-year vision and then break it into quarterly moves the team can actually execute.",
    "Trust is their superpower. They follow through on what they say, so people extend them the benefit of the doubt.",
    "Crisp and thoughtful. Their written updates are the ones I actually read start to finish.",
    "Clear and warm. They can explain a complex trade-off to executives and to interns in the same meeting and both walk away understanding it.",
    "They delegate well and pair it with support — they hand over ownership but stay available if you hit a wall.",
    "Genuinely inspiring. People want to do their best work for them because they make you feel your work matters.",
    "They give feedback kindly and directly, always tied to a specific example and a path forward. It never feels like an attack.",
    "Rock solid. If they commit to a date, it happens. I can't remember them missing a deadline.",
    "They welcome pushback — they'll say 'tell me where I'm wrong' and mean it. Differing views make the plan better with them.",
    "They surface tension early and get people talking directly rather than letting it fester. Conflicts get smaller, not bigger.",
    "Extremely organized. Their calendar and priorities are transparent, so you always know where you stand.",
    "Very professional and consistent. Honestly I'd struggle to name something I'd want them to change.",
    "Calm under pressure. During our outage last year they kept everyone steady, triaged clearly, and thanked the team afterward.",
    "Keep being so consistent and human — the way they combine high standards with real care is rare. Don't lose that.",
    "I'd just nudge them to delegate the last 10% they still hold onto, so they can scale their impact even further.",
  ],
};

// NEGATIVE — consistently critical, candid frustration with specifics.
const negative: Persona = {
  name: "Marcus Devlin",
  summary:
    "Largely critical. Recurring themes: poor listening, missed commitments, credit-taking, and defensiveness when challenged.",
  answers: [
    "Honestly the goals feel arbitrary and keep shifting. You'll hit a target and then be told it was the wrong one all along.",
    "This is a real weak spot. They interrupt constantly and you can tell they're just waiting for their turn to talk.",
    "They hold onto control tightly. Decisions route through them and they take the credit when things go well.",
    "Meetings run long and unfocused, and a couple of loud voices dominate while everyone else checks out.",
    "There's a vision in the abstract but execution falls apart — priorities change week to week with no follow-through.",
    "Trust is thin. People are guarded around them because you're never sure the story will stay consistent.",
    "Their written updates are vague and last-minute, so half the team is working off different assumptions.",
    "Verbally they ramble and bury the point. I often leave more confused than when I walked in.",
    "They don't really delegate — they either micromanage the details or dump something with no context and disappear.",
    "Morale is low. It's hard to feel motivated when effort goes unacknowledged and the goalposts keep moving.",
    "Feedback tends to come late, in front of others, and focused on blame rather than how to improve.",
    "This is the biggest issue — commitments slip regularly and deadlines get quietly renegotiated after the fact.",
    "Not well. Push back on an idea and you get defensiveness, or you're subtly frozen out of the next conversation.",
    "They tend to avoid conflict until it explodes, then it becomes personal instead of being solved.",
    "Disorganized. Things fall through the cracks and you're often reminding them of their own commitments.",
    "I'd want more follow-through and less taking credit for the team's work — that's what erodes professionalism here.",
    "Under stress they get short-tempered and it spreads. During the Q3 crunch they snapped at people in a review and it stuck with the team.",
    "The one thing worth keeping is their technical knowledge — when they focus on the actual problem they're sharp.",
    "I'd ask them to actually listen, own their commitments, and give the team credit. Those three would change everything.",
  ],
};

// MIXED — genuine strengths and genuine weaknesses.
const mixed: Persona = {
  name: "Elena Voss",
  summary:
    "Balanced. Strong strategic thinker and motivator, but let down by inconsistent listening, shaky reliability, and defensiveness under stress.",
  answers: [
    "They set ambitious goals and that energizes the team — though sometimes they're a stretch too far without enough support to get there.",
    "It varies. In one-on-ones they listen well, but in group settings they tend to talk over people.",
    "They've gotten better at sharing decisions, but there are still areas they won't let go of.",
    "Meetings are high-energy and idea-rich, but they can run over and don't always end with clear owners.",
    "Strategy is a genuine strength — they see around corners. Execution is more hit-or-miss.",
    "With people they know well, trust is strong; newer team members find them harder to read.",
    "Their writing is good when they invest the time, but rushed updates can be confusing.",
    "When prepared they're compelling; off the cuff they can lose the thread.",
    "They delegate the big things well but hold onto smaller details they should let go of.",
    "They're a strong motivator — genuinely inspiring in the good moments — but it dips when they're stressed.",
    "Their feedback is useful and specific, though the delivery can be blunt depending on their mood.",
    "Reliability is inconsistent — they hit the ones they care about but let smaller commitments slip.",
    "They say they want dissent, and often they do, but under pressure they can get defensive.",
    "They handle low-grade conflict well; bigger clashes they sometimes avoid until it's overdue.",
    "Organization is a work in progress — big-picture tracking is good, day-to-day follow-up less so.",
    "Mostly professional; I'd want more consistency so people know which version they'll get on a given day.",
    "Stress is where the cracks show — they can get curt, though they usually circle back and apologize.",
    "Keep the vision and the way you lift people up when things are going well — that's genuinely special.",
    "I'd ask them to be more consistent under pressure and to close the loop on the smaller commitments.",
  ],
};

function buildTranscript(subjectName: string, persona: Persona) {
  const questions = renderQuestions(subjectName);
  const entries: { id: string; role: "user" | "assistant"; text: string }[] = [
    { id: "intro", role: "assistant", text: OPENING },
  ];

  questions.forEach((question, index) => {
    entries.push({ id: `q${index}`, role: "assistant", text: question });
    const answer = persona.answers[index] ?? "I don't have much to add there.";
    entries.push({ id: `a${index}`, role: "user", text: answer });
  });

  entries.push({ id: "closing", role: "assistant", text: CLOSING });
  return entries;
}

async function seedInterviews() {
  console.log("Seeding example interviews...");

  // Reuse the single interview concept, creating it if needed.
  let [concept] = await db
    .select()
    .from(interviewConcepts)
    .orderBy(interviewConcepts.createdAt)
    .limit(1);

  if (!concept) {
    [concept] = await db
      .insert(interviewConcepts)
      .values({
        title: "360 Interview",
        subjectName: "Nicholas Guthrie",
        passcode: Math.floor(100000 + Math.random() * 900000).toString(),
        introText:
          "You'll be giving candid, confidential feedback about Nicholas Guthrie. A voice assistant will ask you a series of questions — just answer out loud and naturally. Plan for about 15-20 minutes.",
      })
      .returning();
    console.log(`Created interview concept (passcode ${concept.passcode}).`);
  }

  const personas = [positive, negative, mixed];
  const names = personas.map((p) => p.name);

  // Idempotent: remove any prior example rows before re-inserting.
  const removed = await db
    .delete(interviews)
    .where(
      and(
        eq(interviews.conceptId, concept.id),
        inArray(interviews.intervieweeName, names),
      ),
    )
    .returning();
  if (removed.length > 0) {
    console.log(`Removed ${removed.length} existing example interview(s).`);
  }

  const now = new Date();
  await db.insert(interviews).values(
    personas.map((persona) => ({
      conceptId: concept.id,
      intervieweeName: persona.name,
      status: "complete",
      transcript: buildTranscript(concept.subjectName, persona),
      summary: persona.summary,
      completedAt: now,
    })),
  );

  console.log(
    `Seeded ${personas.length} example interviews about ${concept.subjectName}: ${names.join(", ")}.`,
  );
  process.exit(0);
}

seedInterviews().catch((err) => {
  console.error("Interview seed failed:", err);
  process.exit(1);
});
