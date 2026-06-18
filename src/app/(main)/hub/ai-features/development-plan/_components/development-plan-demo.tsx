"use client";

import { PlanEditor } from "@/components/plan/plan-editor";

export function DevelopmentPlanDemo({ initialDoc }: { initialDoc: unknown }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col rounded-xl ring-1 ring-foreground/10 p-4">
      <PlanEditor
        planId="demo"
        initialDoc={initialDoc}
        persist={false}
        className="min-h-[480px]"
      />
    </div>
  );
}
