import type { Skill, Dimension, Domain } from "@/lib/framework/ld12-definitions";
import type {
  ValuesSubDimension,
  ValuesDimension,
} from "@/lib/framework/values-definitions";

export interface ResolvedUserProfile {
  firstName: string;
  fullName: string;
  jobTitle: string;
  functionName: string;
  companyName: string;
  companyIndustry: string;
}

export type ScoreLabel = "High" | "Good" | "Low";
export type ProfileShape = "Balanced" | "Spiky" | "Developing";

export interface EnrichedSkill {
  skill: Skill;
  dimension: Dimension;
  domain: Domain;
  percentile: number;
  label: ScoreLabel;
}

export interface LD12Profile {
  personId: string;
  completedAt: string;
  profileShape: ProfileShape;
  skills: EnrichedSkill[];
  topStrengths: EnrichedSkill[];
  criticalGaps: EnrichedSkill[];
}

export type ValuesScoreLabel = "High importance" | "Moderate" | "Lower importance";

export interface EnrichedValue {
  subDimension: ValuesSubDimension;
  dimension: ValuesDimension;
  percentile: number;
  label: ValuesScoreLabel;
}

export interface ValuesProfile {
  personId: string;
  completedAt: string;
  values: EnrichedValue[];
  topMotivators: EnrichedValue[];
  lowerMotivators: EnrichedValue[];
}
