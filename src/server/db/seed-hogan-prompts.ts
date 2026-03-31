import { db } from "./index";
import { prompts } from "./schema";

const hoganPromptsData: {
  content: string;
  positiveExamples: string[];
  negativeExamples: string[];
}[] = [
  {
    content:
      "Help me understand my HPI bright-side profile. What stands out in how others likely see me day to day?",
    positiveExamples: [
      "Your HPI data is percentile-based versus working adults — there is no 'good' or 'bad' profile.\n\n**What's elevated for you:** Your **Inquisitive** score is in the **High** range. People scoring here are often seen as curious, idea-oriented, and interested in the bigger picture — sometimes at the cost of patience with routine implementation. Your **Ambition** is also **High**, which usually shows up as drive, confidence, and willingness to lead — and can edge into forcefulness when stress is high.\n\n**What's lower:** **Prudence** in the **Low** range often reads as flexible and tolerant of ambiguity; the tradeoff can be less structure or follow-through on process when others expect it.\n\nHow much does this match what you've heard back from peers and your manager — especially on the curiosity vs. execution balance?",
    ],
    negativeExamples: [
      "Your HPI scores are mostly average except a few highs and lows. You're doing fine. Just keep leveraging your strengths.",
      "High Inquisitive means you're smart and low Prudence means you're disorganized. You should get better at planning.",
    ],
  },
  {
    content:
      "What are my HDS dark-side derailers, and how might they show up when I'm stressed or not at my best?",
    positiveExamples: [
      "HDS scores describe **performance risks under pressure** — not personality flaws.\n\nFrom your profile, **Imaginative** sits in the **Moderate Risk** band and **Diligent** is **Moderate Risk** as well. That combination can look like creative, idea-rich leadership that becomes **perfectionistic or hard to please** when stakes rise — you may shift between wanting novel angles and tightening control on details.\n\n**Skeptical** in **Low Risk** still matters contextually: even moderate elevation can mean you're more alert to others' motives and slower to trust — useful in some roles, tiring in others.\n\nThe Hogan guide stresses interpreting **patterns**, not single scales. What situations recently left you feeling either 'too scattered' or 'too controlling' — or both in the same week?",
    ],
    negativeExamples: [
      "You have high risk on several HDS scales which is a problem for leadership. You need to fix your dark side before you derail.",
      "HDS means you're unstable. Your Imaginative and Diligent scores show you can't focus.",
    ],
  },
  {
    content:
      "How do my MVPI values influence the kind of leader I am or the environment I try to create?",
    positiveExamples: [
      "MVPI reflects **what you want and value** — not how skilled you are.\n\n**Power** is **High** in your data: leaders with this pattern often strive for impact, results, and influence, and may become frustrated when pace or standards feel low. **Science** is **High** as well — you likely gravitate toward evidence, logic, and understanding how things work; that can complement Power when decisions need justification, but can also clash with intuitive cultures.\n\n**Hedonism** is **Low** — that's not a weakness; it often means less need for 'fun first' environments and more comfort with formality or duty.\n\nWhere do you see Power and Science showing up in how you run meetings, set goals, or push the team?",
    ],
    negativeExamples: [
      "Your MVPI says you care about power and don't care about fun. That makes you a bad people leader.",
      "Values don't matter as much as skills. Focus on your LD12 scores instead.",
    ],
  },
  {
    content:
      "Looking across my HPI, HDS, and MVPI together, what themes or tensions do you see?",
    positiveExamples: [
      "Configural interpretation is where Hogan gets most powerful — triangulating motives, everyday reputation, and stress risks.\n\nOne plausible thread from your pattern: **High Ambition** and **High Power** (MVPI) can create a strong push for outcomes and recognition. Under strain, **Moderate Risk** elevations on **Diligent** and **Imaginative** can show up as alternating **micromanaging detail** and **restless reinvention** — both can be strengths that **over-activate** when you feel outcomes are threatened.\n\nAnother linkage: **Low Prudence** on the HPI can support agility, but paired with **Moderate Risk Diligent** on the HDS, others may experience whiplash between 'go fast and flex' and 'suddenly everything must be perfect.'\n\nHow much does that 'drive + standards oscillation' resonate with your team's experience of you?",
    ],
    negativeExamples: [
      "Your Hogan profile is all over the place. There's no clear story.",
      "Just read each scale one by one: Adjustment, Ambition, Excitable, Recognition...",
    ],
  },
  {
    content:
      "How might my Hogan results relate to my LD12 leadership skill profile?",
    positiveExamples: [
      "These instruments measure different things: LD12 focuses on **leadership competencies**; Hogan focuses on **personality reputation** (HPI/HDS) and **motives** (MVPI). We should connect themes, not equate scores.\n\nExample: **High Inquisitive** on Hogan often aligns with strong **Strategic Thinking** and **Innovation** on LD12 when curiosity translates into visible business judgment — but it can also pair with **lower Execution or Focus** if ideas outpace discipline. Your HDS **Diligent** risk might partially offset that by adding pressure for detail — at the cost of stress.\n\nSimilarly, **High Power** (MVPI) can fuel **Motivating Others** and **Accountability** when channelled well, or can strain **Listening** and **Coaching** if pace overtakes inquiry.\n\nWhich LD12 domain do you want to link first — Leading Self, Others, or Organization — and I'll map the most relevant Hogan scales?",
    ],
    negativeExamples: [
      "Your LD12 and Hogan scores contradict each other so one must be wrong.",
      "Hogan MVPI Power is the same as LD12 Power values dimension — they're identical.",
    ],
  },
  {
    content:
      "I'm preparing to review my Hogan report with my coach. What should I focus on first?",
    positiveExamples: [
      "Start with **orientation**, not scale-by-scale reading: Hogan measures **reputation**, which can differ from identity — that's normal.\n\nPractically, I'd suggest this order:\n1. **MVPI** — clarify what you are motivated to build (e.g., impact, stability, service).\n2. **HPI** — how those motives show up in everyday behavior.\n3. **HDS** — what might trip you up when you're taxed, bored, or less self-monitoring.\n\nThen pick **3–5 salient scales** total, not the full report. From your data, strong candidates might include **Inquisitive**, **Ambition**, **Power**, and the **Diligent + Imaginative** HDS pairing — but you should validate what feels most live in your current role.\n\nWhat's the development outcome you want from the debrief — role transition, team dynamics, or executive presence?",
    ],
    negativeExamples: [
      "Read every scale in order from start to finish and memorize the definitions.",
      "Skip MVPI and go straight to HDS because that's the only important part.",
    ],
  },
];

async function seedHoganPrompts() {
  console.log("Seeding Hogan prompts...");

  await db.insert(prompts).values(hoganPromptsData);

  console.log(`Seeded ${hoganPromptsData.length} Hogan prompts with examples.`);
  process.exit(0);
}

seedHoganPrompts().catch((err) => {
  console.error("Hogan prompt seed failed:", err);
  process.exit(1);
});
