// data/ld12-definitions.ts
// Complete LD12 Framework — domains, dimensions, and all 45 skills
// Single source of truth for both the enrichment pipeline and UI display

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Domain {
  id: number;
  name: string;
  description: string;
}

export interface Dimension {
  id: number;
  name: string;
  description: string;
  domainId: number;
}

export interface Skill {
  id: number;
  name: string;
  description: string;
  domainId: number;
  dimensionId: number;
  strengthDescription: string;
  opportunityDescription: string;
}

// ─── Domains ──────────────────────────────────────────────────────────────────

export const DOMAINS: Domain[] = [
  {
    id: 1,
    name: "Leading Self",
    description:
      "Leading Self describes skills that impact a leader on a personal level. Skills in this domain focus on how effectively a leader manages their time, energy, thinking, decision making, and overall reputation and brand.",
  },
  {
    id: 2,
    name: "Leading Others",
    description:
      "Leading Others involves achieving results with and through others. Skills in this domain involve the ability to build and maintain effective relationships, manage performance, and drive team performance.",
  },
  {
    id: 3,
    name: "Leading Organizations",
    description:
      "Leading the Organization involves skills that shape the organization's future. Skills in this domain involve a leader's ability to set a vision, think strategically, manage change and build a great culture.",
  },
];

// ─── Dimensions ───────────────────────────────────────────────────────────────

export const DIMENSIONS: Dimension[] = [
  // Leading Self
  {
    id: 1,
    name: "Self Management",
    description:
      "Self Management involves a range of skills that include your ability to exercise self awareness, your ability to engage in self care, your confidence, your resilience, and your ability to manage emotions.",
    domainId: 1,
  },
  {
    id: 2,
    name: "Time and Energy",
    description:
      "Time and Energy involve skills that optimize your ability to focus effort and attention, set priorities, manage time, and delegate to others.",
    domainId: 1,
  },
  {
    id: 3,
    name: "Decision Making",
    description:
      "Decision Making refers to the ability to seek out and synthesize information, solve problems, and ultimately make high-quality decisions.",
    domainId: 1,
  },
  {
    id: 4,
    name: "Leadership Brand",
    description:
      "Leadership Brand involves your ability to build a strong reputation in the organization, operate with executive presence, acquire job-relevant expertise, and proactively manage your career.",
    domainId: 1,
  },
  // Leading Others
  {
    id: 5,
    name: "Building Trust",
    description:
      "Building Trust involves demonstrating authenticity, reliability, and integrity to create strong relationships and foster confidence in your leadership.",
    domainId: 2,
  },
  {
    id: 6,
    name: "Social Acumen",
    description:
      "Social Acumen involves your ability to demonstrate empathy, engage in active listening, manage conflict, exercise influence, and cultivate strong working relationships.",
    domainId: 2,
  },
  {
    id: 7,
    name: "Managing Performance",
    description:
      "Managing Performance involves a broad set of skills required to achieve performance objectives through others. These skills include accountability, coaching, and the ability to motivate, develop, and empower others.",
    domainId: 2,
  },
  {
    id: 8,
    name: "Team Effectiveness",
    description:
      "Team Effectiveness involves your ability to collaborate effectively, lead a team, and maximize team performance by attending to a team's productivity and culture.",
    domainId: 2,
  },
  // Leading Organizations
  {
    id: 9,
    name: "Visioning",
    description:
      "Visioning concerns your ability to innovate, set a vision, and inspire buy-in from others.",
    domainId: 3,
  },
  {
    id: 10,
    name: "Strategic Leadership",
    description:
      "Strategic Leadership deals with your ability to develop and manage big-picture strategy as well as manage stakeholder relationships and outcomes for implementing new strategies.",
    domainId: 3,
  },
  {
    id: 11,
    name: "Driving Change",
    description:
      "Driving Change refers to your ability to execute on a vision by way of agile, flexible leadership and navigating change at the organizational level.",
    domainId: 3,
  },
  {
    id: 12,
    name: "Culture Shaping",
    description:
      "Culture Shaping deals with your ability to build an organizational culture wherein members feel engaged via inclusive leadership.",
    domainId: 3,
  },
];

