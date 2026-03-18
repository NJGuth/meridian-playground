"use client";

import { useTransition } from "react";
import { Copy, Trash2 } from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

export function CardContextMenu({
  children,
  onDuplicate,
  onDelete,
}: {
  children: React.ReactNode;
  onDuplicate: () => Promise<void>;
  onDelete: () => Promise<void>;
}) {
  const [, startTransition] = useTransition();

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem
          onSelect={() => startTransition(() => onDuplicate())}
        >
          <Copy />
          Duplicate
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem
          variant="destructive"
          onSelect={() => startTransition(() => onDelete())}
        >
          <Trash2 />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
