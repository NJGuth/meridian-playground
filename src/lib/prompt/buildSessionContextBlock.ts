import type { ResolvedUserProfile } from "@/lib/assessment/types";

export function buildSessionContextBlock(params: {
  user: ResolvedUserProfile;
  ld12XML: string | null;
  valuesXML: string | null;
}): string {
  const { user, ld12XML, valuesXML } = params;

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
</session-context>`;
}
