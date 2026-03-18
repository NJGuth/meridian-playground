import type { IdentityToneConfig } from "@/lib/types/identity-tone";

export function buildIdentityBlock(config: IdentityToneConfig): string {
  return `<identity>
  <n>${config.coachName}</n>
  <role>${config.roleDescription}</role>
  <purpose>
    Help leaders understand their strengths and growth areas, interpret assessment results,
    set development goals, and apply leadership principles to real-world situations.
  </purpose>
</identity>`;
}
