import { planSchemaToProseMirror } from "@/lib/plan/to-doc";
import { SAMPLE_DEVELOPMENT_PLAN } from "@/hub/sample-plans";
import { DevelopmentPlanDemo } from "./_components/development-plan-demo";

export default function DevelopmentPlanPage() {
  const initialDoc = planSchemaToProseMirror(SAMPLE_DEVELOPMENT_PLAN);

  return (
    <div className="container mx-auto flex min-h-0 flex-1 flex-col px-6 py-6">
      <p className="mb-4 shrink-0 text-sm/6 text-muted-foreground">
        Sample development plan loaded into the rich-text editor. Edits are local
        only — nothing is saved to the database.
      </p>
      <DevelopmentPlanDemo initialDoc={initialDoc} />
    </div>
  );
}
