import type { ResolvedUserProfile } from "@/lib/assessment/types";

export function buildSessionContextBlock(params: {
  user: ResolvedUserProfile;
  ld12XML: string | null;
  valuesXML: string | null;
  hoganHpiXML: string | null;
  hoganHdsXML: string | null;
  hoganMvpiXML: string | null;
}): string {
  const {
    user,
    ld12XML,
    valuesXML,
    hoganHpiXML,
    hoganHdsXML,
    hoganMvpiXML,
  } = params;

  const ld12Block =
    ld12XML ??
    `<assessment-data type="ld12" status="not-completed">
  No LD12 assessment data available for this user.
  Do not reference or invent scores.
  If the user asks about their results, let them know their LD12 assessment has not been completed.
</assessment-data>`;

  const valuesBlock =
    valuesXML ??
    `<values-assessment-data status="not-completed">
  No Values Navigator data available for this user.
</values-assessment-data>`;

  const hpiBlock =
    hoganHpiXML ??
    `<hogan-assessment-data instrument="HPI" status="not-completed">
  No Hogan HPI (Bright Side) data for this user. Do not invent HPI scores.
</hogan-assessment-data>`;

  const hdsBlock =
    hoganHdsXML ??
    `<hogan-assessment-data instrument="HDS" status="not-completed">
  No Hogan HDS (Dark Side) data for this user. Do not invent HDS scores.
</hogan-assessment-data>`;

  const mvpiBlock =
    hoganMvpiXML ??
    `<hogan-assessment-data instrument="MVPI" status="not-completed">
  No Hogan MVPI (Inside / values) data for this user. Do not invent MVPI scores.
</hogan-assessment-data>`;

  const hoganResultsBlock = `<hogan-assessment-results
    role="same_as_ld12_for_hogan"
    interpretation_reference="Hogan Interpretation Guide"
    usage="This user's Hogan percentiles (HPI, HDS, MVPI) when present. Treat like LD12: ground coaching in these numbers only. For how to discuss Hogan—reputation not identity, bands, HPI/HDS/MVPI integration, configural patterns, probabilistic language, and feedback delivery—follow the 'Hogan Interpretation Guide' and 'Hogan Assessment Scales' knowledge blocks in the system prompt. Do not contradict those guides; do not invent scores not shown below."
  >
${hpiBlock}

${hdsBlock}

${mvpiBlock}
  </hogan-assessment-results>`;

  return `<session-context>
  <user-profile
    firstName="${user.firstName}"
    fullName="${user.fullName}"
    jobTitle="${user.jobTitle}"
    function="${user.functionName}"
    company="${user.companyName}"
    industry="${user.companyIndustry}"
  />

  ${ld12Block}

  ${valuesBlock}

${hoganResultsBlock}
</session-context>`;
}
