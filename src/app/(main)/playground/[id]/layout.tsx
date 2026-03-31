import { notFound } from "next/navigation";
import { db } from "@/server/db";
import { playgrounds } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarHeader,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlaygroundNav } from "./_components/playground-nav";
import { PlaygroundSidebarTrigger } from "./_components/sidebar-trigger";
import { PlaygroundTitleForm } from "../_components/playground-title-form";
import { ModelSelectorField } from "./_components/model-selector-field";
import { IdentityToneFields } from "./_components/identity-tone-fields";
import { RulesFields } from "./_components/rules-fields";
import { PersonSelectorField } from "./_components/person-selector-field";
import { PersonProvider } from "./_components/person-context";
import { updatePlayground } from "@/server/actions/playground";
import type { FeedbackStyle, CoachingPosture } from "@/lib/types/identity-tone";

export default async function PlaygroundLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [playground] = await db
    .select()
    .from(playgrounds)
    .where(eq(playgrounds.id, id))
    .limit(1);

  if (!playground) notFound();

  return (
    <PersonProvider>
      <SidebarProvider
        defaultOpen={true}
        className="h-dvh! min-h-0!"
      >
        <SidebarInset className="flex flex-1 flex-col overflow-hidden">
          <header className="flex shrink-0 items-center justify-between border-b px-6 py-2">
            <PlaygroundNav id={id} />
            <PlaygroundSidebarTrigger playgroundId={playground.id} />
          </header>
          <div className="flex flex-1 flex-col overflow-hidden">
            {children}
          </div>
        </SidebarInset>
        <Sidebar side="right">
          <Tabs defaultValue="settings" className="flex flex-1 flex-col gap-0 overflow-hidden">
            <SidebarHeader className="px-4 py-3">
              <TabsList className="w-full">
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="rules">Rules</TabsTrigger>
              </TabsList>
            </SidebarHeader>
            <TabsContent
              value="settings"
              forceMount
              className="min-h-0 flex-1 data-[state=inactive]:hidden"
            >
              <ScrollArea className="h-full">
                <div className="flex flex-col gap-6 px-4 py-2">
                  <PlaygroundTitleForm
                    id={playground.id}
                    defaultValue={playground.title}
                    updatePlayground={updatePlayground}
                  />
                  <ModelSelectorField
                    playgroundId={playground.id}
                    currentModel={playground.model}
                  />
                  <SidebarSeparator className="-mx-4" />
                  <PersonSelectorField />
                  <SidebarSeparator className="-mx-4" />
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Identity & Tone
                    </span>
                    <IdentityToneFields
                      playgroundId={playground.id}
                      defaultRoleDescription={playground.roleDescription}
                      defaultFeedbackStyle={playground.feedbackStyle as FeedbackStyle}
                      defaultCoachingPosture={playground.coachingPosture as CoachingPosture}
                      defaultWelcomeMessage={playground.welcomeMessage}
                    />
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent
              value="rules"
              forceMount
              className="min-h-0 flex-1 data-[state=inactive]:hidden"
            >
              <ScrollArea className="h-full">
                <div className="flex flex-col gap-4 px-4 py-2">
                  <RulesFields
                    playgroundId={playground.id}
                    defaultDisabledRuleIds={playground.disabledRuleIds}
                    defaultCustomRules={playground.customRules}
                  />
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </Sidebar>
      </SidebarProvider>
    </PersonProvider>
  );
}
