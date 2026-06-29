import { Suspense } from "react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Calendar, Home, Mic } from "lucide-react";
import { db } from "@/server/db";
import { voiceConcepts } from "@/server/db/schema";
import {
  createVoiceConcept,
  deleteVoiceConcept,
  duplicateVoiceConcept,
} from "@/server/actions/voice-concept";
import {
  CardGrid,
  CardGridSkeleton,
  CreateCard,
} from "@/components/ui/card-grid";
import { CardContextMenu } from "@/components/ui/card-context-menu";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

async function VoiceConceptsGrid() {
  const concepts = await db.select().from(voiceConcepts);

  return (
    <CardGrid>
      <form action={createVoiceConcept}>
        <CreateCard type="submit" label="Create" />
      </form>

      {concepts.map((concept) => (
        <CardContextMenu
          key={concept.id}
          onDuplicate={duplicateVoiceConcept.bind(null, concept.id)}
          onDelete={deleteVoiceConcept.bind(null, concept.id)}
        >
          <Link href={`/hub/voice-concepts/${concept.id}`} className="block">
            <div className="flex aspect-square flex-col rounded-xl p-5 ring-1 ring-foreground/10 transition-colors hover:bg-muted/50">
              <h3 className="text-lg font-semibold text-foreground">
                {concept.title}
              </h3>
              <div className="mt-1 flex items-center gap-1.5 text-muted-foreground">
                <Mic className="size-3.5" />
                <span className="text-xs capitalize">{concept.voice}</span>
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-muted-foreground">
                <Calendar className="size-3.5" />
                <span className="text-xs">
                  {concept.createdAt.toLocaleDateString("en-US", {
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

export default function VoiceConceptsPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <header className="flex shrink-0 items-center justify-between border-b px-6 py-2">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-sm"
        >
          <Button variant="secondary" size="icon" className="size-9" asChild>
            <Link href="/hub">
              <Home className="size-4" />
              <span className="sr-only">Concept Hub</span>
            </Link>
          </Button>
          <Separator orientation="vertical" className="h-5! self-center!" />
          <span className="font-medium text-foreground">Voice Concepts</span>
        </nav>
        <UserButton />
      </header>

      <div className="container mx-auto flex flex-1 flex-col overflow-y-auto px-6 py-6">
        <div className="mb-6 flex flex-col gap-1">
          <p className="text-sm/6 text-muted-foreground">
            Create configurable OpenAI Realtime voice experiences with persona,
            script, and rules.
          </p>
        </div>

        <Suspense fallback={<CardGridSkeleton />}>
          <VoiceConceptsGrid />
        </Suspense>
      </div>
    </div>
  );
}
