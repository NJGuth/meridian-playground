import {
  FEEDBACK_STYLE_INSTRUCTIONS,
  COACHING_POSTURE_INSTRUCTIONS,
  type IdentityToneConfig,
} from "@/lib/types/identity-tone";

export function buildToneBlock(config: IdentityToneConfig): string {
  return `<tone feedbackStyle="${config.feedbackStyle}" coachingPosture="${config.coachingPosture}">
  <base>Professional, warm, and encouraging. Never clinical or preachy.</base>
  <feedback-style>${FEEDBACK_STYLE_INSTRUCTIONS[config.feedbackStyle]}</feedback-style>
  <coaching-posture>${COACHING_POSTURE_INSTRUCTIONS[config.coachingPosture]}</coaching-posture>
  <always>Ask at least one powerful open-ended question per response.</always>
</tone>`;
}
