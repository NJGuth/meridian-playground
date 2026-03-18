// data/values-definitions.ts
// Complete Values Navigator Framework — dimensions, sub-dimensions, and types
// Single source of truth for both the enrichment pipeline and UI display

// ─── Types ────────────────────────────────────────────────────────────────────

export const VALUES_DIMENSION_KEYS = [
  "Stability",
  "Tradition",
  "Visibility",
  "Power",
  "Rationality",
  "Aesthetic_Appreciation",
  "Community",
  "Autonomy",
  "Enjoyment",
  "Well_Being",
] as const;

export type ValuesDimensionKey = (typeof VALUES_DIMENSION_KEYS)[number];

export const VALUES_SUB_DIMENSION_KEYS = [
  "Financial_Security",
  "Job_Security",
  "Predictability",
  "History",
  "Hierarchy",
  "Routine",
  "Acknowledgement",
  "Praise",
  "Leadership",
  "Status",
  "Competition",
  "Science",
  "Data",
  "Logic",
  "Nature",
  "Design",
  "Experience",
  "Altruism",
  "Affiliation",
  "Freedom",
  "Individuality",
  "Indulgence",
  "Entertainment",
  "Self_Care",
  "Life_Integration",
  "Support_System",
] as const;

export type ValuesSubDimensionKey = (typeof VALUES_SUB_DIMENSION_KEYS)[number];

export interface ValuesDimension {
  key: ValuesDimensionKey;
  title: string;
  description: string;
  subDimensionKeys: ValuesSubDimensionKey[];
}

export interface ValuesSubDimension {
  key: ValuesSubDimensionKey;
  title: string;
  description: string;
  dimensionKey: ValuesDimensionKey;
}

// ─── Dimensions ───────────────────────────────────────────────────────────────

export const VALUES_DIMENSIONS: ValuesDimension[] = [
  {
    key: "Stability",
    title: "Stability",
    description:
      "A dimension that encompasses safety/security, predictability, harmony, consistency, and resilience against change. Each sub-dimension underneath reflects motivational goals that emphasize protection from harm and maintenance of order.",
    subDimensionKeys: ["Financial_Security", "Job_Security", "Predictability"],
  },
  {
    key: "Tradition",
    title: "Tradition",
    description:
      "Value placed on respecting, preserving, and adhering to established customs, rituals, and cultural norms. It encompasses a desire for consistency, respect for history, and commitment to long-standing practices and beliefs.",
    subDimensionKeys: ["History", "Hierarchy", "Routine"],
  },
  {
    key: "Visibility",
    title: "Visibility",
    description:
      "The value placed on being acknowledged, appreciated, and visible to others. It reflects a motivation for external validation, social approval, and recognition of one's contributions or achievements. This dimension encompasses the desire for attention and respect from others, as well as a sense of being valued within a community or organization.",
    subDimensionKeys: ["Praise", "Acknowledgement"],
  },
  {
    key: "Power",
    title: "Power",
    description:
      "The value placed on achieving influence, control, and authority over others and resources. It reflects a motivation for social status, prestige, and the ability to direct or shape outcomes in personal, organizational, or societal contexts. Power as a value is rooted in the desire to assert dominance, gain recognition, and maintain leadership roles.",
    subDimensionKeys: ["Leadership", "Status", "Competition"],
  },
  {
    key: "Rationality",
    title: "Rationality",
    description:
      "Represents a fundamental value that motivates individuals to prioritize reasoning, evidence-based thinking, and systematic approaches in their decision-making processes. It reflects a commitment to objectivity, intellectual growth, and the pursuit of truth through logical inquiry.",
    subDimensionKeys: ["Science", "Data", "Logic"],
  },
  {
    key: "Aesthetic_Appreciation",
    title: "Aesthetic Appreciation",
    description:
      "The value placed on beauty, creativity, self-expression, and appreciation of form and quality in both natural and human-made environments. It reflects a motivation to engage with and create experiences that evoke sensory pleasure, emotional responses, and intellectual stimulation through artistic and creative pursuits.",
    subDimensionKeys: ["Nature", "Design", "Experience"],
  },
  {
    key: "Community",
    title: "Community",
    description:
      "The value placed on creating meaningful relationships, mutual support, and collective well-being within social groups. It reflects a motivation to connect with others, contribute to shared goals, and enhance the welfare of individuals and the broader community. Community encompasses both the desire for belonging and affiliation as well as the drive to help and uplift others through altruistic actions.",
    subDimensionKeys: ["Altruism", "Affiliation"],
  },
  {
    key: "Autonomy",
    title: "Autonomy",
    description:
      "The value placed on independence, self-reliance, and the freedom to think, act, and express oneself without undue external influence. It reflects a motivation to prioritize personal agency, individuality, and the ability to make choices that align with one's own beliefs and goals. Independence emphasizes self-direction and the pursuit of personal authenticity while fostering a sense of control over one's life.",
    subDimensionKeys: ["Freedom", "Individuality"],
  },
  {
    key: "Enjoyment",
    title: "Enjoyment",
    description:
      "The value placed on experiencing pleasure, engagement, and positive emotional states through activities, interactions, and leisure. Enjoyment encompasses both indulgence in pleasurable experiences and participation in stimulating or entertaining activities that enhance quality of life.",
    subDimensionKeys: ["Indulgence", "Entertainment"],
  },
  {
    key: "Well_Being",
    title: "Well-Being",
    description:
      "A fundamental value that motivates individuals to prioritize physical health, emotional resilience, meaningful relationships, and life balance in pursuit of a fulfilled life. It integrates self-care practices, effective life integration strategies, and reliance on support systems to achieve harmony across various dimensions of wellness.",
    subDimensionKeys: ["Self_Care", "Life_Integration", "Support_System"],
  },
];

