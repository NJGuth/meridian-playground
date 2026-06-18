import { convertToModelMessages, streamText, tool, type UIMessage } from "ai";
import { z } from "zod";
import {
  buildLD12Profile,
  type LD12Thresholds,
  serializeLD12ProfileToXML,
} from "@/lib/assessment/enrichment";
import {
  buildHDSProfile,
  buildHPIProfile,
  buildMVPIProfile,
  serializeHDSProfileToXML,
  serializeHPIProfileToXML,
  serializeMVPIProfileToXML,
} from "@/lib/assessment/hoganEnrichment";
import type { ResolvedUserProfile } from "@/lib/assessment/types";
import {
  buildValuesProfile,
  serializeValuesProfileToXML,
  type ValuesThresholds,
} from "@/lib/assessment/valuesEnrichment";
import { buildFrameworkBlocks } from "@/lib/frameworks/buildFrameworkBlocks";
import { developmentPlanSchema } from "@/lib/plan/schema";
import { buildCurrentPlanBlock } from "@/lib/prompt/buildCurrentPlanBlock";
import { buildExamplesBlock } from "@/lib/prompt/buildExamplesBlock";
import { buildIdentityBlock } from "@/lib/prompt/buildIdentityBlock";
import { buildKnowledgePriorityBlock } from "@/lib/prompt/buildKnowledgePriorityBlock";
import { buildOutputFormattingBlock } from "@/lib/prompt/buildOutputFormattingBlock";
import { buildRulesBlock } from "@/lib/prompt/buildRulesBlock";
import { buildSessionContextBlock } from "@/lib/prompt/buildSessionContextBlock";
import { buildToneBlock } from "@/lib/prompt/buildToneBlock";
import { buildWelcomeBlock } from "@/lib/prompt/buildWelcomeBlock";
import {
  FEEDBACK_STYLE_OPTIONS,
  IDENTITY_TONE_DEFAULTS,
  type IdentityToneConfig,
} from "@/lib/types/identity-tone";
import {
  RULES_CONFIG_DEFAULTS,
  type RulesConfig,
} from "@/lib/types/playground-rules";
import {
  fetchHDSAssessment,
  fetchHPIAssessment,
  fetchLD12Assessment,
  fetchMVPIAssessment,
  fetchPersonForChat,
  fetchValuesAssessment,
} from "@/server/actions/assessment";
import { getAllPrompts } from "@/server/actions/prompt";
import { getScoringConfig } from "@/server/actions/scoring";

function assembleSystemPrompt(params: {
  identityTone: IdentityToneConfig;
  rulesConfig: RulesConfig;
  welcomeMessage: string;
  user: ResolvedUserProfile | null;
  ld12XML: string | null;
  valuesXML: string | null;
  hoganHpiXML: string | null;
  hoganHdsXML: string | null;
  hoganMvpiXML: string | null;
  includeHoganKnowledge: boolean;
  hasExamples: boolean;
  currentPlanMarkdown: string | null;
}): string {
  const {
    identityTone,
    rulesConfig,
    welcomeMessage,
    user,
    ld12XML,
    valuesXML,
    hoganHpiXML,
    hoganHdsXML,
    hoganMvpiXML,
    includeHoganKnowledge,
    hasExamples,
    currentPlanMarkdown,
  } = params;

  const parts: string[] = [
    buildFrameworkBlocks({ includeHogan: includeHoganKnowledge }),
    buildIdentityBlock(identityTone),
    buildToneBlock(identityTone),
    buildWelcomeBlock(identityTone, welcomeMessage),
  ];

  if (user) {
    parts.push(
      buildSessionContextBlock({
        user,
        ld12XML,
        valuesXML,
        hoganHpiXML,
        hoganHdsXML,
        hoganMvpiXML,
      }),
    );
  }

  const planBlock = buildCurrentPlanBlock(currentPlanMarkdown);
  if (planBlock) {
    parts.push(planBlock);
  }

  parts.push(
    buildKnowledgePriorityBlock(hasExamples, includeHoganKnowledge),
    buildRulesBlock({ user, identityTone, rulesConfig }),
    buildOutputFormattingBlock(hasExamples),
  );

  return parts.join("\n\n");
}

