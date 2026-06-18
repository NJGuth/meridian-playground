"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Loader } from "@/components/ui/loader";
import { getPlan } from "@/server/actions/plan";
import { PlanEditor } from "./plan-editor";

export function PlanDialog({
  planId,
  title,
  open,
  onOpenChange,
}: {
  planId: string;
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [doc, setDoc] = useState<unknown | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    let active = true;
    setLoading(true);
    getPlan(planId)
      .then((plan) => {
        if (active) setDoc(plan?.docJson ?? { type: "doc", content: [] });
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [open, planId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85dvh] w-full flex-col p-6 sm:max-w-3xl">
        <DialogTitle className="sr-only">
          {title || "Development Plan"}
        </DialogTitle>
        {loading || doc === null ? (
          <div className="flex flex-1 items-center justify-center py-12">
            <Loader />
          </div>
        ) : (
          <PlanEditor planId={planId} initialDoc={doc} />
        )}
      </DialogContent>
    </Dialog>
  );
}
