export type RuleCategory =
  | "persona"
  | "data-integrity"
  | "coaching"
  | "values"
  | "safety"
  | "custom";

export interface PlaygroundRule {
  id: string;
  category: RuleCategory;
  text: string;
  defaultActive: boolean;
  description: string;
}

export interface RulesConfig {
  disabledRuleIds: string[];
  customRules: string[];
}

export const RULES_CONFIG_DEFAULTS: RulesConfig = {
  disabledRuleIds: [],
  customRules: [],
};
