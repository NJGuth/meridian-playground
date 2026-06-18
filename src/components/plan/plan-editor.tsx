"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useRef, useState } from "react";
import { Markdown } from "tiptap-markdown";
import { cn } from "@/lib/utils";
import { updatePlanDoc } from "@/server/actions/plan";

const AUTOSAVE_DELAY = 1000;

type SaveStatus = "idle" | "saving" | "saved";

export function PlanEditor({
  planId,
  initialDoc,
  className,
  persist = true,
}: {
  planId: string;
  initialDoc: unknown;
  className?: string;
  persist?: boolean;
}) {
  const [status, setStatus] = useState<SaveStatus>("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Markdown],
    content: (initialDoc as object) ?? "",
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-chat max-w-none focus:outline-none",
          "prose-h1:text-2xl prose-h1:font-semibold prose-h1:mb-2",
          "prose-h2:mt-6 prose-h2:mb-2 prose-h2:text-lg prose-h2:font-semibold",
          "prose-h3:mt-4 prose-h3:mb-1 prose-h3:text-xs prose-h3:font-semibold prose-h3:uppercase prose-h3:tracking-wide",
          "prose-p:text-sm prose-li:text-sm prose-li:marker:text-muted-foreground",
        ),
      },
    },
    onUpdate: ({ editor: current }) => {
      if (!persist) return;

      setStatus("saving");
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(async () => {
        const docJson = current.getJSON();
        const markdownStorage = (
          current.storage as unknown as Record<string, unknown>
        ).markdown as { getMarkdown: () => string } | undefined;
        const docMarkdown = markdownStorage?.getMarkdown() ?? "";
        await updatePlanDoc(planId, docJson, docMarkdown);
        setStatus("saved");
      }, AUTOSAVE_DELAY);
    },
  });

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2">
      <div className="min-h-0 flex-1 overflow-auto pr-2">
        <EditorContent editor={editor} className={className} />
      </div>
      <p className="shrink-0 text-right text-xs text-muted-foreground">
        {!persist
          ? "Sandbox mode — changes are not saved"
          : status === "saving"
            ? "Saving..."
            : status === "saved"
              ? "All changes saved"
              : "\u00A0"}
      </p>
    </div>
  );
}
