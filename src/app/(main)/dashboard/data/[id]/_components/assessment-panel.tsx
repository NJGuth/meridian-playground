"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  SKILLS,
  DIMENSIONS,
  DOMAINS,
  DOMAIN_BY_ID,
  DIMENSION_BY_ID,
} from "@/lib/framework/ld12-definitions";
import {
  VALUES_SUB_DIMENSIONS,
  VALUES_DIMENSIONS,
  VALUES_DIMENSION_BY_KEY,
} from "@/lib/framework/values-definitions";
import {
  HPI_SCALE_KEYS,
  HDS_SCALE_KEYS,
  MVPI_SCALE_KEYS,
  HPI_SCALE_BY_KEY,
  HDS_SCALE_BY_KEY,
  MVPI_SCALE_BY_KEY,
} from "@/lib/framework/hogan-definitions";

type ScoreValue = number | null;
type MultiRaterScore = {
  self: ScoreValue;
  manager: ScoreValue;
  other: ScoreValue;
  overall: ScoreValue;
};

const COMPETENCY_KEYS = [
  "Self_Care",
  "Self_Awareness",
  "Confidence",
  "Resilience",
  "Emotion_Management",
  "Focus",
  "Prioritization",
  "Time_Management",
  "Delegation",
  "Curiosity",
  "Problem_Solving",
  "Decision_Quality",
  "Career_Development",
  "Gaining_Expertise",
  "Executive_Presence",
  "Personal_Brand",
  "Authenticity",
  "Trust",
  "Empathy",
  "Listening",
  "Building_Relationships",
  "Strengthening_Relationships",
  "Managing_Conflict",
  "Influence",
  "Communication",
  "Accountability",
  "Coaching",
  "Developing_Talent",
  "Motivating_Others",
  "Empowering_Others",
  "Collaboration",
  "Team_Productivity",
  "Team_Culture",
  "Team_Leadership",
  "Setting_Vision",
  "Innovation",
  "Inspiration",
  "Strategic_Thinking",
  "Strategic_Management",
  "Stakeholder_Management",
  "Navigating_Change",
  "Leadership_Flexibility",
  "Execution",
  "Culture_Building",
  "Inclusive_Leadership",
];

const DIMENSION_KEYS = [
  "Dimension_Self_Management",
  "Dimension_Time_And_Energy",
  "Dimension_Decision_Making",
  "Dimension_Leadership_Brand",
  "Dimension_Building_Trust",
  "Dimension_Social_Acumen",
  "Dimension_Managing_Performance",
  "Dimension_Team_Effectiveness",
  "Dimension_Visioning",
  "Dimension_Strategic_Leadership",
  "Dimension_Driving_Change",
  "Dimension_Culture_Shaping",
];

const DOMAIN_KEYS = [
  "Domain_leading_self",
  "Domain_leading_others",
  "Domain_leading_organizations",
];

function formatLabel(key: string): string {
  return key
    .replace(/^Dimension_/, "")
    .replace(/^Domain_/, "")
    .replaceAll("_", " ");
}

type DefinitionInfo = {
  name: string;
  breadcrumb?: string;
  description: string;
  strengthDescription?: string;
  opportunityDescription?: string;
};

function normalize(s: string) {
  return s.toLowerCase().replaceAll(" ", "_").replaceAll("-", "_");
}

const skillByNorm = new Map(SKILLS.map((s) => [normalize(s.name), s]));
const dimByNorm = new Map(DIMENSIONS.map((d) => [normalize(d.name), d]));
const domByNorm = new Map(DOMAINS.map((d) => [normalize(d.name), d]));
const valSubByNorm = new Map(
  VALUES_SUB_DIMENSIONS.map((s) => [normalize(s.key), s]),
);
const valDimByNorm = new Map(
  VALUES_DIMENSIONS.map((d) => [normalize(d.key), d]),
);

