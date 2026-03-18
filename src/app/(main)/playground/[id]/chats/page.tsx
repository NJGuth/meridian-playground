import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createChat, getChatsForPlayground } from "@/server/actions/chat";

export default async function ChatsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const chatList = await getChatsForPlayground(id);

  const createChatWithId = createChat.bind(null, id);

  return (
    <div className="container mx-auto flex flex-1 flex-col gap-6 px-6 py-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          Chats
        </h2>
        <form action={createChatWithId}>
          <Button type="submit" size="sm">
            <Plus className="size-4" />
            New Chat
          </Button>
        </form>
      </div>

      {chatList.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 text-muted-foreground">
          <p className="text-sm">No chats yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {chatList.map((chat) => (
            <Link
              key={chat.id}
              href={`/playground/${id}/chats/${chat.id}`}
              className="flex items-center justify-between rounded-sm border p-4 transition-colors hover:bg-secondary"
            >
              <span className="text-sm font-medium">{chat.title}</span>
              <span className="text-xs text-muted-foreground">
                {chat.createdAt.toLocaleDateString()}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
