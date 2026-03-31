// Hogan Assessment — HPI, HDS, MVPI definitions for enrichment and framework XML
// Primary scale keys use underscores for multi-word names (pctileScores in DB)

export const HPI_SCALE_KEYS = [
  "Adjustment",
  "Ambition",
  "Sociability",
  "Interpersonal_Sensitivity",
  "Prudence",
  "Inquisitive",
  "Learning_Approach",
] as const;

export type HPIScaleKey = (typeof HPI_SCALE_KEYS)[number];

export const HDS_SCALE_KEYS = [
  "Excitable",
  "Skeptical",
  "Cautious",
  "Reserved",
  "Leisurely",
  "Bold",
  "Mischievous",
  "Colorful",
  "Imaginative",
  "Diligent",
  "Dutiful",
] as const;

export type HDSScaleKey = (typeof HDS_SCALE_KEYS)[number];

export const MVPI_SCALE_KEYS = [
  "Recognition",
  "Power",
  "Hedonism",
  "Altruistic",
  "Affiliation",
  "Tradition",
  "Security",
  "Commerce",
  "Aesthetics",
  "Science",
] as const;

export type MVPIScaleKey = (typeof MVPI_SCALE_KEYS)[number];

export interface HoganSubscale {
  name: string;
}

export interface HPIScale {
  key: HPIScaleKey;
  title: string;
  insightRegarding: string;
  ffmFactor: string;
  lowScoreSummary: string;
  highScoreSummary: string;
  subscales: HoganSubscale[];
}

export interface HDSScale {
  key: HDSScaleKey;
  title: string;
  cluster: string;
  everydayStrength: string;
  overusedRisk: string;
  subscales: HoganSubscale[];
}

export interface MVPIScale {
  key: MVPIScaleKey;
  title: string;
  cluster: string;
  highDefinition: string;
  subscales: HoganSubscale[];
}

export const HPI_BANDS_THREE = {
  Low: { min: 0, max: 35 },
  Average: { min: 36, max: 64 },
  High: { min: 65, max: 100 },
} as const;

export const HDS_BANDS = {
  No_Risk: { min: 0, max: 39 },
  Low_Risk: { min: 40, max: 69 },
  Moderate_Risk: { min: 70, max: 89 },
  High_Risk: { min: 90, max: 100 },
} as const;

export const MVPI_BANDS_THREE = HPI_BANDS_THREE;

export const HPI_SCALES: HPIScale[] = [
  {
    key: "Adjustment",
    title: "Adjustment",
    insightRegarding: "Resilience",
    ffmFactor: "Emotional Stability",
    lowScoreSummary:
      "Vigilant, self-aware, stress-prone; eager for feedback. May seem moody or tense.",
    highScoreSummary:
      "Resilient, optimistic, composed; may be feedback-resistant or arrogant when high.",
    subscales: [
      { name: "Empathy" },
      { name: "Not Anxious" },
      { name: "No Guilt" },
      { name: "Calmness" },
      { name: "Even Tempered" },
      { name: "No Complaints" },
      { name: "Trusting" },
      { name: "Good Attachment" },
    ],
  },
  {
    key: "Ambition",
    title: "Ambition",
    insightRegarding: "Drive & Energy",
    ffmFactor: "Extraversion",
    lowScoreSummary:
      "Supportive team player; lower drive and initiative. Team oriented.",
    highScoreSummary:
      "High confidence and drive; forceful; may intimidate or over-compete.",
    subscales: [
      { name: "Competitive" },
      { name: "Self Confident" },
      { name: "Accomplishment" },
      { name: "Leadership" },
      { name: "Identity" },
      { name: "No Social Anxiety" },
    ],
  },
  {
    key: "Sociability",
    title: "Sociability",
    insightRegarding: "Social Style",
    ffmFactor: "Extraversion",
    lowScoreSummary:
      "Focused, task-oriented; lower-impact social style. Focused.",
    highScoreSummary:
      "Socially proactive; distractible; may talk more than listen. Flighty when high.",
    subscales: [
      { name: "Likes Parties" },
      { name: "Likes Crowds" },
      { name: "Experience Seeking" },
      { name: "Exhibitionistic" },
      { name: "Entertaining" },
    ],
  },
  {
    key: "Interpersonal_Sensitivity",
    title: "Interpersonal Sensitivity",
    insightRegarding: "Communication Style",
    ffmFactor: "Agreeableness",
    lowScoreSummary:
      "Direct, candid; potentially abrasive. Objective and candid.",
    highScoreSummary:
      "Diplomatic, warm; conflict avoidant. Nonconfrontational when high.",
    subscales: [
      { name: "Easy to Live With" },
      { name: "Sensitive" },
      { name: "Caring" },
      { name: "Likes People" },
      { name: "No Hostility" },
    ],
  },
  {
    key: "Prudence",
    title: "Prudence",
    insightRegarding: "Task-Focus",
    ffmFactor: "Dependability",
    lowScoreSummary:
      "Flexible, ambiguity-tolerant; disorganized. Flexible.",
    highScoreSummary:
      "Compliant, organized; rigid about rules. Micromanaging when high.",
    subscales: [
      { name: "Moralistic" },
      { name: "Mastery" },
      { name: "Virtuous" },
      { name: "Not Autonomous" },
      { name: "Not Spontaneous" },
      { name: "Impulse Control" },
      { name: "Avoids Trouble" },
    ],
  },
  {
    key: "Inquisitive",
    title: "Inquisitive",
    insightRegarding: "Problem-Solving",
    ffmFactor: "Openness to Experience",
    lowScoreSummary:
      "Pragmatic implementer; tactical focus. Practical and willing to implement.",
    highScoreSummary:
      "Curious, big-picture; easily bored by implementation. Impractical when high.",
    subscales: [
      { name: "Science Ability" },
      { name: "Curiosity" },
      { name: "Thrill Seeking" },
      { name: "Intellectual Games" },
      { name: "Generates Ideas" },
      { name: "Culture" },
    ],
  },
  {
    key: "Learning_Approach",
    title: "Learning Approach",
    insightRegarding: "Learning Style",
    ffmFactor: "Openness to Experience",
    lowScoreSummary:
      "Hands-on, practical learning. Application oriented.",
    highScoreSummary:
      "Continuous learner; may over-analyze. Pedantic when high.",
    subscales: [
      { name: "Education" },
      { name: "Math Ability" },
      { name: "Good Memory" },
      { name: "Reading" },
    ],
  },
];

