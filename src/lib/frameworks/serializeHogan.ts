import {
  HPI_SCALES,
  HDS_SCALES,
  MVPI_SCALES,
  HPI_BANDS_THREE,
  HDS_BANDS,
  MVPI_BANDS_THREE,
} from "@/lib/framework/hogan-definitions";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function serializeHoganFramework(): string {
  const hpiBlocks = HPI_SCALES.map((s) => {
    const subs = s.subscales
      .map((sub) => `      <subscale name="${escapeXml(sub.name)}" />`)
      .join("\n");
    return `  <hpi_scale key="${s.key}" title="${escapeXml(s.title)}" insight="${escapeXml(s.insightRegarding)}" ffm="${escapeXml(s.ffmFactor)}">
    <low>${escapeXml(s.lowScoreSummary)}</low>
    <high>${escapeXml(s.highScoreSummary)}</high>
    <subscales>
${subs}
    </subscales>
  </hpi_scale>`;
  }).join("\n");

  const hdsBlocks = HDS_SCALES.map((s) => {
    const subs = s.subscales
      .map((sub) => `      <subscale name="${escapeXml(sub.name)}" />`)
      .join("\n");
    return `  <hds_scale key="${s.key}" title="${escapeXml(s.title)}" cluster="${escapeXml(s.cluster)}">
    <everyday_strength>${escapeXml(s.everydayStrength)}</everyday_strength>
    <overused_risk>${escapeXml(s.overusedRisk)}</overused_risk>
    <subscales>
${subs}
    </subscales>
  </hds_scale>`;
  }).join("\n");

  const mvpiBlocks = MVPI_SCALES.map((s) => {
    const subs = s.subscales
      .map((sub) => `      <subscale name="${escapeXml(sub.name)}" />`)
      .join("\n");
    return `  <mvpi_scale key="${s.key}" title="${escapeXml(s.title)}" cluster="${escapeXml(s.cluster)}">
    <high_definition>${escapeXml(s.highDefinition)}</high_definition>
    <subscales>
${subs}
    </subscales>
  </mvpi_scale>`;
  }).join("\n");

  const hpiBands = Object.entries(HPI_BANDS_THREE)
    .map(
      ([name, r]) =>
        `    <band name="${name}" min="${r.min}" max="${r.max}" />`,
    )
    .join("\n");

  const hdsBands = Object.entries(HDS_BANDS)
    .map(([name, r]) => {
      const label = name.replace(/_/g, " ");
      return `    <band name="${label}" min="${r.min}" max="${r.max}" />`;
    })
    .join("\n");

  const mvpiBands = Object.entries(MVPI_BANDS_THREE)
    .map(
      ([name, r]) =>
        `    <band name="${name}" min="${r.min}" max="${r.max}" />`,
    )
    .join("\n");

  return `<hogan-framework version="1.0">
  <overview>Hogan measures workplace reputation (how others tend to see the person) across HPI (everyday personality), HDS (stress derailers), and MVPI (values and motives).</overview>
  <scoring_bands>
    <hpi_three_level>
${hpiBands}
    </hpi_three_level>
    <hds_risk>
${hdsBands}
    </hds_risk>
    <mvpi_three_level>
${mvpiBands}
    </mvpi_three_level>
  </scoring_bands>
  <hpi>
${hpiBlocks}
  </hpi>
  <hds>
${hdsBlocks}
  </hds>
  <mvpi>
${mvpiBlocks}
  </mvpi>
</hogan-framework>`;
}

export const HOGAN_FRAMEWORK_XML = serializeHoganFramework();
