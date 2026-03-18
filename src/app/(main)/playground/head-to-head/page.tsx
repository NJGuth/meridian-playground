import Link from "next/link";
import { Home } from "lucide-react";
import { db } from "@/server/db";
import { playgrounds } from "@/server/db/schema";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PersonProvider } from "@/app/(main)/playground/[id]/_components/person-context";
import { HeadToHeadPanel } from "./_components/head-to-head-panel";
import type { FeedbackStyle, CoachingPosture } from "@/lib/types/identity-tone";
import type { PlaygroundOption } from "./_components/head-to-head-chat";

export default async function HeadToHeadPage() {
  const allPlaygrounds = await db.select().from(playgrounds);

  const options: PlaygroundOption[] = allPlaygrounds.map((pg) => ({
    id: pg.id,
    title: pg.title,
    model: pg.model,
    identityTone: {
      coachName: pg.title,
      roleDescription: pg.roleDescription,
      feedbackStyle: pg.feedbackStyle as FeedbackStyle,
      coachingPosture: pg.coachingPosture as CoachingPosture,
    },
    rulesConfig: {
      disabledRuleIds: pg.disabledRuleIds,
      customRules: pg.customRules,
    },
  }));

  return (
    <PersonProvider>
      <div className="flex h-dvh flex-col overflow-hidden">
        <header className="flex shrink-0 items-center gap-3 border-b px-6 py-2">
          <Button variant="ghost" size="icon" className="size-8" asChild>
            <Link href="/dashboard/playgrounds">
              <Home className="size-4" />
            </Link>
          </Button>
          <Separator orientation="vertical" className="h-4" />
          <h1 className="text-sm font-medium">Head to Head</h1>
        </header>
        <HeadToHeadPanel playgrounds={options} />
      </div>
    </PersonProvider>
  );
}
