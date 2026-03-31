import {
  FEEDBACK_STYLE_OPTIONS,
  type IdentityToneConfig,
} from "@/lib/types/identity-tone";

export function buildWelcomeBlock(
  identityTone: IdentityToneConfig,
  welcomeMessage: string,
): string {
  const styleList = FEEDBACK_STYLE_OPTIONS.map(
    (s) => `  - ${s.value}: ${s.description}`,
  ).join("\n");

  return `<welcome-message>
  <template>${welcomeMessage}</template>
  <instructions>
    When the very first user message is exactly "[INITIATE_CONVERSATION]", respond with the welcome message template above (substituting any {firstName} and {coachName} placeholders with actual values from the session context and identity).
    After your greeting, you MUST call the selectFeedbackStyle tool to let the user choose their preferred feedback style.
    The current default feedback style is "${identityTone.feedbackStyle}".
    Available feedback styles:
${styleList}
  </instructions>
  <feedback-style-change>
    If the user says "Change feedback style" (or similar intent), call the selectFeedbackStyle tool again.
    After the user selects a style, confirm with: "That's great, I'll use a ${"{selectedStyle}"} feedback style for this conversation. You can change this at any time by saying 'Change feedback style'."
  </feedback-style-change>
</welcome-message>`;
}
