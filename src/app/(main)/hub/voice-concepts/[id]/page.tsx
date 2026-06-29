import { notFound } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import { voiceConcepts } from "@/server/db/schema";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { ConceptConfigSidebar } from "./_components/concept-config-sidebar";
import { VoiceConceptProvider } from "./_components/voice-concept-config-context";
import { VoiceConceptExperience } from "./_components/voice-concept-experience";
import { VoiceConceptNav } from "./_components/voice-concept-nav";
import { VoiceConceptSidebarTrigger } from "./_components/voice-concept-sidebar-trigger";

export default async function VoiceConceptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [concept] = await db
    .select()
    .from(voiceConcepts)
    .where(eq(voiceConcepts.id, id))
    .limit(1);

  if (!concept) notFound();

  return (
    <VoiceConceptProvider concept={concept}>
      <SidebarProvider defaultOpen className="h-dvh! min-h-0!">
        <SidebarInset className="flex flex-1 flex-col overflow-hidden">
          <header className="flex shrink-0 items-center justify-between border-b px-6 py-2">
            <VoiceConceptNav />
            <div className="flex items-center gap-2">
              <VoiceConceptSidebarTrigger conceptId={concept.id} />
              <UserButton />
            </div>
          </header>
          <VoiceConceptExperience />
        </SidebarInset>
        <ConceptConfigSidebar />
      </SidebarProvider>
    </VoiceConceptProvider>
  );
}