export async function POST(req: Request) {
  const {
    messages,
    model,
    identityTone,
    rulesConfig,
    personId,
    welcomeMessage,
    currentPlanMarkdown,
  }: {
    messages: UIMessage[];
    model?: string;
    identityTone?: IdentityToneConfig;
    rulesConfig?: RulesConfig;
    personId?: string;
    welcomeMessage?: string;
    currentPlanMarkdown?: string;
  } = await req.json();

  const config: IdentityToneConfig = identityTone ?? IDENTITY_TONE_DEFAULTS;
  const rules: RulesConfig = rulesConfig ?? RULES_CONFIG_DEFAULTS;

  let user: ResolvedUserProfile | null = null;
  let ld12XML: string | null = null;
  let valuesXML: string | null = null;
  let hoganHpiXML: string | null = null;
  let hoganHdsXML: string | null = null;
  let hoganMvpiXML: string | null = null;
  let includeHoganKnowledge = false;

  const [allPrompts, scoringCfg] = await Promise.all([
    getAllPrompts(),
    getScoringConfig(),
  ]);

  const ld12Thresholds: LD12Thresholds = {
    highThreshold: scoringCfg.ld12HighThreshold,
    goodThreshold: scoringCfg.ld12GoodThreshold,
    developingMean: scoringCfg.profileShapeDevelopingMean,
    spikyStdDev: scoringCfg.profileShapeSpikyStdDev,
  };

  const valuesThresholds: ValuesThresholds = {
    highThreshold: scoringCfg.valuesHighThreshold,
    moderateThreshold: scoringCfg.valuesModerateThreshold,
  };

  if (personId) {
    const [
      person,
      ld12Assessment,
      valuesAssessment,
      hpiAssessment,
      hdsAssessment,
      mvpiAssessment,
    ] = await Promise.all([
      fetchPersonForChat(personId),
      fetchLD12Assessment(personId),
      fetchValuesAssessment(personId),
      fetchHPIAssessment(personId),
      fetchHDSAssessment(personId),
      fetchMVPIAssessment(personId),
    ]);

    if (person) {
      user = {
        firstName: person.firstName,
        fullName: `${person.firstName} ${person.lastName}`,
        jobTitle: person.jobTitle,
        functionName: person.function,
        companyName: person.company,
        companyIndustry: person.industry,
      };

      if (ld12Assessment) {
        const profile = buildLD12Profile(
          personId,
          ld12Assessment.pctileScores,
          ld12Assessment.completedAt,
          ld12Thresholds,
        );
        ld12XML = serializeLD12ProfileToXML(profile, ld12Thresholds);
      }

      if (valuesAssessment) {
        const profile = buildValuesProfile(
          personId,
          valuesAssessment.pctileScores,
          valuesAssessment.completedAt,
          valuesThresholds,
        );
        valuesXML = serializeValuesProfileToXML(profile, valuesThresholds);
      }

      includeHoganKnowledge = !!(
        hpiAssessment ||
        hdsAssessment ||
        mvpiAssessment
      );

      if (hpiAssessment) {
        const profile = buildHPIProfile(
          personId,
          hpiAssessment.pctileScores,
          hpiAssessment.completedAt,
        );
        hoganHpiXML = serializeHPIProfileToXML(profile);
      }

      if (hdsAssessment) {
        const profile = buildHDSProfile(
          personId,
          hdsAssessment.pctileScores,
          hdsAssessment.completedAt,
        );
        hoganHdsXML = serializeHDSProfileToXML(profile);
      }

      if (mvpiAssessment) {
        const profile = buildMVPIProfile(
          personId,
          mvpiAssessment.pctileScores,
          mvpiAssessment.completedAt,
        );
        hoganMvpiXML = serializeMVPIProfileToXML(profile);
      }
    }
  }

  const examplesBlock = buildExamplesBlock(allPrompts);
  const hasExamples = examplesBlock.length > 0;

  const resolvedWelcome =
    welcomeMessage ?? "Hi {firstName}, my name is {coachName}.";

  const systemParts: string[] = [
    assembleSystemPrompt({
      identityTone: config,
      rulesConfig: rules,
      welcomeMessage: resolvedWelcome,
      user,
      ld12XML,
      valuesXML,
      hoganHpiXML,
      hoganHdsXML,
      hoganMvpiXML,
      includeHoganKnowledge,
      hasExamples,
      currentPlanMarkdown: currentPlanMarkdown ?? null,
    }),
  ];

  if (hasExamples) {
    systemParts.push(examplesBlock);
  }

  const system = systemParts.join("\n\n");

  const selectedModel = model || "anthropic/claude-sonnet-4-6";
  const isAnthropic = selectedModel.startsWith("anthropic/");

  const feedbackStyleValues = FEEDBACK_STYLE_OPTIONS.map((o) => o.value) as [
    string,
    ...string[],
  ];

  const result = streamText({
    model: selectedModel,
    system,
    messages: await convertToModelMessages(messages),
    tools: {
      selectFeedbackStyle: tool({
        description:
          "Present the user with feedback style options to choose from. Call this at the start of a new conversation (after your welcome message) and whenever the user asks to change their feedback style.",
        inputSchema: z.object({
          currentStyle: z
            .enum(feedbackStyleValues)
            .describe("The currently active feedback style"),
        }),
      }),
      createDevelopmentPlan: tool({
        description:
          "Create a structured Strategic Development Plan for the user. Call this only when the user explicitly asks you to create, draft, or build a development plan. Ground every goal in the user's LD12 profile and a named LD12 skill, and follow the SMART structure from the coaching guide. To refine or discuss an EXISTING plan, do not call this tool again - reference the current plan and suggest changes conversationally.",
        inputSchema: developmentPlanSchema,
      }),
    },
    providerOptions: {
      ...(isAnthropic && {
        anthropic: {
          cacheControl: { type: "ephemeral" },
          thinking: { type: "enabled", budgetTokens: 10000 },
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse({
    sendReasoning: true,
    messageMetadata: ({ part }) => {
      if (part.type === "finish") {
        return { totalUsage: part.totalUsage };
      }
    },
  });
}
