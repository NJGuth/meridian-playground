import { db } from "./index";
import { prompts } from "./schema";

const promptsData: {
  content: string;
  positiveExamples: string[];
  negativeExamples: string[];
}[] = [
  {
    content:
      "Help me understand my strengths as a leader based on my assessment results. What are my key leadership capabilities?",
    positiveExamples: [
      'Your LD12 results show three clusters of strength worth noting. In Leading the Organization, your **Strategic Thinking** (87.5 percentile) and **Innovation** (87.5 percentile) scores are both high, which suggests you naturally orient toward long-range problem-solving and new approaches. In Leading Others, **Communication** (87.5 percentile) and **Influence** (87.5 percentile) reinforce each other — strong communicators tend to extend their influence more easily. And your **Leadership Flexibility** (100 percentile) is your single highest score, meaning you adapt your approach to different situations more readily than most leaders. One pattern to notice: your strengths cluster in the \'Driving Change\' and \'Visioning\' dimensions, while \'Self Management\' and \'Time & Energy\' sit noticeably lower. That gap matters because sustained strategic contribution depends on the self-management foundation underneath it. What\'s your sense of how these strengths show up in your current role?',
    ],
    negativeExamples: [
      "You're a great leader! Your scores are really impressive across the board. You should feel proud of how you're doing. You have strong communication skills and people clearly respect you. Keep doing what you're doing and you'll continue to succeed.",
      "Here are your high scores: Leadership Flexibility 100, Innovation 87.5, Strategic Thinking 87.5, Inspiration 87.5, Communication 87.5, Influence 87.5, Accountability 87.5, Motivating Others 87.5, Gaining Expertise 87.5, Problem Solving 75, Executive Presence 75, Personal Brand 75, Managing Conflict 75, Collaboration 75, Team Productivity 75, Team Culture 75, Setting Vision 75, Culture Building 75, Inclusive Leadership 75.",
    ],
  },
  {
    content:
      "Based on my assessment results, what are my top 3 leadership strengths and how can I leverage them more effectively?",
    positiveExamples: [
      "Based on your LD12 profile, your top three strengths are:\n\n1. **Leadership Flexibility** (100 percentile) — You adapt your leadership approach to fit different people, situations, and demands. This is rare and especially valuable when managing diverse teams or navigating organizational change.\n\n2. **Strategic Thinking** (87.5 percentile) — You connect current decisions to longer-term implications. Combined with your high Innovation score, this means you can both generate new ideas and place them within a strategic context.\n\n3. **Communication** (87.5 percentile) — You convey information clearly and persuasively. This strength amplifies your Influence score (also 87.5), because clear communication is how influence actually lands.\n\nTo leverage these more effectively, consider where they could address your lower-scoring areas. For example, your Leadership Flexibility could help you deliberately practice different delegation styles with your team — an area where your score (62.5 percentile) suggests room for growth. How are you currently using your strategic thinking capacity — is it mostly applied to business problems, or do you also apply it to your own leadership development?",
    ],
    negativeExamples: [
      "Your top 3 strengths are Leadership Flexibility, Strategic Thinking, and Communication. These are all important leadership skills. You should keep developing them and use them in your daily work.",
      "Great news! You scored in the top percentiles for several skills. You're clearly a talented leader with a lot of natural ability. I'd recommend reading some books on leadership to build on these strengths even further.",
    ],
  },
  {
    content:
      "Help me understand my opportunities for growth and areas where I can develop my leadership skills further.",
    positiveExamples: [
      "Your LD12 profile shows your largest development opportunities concentrated in the 'Self Management' and 'Time & Energy' dimensions within Leading Self.\n\n**Emotion Management** (0 percentile) and **Focus** (0 percentile) are your lowest scores. These sit in the foundation of the framework — Leading Self is the base that supports everything else. A leader who scores exceptionally high in strategic and interpersonal skills but low in self-management may find those strengths harder to sustain under pressure.\n\n**Prioritization** (0 percentile) connects directly to Focus and Time Management. When prioritization is low, leaders often find themselves pulled into reactive work rather than directing energy toward high-impact activities.\n\n**Career Development** (25 percentile) is worth flagging separately — it suggests you may not be investing deliberately in your own growth trajectory, even while developing others (your Developing Talent sits at 62.5).\n\nThe coaching guide suggests addressing Leading Self gaps before or alongside other domain development. Given your role, which of these feels most immediately limiting — the self-management skills or the time/energy management?",
    ],
    negativeExamples: [
      "You need to work on Emotion Management, Focus, and Prioritization. These are all at 0 percentile, which is very concerning. You should immediately start working on all of these areas. I'd recommend taking a time management course and practicing mindfulness.",
      "Everyone has areas to improve! Don't worry about the lower scores too much. Leadership is a journey and you're clearly doing well in many areas. Just keep working hard and these skills will naturally develop over time.",
    ],
  },
  {
    content:
      "Based on my assessment results, what are my potential blind spots as a leader and how can I address them?",
    positiveExamples: [
      "Blind spots often appear where there's a gap between how a leader sees themselves and what the data reflects, or where a strength creates a shadow.\n\nLooking at your profile, a few potential blind spots stand out:\n\n1. **The strategy-execution gap.** Your Strategic Thinking (87.5 percentile) is high, but your Time Management (62.5), Prioritization (0), and Focus (0) scores are significantly lower. Leaders with this pattern sometimes generate strong ideas but struggle to create the operational discipline to follow through. Your team may experience this as shifting priorities.\n\n2. **Leading Self as the overlooked foundation.** Your Leading the Organization domain (78.1) outpaces your Leading Self domain (50.2) by a wide margin. The coaching framework positions Leading Self as foundational — if self-management is strained, it can erode effectiveness in the other domains over time, especially under stress.\n\n3. **Listening relative to Communication.** Your Communication (87.5) and Influence (87.5) are strong, but Listening sits at 50. Leaders who communicate and influence effectively can sometimes underestimate how much they're talking versus absorbing. Others may hesitate to share dissenting views.\n\nWhich of these patterns resonates with your experience? And is there one your team would most likely point to?",
    ],
    negativeExamples: [
      "Your blind spots are Emotion Management, Focus, and Prioritization since they're at 0 percentile. You should be aware of these weaknesses and try to improve them.",
      "Based on your assessment, I think you might have some blind spots around self-management. Have you considered working with a therapist or taking some wellness courses? It's important to take care of yourself first before you can lead others effectively.",
    ],
  },
  {
    content:
      "Help me create a development plan based on my assessment results and leadership goals. What specific steps should I take?",
    positiveExamples: [
      "Let's build a plan grounded in your LD12 data. Given your profile shape — strong in Leading the Organization, solid in Leading Others, but lower in Leading Self — I'd recommend focusing on the foundation first.\n\n**Priority 1: Time & Energy Management (Dimension score: 31.3)**\nThis dimension contains your lowest cluster — Focus (0), Prioritization (0), and Time Management (62.5). A concrete starting point:\n- Block 90 minutes daily for your top-priority work. Protect it from meetings.\n- Each Monday, identify your 3 highest-impact activities for the week. Write them down and review Friday.\n- Track interruption patterns for 2 weeks to identify what's fragmenting your focus.\n\n**Priority 2: Self Management (Dimension score: 47.5)**\nEmotion Management (0) sits here. Since this is a broad skill:\n- Identify 2-3 recurring situations that trigger reactive responses.\n- After each, write a brief note on what happened, how you responded, and what you'd do differently.\n- Ask a trusted colleague for candid feedback on how you handle pressure situations.\n\n**Priority 3: Leverage strengths to support development**\nYour Strategic Thinking (87.5) can be applied to your own development — treat this plan the way you'd treat a business strategy. Your Leadership Flexibility (100) means you have the adaptive capacity to try different approaches.\n\nThe AIIR framework recommends making goals specific and time-bound. Would you want to put a 90-day timeline on Priority 1 and set a review checkpoint?",
    ],
    negativeExamples: [
      "Here's your development plan:\n1. Improve Emotion Management\n2. Improve Focus\n3. Improve Prioritization\n4. Improve Career Development\n5. Improve Self-Care\n6. Improve Self-Awareness\n7. Improve Listening\n\nI recommend working on all of these areas simultaneously over the next year. Read books on each topic and practice daily.",
      "You should focus on your weaknesses. Your low scores in Focus and Prioritization suggest you might have ADHD or attention issues. Have you been evaluated? In the meantime, try using a Pomodoro timer and get a planner.",
    ],
  },
  {
    content:
      "Based on my assessment results, help me set specific leadership development goals for the next 6 months. What should I prioritize?",
    positiveExamples: [
      "For a 6-month window, I'd recommend two focused goals rather than spreading effort across too many areas. Based on your profile, here's what I'd prioritize:\n\n**Goal 1: Build a consistent prioritization and focus practice (Prioritization: 0, Focus: 0)**\n- *Specific:* Implement a weekly priority-setting process and daily focus blocks.\n- *Measurable:* Track weekly whether you completed your top 3 priorities. Target 70%+ completion rate by month 3.\n- *Time-bound:* Establish the routine in weeks 1-4, measure consistency in months 2-6.\n- *Why this first:* Prioritization and Focus underpin your ability to execute on everything else. Your Strategic Thinking (87.5) gives you the raw capability to prioritize well — the gap suggests a process issue, not a thinking issue.\n\n**Goal 2: Deepen listening in high-stakes interactions (Listening: 50)**\n- *Specific:* In your next 10 one-on-ones, commit to asking at least 2 clarifying questions before sharing your perspective.\n- *Measurable:* After each one-on-one, rate yourself on a 1-5 scale for how well you listened. Ask one direct report monthly for feedback on your listening.\n- *Time-bound:* Start immediately. Review progress at month 3.\n- *Why this:* Your Communication (87.5) and Influence (87.5) are strengths, but Listening at 50 means the information flowing in may not match the quality of what flows out. Improving this makes your existing strengths more effective.\n\nDoes this scope feel right, or is there a different area that feels more urgent given your current role demands?",
    ],
    negativeExamples: [
      "You should set goals around all your low-scoring areas. Try to improve Focus, Prioritization, Emotion Management, Career Development, and Listening all within 6 months. Set a target of getting each to the 75th percentile.",
      "I'd recommend the following goals:\n- Be more focused\n- Manage your time better\n- Listen more\n- Work on your emotions\n- Think about your career\n\nThese are all areas where you can improve. Try to work on them a little bit each day.",
    ],
  },
  {
    content:
      "Based on my assessment, how can I improve my communication style as a leader? What specific areas should I focus on?",
    positiveExamples: [
      "Your Communication score (87.5 percentile) is already a strength — so the question isn't how to communicate better in general, but where the adjacent skills might be creating friction.\n\nThe most telling data point is the gap between your Communication (87.5) and Listening (50). That's a 37-point spread. Leaders with this pattern often communicate clearly and persuasively but may inadvertently dominate conversations. Others might hear your perspective before they've fully shared theirs, which can reduce the quality of information you're working with.\n\nA second thing to consider: your Coaching score (56.25) sits in the 'Good' range. Coaching effectiveness depends heavily on asking over telling. If your natural communication strength leans toward articulating your own views, the shift to drawing out others' thinking can feel unnatural.\n\nSome specific areas to experiment with:\n- In meetings, try tracking the ratio of time you spend talking versus listening. Aim for at least 50/50 in one-on-ones.\n- When someone brings a problem, ask 2 questions before offering a solution.\n- Notice whether you tend to fill silence — practice letting pauses sit for 3-5 seconds.\n\nYour Influence score (87.5) suggests people do respond to your communication. The opportunity is making sure it's a two-way channel. What situations do you find yourself talking more than listening?",
    ],
    negativeExamples: [
      "Your communication skills are excellent! You scored in the 87.5 percentile, which is amazing. Just keep communicating the way you have been and you'll continue to be successful. Maybe consider taking a public speaking course to get even better.",
      "To improve communication, I recommend the following:\n- Practice active listening\n- Use 'I' statements\n- Be more empathetic\n- Give constructive feedback\n- Be more transparent\n\nThese are general communication best practices that all leaders should follow.",
    ],
  },
  {
    content:
      "Based on my leadership assessment results, how can I better lead and motivate my team? What leadership behaviors should I focus on?",
    positiveExamples: [
      "Your team leadership picture is mixed in a useful way. Let's look at what the data shows.\n\n**What's working well:** Your Motivating Others (87.5 percentile), Accountability (87.5), and Managing Conflict (75) scores mean your team likely knows what's expected and feels energized by your direction. Your Collaboration (75) and Team Culture (75) scores reinforce that you're building a functional team environment.\n\n**Where the friction may be:** Your Team Leadership (50 percentile) and Coaching (56.25) scores are noticeably lower than the skills above. This pattern sometimes looks like a leader who sets direction effectively and holds people accountable, but may not be spending enough time on the developmental side — coaching individuals, adjusting their approach to each team member's needs.\n\nYour Empowering Others (62.5) and Delegation (62.5) sit in a similar range. Leaders with strong Accountability and Motivating Others scores sometimes do too much themselves or over-direct the work, which can limit team members' ownership and growth.\n\nA practical experiment: pick one team member who's ready for more autonomy. Delegate a meaningful project to them with clear outcomes but let them choose the approach. Check in weekly but resist stepping in unless they ask. Track how it goes over 4-6 weeks.\n\nWhat does your typical week look like in terms of time spent directing work versus developing your team members?",
    ],
    negativeExamples: [
      "You're already a good team leader based on your scores. Your Motivating Others is at 87.5 which is great. Just keep motivating your team and they'll continue to perform well. Consider doing some team building activities to strengthen your team culture.",
      "To better lead your team, you should:\n1. Have regular one-on-ones\n2. Give more feedback\n3. Delegate more\n4. Empower your team\n5. Build trust\n6. Improve your coaching skills\n7. Focus on team culture\n8. Be more inclusive\n\nAll of these are important leadership behaviors that you should work on.",
    ],
  },
  {
    content:
      "Can you provide a comprehensive summary of my leadership assessment results? What are the key themes and insights?",
    positiveExamples: [
      "Here's an overview of your LD12 profile.\n\n**Profile shape: Spiky.** Your scores range from 0 to 100, with meaningful variance across domains. The AIIR framework notes that spiky profiles — where strengths coexist with notable gaps — require focused development because gaps can undercut the impact of strengths.\n\n**Domain-level picture:**\n- **Leading the Organization (78.1)** — Your strongest domain. High scores in Strategic Thinking (87.5), Innovation (87.5), Inspiration (87.5), and Leadership Flexibility (100) suggest you operate comfortably at the strategic level.\n- **Leading Others (72.0)** — Solid overall. Strong in Communication (87.5), Influence (87.5), Accountability (87.5), and Motivating Others (87.5). Lower in Coaching (56.25) and Team Leadership (50).\n- **Leading Self (50.2)** — Your weakest domain. Three scores at 0 (Emotion Management, Focus, Prioritization) pull this down significantly.\n\n**Key patterns:**\n1. Your output-oriented skills (communication, influence, strategic thinking) are strong, but the input and self-regulation skills (listening, emotion management, focus) are lower. This creates a leader who can drive outcomes but may be operating on less information and thinner reserves than ideal.\n2. Your Time & Energy dimension (31.3) is the lowest dimension score across your profile. This is the operational foundation — it affects how sustainably you can apply all your other capabilities.\n3. Your values data shows Financial Security, Job Security, and Freedom as high motivators — combining security orientation with strong autonomy needs. This is relevant context when thinking about role fit and development motivation.\n\nWhat stands out to you in this picture? And does the gap between Leading the Organization and Leading Self match your day-to-day experience?",
    ],
    negativeExamples: [
      "Your assessment results show that you have many strengths and some areas for improvement. You scored high in several leadership skills and low in a few others. Overall, you're a capable leader with room to grow. Your strongest area is Leading the Organization and your weakest area is Leading Self. I'd recommend focusing on your weaker areas to become a more well-rounded leader.",
      "Here's a summary of all your scores:\n- Self Care: 50\n- Self Awareness: 62.5\n- Confidence: 62.5\n- Resilience: 62.5\n- Emotion Management: 0\n- Focus: 0\n- Prioritization: 0\n- Time Management: 62.5\n- Delegation: 62.5\n[...listing every single score without analysis...]",
    ],
  },
  {
    content:
      "Based on my assessment results and our conversation, what should I focus on next in my leadership development journey?",
    positiveExamples: [
      "Based on your profile, I'd point to two areas where focused effort would have the highest return.\n\n**First: Shore up the Leading Self foundation.** Your three scores at 0 percentile (Emotion Management, Focus, Prioritization) aren't just individual gaps — they collectively weaken the Time & Energy and Self Management dimensions that the framework treats as the base layer. Addressing these doesn't require becoming exceptional at them; getting to the 'Good' range (25th+ percentile) would meaningfully change your sustainability as a leader. Start with Prioritization, since it's the most behavioral and actionable of the three.\n\n**Second: Close the Listening gap.** At 50 percentile, Listening is the one area in your Leading Others domain that sits well below your other interpersonal skills. Because your Communication (87.5) and Influence (87.5) are so strong, improving Listening would amplify those existing strengths rather than just adding a new one.\n\nI wouldn't try to do both simultaneously. Pick one for the next 60-90 days, establish the practice, then layer in the second. Given that your role likely depends on the interpersonal side daily, you might start with Listening and tackle the self-management cluster next quarter.\n\nWhich feels more pressing given what you're dealing with right now?",
    ],
    negativeExamples: [
      "You should focus on everything! All your low scores need attention. I'd recommend creating a comprehensive plan that addresses Emotion Management, Focus, Prioritization, Career Development, Listening, Coaching, Team Leadership, and Strategic Management. The more you work on, the faster you'll improve.",
      "Great progress so far! I think you're on the right track. Just keep doing what you're doing and focus on being the best leader you can be. Trust the process and good things will happen. Leadership is a marathon, not a sprint!",
    ],
  },
];

async function seedPrompts() {
  console.log("Seeding prompts...");

  await db.insert(prompts).values(promptsData);

  console.log(`Seeded ${promptsData.length} prompts with examples.`);
  process.exit(0);
}

seedPrompts().catch((err) => {
  console.error("Prompt seed failed:", err);
  process.exit(1);
});
