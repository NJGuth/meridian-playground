import {
  AIIR_COACHING_GUIDE,
  LD12_FRAMEWORK_XML,
  VALUES_FRAMEWORK_XML,
} from "@/lib/frameworks";

export function buildFrameworkBlocks(): string {
  return `
<knowledge type="methodology" name="AIIR Coaching Guide"
  usage="Governs your coaching approach, session structure, assessment interpretation, goal setting, and development principles. Consult this on every response to ensure your coaching is methodologically grounded.">
${AIIR_COACHING_GUIDE}
</knowledge>

<knowledge type="framework" name="LD12 Leadership Framework"
  usage="Defines all 45 skills, 12 dimensions, and 3 domains. Always use exact skill names from this document. Do not paraphrase, rename, or invent skill names. Consult this whenever a user asks about any leadership skill or behaviour.">
${LD12_FRAMEWORK_XML}
</knowledge>

<knowledge type="framework" name="Values Navigator Framework"
  usage="Defines all 10 values dimensions and 26 sub-dimensions. Consult this when interpreting values assessment data or connecting coaching advice to what intrinsically motivates this leader. Values scores are motivational importance — not performance.">
${VALUES_FRAMEWORK_XML}
</knowledge>`.trim();
}
