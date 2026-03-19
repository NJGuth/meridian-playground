"use server";

import type { UIMessage } from "ai";
import { asc, eq } from "drizzle-orm";
import { db } from "@/server/db";
import { messages } from "@/server/db/schema";

export async function saveMessage(chatId: string, message: UIMessage) {
  await db
    .insert(messages)
    .values({
      id: message.id,
      chatId,
      role: message.role,
      parts: message.parts as unknown[],
      metadata: (message.metadata as Record<string, unknown>) ?? null,
    })
    .onConflictDoUpdate({
      target: messages.id,
      set: {
        parts: message.parts as unknown[],
        metadata: (message.metadata as Record<string, unknown>) ?? null,
      },
    });
}

export async function getMessagesForChat(
  chatId: string,
): Promise<UIMessage[]> {
  const rows = await db
    .select()
    .from(messages)
    .where(eq(messages.chatId, chatId))
    .orderBy(asc(messages.createdAt));

  return rows.map((row) => ({
    id: row.id,
    role: row.role as UIMessage["role"],
    parts: row.parts as UIMessage["parts"],
    metadata: row.metadata ?? undefined,
  }));
}
