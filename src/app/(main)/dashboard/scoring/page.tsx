import { getScoringConfig } from "@/server/actions/scoring";
import { ScoringForm } from "./_components/scoring-form";

export default async function ScoringPage() {
  const config = await getScoringConfig();

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <div className="container mx-auto max-w-2xl px-6 py-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-semibold tracking-tight text-foreground">
            Scoring Thresholds
          </h1>
          <p className="text-sm/6 text-muted-foreground">
            Configure the percentile thresholds used to classify assessment
            scores. Changes apply to all new chat sessions.
          </p>
        </div>

        <ScoringForm config={config} />
      </div>
    </div>
  );
}
