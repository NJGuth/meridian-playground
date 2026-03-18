"use server";

import { db } from "@/server/db";
import { chats } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createChat(playgroundId: string) {
  const [chat] = await db
    .insert(chats)
    .values({ playgroundId, title: "New Chat" })
    .returning();

  redirect(`/playground/${playgroundId}/chats/${chat.id}`);
}

export async function getChatsForPlayground(playgroundId: string) {
  return db
    .select()
    .from(chats)
    .where(eq(chats.playgroundId, playgroundId))
    .orderBy(chats.createdAt);
}

export async function deleteChat(formData: FormData) {
  const id = formData.get("id") as string;
  const playgroundId = formData.get("playgroundId") as string;
  if (!id || !playgroundId) return;

  await db.delete(chats).where(eq(chats.id, id));

  revalidatePath(`/playground/${playgroundId}/chats`);
}
