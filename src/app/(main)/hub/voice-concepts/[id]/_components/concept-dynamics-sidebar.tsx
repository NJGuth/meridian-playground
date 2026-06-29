"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SidebarSeparator } from "@/components/ui/sidebar";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  createDefaultTrigger,
  MOOD_AXES,
  type MoodTrigger,
} from "@/lib/voice/concept-dynamics";
import {
  DIFFICULTY_PRESETS,
  REACTIVITY_ARCHETYPES,
} from "@/lib/voice/voice-presets";
import {
  useVoiceConcept,
  type ConceptConfig,
} from "./voice-concept-config-context";

function AxisSlider({
  label,
  low,
  high,
  value,
  onChange,
  onCommit,
}: {
  label: string;
  low: string;
  high: string;
  value: number;
  onChange: (value: number) => void;
  onCommit: () => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium">{label}</span>
        <span className="text-xs text-muted-foreground">{value}</span>
      </div>
      <Slider
        value={[value]}
        min={0}
        max={100}
        step={1}
        onValueChange={(values) => onChange(values[0] ?? 50)}
        onValueCommit={onCommit}
      />
      <div className="flex justify-between text-[11px]/3.5 text-muted-foreground">
        <span>{low}</span>
        <span>{high}</span>
      </div>
    </div>
  );
}

function applyPreset(
  preset: {
    mood?: Partial<ConceptConfig>;
    volatility?: number;
    tolerance?: number;
    reactivityEnabled?: boolean;
    moodTriggers?: MoodTrigger[];
  },
): Partial<ConceptConfig> {
  const patch: Partial<ConceptConfig> = {};
  if (preset.mood) {
    if (preset.mood.warmth !== undefined) patch.warmth = preset.mood.warmth;
    if (preset.mood.cooperativeness !== undefined)
      patch.cooperativeness = preset.mood.cooperativeness;
    if (preset.mood.aggression !== undefined)
      patch.aggression = preset.mood.aggression;
    if (preset.mood.patience !== undefined) patch.patience = preset.mood.patience;
  }
  if (preset.volatility !== undefined) patch.volatility = preset.volatility;
  if (preset.tolerance !== undefined) patch.tolerance = preset.tolerance;
  if (preset.reactivityEnabled !== undefined)
    patch.reactivityEnabled = preset.reactivityEnabled;
  if (preset.moodTriggers !== undefined) patch.moodTriggers = preset.moodTriggers;
  return patch;
}