export const HDS_SCALES: HDSScale[] = [
  {
    key: "Excitable",
    title: "Excitable",
    cluster: "Moving Away",
    everydayStrength: "Intense & energetic",
    overusedRisk: "Moody, inconsistent, volatile & unpredictable",
    subscales: [
      { name: "Volatile" },
      { name: "Easily Disappointed" },
      { name: "No Direction" },
    ],
  },
  {
    key: "Skeptical",
    title: "Skeptical",
    cluster: "Moving Away",
    everydayStrength: "Perceptive & insightful",
    overusedRisk: "Cynical, negative, distrustful & fault-finding",
    subscales: [
      { name: "Cynical" },
      { name: "Mistrusting" },
      { name: "Grudges" },
    ],
  },
  {
    key: "Cautious",
    title: "Cautious",
    cluster: "Moving Away",
    everydayStrength: "Careful & thorough",
    overusedRisk: "Risk-averse, overly careful & fearful of failure",
    subscales: [
      { name: "Avoidant" },
      { name: "Fearful" },
      { name: "Unassertive" },
    ],
  },
  {
    key: "Reserved",
    title: "Reserved",
    cluster: "Moving Away",
    everydayStrength: "Independent & objective",
    overusedRisk: "Socially withdrawn, tough, & uncommunicative",
    subscales: [
      { name: "Introverted" },
      { name: "Unsocial" },
      { name: "Tough" },
    ],
  },
  {
    key: "Leisurely",
    title: "Leisurely",
    cluster: "Moving Away",
    everydayStrength: "Cooperative & agreeable",
    overusedRisk: "Stubborn, privately irritable & passive-resistant",
    subscales: [
      { name: "Passive Aggressive" },
      { name: "Unappreciated" },
      { name: "Irritated" },
    ],
  },
  {
    key: "Bold",
    title: "Bold",
    cluster: "Moving Against",
    everydayStrength: "Confident & assertive",
    overusedRisk: "Entitled, arrogant, & overestimates competence",
    subscales: [
      { name: "Entitled" },
      { name: "Overconfidence" },
      { name: "Fantasized Talent" },
    ],
  },
  {
    key: "Mischievous",
    title: "Mischievous",
    cluster: "Moving Against",
    everydayStrength: "Charming & interesting",
    overusedRisk: "Risk-taking, limit-testing & untrustworthy",
    subscales: [
      { name: "Risky" },
      { name: "Impulsive" },
      { name: "Manipulative" },
    ],
  },
  {
    key: "Colorful",
    title: "Colorful",
    cluster: "Moving Against",
    everydayStrength: "Outgoing & socially-skilled",
    overusedRisk: "Attention-seeking, self-promoting & dramatic",
    subscales: [
      { name: "Public Confidence" },
      { name: "Distractible" },
      { name: "Self-Display" },
    ],
  },
  {
    key: "Imaginative",
    title: "Imaginative",
    cluster: "Moving Against",
    everydayStrength: "Innovative & creative",
    overusedRisk: "Eccentric, impractical, & lacking focus",
    subscales: [
      { name: "Eccentric" },
      { name: "Special Sensitivity" },
      { name: "Creative Thinking" },
    ],
  },
  {
    key: "Diligent",
    title: "Diligent",
    cluster: "Moving Toward",
    everydayStrength: "Detailed & conscientious",
    overusedRisk: "Micromanaging, perfectionistic, & nit-picking",
    subscales: [
      { name: "Standards" },
      { name: "Perfectionistic" },
      { name: "Organized" },
    ],
  },
  {
    key: "Dutiful",
    title: "Dutiful",
    cluster: "Moving Toward",
    everydayStrength: "Supportive & loyal",
    overusedRisk: "Over-eager to please, deferential, & ingratiating",
    subscales: [
      { name: "Indecisive" },
      { name: "Ingratiating" },
      { name: "Conforming" },
    ],
  },
];

