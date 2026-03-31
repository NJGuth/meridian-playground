import {
  HPI_SCALE_BY_KEY,
  HPI_SCALE_KEYS,
  HDS_SCALE_BY_KEY,
  HDS_SCALE_KEYS,
  MVPI_SCALE_BY_KEY,
  MVPI_SCALE_KEYS,
} from "@/lib/framework/hogan-definitions";
import type {
  HPIScoreLabel,
  HDSScoreLabel,
  MVPIScoreLabel,
  EnrichedHPIScale,
  EnrichedHDSScale,
  EnrichedMVPIScale,
  HPIProfile,
  HDSProfile,
  MVPIProfile,
} from "./types";

export function classifyHPIScore(percentile: number): HPIScoreLabel {
  if (percentile >= 65) return "High";
  if (percentile >= 36) return "Average";
  return "Low";
}

export function classifyHDSScore(percentile: number): HDSScoreLabel {
  if (percentile >= 90) return "High Risk";
  if (percentile >= 70) return "Moderate Risk";
  if (percentile >= 40) return "Low Risk";
  return "No Risk";
}

export function classifyMVPIScore(percentile: number): MVPIScoreLabel {
  return classifyHPIScore(percentile);
}

export function buildHPIProfile(
  personId: string,
  pctileScores: Record<string, number>,
  completedAt: string,
): HPIProfile {
  const scales: EnrichedHPIScale[] = [];

  for (const key of HPI_SCALE_KEYS) {
    const raw = pctileScores[key];
    if (raw === undefined) continue;
    const scale = HPI_SCALE_BY_KEY.get(key);
    if (!scale) continue;
    scales.push({
      scale,
      percentile: raw,
      label: classifyHPIScore(raw),
    });
  }

  const sortedHigh = [...scales]
    .filter((s) => s.label === "High")
    .sort((a, b) => b.percentile - a.percentile);
  const sortedLow = [...scales]
    .filter((s) => s.label === "Low")
    .sort((a, b) => a.percentile - b.percentile);

  return {
    personId,
    completedAt,
    scales,
    highs: sortedHigh.slice(0, 4),
    lows: sortedLow.slice(0, 4),
  };
}

export function buildHDSProfile(
  personId: string,
  pctileScores: Record<string, number>,
  completedAt: string,
): HDSProfile {
  const scales: EnrichedHDSScale[] = [];

  for (const key of HDS_SCALE_KEYS) {
    const raw = pctileScores[key];
    if (raw === undefined) continue;
    const scale = HDS_SCALE_BY_KEY.get(key);
    if (!scale) continue;
    scales.push({
      scale,
      percentile: raw,
      label: classifyHDSScore(raw),
    });
  }

  const elevatedRisks = scales
    .filter(
      (s) => s.label === "Moderate Risk" || s.label === "High Risk",
    )
    .sort((a, b) => b.percentile - a.percentile);

  const clusterSet = new Set<string>();
  for (const s of elevatedRisks) {
    clusterSet.add(s.scale.cluster);
  }

  return {
    personId,
    completedAt,
    scales,
    elevatedRisks,
    clustersWithElevation: [...clusterSet],
  };
}