export function ConceptDynamicsSidebar() {
  const { config, setField, commitField, commit } = useVoiceConcept();
  const [newTriggerCondition, setNewTriggerCondition] = useState("");

  function commitAxis(key: keyof ConceptConfig) {
    commitField(key);
  }

  function handleDifficultyPreset(key: string) {
    const preset = DIFFICULTY_PRESETS[key];
    if (!preset) return;
    commit(applyPreset(preset));
  }

  function handleArchetype(key: string) {
    const archetype = REACTIVITY_ARCHETYPES[key];
    if (!archetype) return;
    commit({
      ...applyPreset(archetype),
      reactivityEnabled: true,
    });
  }

  function handleAddTrigger() {
    const trimmed = newTriggerCondition.trim();
    if (!trimmed) return;
    setNewTriggerCondition("");
    commit({ moodTriggers: [...config.moodTriggers, createDefaultTrigger(trimmed)] });
  }

  function handleRemoveTrigger(index: number) {
    commit({
      moodTriggers: config.moodTriggers.filter((_, i) => i !== index),
    });
  }

  function updateTrigger(
    index: number,
    patch: Partial<MoodTrigger>,
  ) {
    const next = config.moodTriggers.map((t, i) =>
      i === index ? { ...t, ...patch } : t,
    );
    commit({ moodTriggers: next });
  }

  return (
    <>
      <SidebarSeparator className="-mx-4" />

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">Difficulty preset</span>
        <Select onValueChange={handleDifficultyPreset}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Apply a preset…" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(DIFFICULTY_PRESETS).map(([key, preset]) => (
              <SelectItem key={key} value={key}>
                {preset.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-4">
        <span className="text-sm font-medium">Demeanor</span>
        {MOOD_AXES.map(({ key, label, low, high }) => (
          <AxisSlider
            key={key}
            label={label}
            low={low}
            high={high}
            value={config[key]}
            onChange={(value) => setField(key, value)}
            onCommit={() => commitAxis(key)}
          />
        ))}
      </div>

      <SidebarSeparator className="-mx-4" />

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium">Reactive mood</span>
            <span className="text-xs/5 text-muted-foreground">
              Mood shifts based on how the trainee handles you.
            </span>
          </div>
          <Switch
            checked={config.reactivityEnabled}
            onCheckedChange={(checked) => commit({ reactivityEnabled: checked })}
          />
        </div>

        {config.reactivityEnabled && (
          <>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium">Reactivity archetype</span>
              <Select onValueChange={handleArchetype}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Load archetype…" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(REACTIVITY_ARCHETYPES).map(([key, arch]) => (
                    <SelectItem key={key} value={key}>
                      {arch.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <AxisSlider
              label="Volatility"
              low="stable"
              high="volatile"
              value={config.volatility}
              onChange={(value) => setField("volatility", value)}
              onCommit={() => commitField("volatility")}
            />

            <AxisSlider
              label="Tolerance"
              low="walks out easily"
              high="endures a lot"
              value={config.tolerance}
              onChange={(value) => setField("tolerance", value)}
              onCommit={() => commitField("tolerance")}
            />

            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium">Triggers</span>
              <Input
                value={newTriggerCondition}
                onChange={(e) => setNewTriggerCondition(e.target.value)}
                placeholder="e.g. The trainee interrupts you"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!newTriggerCondition.trim()}
                onClick={handleAddTrigger}
              >
                <Plus className="size-3" />
                Add trigger
              </Button>
              {config.moodTriggers.map((trigger, index) => (
                <Card key={`${trigger.condition.slice(0, 24)}-${index}`} size="sm" className="py-3">
                  <div className="flex flex-col gap-3 px-3">
                    <div className="flex items-start gap-2">
                      <p className="flex-1 text-xs/4 text-foreground">
                        {trigger.condition}
                      </p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        className="shrink-0 text-muted-foreground hover:text-destructive"
                        onClick={() => handleRemoveTrigger(index)}
                      >
                        <X className="size-3" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {(
                        [
                          ["warmthDelta", "Warmth Δ"],
                          ["cooperativenessDelta", "Coop. Δ"],
                          ["aggressionDelta", "Aggr. Δ"],
                          ["patienceDelta", "Patience Δ"],
                        ] as const
                      ).map(([field, fieldLabel]) => (
                        <div key={field} className="flex flex-col gap-1">
                          <span className="text-[10px] text-muted-foreground">
                            {fieldLabel}
                          </span>
                          <Input
                            type="number"
                            min={-50}
                            max={50}
                            value={trigger[field]}
                            onChange={(e) =>
                              updateTrigger(index, {
                                [field]: Number(e.target.value) || 0,
                              })
                            }
                            className="h-7 text-xs"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>

      <SidebarSeparator className="-mx-4" />

      <div className="flex flex-col gap-2">
        <label htmlFor="hidden-agenda" className="text-sm font-medium">
          Hidden agenda
        </label>
        <Textarea
          id="hidden-agenda"
          rows={3}
          value={config.hiddenAgenda}
          onChange={(e) => setField("hiddenAgenda", e.target.value)}
          onBlur={() => commitField("hiddenAgenda")}
          placeholder="A secret concern they won't volunteer unless earned…"
          className="min-h-0 resize-none text-sm/6"
        />
        <label htmlFor="agenda-unlock" className="text-sm font-medium">
          Unlock condition
        </label>
        <Textarea
          id="agenda-unlock"
          rows={2}
          value={config.agendaUnlockCondition}
          onChange={(e) => setField("agendaUnlockCondition", e.target.value)}
          onBlur={() => commitField("agendaUnlockCondition")}
          placeholder="e.g. The trainee shows empathy and asks open questions"
          className="min-h-0 resize-none text-sm/6"
        />
      </div>

      <SidebarSeparator className="-mx-4" />

      <div className="flex flex-col gap-4">
        <span className="text-sm font-medium">Timing</span>
        <div className="flex flex-col gap-2">
          <label htmlFor="target-duration" className="text-xs">
            Target duration (minutes)
          </label>
          <Input
            id="target-duration"
            type="number"
            min={0}
            placeholder="Open-ended"
            value={config.targetDurationMinutes ?? ""}
            onChange={(e) => {
              const raw = e.target.value;
              if (!raw) {
                setField("targetDurationMinutes", null);
                return;
              }
              setField("targetDurationMinutes", Number(raw));
            }}
            onBlur={() => commitField("targetDurationMinutes")}
          />
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs">Auto-end when time expires</span>
          <Switch
            checked={config.autoEndOnExpiry}
            onCheckedChange={(checked) => commit({ autoEndOnExpiry: checked })}
          />
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs">Run variation</span>
            <span className="text-[11px]/3.5 text-muted-foreground">
              Slight mood jitter each run
            </span>
          </div>
          <Switch
            checked={config.variationEnabled}
            onCheckedChange={(checked) => commit({ variationEnabled: checked })}
          />
        </div>
      </div>
    </>
  );
}

export function formatRemaining(seconds: number | null): string | null {
  if (seconds === null) return null;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
