"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  ModelSelector,
  ModelSelectorTrigger,
  ModelSelectorContent,
  ModelSelectorInput,
  ModelSelectorList,
  ModelSelectorEmpty,
  ModelSelectorGroup,
  ModelSelectorItem,
  ModelSelectorLogo,
  ModelSelectorName,
} from "@/components/ai-elements/model-selector";
import { updatePlaygroundModel } from "@/server/actions/playground";

const MODEL_GROUPS = [
  {
    provider: "anthropic" as const,
    label: "Anthropic",
    models: [
      { id: "anthropic/claude-opus-4-6", name: "Claude Opus 4.6" },
      { id: "anthropic/claude-sonnet-4-6", name: "Claude Sonnet 4.6" },
    ],
  },
  {
    provider: "openai" as const,
    label: "OpenAI",
    models: [
      { id: "openai/gpt-5.4", name: "GPT-5.4" },
      { id: "openai/gpt-5.2", name: "GPT-5.2" },
    ],
  },
  {
    provider: "google" as const,
    label: "Google",
    models: [
      { id: "google/gemini-3.1-pro", name: "Gemini 3.1 Pro" },
    ],
  },
  {
    provider: "xai" as const,
    label: "xAI",
    models: [{ id: "xai/grok-4.1", name: "Grok 4.1" }],
  },
  {
    provider: "deepseek" as const,
    label: "DeepSeek",
    models: [{ id: "deepseek/deepseek-r1", name: "DeepSeek R1" }],
  },
];

const MODEL_LABELS: Record<string, string> = Object.fromEntries(
  MODEL_GROUPS.flatMap((g) => g.models.map((m) => [m.id, m.name]))
);

export function getModelLabel(modelId: string) {
  return MODEL_LABELS[modelId] ?? modelId;
}

export function ModelSelectorField({
  playgroundId,
  currentModel,
}: {
  playgroundId: string;
  currentModel: string;
}) {
  const [open, setOpen] = useState(false);
  const [model, setModel] = useState(currentModel);
  const [isPending, startTransition] = useTransition();

  const handleSelect = (modelId: string) => {
    setModel(modelId);
    setOpen(false);
    startTransition(() => {
      updatePlaygroundModel(playgroundId, modelId);
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-foreground">Model</span>
      <ModelSelector open={open} onOpenChange={setOpen}>
        <ModelSelectorTrigger asChild>
          <Button
            variant="outline"
            className="h-8 w-full justify-start gap-2 rounded-lg border-input/60 font-normal text-muted-foreground shadow-xs dark:bg-input/30 dark:hover:bg-input/50"
            disabled={isPending}
          >
            <ModelSelectorLogo
              provider={model.split("/")[0]}
              className="size-4"
            />
            <span className="truncate">{MODEL_LABELS[model] ?? model}</span>
          </Button>
        </ModelSelectorTrigger>
        <ModelSelectorContent>
          <ModelSelectorInput placeholder="Search models..." />
          <ModelSelectorList>
            <ModelSelectorEmpty>No models found.</ModelSelectorEmpty>
            {MODEL_GROUPS.map((group) => (
              <ModelSelectorGroup
                key={group.provider}
                heading={group.label}
              >
                {group.models.map((m) => (
                  <ModelSelectorItem
                    key={m.id}
                    value={m.id}
                    onSelect={() => handleSelect(m.id)}
                    className="gap-2"
                  >
                    <ModelSelectorLogo
                      provider={group.provider}
                      className="size-4"
                    />
                    <ModelSelectorName>{m.name}</ModelSelectorName>
                  </ModelSelectorItem>
                ))}
              </ModelSelectorGroup>
            ))}
          </ModelSelectorList>
        </ModelSelectorContent>
      </ModelSelector>
    </div>
  );
}
