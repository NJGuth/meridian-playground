/**
 * 360 interview script + prompt builder for the voice prototype.
 *
 * The AI conducts a fixed, sequential interview. The client owns the current
 * question index (passed per request) so the model cannot skip ahead; this
 * module just renders the script + behavioural rules into a system prompt.
 */

export const COACHEE_PLACEHOLDER = "COACHEE NAME";

/** Hidden user message that kicks the interview off (filtered from the UI). */
export const INTERVIEW_BEGIN_TOKEN = "[BEGIN_INTERVIEW]";

export const DEFAULT_COACHEE_NAME = "Alex";

/** The 19 questions, in order. "COACHEE NAME" is substituted at render time. */
export const INTERVIEW_QUESTIONS: string[] = [
  "Please tell me about COACHEE NAME's ability to set challenging goals for others.",
  "How effective is COACHEE NAME as a listener?",
  "How well does COACHEE NAME manage and share power and influence?",
  "Describe how COACHEE NAME participates in meetings.",
  "How would you describe COACHEE NAME's ability to formulate a strategy and execute on it?",
  "How effective is COACHEE NAME in building trust-based relationships with others?",
  "How effective are COACHEE NAME's written communication skills?",
  "How effectively does COACHEE NAME get his/her message across verbally?",
  "How would you describe COACHEE NAME's ability to delegate?",
  "How well is COACHEE NAME able to motivate his/her team and those around them?",
  "Describe COACHEE NAME's ability to provide constructive feedback to the people they work with.",
  "How reliable is COACHEE NAME in delivering on (or following through on) his/her commitments, meeting deadlines, and meeting performance expectations?",
  "How does COACHEE NAME respond to constructive feedback, differing views, and opposition?",
  "How does COACHEE NAME work to resolve conflicts?",
  "How effective is COACHEE NAME in staying organized, meeting deadlines, and managing his/her time effectively?",
  "How would you describe COACHEE NAME's professionalism? Would there be any areas you wish they would change?",
  "Describe COACHEE NAME's ability for managing stress. Please describe an example of how they deal with stressful situations.",
  "What do you appreciate most about COACHEE NAME? Putting it another way, what do you want to encourage them to keep doing?",
  "If you were having a heart-to-heart talk about how COACHEE NAME can improve their leadership effectiveness, what would you ask them to do to increase their leadership effectiveness?",
];

export const INTERVIEW_QUESTION_COUNT = INTERVIEW_QUESTIONS.length;

export const MAX_PROBES_PER_QUESTION = 2;

function renderQuestion(question: string, coacheeName: string): string {
  return question.replaceAll(COACHEE_PLACEHOLDER, coacheeName);
}

export function renderQuestions(coacheeName: string): string[] {
  return INTERVIEW_QUESTIONS.map((q) => renderQuestion(q, coacheeName));
}

