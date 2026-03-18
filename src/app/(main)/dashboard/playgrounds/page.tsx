import { Suspense } from "react";
import Link from "next/link";
import { db } from "@/server/db";
import { playgrounds } from "@/server/db/schema";
import { ArrowRight, Calendar, Swords } from "lucide-react";
import {
  createPlayground,
  deletePlayground,
  duplicatePlayground,
} from "@/server/actions/playground";
import { CardGrid, CardGridSkeleton, CreateCard } from "@/components/ui/card-grid";
import { CardContextMenu } from "@/components/ui/card-context-menu";

const MODEL_LABELS: Record<string, string> = {
  "anthropic/claude-opus-4-6": "Claude Opus 4.6",
  "anthropic/claude-sonnet-4-6": "Claude Sonnet 4.6",
  "openai/gpt-5.4": "GPT-5.4",
  "openai/gpt-5.2": "GPT-5.2",
  "google/gemini-3.1-pro": "Gemini 3.1 Pro",
  "xai/grok-4.1": "Grok 4.1",
  "deepseek/deepseek-r1": "DeepSeek R1",
};

async function PlaygroundsGrid() {
  const allPlaygrounds = await db.select().from(playgrounds);

  return (
    <CardGrid>
      <form action={createPlayground}>
        <CreateCard type="submit" label="Create" />
      </form>

      {allPlaygrounds.map((pg) => (
        <CardContextMenu
          key={pg.id}
          onDuplicate={duplicatePlayground.bind(null, pg.id)}
          onDelete={deletePlayground.bind(null, pg.id)}
        >
          <Link href={`/playground/${pg.id}`} className="block">
            <div className="flex aspect-square flex-col rounded-xl p-5 ring-1 ring-foreground/10 transition-colors hover:bg-muted/50">
              <h3 className="text-lg font-semibold text-foreground">
                {pg.title}
              </h3>
              <div className="mt-1 flex items-center gap-1.5 text-muted-foreground">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://models.dev/logos/${pg.model.split("/")[0]}.svg`}
                  alt={pg.model.split("/")[0]}
                  className="size-3.5 invert"
                  width={14}
                  height={14}
                />
                <span className="text-xs">
                  {MODEL_LABELS[pg.model] ?? pg.model}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-muted-foreground">
                <Calendar className="size-3.5" />
                <span className="text-xs">
                  {pg.createdAt.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </Link>
        </CardContextMenu>
      ))}
    </CardGrid>
  );
}

export default function PlaygroundsPage() {
  return (
    <div className="container mx-auto flex flex-1 flex-col overflow-y-auto px-6 py-6">
      <Link
        href="/playground/head-to-head"
        className="group mb-6 flex items-center gap-3 rounded-xl bg-muted/50 px-5 py-3 ring-1 ring-foreground/10 transition-colors hover:bg-muted"
      >
        <Swords className="size-5 shrink-0 text-muted-foreground" />
        <div className="flex flex-1 flex-col">
          <span className="text-sm font-medium">Head to Head</span>
          <span className="text-xs text-muted-foreground">
            Compare two playground configs side by side
          </span>
        </div>
        <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
      </Link>

      <Suspense fallback={<CardGridSkeleton />}>
        <PlaygroundsGrid />
      </Suspense>
    </div>
  );
}
