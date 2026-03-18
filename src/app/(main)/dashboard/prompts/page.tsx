import { Suspense } from "react";
import Link from "next/link";
import { db } from "@/server/db";
import { prompts } from "@/server/db/schema";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import {
  createPrompt,
  deletePrompt,
  duplicatePrompt,
} from "@/server/actions/prompt";
import { CardGrid, CardGridSkeleton, CreateCard } from "@/components/ui/card-grid";
import { CardContextMenu } from "@/components/ui/card-context-menu";

async function PromptsGrid() {
  const allPrompts = await db.select().from(prompts);

  return (
    <CardGrid>
      <form action={createPrompt}>
        <CreateCard type="submit" label="Create" />
      </form>

      {allPrompts.map((prompt) => (
        <CardContextMenu
          key={prompt.id}
          onDuplicate={duplicatePrompt.bind(null, prompt.id)}
          onDelete={deletePrompt.bind(null, prompt.id)}
        >
          <Link
            href={`/dashboard/prompts/${prompt.id}`}
            className="block"
          >
            <div className="flex aspect-square flex-col rounded-xl p-5 ring-1 ring-foreground/10 transition-colors hover:bg-muted/50">
              <p className="line-clamp-6 flex-1 text-base/6 italic text-foreground">
                {prompt.content || "Empty prompt"}
              </p>
              <div className="mt-auto flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <ThumbsUp className="size-3.5" />
                  <span className="text-xs">
                    {prompt.positiveExamples.length}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ThumbsDown className="size-3.5" />
                  <span className="text-xs">
                    {prompt.negativeExamples.length}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </CardContextMenu>
      ))}
    </CardGrid>
  );
}

export default function PromptsPage() {
  return (
    <div className="container mx-auto flex flex-1 flex-col overflow-y-auto px-6 py-6">
      <Suspense fallback={<CardGridSkeleton />}>
        <PromptsGrid />
      </Suspense>
    </div>
  );
}
