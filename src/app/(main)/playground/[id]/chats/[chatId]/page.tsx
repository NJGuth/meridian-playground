import { notFound } from "next/navigation";
import { db } from "@/server/db";
import { playgrounds } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { ChatPanel } from "./_components/chat-panel";
import { getAllPrompts } from "@/server/actions/prompt";
import { getMessagesForChat } from "@/server/actions/message";
import type { IdentityToneConfig, FeedbackStyle, CoachingPosture } from "@/lib/types/identity-tone";
import type { RulesConfig } from "@/lib/types/playground-rules";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ id: string; chatId: string }>;
}) {
  const { id, chatId } = await params;

  const [[playground], allPrompts, persistedMessages] = await Promise.all([
    db
      .select({
        model: playgrounds.model,
        title: playgrounds.title,
        roleDescription: playgrounds.roleDescription,
        feedbackStyle: playgrounds.feedbackStyle,
        coachingPosture: playgrounds.coachingPosture,
        disabledRuleIds: playgrounds.disabledRuleIds,
        customRules: playgrounds.customRules,
        welcomeMessage: playgrounds.welcomeMessage,
      })
      .from(playgrounds)
      .where(eq(playgrounds.id, id))
      .limit(1),
    getAllPrompts(),
    getMessagesForChat(chatId),
  ]);

  if (!playground) notFound();

  const identityTone: IdentityToneConfig = {
    coachName: playground.title,
    roleDescription: playground.roleDescription,
    feedbackStyle: playground.feedbackStyle as FeedbackStyle,
    coachingPosture: playground.coachingPosture as CoachingPosture,
  };

  const rulesConfig: RulesConfig = {
    disabledRuleIds: playground.disabledRuleIds,
    customRules: playground.customRules,
  };

  return (
    <ChatPanel
      playgroundId={id}
      chatId={chatId}
      model={playground.model}
      prompts={allPrompts}
      identityTone={identityTone}
      rulesConfig={rulesConfig}
      welcomeMessage={playground.welcomeMessage}
      initialMessages={persistedMessages}
    />
  );
}
