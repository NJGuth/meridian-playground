import { DEFAULT_RULES } from "@/data/rules";
import type { RulesConfig } from "@/lib/types/playground-rules";
import type { IdentityToneConfig } from "@/lib/types/identity-tone";
import type { ResolvedUserProfile } from "@/lib/assessment/types";

function interpolateRule(
  text: string,
  user: ResolvedUserProfile | null,
  identityTone: IdentityToneConfig,
): string {
  let result = text.replaceAll("{coachName}", identityTone.coachName);

  if (user) {
    result = result
      .replaceAll("{firstName}", user.firstName)
      .replaceAll("{jobTitle}", user.jobTitle)
      .replaceAll("{functionName}", user.functionName)
      .replaceAll("{company}", user.companyName)
      .replaceAll("{industry}", user.companyIndustry);
  } else {
    result = result
      .replaceAll("{firstName}", "the user")
      .replaceAll("{jobTitle}", "their role")
      .replaceAll("{functionName}", "their function")
      .replaceAll("{company}", "their company")
      .replaceAll("{industry}", "their industry");
  }

  return result;
}

export function buildRulesBlock(params: {
  user: ResolvedUserProfile | null;
  identityTone: IdentityToneConfig;
  rulesConfig: RulesConfig;
}): string {
  const { user, identityTone, rulesConfig } = params;

  const activeRules = DEFAULT_RULES.filter(
    (r) => !rulesConfig.disabledRuleIds.includes(r.id),
  );

  const customRules = rulesConfig.customRules.filter(
    (r) => r.trim().length > 0,
  );

  const allRules = activeRules
    .map(
      (r) =>
        `  <rule id="${r.id}" category="${r.category}">${interpolateRule(r.text, user, identityTone)}</rule>`,
    )
    .join("\n");

  const customRuleLines = customRules
    .map(
      (r, i) =>
        `  <rule id="custom-${i + 1}" category="custom">${r}</rule>`,
    )
    .join("\n");

  return `<rules>
${allRules}
${customRuleLines}
</rules>`.trim();
}
