"use client";

import { useState, useTransition } from "react";
import { ChevronDown, X, Plus } from "lucide-react";
import { DEFAULT_RULES } from "@/data/rules";
import { updatePlaygroundRules } from "@/server/actions/playground";
import type { RuleCategory } from "@/lib/types/playground-rules";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const CATEGORY_LABELS: Record<Exclude<RuleCategory, "custom">, string> = {
  persona: "Persona",
  "data-integrity": "Data Integrity",
  coaching: "Coaching",
  values: "Values",
  safety: "Safety",
};

const CATEGORY_ORDER: Exclude<RuleCategory, "custom">[] = [
  "persona",
  "data-integrity",
  "coaching",
  "values",
  "safety",
];

export function RulesFields({
  playgroundId,
  defaultDisabledRuleIds,
  defaultCustomRules,
}: {
  playgroundId: string;
  defaultDisabledRuleIds: string[];
  defaultCustomRules: string[];
}) {
  const [disabledRuleIds, setDisabledRuleIds] = useState<string[]>(
    defaultDisabledRuleIds,
  );
  const [customRules, setCustomRules] = useState<string[]>(defaultCustomRules);
  const [newRule, setNewRule] = useState("");
  const [isPending, startTransition] = useTransition();

  function persist(overrides?: {
    disabledRuleIds?: string[];
    customRules?: string[];
  }) {
    const config = {
      disabledRuleIds: overrides?.disabledRuleIds ?? disabledRuleIds,
      customRules: overrides?.customRules ?? customRules,
    };
    startTransition(() => {
      updatePlaygroundRules(playgroundId, config);
    });
  }

  function handleToggle(ruleId: string, enabled: boolean) {
    const next = enabled
      ? disabledRuleIds.filter((id) => id !== ruleId)
      : [...disabledRuleIds, ruleId];
    setDisabledRuleIds(next);
    persist({ disabledRuleIds: next });
  }

  function handleAddCustomRule() {
    const trimmed = newRule.trim();
    if (!trimmed) return;
    const next = [...customRules, trimmed];
    setCustomRules(next);
    setNewRule("");
    persist({ customRules: next });
  }

  function handleRemoveCustomRule(index: number) {
    const next = customRules.filter((_, i) => i !== index);
    setCustomRules(next);
    persist({ customRules: next });
  }

  const rulesByCategory = CATEGORY_ORDER.map((category) => ({
    category,
    label: CATEGORY_LABELS[category],
    rules: DEFAULT_RULES.filter((r) => r.category === category),
  }));

  return (
    <fieldset disabled={isPending} className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <Textarea
          id="customRule"
          rows={2}
          value={newRule}
          onChange={(e) => setNewRule(e.target.value)}
          placeholder="e.g. Always begin responses with a brief reflection prompt before offering any advice."
          className="min-h-0 resize-none text-xs"
        />
        <Button
          variant="outline"
          size="sm"
          disabled={!newRule.trim()}
          onClick={handleAddCustomRule}
        >
          <Plus className="size-3" />
          Add rule
        </Button>
      </div>

      {customRules.length > 0 && (
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="group flex w-full items-center justify-between py-1 text-xs font-medium text-muted-foreground hover:text-foreground">
            Custom
            <ChevronDown className="size-3.5 transition-transform group-data-[state=open]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="flex flex-col gap-2 pt-1">
              {customRules.map((rule, index) => (
                <Card
                  key={`custom-${rule.slice(0, 32)}-${index}`}
                  size="sm"
                  className="py-2.5"
                >
                  <div className="flex items-start gap-2 px-3">
                    <p className="flex-1 text-xs/4 text-foreground">{rule}</p>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      className="shrink-0 text-muted-foreground hover:text-destructive"
                      onClick={() => handleRemoveCustomRule(index)}
                    >
                      <X className="size-3" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}

      {rulesByCategory.map(({ category, label, rules }) => (
        <Collapsible key={category} defaultOpen>
          <CollapsibleTrigger className="group flex w-full items-center justify-between py-1 text-xs font-medium text-muted-foreground hover:text-foreground">
            {label}
            <ChevronDown className="size-3.5 transition-transform group-data-[state=open]:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="flex flex-col gap-2 pt-1">
              {rules.map((rule) => {
                const isActive = !disabledRuleIds.includes(rule.id);
                return (
                  <RuleCard
                    key={rule.id}
                    description={rule.description}
                    text={rule.text}
                    active={isActive}
                    onToggle={(enabled) => handleToggle(rule.id, enabled)}
                  />
                );
              })}
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}
    </fieldset>
  );
}

function RuleCard({
  description,
  text,
  active,
  onToggle,
}: {
  description: string;
  text: string;
  active: boolean;
  onToggle: (enabled: boolean) => void;
}) {
  return (
    <Card size="sm" className="py-2.5">
      <Collapsible>
        <div className="flex items-start gap-2 px-3">
          <CollapsibleTrigger className="flex-1 text-left text-xs/4 text-foreground hover:text-muted-foreground">
            {description}
          </CollapsibleTrigger>
          <Switch
            size="sm"
            checked={active}
            onCheckedChange={onToggle}
            className="shrink-0"
          />
        </div>
        <CollapsibleContent>
          <p className="mx-3 mt-2 rounded-sm bg-muted/50 px-2 py-1.5 text-[11px]/3.5 text-muted-foreground">
            {text}
          </p>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