// ─── Skills ───────────────────────────────────────────────────────────────────

export const SKILLS: Skill[] = [
  // ── Leading Self / Self Management ─────────────────────────────────────────
  {
    id: 1,
    name: "Self Care",
    description:
      "Actively attending to one's own mental, emotional, and physical well-being personally and professionally.",
    domainId: 1,
    dimensionId: 1,
    strengthDescription:
      "Consistently prioritizes personal well-being and maintains healthy boundaries between work and personal life. Demonstrates proactive self-care practices that enhance overall performance and sustainability.",
    opportunityDescription:
      "Develop a more structured self-care routine and learn to recognize early warning signs of burnout. Focus on building resilience through regular exercise, adequate rest, and stress management techniques.",
  },
  {
    id: 2,
    name: "Self-Awareness",
    description:
      "Conscious knowledge of one's own character, feelings, and motives that guide behavior and decision making.",
    domainId: 1,
    dimensionId: 1,
    strengthDescription:
      "Possesses strong emotional intelligence and regularly reflects on personal strengths, weaknesses, and behavioral patterns. Makes decisions aligned with personal values and understands their impact on others.",
    opportunityDescription:
      "Enhance self-reflection practices through journaling or feedback mechanisms. Seek regular input from trusted colleagues to gain additional perspective on blind spots and areas for growth.",
  },
  {
    id: 3,
    name: "Confidence",
    description:
      "A feeling of self-assurance and personal efficacy arising from an appreciation of one's own qualities.",
    domainId: 1,
    dimensionId: 1,
    strengthDescription:
      "Demonstrates authentic confidence that inspires trust and credibility. Takes calculated risks and speaks up with conviction while remaining open to feedback and learning opportunities.",
    opportunityDescription:
      "Build confidence through skill development and celebrating small wins. Practice presenting ideas and taking on stretch assignments to strengthen self-efficacy in challenging situations.",
  },
  {
    id: 4,
    name: "Emotion Management",
    description:
      "The ability to be aware of and constructively manage positive and challenging emotions.",
    domainId: 1,
    dimensionId: 1,
    strengthDescription:
      "Maintains emotional balance under pressure and responds thoughtfully rather than reactively. Effectively channels emotions to drive positive outcomes and maintains professional composure in difficult situations.",
    opportunityDescription:
      "Develop mindfulness practices and emotional regulation techniques. Learn to identify emotional triggers and create strategies for managing stress and maintaining perspective during high-pressure situations.",
  },
  {
    id: 5,
    name: "Resilience",
    description:
      "The capacity to maintain composure through challenging times and to recover from setbacks.",
    domainId: 1,
    dimensionId: 1,
    strengthDescription:
      "Bounces back quickly from setbacks and uses challenges as learning opportunities. Maintains optimism and determination while adapting strategies when faced with obstacles or failure.",
    opportunityDescription:
      "Strengthen resilience through building a strong support network and developing coping strategies. Practice reframing setbacks as learning opportunities and focus on building mental toughness through challenging experiences.",
  },
  // ── Leading Self / Time and Energy ─────────────────────────────────────────
  {
    id: 6,
    name: "Focus",
    description:
      "Effectively concentrating one's attention and effort on the most pressing needs to complete tasks and deliver on responsibilities.",
    domainId: 1,
    dimensionId: 2,
    strengthDescription:
      "Maintains laser focus on high-priority tasks and minimizes distractions. Demonstrates deep work capabilities and consistently delivers quality results through sustained attention and concentration.",
    opportunityDescription:
      "Develop focus techniques like time-blocking and the Pomodoro method. Practice mindfulness and create distraction-free work environments to enhance concentration and productivity.",
  },
  {
    id: 7,
    name: "Prioritization",
    description:
      "Capacity to organize tasks and actions based on level of urgency and importance.",
    domainId: 1,
    dimensionId: 2,
    strengthDescription:
      "Excels at identifying and focusing on high-impact activities that align with strategic goals. Consistently makes smart trade-offs and ensures critical tasks receive appropriate attention and resources.",
    opportunityDescription:
      "Learn advanced prioritization frameworks like the Eisenhower Matrix and MoSCoW method. Practice saying no to low-value activities and develop systems for regular priority review and adjustment.",
  },
  {
    id: 8,
    name: "Time Management",
    description:
      "Planning and exercising conscious control of time spent on specific activities to increase effectiveness, efficiency, and productivity.",
    domainId: 1,
    dimensionId: 2,
    strengthDescription:
      "Masters the art of time allocation and consistently meets deadlines while maintaining work-life balance. Uses effective planning tools and techniques to maximize productivity and minimize wasted time.",
    opportunityDescription:
      "Implement time-tracking systems to identify time drains and optimize schedules. Learn advanced scheduling techniques and develop better habits around meeting management and email processing.",
  },
  {
    id: 9,
    name: "Delegation",
    description:
      "Getting work done by sharing responsibility for outcomes along with the agency to do what is needed to produce results.",
    domainId: 1,
    dimensionId: 2,
    strengthDescription:
      "Effectively identifies tasks suitable for delegation and empowers team members with clear expectations and appropriate authority. Builds team capability while freeing up time for strategic priorities.",
    opportunityDescription:
      "Develop delegation frameworks and improve communication skills for clear task assignment. Learn to balance oversight with autonomy and build trust through effective follow-up and feedback mechanisms.",
  },
  // ── Leading Self / Decision Making ─────────────────────────────────────────
  {
    id: 10,
    name: "Curiosity",
    description:
      "The tendency to recognize and seek out novel and challenging information, ideas, and experiences.",
    domainId: 1,
    dimensionId: 3,
    strengthDescription:
      "Demonstrates intellectual curiosity and actively seeks diverse perspectives and new information. Asks probing questions and explores innovative solutions, driving continuous learning and improvement.",
    opportunityDescription:
      "Cultivate a structured approach to learning by setting aside dedicated time for exploration and research. Practice asking better questions and seek out diverse viewpoints to broaden understanding and decision-making capabilities.",
  },
  {
    id: 11,
    name: "Problem Solving",
    description:
      "Synthesizing diverse data sources, analyzing cause-effect relationships, and engaging in critical thinking to make accurate assessments and implement effective solutions.",
    domainId: 1,
    dimensionId: 3,
    strengthDescription:
      "Excels at breaking down complex problems into manageable components and systematically analyzing root causes. Synthesizes information from multiple sources to develop creative, data-driven solutions.",
    opportunityDescription:
      "Develop structured problem-solving methodologies like design thinking or root cause analysis. Practice working through case studies and seek feedback on solution approaches to refine analytical skills.",
  },
  {
    id: 12,
    name: "Decision Quality",
    description: "Making good judgments by balancing data, experience, and intuition.",
    domainId: 1,
    dimensionId: 3,
    strengthDescription:
      "Consistently makes well-reasoned decisions that balance quantitative data with qualitative insights and experience. Demonstrates sound judgment under pressure and learns from both successful and unsuccessful decisions.",
    opportunityDescription:
      "Develop decision-making frameworks that incorporate multiple data sources and stakeholder perspectives. Practice documenting decision rationale and outcomes to improve future decision-making processes.",
  },
  // ── Leading Self / Leadership Brand ────────────────────────────────────────
  {
    id: 13,
    name: "Career Development",
    description: "Identifying and implementing strategies for career growth.",
    domainId: 1,
    dimensionId: 4,
    strengthDescription:
      "Proactively manages career trajectory with clear goals and strategic planning. Seeks growth opportunities, builds relevant skills, and positions themselves for advancement while contributing meaningfully to organizational success.",
    opportunityDescription:
      "Develop a comprehensive career development plan with specific milestones and skill targets. Seek mentorship, identify stretch assignments, and build a professional network to accelerate career growth and visibility.",
  },
  {
    id: 14,
    name: "Gaining Expertise",
    description:
      "Acquires new job-relevant knowledge and experiences that facilitate being an expert on the industry, company, product, or technical domain.",
    domainId: 1,
    dimensionId: 4,
    strengthDescription:
      "Continuously builds deep expertise in relevant domains and stays current with industry trends. Becomes a go-to resource for complex challenges and contributes valuable insights that drive organizational success.",
    opportunityDescription:
      "Create a structured learning plan with regular skill assessments and knowledge updates. Engage in professional development, attend conferences, and seek opportunities to apply new knowledge in real-world scenarios.",
  },
  {
    id: 15,
    name: "Executive Presence",
    description:
      "Demonstrating self-confidence, poise, and authenticity that inspires confidence in others to believe in and follow your leadership.",
    domainId: 1,
    dimensionId: 4,
    strengthDescription:
      "Commands respect through authentic confidence, clear communication, and emotional intelligence. Inspires trust and credibility, making others naturally want to follow and support their leadership vision.",
    opportunityDescription:
      "Develop communication skills and practice presenting with confidence. Work on body language, voice projection, and active listening. Seek feedback on leadership presence and practice in increasingly challenging situations.",
  },
  {
    id: 16,
    name: "Personal Brand",
    description:
      "Cultivating one's reputation at work by making visible one's identity and distinctiveness as a leader.",
    domainId: 1,
    dimensionId: 4,
    strengthDescription:
      "Has developed a clear, authentic personal brand that aligns with organizational values and leadership goals. Consistently demonstrates unique strengths and values, building a strong reputation for reliability and excellence.",
    opportunityDescription:
      "Define your unique value proposition and leadership style. Consistently communicate your brand through actions, communications, and professional interactions. Seek opportunities to showcase expertise and build visibility within the organization.",
  },
  // ── Leading Others / Building Trust ────────────────────────────────────────
  {
    id: 17,
    name: "Authenticity",
    description:
      "Capacity to be true to one's own personality, own one's limitations and mistakes, ask for advice, and receive constructive feedback.",
    domainId: 2,
    dimensionId: 5,
    strengthDescription:
      "Demonstrates genuine self-awareness and vulnerability that builds deep trust and connection. Admits mistakes openly, seeks feedback regularly, and shows consistent alignment between values and actions.",
    opportunityDescription:
      "Practice self-reflection and develop comfort with vulnerability. Seek regular feedback from trusted colleagues and work on accepting constructive criticism as a growth opportunity rather than a personal attack.",
  },
  {
    id: 18,
    name: "Trust",
    description:
      "Conducting oneself in a way that demonstrates to others reliability and intention to do the right thing.",
    domainId: 2,
    dimensionId: 5,
    strengthDescription:
      "Consistently follows through on commitments and demonstrates integrity in all interactions. Makes decisions based on what's right rather than what's convenient, earning the confidence and respect of colleagues and team members.",
    opportunityDescription:
      "Focus on consistent follow-through and clear communication about commitments. Practice making difficult decisions that prioritize long-term trust over short-term gains, and seek feedback on perceived reliability.",
  },
  // ── Leading Others / Social Acumen ─────────────────────────────────────────
  {
    id: 19,
    name: "Empathy",
    description:
      "Capacity to understand and relate to another's emotional state and see things from their perspective.",
    domainId: 2,
    dimensionId: 6,
    strengthDescription:
      "Demonstrates deep understanding of others' emotions and perspectives, creating strong emotional connections. Shows genuine care and consideration for team members' feelings and experiences, fostering psychological safety and trust.",
    opportunityDescription:
      "Practice active listening and perspective-taking exercises. Develop emotional intelligence through mindfulness and seek opportunities to understand diverse viewpoints and experiences.",
  },
  {
    id: 20,
    name: "Listening",
    description:
      "Taking time to see another's perspective in a way that makes the other person feel understood and without interjecting one's own beliefs or opinions.",
    domainId: 2,
    dimensionId: 6,
    strengthDescription:
      "Masters the art of active listening, making others feel truly heard and valued. Asks thoughtful follow-up questions and demonstrates understanding without judgment, creating an environment where people feel safe to share openly.",
    opportunityDescription:
      "Practice active listening techniques and avoid interrupting or immediately offering solutions. Focus on understanding before being understood and develop skills in reflective listening and paraphrasing.",
  },
  {
    id: 21,
    name: "Building Relationships",
    description:
      "Working to build relationships with people who may be helpful in achieving work-related goals and establishing advantages.",
    domainId: 2,
    dimensionId: 6,
    strengthDescription:
      "Strategically builds meaningful professional relationships that create mutual value. Develops a strong network of diverse contacts and consistently invests in relationship-building activities that benefit both parties.",
    opportunityDescription:
      "Develop a systematic approach to networking and relationship building. Focus on creating genuine value for others rather than just seeking personal gain, and practice building relationships across different levels and departments.",
  },
  {
    id: 22,
    name: "Strengthening Relationships",
    description: "Proactive investment in developing and maintaining relationships over time.",
    domainId: 2,
    dimensionId: 6,
    strengthDescription:
      "Consistently nurtures and deepens existing relationships through regular communication and meaningful interactions. Demonstrates long-term commitment to relationship building and creates lasting professional bonds.",
    opportunityDescription:
      "Create systems for regular relationship maintenance and follow-up. Practice showing genuine interest in others' success and well-being, and develop habits for staying connected with your professional network.",
  },
  {
    id: 23,
    name: "Managing Conflict",
    description:
      "Constructively addressing disagreement to achieve an optimal resolution that minimizes negative impact and leverages positive conflict.",
    domainId: 2,
    dimensionId: 6,
    strengthDescription:
      "Transforms conflicts into opportunities for growth and innovation. Facilitates productive discussions that address root causes while preserving relationships and finding win-win solutions that benefit all parties.",
    opportunityDescription:
      "Learn conflict resolution frameworks and practice mediation skills. Develop techniques for de-escalating tense situations and focus on addressing underlying issues rather than just symptoms.",
  },
  {
    id: 24,
    name: "Communication",
    description:
      "Clearly conveying thoughts, feelings, ideas, and expectations verbally and nonverbally across methods.",
    domainId: 2,
    dimensionId: 6,
    strengthDescription:
      "Communicates with clarity, confidence, and emotional intelligence across all channels. Adapts communication style to different audiences and situations, ensuring messages are understood and well-received.",
    opportunityDescription:
      "Practice clear, concise communication and develop skills in different communication formats. Work on nonverbal communication, storytelling, and adapting your message for different audiences and contexts.",
  },
  {
    id: 25,
    name: "Influence",
    description:
      "The ability to have a motivating effect on others without exerting power and control.",
    domainId: 2,
    dimensionId: 6,
    strengthDescription:
      "Inspires and motivates others through authentic leadership and compelling vision. Builds consensus and drives change through persuasion rather than authority, creating buy-in and commitment from team members.",
    opportunityDescription:
      "Develop skills in storytelling and vision communication. Practice building coalitions and learn techniques for influencing without authority, focusing on creating shared value and mutual benefit.",
  },
  // ── Leading Others / Managing Performance ──────────────────────────────────
  {
    id: 26,
    name: "Accountability",
    description:
      "The willingness of an individual to account for their actions, accept responsibility for them, and share results in a transparent manner.",
    domainId: 2,
    dimensionId: 7,
    strengthDescription:
      "Takes full ownership of outcomes and holds themselves and others accountable for results. Creates transparent systems for tracking progress and openly shares both successes and failures to drive continuous improvement.",
    opportunityDescription:
      "Develop systems for regular progress tracking and reporting. Practice taking ownership of mistakes and learn to create accountability structures that motivate rather than punish team members.",
  },
  {
    id: 27,
    name: "Coaching",
    description:
      "Helping others improve performance by posing probing questions that guide them toward learning, development, and finding their own solutions.",
    domainId: 2,
    dimensionId: 7,
    strengthDescription:
      "Masters the art of coaching through powerful questioning and active listening. Guides team members to discover their own solutions and develop critical thinking skills, fostering long-term growth and independence.",
    opportunityDescription:
      "Learn coaching frameworks like GROW model and develop questioning techniques. Practice active listening and avoid jumping to solutions, focusing on helping others develop their own problem-solving abilities.",
  },
  {
    id: 28,
    name: "Developing Talent",
    description:
      "Efforts that foster learning, employee engagement, and employee development to drive productivity and organizational performance.",
    domainId: 2,
    dimensionId: 7,
    strengthDescription:
      "Creates comprehensive development programs that identify and nurture individual strengths. Invests in team members' growth through mentoring, training, and stretch assignments that drive both personal and organizational success.",
    opportunityDescription:
      "Develop talent assessment and development planning skills. Create learning opportunities and mentorship programs, and practice identifying and developing high-potential team members.",
  },
  {
    id: 29,
    name: "Motivating Others",
    description: "Inspiring others' commitment to their work and organizational excellence.",
    domainId: 2,
    dimensionId: 7,
    strengthDescription:
      "Inspires genuine commitment and enthusiasm through authentic leadership and meaningful recognition. Understands individual motivators and creates an environment where team members feel valued and engaged in their work.",
    opportunityDescription:
      "Learn about different motivation theories and practice identifying what drives individual team members. Develop skills in recognition and appreciation, and create systems that celebrate both individual and team achievements.",
  },
  {
    id: 30,
    name: "Empowering Others",
    description: "Providing others with a sense of ownership and the means to achieve something.",
    domainId: 2,
    dimensionId: 7,
    strengthDescription:
      "Effectively delegates authority and resources while providing necessary support. Creates an environment where team members feel empowered to take initiative and make decisions that drive results.",
    opportunityDescription:
      "Develop delegation skills and learn to balance oversight with autonomy. Practice providing clear expectations and resources while allowing team members to own their outcomes and learn from experience.",
  },
  // ── Leading Others / Team Effectiveness ────────────────────────────────────
  {
    id: 31,
    name: "Collaboration",
    description:
      "Effectively working with others to actualize a common purpose or achieve a shared goal.",
    domainId: 2,
    dimensionId: 8,
    strengthDescription:
      "Excels at bringing diverse teams together to achieve shared objectives. Facilitates effective collaboration by building trust, managing dynamics, and ensuring all voices are heard and valued.",
    opportunityDescription:
      "Develop facilitation skills and learn techniques for managing group dynamics. Practice building consensus and creating inclusive environments where all team members can contribute effectively.",
  },
  {
    id: 32,
    name: "Team Productivity",
    description: "Focusing on the efficiency and productivity of a team.",
    domainId: 2,
    dimensionId: 8,
    strengthDescription:
      "Optimizes team performance through effective processes, clear goals, and efficient workflows. Monitors and improves team productivity while maintaining high quality standards and team morale.",
    opportunityDescription:
      "Learn productivity frameworks and develop skills in process optimization. Practice setting clear goals and metrics, and create systems for tracking and improving team performance.",
  },
  {
    id: 33,
    name: "Team Culture",
    description: "Investing in the team dynamics and interpersonal functioning of the team.",
    domainId: 2,
    dimensionId: 8,
    strengthDescription:
      "Cultivates a positive, inclusive team culture that values diversity and psychological safety. Creates an environment where team members feel supported, respected, and motivated to do their best work.",
    opportunityDescription:
      "Develop skills in culture building and team dynamics. Practice creating inclusive environments and learn techniques for addressing team conflicts and building stronger relationships.",
  },
  {
    id: 34,
    name: "Team Leadership",
    description:
      "Team Leader skills that enable others to work together in a way that produces results and value beyond what could be achieved individually.",
    domainId: 2,
    dimensionId: 8,
    strengthDescription:
      "Leads teams to achieve exceptional results through effective leadership and team development. Creates synergy where the team's collective output exceeds the sum of individual contributions.",
    opportunityDescription:
      "Develop team leadership skills and learn to leverage individual strengths for collective success. Practice building high-performing teams and creating environments that maximize team potential.",
  },
  // ── Leading Organizations / Visioning ──────────────────────────────────────
  {
    id: 35,
    name: "Setting Vision",
    description:
      "Establishing and communicating a clear and compelling future state, usually connected to organizational advances, and reinforcing it over time.",
    domainId: 3,
    dimensionId: 9,
    strengthDescription:
      "Creates and communicates compelling visions that inspire and align the organization. Consistently reinforces the vision through actions, decisions, and communications, ensuring everyone understands and is motivated by the future direction.",
    opportunityDescription:
      "Develop skills in vision creation and communication. Practice articulating clear, inspiring future states and learn techniques for consistently reinforcing vision through storytelling and strategic messaging.",
  },
  {
    id: 36,
    name: "Innovation",
    description:
      "Introducing a new idea or concept, or advancing an existing idea or concept, in order to derive a novel solution to an existing problem.",
    domainId: 3,
    dimensionId: 9,
    strengthDescription:
      "Continuously generates and implements innovative solutions that drive organizational growth and competitive advantage. Creates an environment that encourages creative thinking and calculated risk-taking.",
    opportunityDescription:
      "Develop creative thinking techniques and learn to foster innovation culture. Practice design thinking methodologies and create systems that encourage experimentation and learning from failure.",
  },
  {
    id: 37,
    name: "Inspiration",
    description: "Communicating and living the organization's values and aspirations.",
    domainId: 3,
    dimensionId: 9,
    strengthDescription:
      "Embodies and communicates organizational values in a way that inspires others to align their actions and decisions. Creates emotional connection to the organization's mission and motivates sustained commitment.",
    opportunityDescription:
      "Develop skills in values communication and authentic leadership. Practice living organizational values consistently and learn techniques for inspiring others through personal example and compelling storytelling.",
  },
  // ── Leading Organizations / Strategic Leadership ────────────────────────────
  {
    id: 38,
    name: "Strategic Thinking",
    description:
      "To understand the bigger picture of the organization's current state, where it needs to go, and devising a plan for how it will get there.",
    domainId: 3,
    dimensionId: 10,
    strengthDescription:
      "Demonstrates exceptional ability to analyze complex situations, identify patterns, and develop comprehensive strategies. Balances short-term needs with long-term vision while considering multiple stakeholders and market dynamics.",
    opportunityDescription:
      "Develop systems thinking and strategic analysis skills. Practice scenario planning and learn to synthesize information from multiple sources to create robust strategic plans.",
  },
  {
    id: 39,
    name: "Strategic Management",
    description:
      "The ongoing process of setting goals, making plans, and adapting to realities in order to execute on a strategy.",
    domainId: 3,
    dimensionId: 10,
    strengthDescription:
      "Effectively translates strategy into actionable plans and manages execution with agility. Continuously monitors progress, adjusts course as needed, and ensures alignment across all organizational levels.",
    opportunityDescription:
      "Develop project management and execution skills. Learn to create clear implementation roadmaps and practice adaptive management techniques for responding to changing conditions.",
  },
  {
    id: 40,
    name: "Stakeholder Management",
    description:
      "Managing relationships, expectations, and information sharing with the key people who are crucial to the success of a project or initiative.",
    domainId: 3,
    dimensionId: 10,
    strengthDescription:
      "Builds and maintains strong relationships with key stakeholders, managing expectations effectively and ensuring alignment. Communicates strategically to build support and navigate complex political landscapes.",
    opportunityDescription:
      "Develop stakeholder mapping and engagement skills. Practice building coalitions and learn techniques for managing diverse stakeholder interests while maintaining focus on strategic objectives.",
  },
  // ── Leading Organizations / Driving Change ─────────────────────────────────
  {
    id: 41,
    name: "Navigating Change",
    description:
      "Effectively introduces and manages organizational change with clear communication and an ability to lead others through ambiguity and resistance.",
    domainId: 3,
    dimensionId: 11,
    strengthDescription:
      "Leads organizational change with clarity and empathy, helping others navigate uncertainty and resistance. Communicates change effectively and provides support throughout the transition process.",
    opportunityDescription:
      "Develop change management frameworks and communication skills. Practice leading through ambiguity and learn techniques for addressing resistance and building change readiness.",
  },
  {
    id: 42,
    name: "Leadership Flexibility",
    description: "Capacity to bend and flex one's leadership style to match the situation.",
    domainId: 3,
    dimensionId: 11,
    strengthDescription:
      "Adapts leadership approach seamlessly based on situational demands, team needs, and organizational context. Demonstrates versatility in communication, decision-making, and management styles.",
    opportunityDescription:
      "Develop situational leadership skills and emotional intelligence. Practice adapting your approach to different contexts and learn to read situations accurately to determine the most effective leadership style.",
  },
  {
    id: 43,
    name: "Execution",
    description:
      "Successful actualization of a strategy or set of objectives through collaboration, planning, coordinated action steps, and measuring results.",
    domainId: 3,
    dimensionId: 11,
    strengthDescription:
      "Consistently delivers results through effective execution of strategic initiatives. Coordinates complex projects, manages resources efficiently, and measures progress to ensure successful outcomes.",
    opportunityDescription:
      "Develop project management and execution skills. Practice creating detailed implementation plans and learn to coordinate cross-functional teams while maintaining focus on results and accountability.",
  },
  // ── Leading Organizations / Culture Shaping ────────────────────────────────
  {
    id: 44,
    name: "Culture Building",
    description:
      "Introducing intentional practices to grow an organization's current culture to an ideal state.",
    domainId: 3,
    dimensionId: 12,
    strengthDescription:
      "Designs and implements culture transformation initiatives that align with organizational values and strategic goals. Creates systems and practices that reinforce desired behaviors and cultural norms.",
    opportunityDescription:
      "Develop culture assessment and design skills. Learn to identify cultural gaps and create intentional practices that drive cultural change while maintaining organizational continuity.",
  },
  {
    id: 45,
    name: "Inclusive Leadership",
    description:
      "Fostering an environment of connection, respect, involvement for all members of an organization to foster engagement and value creation.",
    domainId: 3,
    dimensionId: 12,
    strengthDescription:
      "Creates an inclusive environment where all team members feel valued, respected, and empowered to contribute. Demonstrates commitment to diversity, equity, and inclusion in all leadership practices.",
    opportunityDescription:
      "Develop inclusive leadership skills and cultural competence. Practice creating psychologically safe environments and learn techniques for ensuring all voices are heard and valued in organizational decision-making.",
  },
];

// ─── Convenience lookups ──────────────────────────────────────────────────────

export const DOMAIN_BY_ID = new Map(DOMAINS.map((d) => [d.id, d]));
export const DIMENSION_BY_ID = new Map(DIMENSIONS.map((d) => [d.id, d]));
export const SKILL_BY_ID = new Map(SKILLS.map((s) => [s.id, s]));

export const SKILLS_BY_DOMAIN = DOMAINS.reduce<Record<number, Skill[]>>((acc, domain) => {
  acc[domain.id] = SKILLS.filter((s) => s.domainId === domain.id);
  return acc;
}, {});

export const SKILLS_BY_DIMENSION = DIMENSIONS.reduce<Record<number, Skill[]>>((acc, dim) => {
  acc[dim.id] = SKILLS.filter((s) => s.dimensionId === dim.id);
  return acc;
}, {});

export const DIMENSIONS_BY_DOMAIN = DOMAINS.reduce<Record<number, Dimension[]>>((acc, domain) => {
  acc[domain.id] = DIMENSIONS.filter((d) => d.domainId === domain.id);
  return acc;
}, {});
