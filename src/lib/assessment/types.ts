import type { Skill, Dimension, Domain } from "@/lib/framework/ld12-definitions";
import type {
  ValuesSubDimension,
  ValuesDimension,
} from "@/lib/framework/values-definitions";
import type {
  HPIScale,
  HDSScale,
  MVPIScale,
} from "@/lib/framework/hogan-definitions";

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

export type HPIScoreLabel = "Low" | "Average" | "High";
export type HDSScoreLabel =
  | "No Risk"
  | "Low Risk"
  | "Moderate Risk"
  | "High Risk";
export type MVPIScoreLabel = "Low" | "Average" | "High";

export interface EnrichedHPIScale {
  scale: HPIScale;
  percentile: number;
  label: HPIScoreLabel;
}

export interface EnrichedHDSScale {
  scale: HDSScale;
  percentile: number;
  label: HDSScoreLabel;
}

export interface EnrichedMVPIScale {
  scale: MVPIScale;
  percentile: number;
  label: MVPIScoreLabel;
}

export interface HPIProfile {
  personId: string;
  completedAt: string;
  scales: EnrichedHPIScale[];
  highs: EnrichedHPIScale[];
  lows: EnrichedHPIScale[];
}

export interface HDSProfile {
  personId: string;
  completedAt: string;
  scales: EnrichedHDSScale[];
  elevatedRisks: EnrichedHDSScale[];
  clustersWithElevation: string[];
}

export interface MVPIProfile {
  personId: string;
  completedAt: string;
  scales: EnrichedMVPIScale[];
  topDrivers: EnrichedMVPIScale[];
  lowerPriorities: EnrichedMVPIScale[];
}