export function buildMVPIProfile(
  personId: string,
  pctileScores: Record<string, number>,
  completedAt: string,
): MVPIProfile {
  const scales: EnrichedMVPIScale[] = [];

  for (const key of MVPI_SCALE_KEYS) {
    const raw = pctileScores[key];
    if (raw === undefined) continue;
    const scale = MVPI_SCALE_BY_KEY.get(key);
    if (!scale) continue;
    scales.push({
      scale,
      percentile: raw,
      label: classifyMVPIScore(raw),
    });
  }

  const sorted = [...scales].sort((a, b) => b.percentile - a.percentile);
  const topDrivers = sorted.filter((s) => s.label === "High").slice(0, 5);
  const lowerPriorities = scales
    .filter((s) => s.label === "Low")
    .sort((a, b) => a.percentile - b.percentile)
    .slice(0, 5);

  return {
    personId,
    completedAt,
    scales,
    topDrivers: topDrivers.length > 0 ? topDrivers : sorted.slice(0, 5),
    lowerPriorities,
  };
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function serializeHPIProfileToXML(profile: HPIProfile): string {
  const highLines = profile.highs
    .map(
      (e) =>
        `    <scale name="${escapeXml(e.scale.title)}" percentile="${Math.round(e.percentile)}" label="${e.label}" insight="${escapeXml(e.scale.insightRegarding)}" />`,
    )
    .join("\n");

  const lowLines = profile.lows
    .map(
      (e) =>
        `    <scale name="${escapeXml(e.scale.title)}" percentile="${Math.round(e.percentile)}" label="${e.label}" insight="${escapeXml(e.scale.insightRegarding)}" />`,
    )
    .join("\n");

  const scoreLines = profile.scales
    .map(
      (e) =>
        `    <scale name="${escapeXml(e.scale.title)}" key="${e.scale.key}" percentile="${Math.round(e.percentile)}" label="${e.label}" ffm="${escapeXml(e.scale.ffmFactor)}">
      <low_summary>${escapeXml(e.scale.lowScoreSummary)}</low_summary>
      <high_summary>${escapeXml(e.scale.highScoreSummary)}</high_summary>
    </scale>`,
    )
    .join("\n");

  return `<hogan-assessment-data instrument="HPI" label="Bright Side" completedAt="${profile.completedAt}">
  <interpretation-guide>
    HPI scores are percentiles vs working adults. Low/Average/High are not good or bad — both ends have strengths and risks.
    High (≥65th): Everyday strengths may become rigid or overused. Low (≤35th): Challenges and genuine team benefits. Average (36–64): Typical range.
    Cross-reference with HDS; never interpret HPI in isolation from context.
  </interpretation-guide>
  <highlights>
    <elevated_scales note="High HPI — visible everyday strengths; note extreme highs (90+) may suggest extreme response style">
${highLines || "    <!-- none -->"}
    </elevated_scales>
    <lower_scales note="Low HPI — development areas and low-score benefits">
${lowLines || "    <!-- none -->"}
    </lower_scales>
  </highlights>
  <scores>
${scoreLines}
  </scores>
</hogan-assessment-data>`;
}

export function serializeHDSProfileToXML(profile: HDSProfile): string {
  const riskLines = profile.elevatedRisks
    .map(
      (e) =>
        `    <scale name="${escapeXml(e.scale.title)}" percentile="${Math.round(e.percentile)}" label="${e.label}" cluster="${escapeXml(e.scale.cluster)}" />`,
    )
    .join("\n");

  const clusters =
    profile.clustersWithElevation.length > 0
      ? profile.clustersWithElevation.map((c) => escapeXml(c)).join(", ")
      : "none noted";

  const scoreLines = profile.scales
    .map(
      (e) =>
        `    <scale name="${escapeXml(e.scale.title)}" key="${e.scale.key}" percentile="${Math.round(e.percentile)}" label="${e.label}" cluster="${escapeXml(e.scale.cluster)}">
      <everyday_strength>${escapeXml(e.scale.everydayStrength)}</everyday_strength>
      <overused_risk>${escapeXml(e.scale.overusedRisk)}</overused_risk>
    </scale>`,
    )
    .join("\n");

  return `<hogan-assessment-data instrument="HDS" label="Dark Side" completedAt="${profile.completedAt}">
  <interpretation-guide>
    HDS scores are performance risks under stress — higher = more likelihood risks emerge. Moderate/High risk is common for 1–2 scales.
    Do not interpret a single HDS scale alone; use patterns and cross-reference HPI. Absence of high risk is not automatically a strength.
    Clusters with elevations in this profile: ${clusters}.
  </interpretation-guide>
  <elevated_risks note="Moderate or High risk — prioritize in coaching">
${riskLines || "    <!-- none in moderate/high band -->"}
  </elevated_risks>
  <scores>
${scoreLines}
  </scores>
</hogan-assessment-data>`;
}

export function serializeMVPIProfileToXML(profile: MVPIProfile): string {
  const topLines = profile.topDrivers
    .map(
      (e) =>
        `    <value name="${escapeXml(e.scale.title)}" percentile="${Math.round(e.percentile)}" label="${e.label}" cluster="${escapeXml(e.scale.cluster)}" />`,
    )
    .join("\n");

  const lowerLines = profile.lowerPriorities
    .map(
      (e) =>
        `    <value name="${escapeXml(e.scale.title)}" percentile="${Math.round(e.percentile)}" label="${e.label}" />`,
    )
    .join("\n");

  const scoreLines = profile.scales
    .map(
      (e) =>
        `    <value name="${escapeXml(e.scale.title)}" key="${e.scale.key}" percentile="${Math.round(e.percentile)}" label="${e.label}" cluster="${escapeXml(e.scale.cluster)}">
      <high_definition>${escapeXml(e.scale.highDefinition)}</high_definition>
    </value>`,
    )
    .join("\n");

  return `<hogan-assessment-data instrument="MVPI" label="Inside / Values" completedAt="${profile.completedAt}">
  <interpretation-guide>
    MVPI scores reflect values and motives — what the person strives for — not performance. High = seeks; Low = less motivating (not a deficit).
    Use to explain how HPI/HDS patterns show up in real goals and culture fit.
  </interpretation-guide>
  <top_drivers>
${topLines}
  </top_drivers>
  <lower_priorities note="Low scores are lower motive — do not frame as weakness">
${lowerLines || "    <!-- none -->"}
  </lower_priorities>
  <scores>
${scoreLines}
  </scores>
</hogan-assessment-data>`;
}
