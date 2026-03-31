"use client";

import { useState, useTransition } from "react";
import { Trash2, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  updatePersonField,
  deletePerson,
  generateRandomAssessments,
} from "@/server/actions/data";
import { AssessmentPanel } from "./assessment-panel";

type AssessmentView =
  | "ld12"
  | "ld12_360"
  | "values"
  | "hogan_hpi"
  | "hogan_hds"
  | "hogan_mvpi";

const NAV_ITEMS: { key: AssessmentView; label: string }[] = [
  { key: "ld12", label: "LD12" },
  { key: "ld12_360", label: "LD12-360" },
  { key: "values", label: "Values" },
  { key: "hogan_hpi", label: "Hogan HPI" },
  { key: "hogan_hds", label: "Hogan HDS" },
  { key: "hogan_mvpi", label: "Hogan MVPI" },
];

function EditableField({
  id,
  label,
  value,
  onSave,
  required = false,
}: {
  id: string;
  label: string;
  value: string;
  onSave: (value: string) => void;
  required?: boolean;
}) {
  const [current, setCurrent] = useState(value);

  function handleBlur() {
    const trimmed = current.trim();
    if (trimmed !== value) {
      if (required && !trimmed) {
        setCurrent(value);
        return;
      }
      onSave(trimmed);
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-xs font-medium text-muted-foreground">
        {label}
      </label>
      <Input
        id={id}
        value={current}
        onChange={(e) => setCurrent(e.target.value)}
        onBlur={handleBlur}
        className="h-8"
      />
    </div>
  );
}

type PersonField =
  | "firstName"
  | "lastName"
  | "jobTitle"
  | "function"
  | "level"
  | "company"
  | "industry";

export function PersonDetail({
  person,
  assessments,
}: {
  person: {
    id: string;
    firstName: string;
    lastName: string;
    jobTitle: string;
    function: string;
    level: string;
    company: string;
    industry: string;
  };
  assessments: {
    ld12?: Record<string, unknown>;
    ld12_360?: Record<string, unknown>;
    values?: Record<string, unknown>;
    hogan_hpi?: Record<string, unknown>;
    hogan_hds?: Record<string, unknown>;
    hogan_mvpi?: Record<string, unknown>;
  };
}) {
  const [activeView, setActiveView] = useState<AssessmentView>("ld12");
  const [, startTransition] = useTransition();

  function handleFieldUpdate(field: PersonField, value: string) {
    startTransition(() => {
      updatePersonField(person.id, field, value);
    });
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      <aside className="flex w-56 shrink-0 flex-col border-r">
        <div className="flex flex-col gap-3 p-4">
          <EditableField
            id="firstName"
            label="First Name"
            value={person.firstName}
            onSave={(v) => handleFieldUpdate("firstName", v)}
            required
          />
          <EditableField
            id="lastName"
            label="Last Name"
            value={person.lastName}
            onSave={(v) => handleFieldUpdate("lastName", v)}
            required
          />
        </div>

        <Separator />

        <div className="flex flex-col gap-3 p-4">
          <EditableField
            id="jobTitle"
            label="Job Title"
            value={person.jobTitle}
            onSave={(v) => handleFieldUpdate("jobTitle", v)}
          />
          <EditableField
            id="function"
            label="Function"
            value={person.function}
            onSave={(v) => handleFieldUpdate("function", v)}
          />
          <EditableField
            id="level"
            label="Level"
            value={person.level}
            onSave={(v) => handleFieldUpdate("level", v)}
          />
          <EditableField
            id="company"
            label="Company"
            value={person.company}
            onSave={(v) => handleFieldUpdate("company", v)}
          />
          <EditableField
            id="industry"
            label="Industry"
            value={person.industry}
            onSave={(v) => handleFieldUpdate("industry", v)}
          />
        </div>

        <Separator />

        <nav className="flex flex-1 flex-col gap-0.5 p-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setActiveView(item.key)}
              data-active={activeView === item.key || undefined}
              className="rounded-md px-3 py-1.5 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground data-active:bg-muted data-active:text-foreground"
            >
              {item.label}
            </button>
          ))}
        </nav>

        <Separator />

        <div className="flex flex-col gap-1.5 p-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() =>
              startTransition(() => generateRandomAssessments(person.id))
            }
          >
            <Shuffle className="size-4" />
            Generate Random Data
          </Button>
          <form action={deletePerson.bind(null, person.id)}>
            <Button
              type="submit"
              variant="destructive"
              size="sm"
              className="w-full"
            >
              <Trash2 className="size-4" />
              Delete
            </Button>
          </form>
        </div>
      </aside>

      <ScrollArea className="flex-1">
        <div className="p-6">
          <AssessmentPanel view={activeView} data={assessments} />
        </div>
      </ScrollArea>
    </div>
  );
}
