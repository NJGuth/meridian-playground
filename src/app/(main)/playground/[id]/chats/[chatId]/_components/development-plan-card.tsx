"use client";

import { ExternalLinkIcon, FileTextIcon } from "lucide-react";
import { useState } from "react";
import {
  Artifact,
  ArtifactAction,
  ArtifactActions,
  ArtifactDescription,
  ArtifactHeader,
  ArtifactTitle,
} from "@/components/ai-elements/artifact";
import { PlanDialog } from "@/components/plan/plan-dialog";

export function DevelopmentPlanCard({
  planId,
  title,
  summary,
}: {
  planId: string;
  title: string;
  summary?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Artifact className="w-full">
        <ArtifactHeader>
          <div className="flex min-w-0 items-center gap-2">
            <FileTextIcon className="size-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0">
              <ArtifactTitle className="truncate">
                {title || "Development Plan"}
              </ArtifactTitle>
              {summary && (
                <ArtifactDescription className="line-clamp-1">
                  {summary}
                </ArtifactDescription>
              )}
            </div>
          </div>
          <ArtifactActions>
            <ArtifactAction
              icon={ExternalLinkIcon}
              tooltip="Open plan"
              label="Open plan"
              onClick={() => setOpen(true)}
            />
          </ArtifactActions>
        </ArtifactHeader>
      </Artifact>
      <PlanDialog
        planId={planId}
        title={title}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
