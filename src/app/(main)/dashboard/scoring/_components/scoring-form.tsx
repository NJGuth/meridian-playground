"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  updateScoringConfig,
  type ScoringConfigData,
} from "@/server/actions/scoring";
import { RotateCcw } from "lucide-react";

const DEFAULTS: ScoringConfigData = {
  ld12HighThreshold: 75,
  ld12GoodThreshold: 25,
  profileShapeDevelopingMean: 35,
  profileShapeSpikyStdDev: 20,
  valuesHighThreshold: 75,
  valuesModerateThreshold: 25,
};

interface FieldConfig {
  key: keyof ScoringConfigData;
  label: string;
  description: string;
  min: number;
  max: number;
}

const LD12_FIELDS: FieldConfig[] = [
  {
    key: "ld12HighThreshold",
    label: "High threshold",
    description: 'Percentile at or above which a skill is labeled "High"',
    min: 1,
    max: 99,
  },
  {
    key: "ld12GoodThreshold",
    label: "Good threshold",
    description:
      'Percentile at or above which a skill is labeled "Good" (below High)',
    min: 1,
    max: 99,
  },
  {
    key: "profileShapeDevelopingMean",
    label: "Developing mean",
    description:
      'If the average percentile falls below this value, the profile is classified as "Developing"',
    min: 1,
    max: 99,
  },
  {
    key: "profileShapeSpikyStdDev",
    label: "Spiky std dev",
    description:
      'If the standard deviation of percentiles is at or above this value, the profile is classified as "Spiky"',
    min: 1,
    max: 50,
  },
];

const VALUES_FIELDS: FieldConfig[] = [
  {
    key: "valuesHighThreshold",
    label: "High importance threshold",
    description:
      'Percentile at or above which a value is labeled "High importance"',
    min: 1,
    max: 99,
  },
  {
    key: "valuesModerateThreshold",
    label: "Moderate threshold",
    description:
      'Percentile at or above which a value is labeled "Moderate" (below High importance)',
    min: 1,
    max: 99,
  },
];

export function ScoringForm({ config }: { config: ScoringConfigData }) {
  const [values, setValues] = useState<ScoringConfigData>(config);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function handleChange(key: keyof ScoringConfigData, raw: string) {
    const num = parseInt(raw, 10);
    if (Number.isNaN(num)) return;
    setValues((prev) => ({ ...prev, [key]: num }));
    setSaved(false);
  }

  function handleSave() {
    startTransition(async () => {
      await updateScoringConfig(values);
      setSaved(true);
    });
  }

  function handleReset() {
    setValues({ ...DEFAULTS });
    setSaved(false);
  }

  return (
    <div className="mt-8 flex flex-col gap-10">
      <Section title="LD12 Leadership Skills" fields={LD12_FIELDS} values={values} onChange={handleChange} />
      <Section title="Values Assessment" fields={VALUES_FIELDS} values={values} onChange={handleChange} />

      <div className="flex items-center gap-3">
        <Button onClick={handleSave} disabled={isPending}>
          {isPending ? "Saving…" : saved ? "Saved" : "Save changes"}
        </Button>
        <Button variant="outline" onClick={handleReset} disabled={isPending}>
          <RotateCcw data-icon="inline-start" className="size-3.5" />
          Reset to defaults
        </Button>
      </div>
    </div>
  );
}

function Section({
  title,
  fields,
  values,
  onChange,
}: {
  title: string;
  fields: FieldConfig[];
  values: ScoringConfigData;
  onChange: (key: keyof ScoringConfigData, value: string) => void;
}) {
  return (
    <section className="flex flex-col gap-5">
      <h2 className="text-sm font-semibold tracking-tight text-foreground">
        {title}
      </h2>
      <div className="flex flex-col gap-4">
        {fields.map((field) => (
          <div
            key={field.key}
            className="flex items-start gap-6 rounded-xl p-4 ring-1 ring-foreground/10"
          >
            <div className="flex flex-1 flex-col gap-0.5">
              <span className="text-sm font-medium text-foreground">
                {field.label}
              </span>
              <span className="text-xs/5 text-muted-foreground">
                {field.description}
              </span>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <Input
                type="number"
                min={field.min}
                max={field.max}
                value={values[field.key]}
                onChange={(e) => onChange(field.key, e.target.value)}
                className="w-20 text-center tabular-nums"
              />
              <span className="text-xs text-muted-foreground">%ile</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