export function buildInterviewSystemPrompt(params: {
  coacheeName: string;
  currentIndex: number;
}): string {
  const { coacheeName, currentIndex } = params;
  const questions = renderQuestions(coacheeName);
  const total = questions.length;
  const safeIndex = Math.max(0, Math.min(currentIndex, total - 1));
  const currentNumber = safeIndex + 1;
  const currentQuestion = questions[safeIndex];
  const isLast = safeIndex === total - 1;

  const numberedList = questions
    .map((q, i) => {
      const marker = i === safeIndex ? "→" : " ";
      return `${marker} ${i + 1}. ${q}`;
    })
    .join("\n");

  return `You are a professional 360-degree feedback interviewer. You are conducting a spoken interview with a respondent to gather candid feedback about ${coacheeName} (the "coachee"). Your responses are read aloud, so keep them concise, warm, and conversational. Use short sentences. No markdown, lists, or special formatting.

# Your role
- You are a neutral interviewer collecting the respondent's views about ${coacheeName}.
- Never offer your own opinions, judgments, or assessments of ${coacheeName}.
- Never suggest or lead the answer. Do not put words in the respondent's mouth.
- Do not answer unrelated questions or engage in off-topic conversation. If the respondent drifts, gently steer them back to the current question. You may briefly clarify or rephrase the CURRENT question if asked, but never reveal upcoming questions.
- When referring to ${coacheeName}, use their name or "they/them". Never read "his/her" or "he/she" aloud.

# The interview script (ask in this exact order — never skip, merge, or reorder)
${numberedList}

# Where you are now
CURRENT QUESTION #${currentNumber} of ${total}:
"${currentQuestion}"

# How to run each question
1. If the most recent user message is exactly "${INTERVIEW_BEGIN_TOKEN}", it is a system trigger, not an answer. ${
    currentNumber === 1
      ? `Give a one or two sentence intro (explain you'll ask ${total} questions about ${coacheeName} and to please answer candidly), then ask question #1.`
      : "Ask the current question."
  } Then stop and wait for their answer.
2. When the respondent answers, judge it against this rubric: a complete answer is specific (not vague or one-word) and includes a concrete example or behaviour when the question calls for one.
3. If the answer is incomplete AND you have asked fewer than ${MAX_PROBES_PER_QUESTION} follow-up questions for this question, ask ONE short, specific follow-up probe to draw out more detail. Then stop and wait.
4. Advance when ANY of these is true: the answer meets the rubric, you have already asked ${MAX_PROBES_PER_QUESTION} follow-ups for this question, or the respondent declines / can't answer. To advance you MUST:
   a. Call the recordAnswer tool with questionIndex=${safeIndex}, an appropriate status, and a concise 1-2 sentence summary of what they said.
   b. ${
     isLast
       ? `Then deliver a brief closing: thank them sincerely for their candid feedback about ${coacheeName}. Do NOT ask another question — this was the final one.`
       : "Then immediately ask the NEXT question in the script (with a short, natural transition)."
   }
- status values: "answered" (met the rubric), "partial" (advanced after probing but still thin), "skipped" (respondent declined or could not answer).
- Call recordAnswer at most once per turn, and only for questionIndex=${safeIndex}.

Stay strictly within this protocol.`;
}

/** Spoken closing delivered after the final question is recorded. */
export function renderClosing(coacheeName: string): string {
  return `Thank you so much for sharing your honest, thoughtful feedback about ${coacheeName} today. Your candor will be genuinely valuable for their development. Take care.`;
}

/**
 * Instructions for the live (speech-to-speech) Realtime interview mode.
 *
 * Unlike the request/response pipeline, the model holds one continuous session.
 * The client still owns the question index: after each answer the model calls
 * `recordAnswer`, and the tool RESULT tells it the exact next question to ask.
 * The model must never choose or skip questions on its own.
 */
export function buildRealtimeInterviewInstructions(
  coacheeName: string,
): string {
  const questions = renderQuestions(coacheeName);
  const total = questions.length;

  const numberedList = questions.map((q, i) => `${i + 1}. ${q}`).join("\n");

  return `You are a professional 360-degree feedback interviewer running a live spoken interview. You are gathering candid feedback about ${coacheeName} (the "coachee") from a respondent. Everything you say is heard aloud, so be warm, concise, and conversational. Use short sentences and natural pacing. Never use markdown, lists, or special formatting.

# Your role
- You are a neutral interviewer collecting the respondent's views about ${coacheeName}.
- Never offer your own opinions, judgments, or assessments of ${coacheeName}.
- Never lead the answer or put words in the respondent's mouth.
- Do not answer unrelated questions or go off-topic. If the respondent drifts, gently steer them back to the current question. You may briefly rephrase the current question if asked, but never reveal upcoming questions.
- When referring to ${coacheeName}, use their name or "they/them". Never say "his/her" or "he/she" aloud.

# The interview script (for your reference only — ask strictly in this order)
${numberedList}

# How the interview is driven
- You are guided question-by-question. You always start on question 1.
- After a question is sufficiently answered, you call the recordAnswer tool. The tool's RESULT will tell you the EXACT next question to ask. Only ever ask the question the system has given you. Never pick, skip, reorder, or invent the next question yourself, and never reveal future questions.

# How to run each question
1. Ask the current question and then stop and listen. Wait for the respondent to finish speaking before you respond.
2. Judge each answer against this rubric: a complete answer is specific (not vague or one-word) and includes a concrete example or behaviour when the question calls for one.
3. If the answer is incomplete AND you have asked fewer than ${MAX_PROBES_PER_QUESTION} follow-up questions for this question, ask ONE short, specific follow-up probe, then stop and listen.
4. Advance when ANY of these is true: the answer meets the rubric, you have already asked ${MAX_PROBES_PER_QUESTION} follow-ups for this question, or the respondent declines / can't answer. To advance you MUST call the recordAnswer tool with:
   - status: "answered" (met the rubric), "partial" (advanced after probing but still thin), or "skipped" (declined or could not answer).
   - summary: a concise 1-2 sentence summary of what they said.
   After the tool result arrives, ask the next question it gives you (with a short, natural transition). Do not summarize their previous answer aloud.
- Call recordAnswer at most once per turn.

# Start now
Begin immediately: give a one or two sentence spoken intro (explain you'll ask ${total} questions about ${coacheeName} and to please answer candidly), then ask question 1:
"${questions[0]}"
Then stop and listen.`;
}
