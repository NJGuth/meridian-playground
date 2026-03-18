"use client";

import { useState, useTransition } from "react";
import { SlidersHorizontal, EllipsisVertical, Copy, Trash2 } from "lucide-react";
import { Popover } from "radix-ui";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useSidebar } from "@/components/ui/sidebar";
import {
  deletePlayground,
  duplicatePlayground,
} from "@/server/actions/playground";

type ConfirmAction = "delete" | "duplicate" | null;

export function PlaygroundSidebarTrigger({
  playgroundId,
}: {
  playgroundId: string;
}) {
  const { toggleSidebar } = useSidebar();
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null);
  const [isPending, startTransition] = useTransition();

  function handleMenuAction(action: ConfirmAction) {
    setMenuOpen(false);
    setConfirmAction(action);
  }

  function handleConfirm() {
    if (!confirmAction) return;
    const action = confirmAction;
    setConfirmAction(null);
    startTransition(() => {
      if (action === "delete") {
        deletePlayground(playgroundId);
      } else {
        duplicatePlayground(playgroundId);
      }
    });
  }

  return (
    <div className="flex items-center gap-1">
      <Popover.Root open={menuOpen} onOpenChange={setMenuOpen}>
        <Popover.Trigger asChild>
          <Button variant="ghost" size="icon" className="size-9">
            <EllipsisVertical className="size-4" />
            <span className="sr-only">More options</span>
          </Button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            align="end"
            sideOffset={4}
            className="z-50 min-w-40 rounded-lg border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95"
          >
            <button
              type="button"
              disabled={isPending}
              onClick={() => handleMenuAction("duplicate")}
              className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
            >
              <Copy className="size-4" />
              Duplicate
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={() => handleMenuAction("delete")}
              className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-destructive outline-hidden hover:bg-destructive/10 disabled:opacity-50"
            >
              <Trash2 className="size-4" />
              Delete
            </button>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      <Separator orientation="vertical" className="h-4 self-center data-vertical:self-auto" />

      <Button
        variant="ghost"
        size="icon"
        className="size-9"
        onClick={toggleSidebar}
      >
        <SlidersHorizontal className="size-4" />
        <span className="sr-only">Toggle sidebar</span>
      </Button>

      <AlertDialog
        open={confirmAction !== null}
        onOpenChange={(open) => {
          if (!open) setConfirmAction(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmAction === "delete"
                ? "Delete playground"
                : "Duplicate playground"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction === "delete"
                ? "This will permanently delete this playground and all of its chats. This action cannot be undone."
                : "This will create a copy of this playground with the same settings. You'll be redirected to the playgrounds list."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirm}
              variant={confirmAction === "delete" ? "destructive" : "default"}
            >
              {confirmAction === "delete" ? "Delete" : "Duplicate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
