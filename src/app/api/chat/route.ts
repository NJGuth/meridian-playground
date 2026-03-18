import { streamText, type UIMessage, convertToModelMessages } from "ai";
import { getAllPrompts } from "@/server/actions/prompt";
import {
  IDENTITY_TONE_DEFAULTS,
  type IdentityToneConfig,
} from "@/lib/types/identity-tone";
import {
  RULES_CONFIG_DEFAULTS,
  type RulesConfig,
} from "@/lib/types/playground-rules";
import { buildFrameworkBlocks } from "@/lib/frameworks/buildFrameworkBlocks";
import { buildIdentityBlock } from "@/lib/prompt/buildIdentityBlock";
import { buildToneBlock } from "@/lib/prompt/buildToneBlock";
import { buildSessionContextBlock } from "@/lib/prompt/buildSessionContextBlock";
import { buildKnowledgePriorityBlock } from "@/lib/prompt/buildKnowledgePriorityBlock";
import { buildRulesBlock } from "@/lib/prompt/buildRulesBlock";
import { buildOutputFormattingBlock } from "@/lib/prompt/buildOutputFormattingBlock";
import { buildExamplesBlock } from "@/lib/prompt/buildExamplesBlock";
import {
  fetchPersonForChat,
  fetchLD12Assessment,
  fetchValuesAssessment,
} from "@/server/actions/assessment";
import {
  buildLD12Profile,
  serializeLD12ProfileToXML,
  type LD12Thresholds,
} from "@/lib/assessment/enrichment";
import {
  buildValuesProfile,
  serializeValuesProfileToXML,
  type ValuesThresholds,
} from "@/lib/assessment/valuesEnrichment";
import { getScoringConfig } from "@/server/actions/scoring";
import type { ResolvedUserProfile } from "@/lib/assessment/types";

function assembleSystemPrompt(params: {
  identityTone: IdentityToneConfig;
  rulesConfig: RulesConfig;
  user: ResolvedUserProfile | null;
  ld12XML: string | null;
  valuesXML: string | null;
  hasExamples: boolean;
}): string {
  const { identityTone, rulesConfig, user, ld12XML, valuesXML, hasExamples } =
    params;

  const parts: string[] = [
    buildFrameworkBlocks(),
    buildIdentityBlock(identityTone),
    buildToneBlock(identityTone),
  ];

  if (user) {
    parts.push(buildSessionContextBlock({ user, ld12XML, valuesXML }));
  }

  parts.push(
    buildKnowledgePriorityBlock(hasExamples),
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
  }: {
    messages: UIMessage[];
    model?: string;
    identityTone?: IdentityToneConfig;
    rulesConfig?: RulesConfig;
    personId?: string;
  } = await req.json();

  const config: IdentityToneConfig = identityTone ?? IDENTITY_TONE_DEFAULTS;
  const rules: RulesConfig = rulesConfig ?? RULES_CONFIG_DEFAULTS;

  let user: ResolvedUserProfile | null = null;
  let ld12XML: string | null = null;
  let valuesXML: string | null = null;

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
    const [person, ld12Assessment, valuesAssessment] = await Promise.all([
      fetchPersonForChat(personId),
      fetchLD12Assessment(personId),
      fetchValuesAssessment(personId),
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
    }
  }

  const examplesBlock = buildExamplesBlock(allPrompts);
  const hasExamples = examplesBlock.length > 0;

  const systemParts: string[] = [
    assembleSystemPrompt({
      identityTone: config,
      rulesConfig: rules,
      user,
      ld12XML,
      valuesXML,
      hasExamples,
    }),
  ];

  if (hasExamples) {
    systemParts.push(examplesBlock);
  }

  const system = systemParts.join("\n\n");

  const result = streamText({
    model: model || "anthropic/claude-sonnet-4-6",
    system,
    messages: await convertToModelMessages(messages),
    providerOptions: {
      anthropic: {
        cacheControl: { type: "ephemeral" },
      },
    },
  });

  return result.toUIMessageStreamResponse({
    sendReasoning: true,
  });
}
