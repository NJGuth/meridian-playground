import {
  SKILLS,
  DIMENSIONS,
  DOMAINS,
  DIMENSION_BY_ID,
  DOMAIN_BY_ID,
  type Skill,
} from "@/lib/framework/ld12-definitions";
import type {
  ScoreLabel,
  ProfileShape,
  EnrichedSkill,
  LD12Profile,
} from "./types";

function skillToKey(skill: Skill): string {
  return skill.name.replace(/[\s-]/g, "_");
}

const SKILL_KEY_MAP = new Map<string, Skill>(
  SKILLS.map((s) => [skillToKey(s), s]),
);

export interface LD12Thresholds {
  highThreshold: number;
  goodThreshold: number;
  developingMean: number;
  spikyStdDev: number;
}

export const LD12_THRESHOLD_DEFAULTS: LD12Thresholds = {
  highThreshold: 75,
  goodThreshold: 25,
  developingMean: 35,
  spikyStdDev: 20,
};

export function classifyScore(
  percentile: number,
  thresholds: LD12Thresholds = LD12_THRESHOLD_DEFAULTS,
): ScoreLabel {
  if (percentile >= thresholds.highThreshold) return "High";
  if (percentile >= thresholds.goodThreshold) return "Good";
  return "Low";
}

export function determineProfileShape(
  scores: number[],
  thresholds: LD12Thresholds = LD12_THRESHOLD_DEFAULTS,
): ProfileShape {
  if (scores.length === 0) return "Developing";

  const mean = scores.reduce((a, b) => a + b, 0) / scores.length;

  if (mean < thresholds.developingMean) return "Developing";

  const variance =
    scores.reduce((sum, s) => sum + (s - mean) ** 2, 0) / scores.length;
  const stdDev = Math.sqrt(variance);

  return stdDev >= thresholds.spikyStdDev ? "Spiky" : "Balanced";
}

export function buildLD12Profile(
  personId: string,
  pctileScores: Record<string, number>,
  completedAt: string,
  thresholds: LD12Thresholds = LD12_THRESHOLD_DEFAULTS,
): LD12Profile {
  const enriched: EnrichedSkill[] = [];

  for (const [key, percentile] of Object.entries(pctileScores)) {
    const skill = SKILL_KEY_MAP.get(key);
    if (!skill) continue;

    const dimension = DIMENSION_BY_ID.get(skill.dimensionId);
    const domain = DOMAIN_BY_ID.get(skill.domainId);
    if (!dimension || !domain) continue;

    enriched.push({
      skill,
      dimension,
      domain,
      percentile,
      label: classifyScore(percentile, thresholds),
    });
  }

  const sorted = [...enriched].sort((a, b) => b.percentile - a.percentile);
  const topStrengths = sorted.slice(0, 5);
  const criticalGaps = sorted.slice(-5).reverse();

  const allPercentiles = enriched.map((e) => e.percentile);
  const profileShape = determineProfileShape(allPercentiles, thresholds);

  return {
    personId,
    completedAt,
    profileShape,
    skills: enriched,
    topStrengths,
    criticalGaps,
  };
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function serializeLD12ProfileToXML(
  profile: LD12Profile,
  thresholds: LD12Thresholds = LD12_THRESHOLD_DEFAULTS,
): string {
  const strengthLines = profile.topStrengths
    .map(
      (e) =>
        `    <skill name="${escapeXml(e.skill.name)}" percentile="${e.percentile}" label="${e.label}" />`,
    )
    .join("\n");

  const gapLines = profile.criticalGaps
    .map(
      (e) =>
        `    <skill name="${escapeXml(e.skill.name)}" percentile="${e.percentile}" label="${e.label}" />`,
    )
    .join("\n");

  const domainBlocks = DOMAINS.map((domain) => {
    const domainDimensions = DIMENSIONS.filter(
      (d) => d.domainId === domain.id,
    );
    const dimensionBlocks = domainDimensions
      .map((dim) => {
        const dimSkills = profile.skills
          .filter((e) => e.dimension.id === dim.id)
          .map((e) => {
            const desc =
              e.label === "High"
                ? e.skill.strengthDescription
                : e.label === "Low"
                  ? e.skill.opportunityDescription
                  : "";
            const descAttr = desc
              ? ` description="${escapeXml(desc)}"`
              : "";
            return `        <skill name="${escapeXml(e.skill.name)}" percentile="${e.percentile}" label="${e.label}"${descAttr} />`;
          })
          .join("\n");

        return `      <dimension name="${escapeXml(dim.name)}">
${dimSkills}
      </dimension>`;
      })
      .join("\n");

    return `    <domain name="${escapeXml(domain.name)}">
${dimensionBlocks}
    </domain>`;
  }).join("\n");

  return `<assessment-data type="ld12" completedAt="${profile.completedAt}" profileShape="${profile.profileShape}">
  <topStrengths>
${strengthLines}
  </topStrengths>
  <criticalGaps>
${gapLines}
  </criticalGaps>
  <scores>
${domainBlocks}
  </scores>
  <interpretation-guide>
    High (≥${thresholds.highThreshold}th percentile): A clear strength — leverage in coaching and development planning.
    Good (${thresholds.goodThreshold}th–${thresholds.highThreshold - 1}th percentile): Adequate — may benefit from targeted development depending on role demands.
    Low (&lt;${thresholds.goodThreshold}th percentile): A development priority — explore root causes and create action plans.
    profileShape="Balanced": Scores are relatively even across skills.
    profileShape="Spiky": Significant variance — notable peaks and valleys that shape the leader's style.
    profileShape="Developing": Most scores are below the ${thresholds.developingMean}th percentile — broad development needed.
  </interpretation-guide>
</assessment-data>`;
}