// ─── Sub-Dimensions ───────────────────────────────────────────────────────────

export const VALUES_SUB_DIMENSIONS: ValuesSubDimension[] = [
  // Stability
  {
    key: "Financial_Security",
    title: "Financial Security",
    description:
      "Desire to have stable and sufficient income, coupled with responsible financial management, to meet one's needs and maintain a sense of economic well-being. In an organizational context, this may manifest as careful budget management and conservative financial planning.",
    dimensionKey: "Stability",
  },
  {
    key: "Job_Security",
    title: "Job Security",
    description:
      "The value placed on maintaining stable employment and a reliable source of income. It reflects a desire for predictability in professional life and a preference for stability over risk. Leaders who value job security tend to make cautious decisions and prefer proven approaches over experimental ones.",
    dimensionKey: "Stability",
  },
  {
    key: "Predictability",
    title: "Predictability",
    description:
      "The value placed on consistency, reliability, and the ability to anticipate outcomes in both personal and professional settings. Leaders who prioritize predictability often create structured environments with clear processes and well-defined expectations.",
    dimensionKey: "Stability",
  },
  // Tradition
  {
    key: "History",
    title: "History",
    description:
      "The value placed on honoring and learning from the past, respecting established practices, and preserving cultural or organizational heritage. Leaders who value history often draw on precedent and institutional knowledge when making decisions.",
    dimensionKey: "Tradition",
  },
  {
    key: "Hierarchy",
    title: "Hierarchy",
    description:
      "The value placed on established structures of authority that organize roles, responsibilities, and power within communities or organizations. It reflects a motivation to maintain stability, order, and continuity by respecting long-standing chains of command. Leaders with this value tend to create clear reporting structures and well-defined levels of authority.",
    dimensionKey: "Tradition",
  },
  {
    key: "Routine",
    title: "Routine",
    description:
      "Maintaining established practices. The value placed on consistent habits, schedules, and repetitive practices that provide structure, predictability, and emotional security. In leadership contexts, this manifests as standardized protocols, regular meeting rhythms, and established workflows that preserve organizational practices over time.",
    dimensionKey: "Tradition",
  },
  // Visibility
  {
    key: "Acknowledgement",
    title: "Acknowledgement",
    description:
      "The value placed on being known and remembered by others in social and professional contexts. It reflects a motivation to be noticed and recognized for one's presence and identity. Leaders who value visibility often ensure their contributions are acknowledged and may actively build their personal brand within the organization.",
    dimensionKey: "Visibility",
  },
  {
    key: "Praise",
    title: "Praise",
    description:
      "The value placed on receiving verbal or written acknowledgment and appreciation for one's achievements, efforts, or qualities. It reflects a motivation to be recognized and positively reinforced for one's contributions. Leaders who value praise typically respond well to positive feedback and may emphasize recognition programs for their teams.",
    dimensionKey: "Visibility",
  },
  // Power
  {
    key: "Leadership",
    title: "Leadership",
    description:
      "The value placed on guiding, influencing, and directing others toward achieving shared goals. It reflects a desire for authority, responsibility, and recognition in shaping outcomes within groups or organizations. Leaders who score high here often actively seek positions of greater responsibility and influence.",
    dimensionKey: "Power",
  },
  {
    key: "Status",
    title: "Status",
    description:
      "The value placed on achieving social recognition, respect, and prestige within a community or organization. It reflects a motivation to attain a high social standing and admiration from others, which is associated with influence, authority, and perceived success. Leaders who value status may be particularly conscious of their title, position, and external symbols of achievement.",
    dimensionKey: "Power",
  },
  {
    key: "Competition",
    title: "Competition",
    description:
      "The value placed on outperforming others and achieving superior results through excellence and effort. It reflects a motivation to measure success through comparison, strive for recognition, and pursue dominance in competitive environments. Leaders who prioritize competition often focus on metrics, benchmarks, and outperforming rivals.",
    dimensionKey: "Power",
  },
  // Rationality
  {
    key: "Science",
    title: "Science",
    description:
      "Science emphasizes a systematic approach to understanding phenomena through empirical evidence, experimentation, and the scientific method. It reflects a value for inquiry, discovery, and the pursuit of knowledge through rigorous methodologies. Leaders who score high here tend to base decisions on research and established theoretical frameworks.",
    dimensionKey: "Rationality",
  },
  {
    key: "Data",
    title: "Data",
    description:
      "Emphasizes reliance on factual, quantitative, and empirical information to guide decision-making and problem-solving. It reflects a value for accuracy, objectivity, and evidence-based reasoning. Leaders who prioritize data typically invest in analytics capabilities and require supporting evidence before making significant decisions.",
    dimensionKey: "Rationality",
  },
  {
    key: "Logic",
    title: "Logic",
    description:
      "Logic emphasizes structured reasoning, coherence, and consistency in analyzing problems and deriving conclusions. It reflects a value for clarity, rational explanations, and systematic thought processes. Leaders who value logic often excel at creating sound arguments and identifying flaws in reasoning or processes.",
    dimensionKey: "Rationality",
  },
  // Aesthetic Appreciation
  {
    key: "Nature",
    title: "Nature",
    description:
      "A value that motivates individuals to seek out, appreciate, and protect natural environments. It reflects a deep-seated connection to the natural world, driving behaviors that prioritize engagement with nature for its beauty, restorative qualities, and ability to inspire awe and well-being. Leaders who value nature may prioritize sustainability initiatives and create work environments that incorporate natural elements.",
    dimensionKey: "Aesthetic_Appreciation",
  },
  {
    key: "Design",
    title: "Design",
    description:
      "The value placed on the creation and appreciation of functional and visually pleasing products, environments, and presentations. Leaders who value design often pay close attention to the aesthetic aspects of workplace environments, product development, and brand experiences.",
    dimensionKey: "Aesthetic_Appreciation",
  },
  {
    key: "Experience",
    title: "Experience",
    description:
      "The value placed on engaging with and appreciating sensory, emotional, and intellectual experiences that arise from encountering beauty, art, or meaningful environments. Leaders who prioritize aesthetic experience may create opportunities for creative expression and emphasize the experiential aspects of work.",
    dimensionKey: "Aesthetic_Appreciation",
  },
  // Community
  {
    key: "Altruism",
    title: "Altruism",
    description:
      "The value placed on selflessly helping others, driven by empathy, compassion, and a desire to improve their well-being without seeking personal gain or recognition. It reflects a commitment to fostering social connections, contributing to collective welfare, and finding intrinsic meaning in prosocial behaviors. Leaders who score high on altruism typically emphasize corporate social responsibility and servant leadership approaches.",
    dimensionKey: "Community",
  },
  {
    key: "Affiliation",
    title: "Affiliation",
    description:
      "The value placed on forming and maintaining close, friendly relationships with others. It reflects a motivation to connect emotionally, socially interact, and feel a sense of belonging within a group or community. Leaders with strong affiliation values often create cohesive team environments and prioritize relationship-building activities.",
    dimensionKey: "Community",
  },
  // Autonomy
  {
    key: "Freedom",
    title: "Freedom",
    description:
      "Absence of constraints on one's actions, allowing individuals to act according to their own will and preferences. It is the capacity to make choices without external pressure. Leaders who value freedom typically create environments where team members have significant autonomy and decision-making authority.",
    dimensionKey: "Autonomy",
  },
  {
    key: "Individuality",
    title: "Individuality",
    description:
      "The value placed on expressing and maintaining one's unique characteristics, beliefs, and behaviors, even when they differ from societal norms or expectations. It reflects a motivation to be recognized as an individual and to pursue personal authenticity, preferring self-expression over conformity. Leaders who prioritize individuality often encourage diverse perspectives and celebrate unique approaches.",
    dimensionKey: "Autonomy",
  },
  // Enjoyment
  {
    key: "Indulgence",
    title: "Indulgence",
    description:
      "The value placed on freely pursuing and experiencing pleasures, often involving activities or purchases considered non-essential or luxurious, without feelings of guilt or unease. Leaders who value indulgence might create more generous benefit packages and encourage appropriate work celebrations.",
    dimensionKey: "Enjoyment",
  },
  {
    key: "Entertainment",
    title: "Entertainment",
    description:
      "The value placed on engaging in activities or experiences designed to provide amusement, relaxation, and diversion from daily routines. Leaders who value entertainment often incorporate fun, humor, and play into the work environment to enhance engagement and satisfaction.",
    dimensionKey: "Enjoyment",
  },
  // Well-Being
  {
    key: "Self_Care",
    title: "Self-Care",
    description:
      "The value placed on engaging in intentional activities and practices to maintain and enhance one's physical, mental, emotional, and social health. A commitment to nurturing one's own health and vitality as a foundation for overall life satisfaction and effectiveness. Leaders who prioritize self-care typically model healthy behaviors and encourage wellness initiatives in their organizations.",
    dimensionKey: "Well_Being",
  },
  {
    key: "Life_Integration",
    title: "Life Integration",
    description:
      "The value placed on effectively managing the interplay between work and personal life in a way that creates harmony, flexibility, and fulfillment. It reflects a commitment to balancing work with relaxation, relationships, and personal enjoyment while adapting to work life. Leaders who score high here often create flexible work arrangements and respect boundaries between professional and personal spheres.",
    dimensionKey: "Well_Being",
  },
  {
    key: "Support_System",
    title: "Support System",
    description:
      "The value placed on creating, maintaining, and investing in meaningful relationships with family and friends to enhance emotional and mental well-being. Leaders who value support systems typically create mentoring programs and foster a culture where team members can seek help when needed.",
    dimensionKey: "Well_Being",
  },
];

// ─── Convenience lookups ──────────────────────────────────────────────────────

export const VALUES_DIMENSION_BY_KEY = new Map(
  VALUES_DIMENSIONS.map((d) => [d.key, d])
);

export const VALUES_SUB_DIMENSION_BY_KEY = new Map(
  VALUES_SUB_DIMENSIONS.map((s) => [s.key, s])
);

export const VALUES_SUB_DIMENSIONS_BY_DIMENSION = VALUES_DIMENSIONS.reduce<
  Record<ValuesDimensionKey, ValuesSubDimension[]>
>((acc, dim) => {
  acc[dim.key] = VALUES_SUB_DIMENSIONS.filter((s) => s.dimensionKey === dim.key);
  return acc;
}, {} as Record<ValuesDimensionKey, ValuesSubDimension[]>);