function getSkillDefinition(key: string): DefinitionInfo | null {
  const norm = normalize(key);
  const skill = skillByNorm.get(norm);
  if (skill) {
    const domain = DOMAIN_BY_ID.get(skill.domainId);
    const dimension = DIMENSION_BY_ID.get(skill.dimensionId);
    return {
      name: skill.name,
      breadcrumb: [domain?.name, dimension?.name].filter(Boolean).join(" / "),
      description: skill.description,
      strengthDescription: skill.strengthDescription,
      opportunityDescription: skill.opportunityDescription,
    };
  }

  const stripped = key.replace(/^Dimension_/, "").replace(/^Domain_/, "");
  const normStripped = normalize(stripped);

  const dim = dimByNorm.get(normStripped);
  if (dim) {
    const domain = DOMAIN_BY_ID.get(dim.domainId);
    return {
      name: dim.name,
      breadcrumb: domain?.name,
      description: dim.description,
    };
  }

  const dom = domByNorm.get(normStripped);
  if (dom) {
    return { name: dom.name, description: dom.description };
  }

  return null;
}

function getValueDefinition(key: string): DefinitionInfo | null {
  const norm = normalize(key);

  const sub = valSubByNorm.get(norm);
  if (sub) {
    const parent = VALUES_DIMENSION_BY_KEY.get(sub.dimensionKey);
    return {
      name: sub.title,
      breadcrumb: parent?.title,
      description: sub.description,
    };
  }

  const dim = valDimByNorm.get(norm);
  if (dim) {
    return { name: dim.title, description: dim.description };
  }

  return null;
}