export const MVPI_SCALES: MVPIScale[] = [
  {
    key: "Recognition",
    title: "Recognition",
    cluster: "Status Interests",
    highDefinition:
      "Desire to be known, seen, visible, and famous; lifestyle guided by opportunities to be noticed",
    subscales: [
      { name: "Lifestyles" },
      { name: "Beliefs" },
      { name: "Occupational Preferences" },
      { name: "Aversions" },
      { name: "Preferred Associates" },
    ],
  },
  {
    key: "Power",
    title: "Power",
    cluster: "Status Interests",
    highDefinition:
      "Desire to succeed, make things happen, outperform competition",
    subscales: [
      { name: "Lifestyles" },
      { name: "Beliefs" },
      { name: "Occupational Preferences" },
      { name: "Aversions" },
      { name: "Preferred Associates" },
    ],
  },
  {
    key: "Hedonism",
    title: "Hedonism",
    cluster: "Status Interests",
    highDefinition:
      "Pursuit of fun, excitement, pleasure; lifestyle organized around entertaining",
    subscales: [
      { name: "Lifestyles" },
      { name: "Beliefs" },
      { name: "Occupational Preferences" },
      { name: "Aversions" },
      { name: "Preferred Associates" },
    ],
  },
  {
    key: "Altruistic",
    title: "Altruistic",
    cluster: "Social Interests",
    highDefinition:
      "Desire to help others; lifestyle organized around public service",
    subscales: [
      { name: "Lifestyles" },
      { name: "Beliefs" },
      { name: "Occupational Preferences" },
      { name: "Aversions" },
      { name: "Preferred Associates" },
    ],
  },
  {
    key: "Affiliation",
    title: "Affiliation",
    cluster: "Social Interests",
    highDefinition:
      "Needing and enjoying frequent social contact; lifestyle organized around relationships",
    subscales: [
      { name: "Lifestyles" },
      { name: "Beliefs" },
      { name: "Occupational Preferences" },
      { name: "Aversions" },
      { name: "Preferred Associates" },
    ],
  },
  {
    key: "Tradition",
    title: "Tradition",
    cluster: "Social Interests",
    highDefinition:
      "Dedication to conventions — family, thrift, hard work, appropriate social behavior",
    subscales: [
      { name: "Lifestyles" },
      { name: "Beliefs" },
      { name: "Occupational Preferences" },
      { name: "Aversions" },
      { name: "Preferred Associates" },
    ],
  },
  {
    key: "Security",
    title: "Security",
    cluster: "Financial Interests",
    highDefinition:
      "Need for predictability and structure; efforts to avoid risk and uncertainty",
    subscales: [
      { name: "Lifestyles" },
      { name: "Beliefs" },
      { name: "Occupational Preferences" },
      { name: "Aversions" },
      { name: "Preferred Associates" },
    ],
  },
  {
    key: "Commerce",
    title: "Commerce",
    cluster: "Financial Interests",
    highDefinition:
      "Interest in earning money, profits, and business opportunities",
    subscales: [
      { name: "Lifestyles" },
      { name: "Beliefs" },
      { name: "Occupational Preferences" },
      { name: "Aversions" },
      { name: "Preferred Associates" },
    ],
  },
  {
    key: "Aesthetics",
    title: "Aesthetics",
    cluster: "Decision-Making Style",
    highDefinition:
      "Need for self-expression; dedication to quality; interest in how things look and feel",
    subscales: [
      { name: "Lifestyles" },
      { name: "Beliefs" },
      { name: "Occupational Preferences" },
      { name: "Aversions" },
      { name: "Preferred Associates" },
    ],
  },
  {
    key: "Science",
    title: "Science",
    cluster: "Decision-Making Style",
    highDefinition:
      "Interest in science and technology; data-based decisions; how things work",
    subscales: [
      { name: "Lifestyles" },
      { name: "Beliefs" },
      { name: "Occupational Preferences" },
      { name: "Aversions" },
      { name: "Preferred Associates" },
    ],
  },
];

export const HPI_SCALE_BY_KEY = new Map<HPIScaleKey, HPIScale>(
  HPI_SCALES.map((s) => [s.key, s]),
);

export const HDS_SCALE_BY_KEY = new Map<HDSScaleKey, HDSScale>(
  HDS_SCALES.map((s) => [s.key, s]),
);

export const MVPI_SCALE_BY_KEY = new Map<MVPIScaleKey, MVPIScale>(
  MVPI_SCALES.map((s) => [s.key, s]),
);
