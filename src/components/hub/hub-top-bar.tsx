"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { resolveHubContext } from "@/hub/registry";
import { Badge } from "@/components/ui/badge";

const COMPLEXITY_LABELS = {
  ui: "UI",
  ai: "AI",
  "full-stack": "Full-stack",
} as const;

export function HubTopBar() {
  const pathname = usePathname();
  const context = resolveHubContext(pathname);

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1">
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1 text-xs text-muted-foreground"
      >
        <Link href="/hub" className="hover:text-foreground">
          Hub
        </Link>
        {context.type === "category" && context.folder && (
          <>
            <ChevronRight className="size-3" />
            <span className="text-foreground">{context.folder.label}</span>
          </>
        )}
        {context.type === "prototype" && context.folder && context.prototype && (
          <>
            <ChevronRight className="size-3" />
            <span className="text-foreground">{context.prototype.title}</span>
          </>
        )}
      </nav>
      <div className="flex items-center gap-2">
        <h1 className="truncate text-lg font-semibold text-foreground">
          {context.title}
        </h1>
        {context.type === "prototype" && context.prototype && (
          <>
            <Badge variant="secondary">
              {COMPLEXITY_LABELS[context.prototype.complexity]}
            </Badge>
            {context.prototype.status === "draft" && (
              <Badge variant="outline">Draft</Badge>
            )}
          </>
        )}
      </div>
    </div>
  );
}
