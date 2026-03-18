import {
  VALUES_DIMENSIONS,
  VALUES_SUB_DIMENSION_BY_KEY,
  VALUES_DIMENSION_BY_KEY,
  type ValuesSubDimensionKey,
} from "@/lib/framework/values-definitions";
import type { ValuesScoreLabel, EnrichedValue, ValuesProfile } from "./types";

export interface ValuesThresholds {
  highThreshold: number;
  moderateThreshold: number;
}

export const VALUES_THRESHOLD_DEFAULTS: ValuesThresholds = {
  highThreshold: 75,
  moderateThreshold: 25,
};

export function classifyValuesScore(
  percentile: number,
  thresholds: ValuesThresholds = VALUES_THRESHOLD_DEFAULTS,
): ValuesScoreLabel {
  if (percentile >= thresholds.highThreshold) return "High importance";
  if (percentile >= thresholds.moderateThreshold) return "Moderate";
  return "Lower importance";
}

export function buildValuesProfile(
  personId: string,
  pctileScores: Record<string, number>,
  completedAt: string,
  thresholds: ValuesThresholds = VALUES_THRESHOLD_DEFAULTS,
): ValuesProfile {
  const enriched: EnrichedValue[] = [];

  for (const [key, percentile] of Object.entries(pctileScores)) {
    const subDim = VALUES_SUB_DIMENSION_BY_KEY.get(
      key as ValuesSubDimensionKey,
    );
    if (!subDim) continue;

    const dimension = VALUES_DIMENSION_BY_KEY.get(subDim.dimensionKey);
    if (!dimension) continue;

    enriched.push({
      subDimension: subDim,
      dimension,
      percentile,
      label: classifyValuesScore(percentile, thresholds),
    });
  }

  const sorted = [...enriched].sort((a, b) => b.percentile - a.percentile);
  const topMotivators = sorted.slice(0, 5);
  const lowerMotivators = sorted
    .filter((e) => e.label === "Lower importance")
    .slice(0, 5);

  return {
    personId,
    completedAt,
    values: enriched,
    topMotivators,
    lowerMotivators,
  };
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function serializeValuesProfileToXML(
  profile: ValuesProfile,
  thresholds: ValuesThresholds = VALUES_THRESHOLD_DEFAULTS,
): string {
  const topLines = profile.topMotivators
    .map(
      (e) =>
        `    <value name="${escapeXml(e.subDimension.title)}" dimension="${escapeXml(e.dimension.title)}" percentile="${e.percentile}" label="${e.label}" />`,
    )
    .join("\n");

  const lowerLines = profile.lowerMotivators
    .map(
      (e) =>
        `    <value name="${escapeXml(e.subDimension.title)}" dimension="${escapeXml(e.dimension.title)}" percentile="${e.percentile}" label="${e.label}" />`,
    )
    .join("\n");

  const dimensionBlocks = VALUES_DIMENSIONS.map((dim) => {
    const dimValues = profile.values
      .filter((e) => e.dimension.key === dim.key)
      .map(
        (e) =>
          `      <value name="${escapeXml(e.subDimension.title)}" percentile="${e.percentile}" label="${e.label}">
        <description>${escapeXml(e.subDimension.description)}</description>
      </value>`,
      )
      .join("\n");

    return `    <dimension name="${escapeXml(dim.title)}">
${dimValues}
    </dimension>`;
  }).join("\n");

  return `<values-assessment-data completedAt="${profile.completedAt}">
  <topMotivators>
${topLines}
  </topMotivators>
  <lowerMotivators>
${lowerLines}
  </lowerMotivators>
  <scores>
${dimensionBlocks}
  </scores>
  <interpretation-guide>
    Values scores represent motivational importance — NOT performance.
    High importance (≥${thresholds.highThreshold}th percentile): A core motivator — connect coaching advice to this value.
    Moderate (${thresholds.moderateThreshold}th–${thresholds.highThreshold - 1}th percentile): Present but not a primary driver.
    Lower importance (&lt;${thresholds.moderateThreshold}th percentile): Less motivating — do NOT frame as a deficit or weakness.
    Use values data to understand what intrinsically drives this leader and tailor development accordingly.
  </interpretation-guide>
</values-assessment-data>`;
}