function DefinitionSheet({
  info,
  onClose,
}: {
  info: DefinitionInfo | null;
  onClose: () => void;
}) {
  return (
    <Sheet open={info !== null} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="overflow-y-auto">
        {info && (
          <>
            <SheetHeader>
              {info.breadcrumb && (
                <SheetDescription>{info.breadcrumb}</SheetDescription>
              )}
              <SheetTitle>{info.name}</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-6 px-4 pb-6">
              <div className="flex flex-col gap-1">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Description
                </h4>
                <p className="text-sm/6 text-foreground">{info.description}</p>
              </div>
              {info.strengthDescription && (
                <div className="flex flex-col gap-1">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    As a Strength
                  </h4>
                  <p className="text-sm/6 text-foreground">
                    {info.strengthDescription}
                  </p>
                </div>
              )}
              {info.opportunityDescription && (
                <div className="flex flex-col gap-1">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    As an Opportunity
                  </h4>
                  <p className="text-sm/6 text-foreground">
                    {info.opportunityDescription}
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function ScoreField({
  value,
  onChange,
  max = 100,
  step = 0.1,
}: {
  value: number;
  onChange: (v: number) => void;
  max?: number;
  step?: number;
}) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="flex items-center gap-3">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <Input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        step={step}
        min={0}
        max={max}
        className="h-6 w-16 px-1.5 text-right text-xs tabular-nums"
      />
    </div>
  );
}

function ScoreSection({
  title,
  keys,
  scores,
  onChange,
  onLabelClick,
  max = 100,
}: {
  title: string;
  keys: string[];
  scores: Record<string, number>;
  onChange: (key: string, value: number) => void;
  onLabelClick?: (key: string) => void;
  max?: number;
}) {
  return (
    <div className="flex flex-col gap-3">
      <h4 className="text-sm font-semibold text-foreground">{title}</h4>
      <div className="grid gap-2">
        {keys.map((key) => {
          const val = scores[key];
          if (val == null) return null;
          return (
            <div
              key={key}
              className="grid grid-cols-[180px_1fr] items-center gap-3"
            >
              {onLabelClick ? (
                <button
                  type="button"
                  onClick={() => onLabelClick(key)}
                  className="truncate text-left text-xs text-muted-foreground underline decoration-foreground/20 underline-offset-2 transition-colors hover:text-foreground"
                >
                  {formatLabel(key)}
                </button>
              ) : (
                <span className="truncate text-xs text-muted-foreground">
                  {formatLabel(key)}
                </span>
              )}
              <ScoreField
                value={val}
                onChange={(v) => onChange(key, v)}
                max={max}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MultiRaterSection({
  title,
  keys,
  scores,
  onChange,
  onLabelClick,
}: {
  title: string;
  keys: string[];
  scores: Record<string, MultiRaterScore>;
  onChange: (key: string, rater: string, value: number | null) => void;
  onLabelClick?: (key: string) => void;
}) {
  const raters = ["self", "manager", "other", "overall"] as const;

  return (
    <div className="flex flex-col gap-3">
      <h4 className="text-sm font-semibold text-foreground">{title}</h4>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b text-muted-foreground">
              <th className="pb-2 text-left font-medium">Competency</th>
              {raters.map((r) => (
                <th
                  key={r}
                  className="pb-2 text-right font-medium capitalize"
                >
                  {r}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {keys.map((key) => {
              const val = scores[key];
              if (!val || typeof val !== "object") return null;
              return (
                <tr key={key} className="border-b border-foreground/5">
                  <td className="py-1.5">
                    {onLabelClick ? (
                      <button
                        type="button"
                        onClick={() => onLabelClick(key)}
                        className="text-left text-muted-foreground underline decoration-foreground/20 underline-offset-2 transition-colors hover:text-foreground"
                      >
                        {formatLabel(key)}
                      </button>
                    ) : (
                      <span className="text-muted-foreground">
                        {formatLabel(key)}
                      </span>
                    )}
                  </td>
                  {raters.map((r) => (
                    <td key={r} className="py-1.5">
                      <Input
                        type="number"
                        value={val[r] ?? ""}
                        onChange={(e) => {
                          const raw = e.target.value;
                          onChange(key, r, raw === "" ? null : Number(raw));
                        }}
                        step={0.1}
                        min={0}
                        className="ml-auto h-6 w-16 px-1.5 text-right text-xs tabular-nums"
                      />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Ld12Panel({ data }: { data: Record<string, unknown> }) {
  const [archetypes, setArchetypes] = useState(
    () => ({ ...(data.archetypeScores ?? {}) }) as Record<string, number>,
  );
  const [pctile, setPctile] = useState(
    () => ({ ...(data.pctileScores ?? {}) }) as Record<string, number>,
  );
  const [sheetInfo, setSheetInfo] = useState<DefinitionInfo | null>(null);

  const handleLabelClick = (key: string) => {
    const info = getSkillDefinition(key);
    if (info) setSheetInfo(info);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <h4 className="text-sm font-semibold text-foreground">Archetypes</h4>
        <div className="grid gap-2">
          {Object.entries(archetypes).map(([key, val]) => (
            <div
              key={key}
              className="grid grid-cols-[180px_1fr] items-center gap-3"
            >
              <span className="truncate text-xs text-muted-foreground">
                {key}
              </span>
              <ScoreField
                value={val}
                onChange={(v) =>
                  setArchetypes((prev) => ({ ...prev, [key]: v }))
                }
              />
            </div>
          ))}
        </div>
      </div>
      <ScoreSection
        title="Competencies"
        keys={COMPETENCY_KEYS}
        scores={pctile}
        onChange={(k, v) => setPctile((prev) => ({ ...prev, [k]: v }))}
        onLabelClick={handleLabelClick}
      />
      <ScoreSection
        title="Dimensions"
        keys={DIMENSION_KEYS}
        scores={pctile}
        onChange={(k, v) => setPctile((prev) => ({ ...prev, [k]: v }))}
        onLabelClick={handleLabelClick}
      />
      <ScoreSection
        title="Domains"
        keys={DOMAIN_KEYS}
        scores={pctile}
        onChange={(k, v) => setPctile((prev) => ({ ...prev, [k]: v }))}
        onLabelClick={handleLabelClick}
      />
      <DefinitionSheet info={sheetInfo} onClose={() => setSheetInfo(null)} />
    </div>
  );
}

function Ld12360Panel({ data }: { data: Record<string, unknown> }) {
  const [scores, setScores] = useState(
    () => structuredClone(data) as Record<string, MultiRaterScore>,
  );
  const [sheetInfo, setSheetInfo] = useState<DefinitionInfo | null>(null);

  const strengths = data.strengths as Record<string, string> | undefined;
  const opportunities = data.opportunities as
    | Record<string, string>
    | undefined;

  const updateScore = (key: string, rater: string, value: number | null) => {
    setScores((prev) => ({
      ...prev,
      [key]: { ...prev[key], [rater]: value },
    }));
  };

  const handleLabelClick = (key: string) => {
    const info = getSkillDefinition(key);
    if (info) setSheetInfo(info);
  };

  return (
    <div className="flex flex-col gap-8">
      {strengths?.manager && (
        <div className="flex flex-col gap-1">
          <h4 className="text-sm font-semibold text-foreground">
            Strengths (Manager)
          </h4>
          <p className="text-sm text-muted-foreground">{strengths.manager}</p>
        </div>
      )}
      {opportunities?.manager && (
        <div className="flex flex-col gap-1">
          <h4 className="text-sm font-semibold text-foreground">
            Opportunities (Manager)
          </h4>
          <p className="text-sm text-muted-foreground">
            {opportunities.manager}
          </p>
        </div>
      )}
      <MultiRaterSection
        title="Competencies"
        keys={COMPETENCY_KEYS}
        scores={scores}
        onChange={updateScore}
        onLabelClick={handleLabelClick}
      />
      <MultiRaterSection
        title="Dimensions"
        keys={DIMENSION_KEYS}
        scores={scores}
        onChange={updateScore}
        onLabelClick={handleLabelClick}
      />
      <MultiRaterSection
        title="Domains"
        keys={DOMAIN_KEYS}
        scores={scores}
        onChange={updateScore}
        onLabelClick={handleLabelClick}
      />
      <DefinitionSheet info={sheetInfo} onClose={() => setSheetInfo(null)} />
    </div>
  );
}

function getHoganHpiDefinition(key: string): DefinitionInfo | null {
  const scale = HPI_SCALE_BY_KEY.get(key as (typeof HPI_SCALE_KEYS)[number]);
  if (!scale) return null;
  return {
    name: scale.title,
    breadcrumb: `HPI · ${scale.insightRegarding} · FFM: ${scale.ffmFactor}`,
    description: `Lower-score side: ${scale.lowScoreSummary} Higher-score side: ${scale.highScoreSummary}`,
  };
}

function getHoganHdsDefinition(key: string): DefinitionInfo | null {
  const scale = HDS_SCALE_BY_KEY.get(key as (typeof HDS_SCALE_KEYS)[number]);
  if (!scale) return null;
  return {
    name: scale.title,
    breadcrumb: `HDS · ${scale.cluster}`,
    description: `Everyday strength: ${scale.everydayStrength}. When overused: ${scale.overusedRisk}.`,
  };
}

function getHoganMvpiDefinition(key: string): DefinitionInfo | null {
  const scale = MVPI_SCALE_BY_KEY.get(key as (typeof MVPI_SCALE_KEYS)[number]);
  if (!scale) return null;
  return {
    name: scale.title,
    breadcrumb: `MVPI · ${scale.cluster}`,
    description: scale.highDefinition,
  };
}

function mergeHoganPctile<T extends string>(
  raw: Record<string, number>,
  keys: readonly T[],
): Record<string, number> {
  const m = { ...raw };
  for (const k of keys) {
    if (m[k] == null) m[k] = 0;
  }
  return m;
}

function HoganHpiPanel({ data }: { data: Record<string, unknown> }) {
  const [pctile, setPctile] = useState(() =>
    mergeHoganPctile(
      { ...((data.pctileScores ?? {}) as Record<string, number>) },
      HPI_SCALE_KEYS,
    ),
  );
  const [sheetInfo, setSheetInfo] = useState<DefinitionInfo | null>(null);

  const handleLabelClick = (key: string) => {
    const info = getHoganHpiDefinition(key);
    if (info) setSheetInfo(info);
  };

  return (
    <div className="flex flex-col gap-8">
      <p className="text-sm text-muted-foreground">
        Hogan Personality Inventory (HPI) — “Bright Side.” Percentiles vs
        working adults; low/average/high are not good or bad.
      </p>
      <ScoreSection
        title="Primary scales"
        keys={[...HPI_SCALE_KEYS]}
        scores={pctile}
        onChange={(k, v) => setPctile((prev) => ({ ...prev, [k]: v }))}
        onLabelClick={handleLabelClick}
      />
      <DefinitionSheet info={sheetInfo} onClose={() => setSheetInfo(null)} />
    </div>
  );
}

function HoganHdsPanel({ data }: { data: Record<string, unknown> }) {
  const [pctile, setPctile] = useState(() =>
    mergeHoganPctile(
      { ...((data.pctileScores ?? {}) as Record<string, number>) },
      HDS_SCALE_KEYS,
    ),
  );
  const [sheetInfo, setSheetInfo] = useState<DefinitionInfo | null>(null);

  const handleLabelClick = (key: string) => {
    const info = getHoganHdsDefinition(key);
    if (info) setSheetInfo(info);
  };

  return (
    <div className="flex flex-col gap-8">
      <p className="text-sm text-muted-foreground">
        Hogan Development Survey (HDS) — “Dark Side.” Higher percentiles mean
        greater likelihood of risk behaviors under stress.
      </p>
      <ScoreSection
        title="Primary scales"
        keys={[...HDS_SCALE_KEYS]}
        scores={pctile}
        onChange={(k, v) => setPctile((prev) => ({ ...prev, [k]: v }))}
        onLabelClick={handleLabelClick}
      />
      <DefinitionSheet info={sheetInfo} onClose={() => setSheetInfo(null)} />
    </div>
  );
}

function HoganMvpiPanel({ data }: { data: Record<string, unknown> }) {
  const [pctile, setPctile] = useState(() =>
    mergeHoganPctile(
      { ...((data.pctileScores ?? {}) as Record<string, number>) },
      MVPI_SCALE_KEYS,
    ),
  );
  const [sheetInfo, setSheetInfo] = useState<DefinitionInfo | null>(null);

  const handleLabelClick = (key: string) => {
    const info = getHoganMvpiDefinition(key);
    if (info) setSheetInfo(info);
  };

  return (
    <div className="flex flex-col gap-8">
      <p className="text-sm text-muted-foreground">
        Motives, Values, Preferences Inventory (MVPI) — “Inside.” Values and
        motives; high/low reflect what drives the person, not performance.
      </p>
      <ScoreSection
        title="Primary scales"
        keys={[...MVPI_SCALE_KEYS]}
        scores={pctile}
        onChange={(k, v) => setPctile((prev) => ({ ...prev, [k]: v }))}
        onLabelClick={handleLabelClick}
      />
      <DefinitionSheet info={sheetInfo} onClose={() => setSheetInfo(null)} />
    </div>
  );
}

function ValuesPanel({ data }: { data: Record<string, unknown> }) {
  const [pctile, setPctile] = useState(
    () => ({ ...(data.pctileScores ?? {}) }) as Record<string, number>,
  );
  const [sheetInfo, setSheetInfo] = useState<DefinitionInfo | null>(null);
  const allKeys = Object.keys(pctile);

  const handleLabelClick = (key: string) => {
    const info = getValueDefinition(key);
    if (info) setSheetInfo(info);
  };

  return (
    <div className="flex flex-col gap-8">
      <ScoreSection
        title="Values"
        keys={allKeys}
        scores={pctile}
        onChange={(k, v) => setPctile((prev) => ({ ...prev, [k]: v }))}
        onLabelClick={handleLabelClick}
      />
      <DefinitionSheet info={sheetInfo} onClose={() => setSheetInfo(null)} />
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
      <p className="text-sm">No {label} data available.</p>
    </div>
  );
}

export function AssessmentPanel({
  view,
  data,
}: {
  view:
    | "ld12"
    | "ld12_360"
    | "values"
    | "hogan_hpi"
    | "hogan_hds"
    | "hogan_mvpi";
  data: {
    ld12?: Record<string, unknown>;
    ld12_360?: Record<string, unknown>;
    values?: Record<string, unknown>;
    hogan_hpi?: Record<string, unknown>;
    hogan_hds?: Record<string, unknown>;
    hogan_mvpi?: Record<string, unknown>;
  };
}) {
  switch (view) {
    case "ld12":
      return data.ld12 ? (
        <Ld12Panel data={data.ld12} />
      ) : (
        <EmptyState label="LD12" />
      );
    case "ld12_360":
      return data.ld12_360 ? (
        <Ld12360Panel data={data.ld12_360} />
      ) : (
        <EmptyState label="LD12-360" />
      );
    case "values":
      return data.values ? (
        <ValuesPanel data={data.values} />
      ) : (
        <EmptyState label="Values" />
      );
    case "hogan_hpi":
      return data.hogan_hpi ? (
        <HoganHpiPanel data={data.hogan_hpi} />
      ) : (
        <EmptyState label="Hogan HPI" />
      );
    case "hogan_hds":
      return data.hogan_hds ? (
        <HoganHdsPanel data={data.hogan_hds} />
      ) : (
        <EmptyState label="Hogan HDS" />
      );
    case "hogan_mvpi":
      return data.hogan_mvpi ? (
        <HoganMvpiPanel data={data.hogan_mvpi} />
      ) : (
        <EmptyState label="Hogan MVPI" />
      );
  }
}
