"use client";

import {
  Check,
  Copy,
  FileText,
  Loader2,
  MoreVertical,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState, useTransition } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Markdown } from "@/components/ui/markdown";
import { InterviewExperience } from "@/components/interview/interview-experience";
import {
  deleteInterview,
  revalidateInterviewConcept,
} from "@/server/actions/interview";
import type { TranscriptEntry } from "@/lib/voice/transcript";

type InterviewRow = {
  id: string;
  intervieweeName: string;
  status: string;
  summary: string;
  transcript: TranscriptEntry[];
  createdAt: string;
  completedAt: string | null;
};

type ConceptData = {
  id: string;
  title: string;
  subjectName: string;
  passcode: string;
  report: string;
  reportGeneratedAt: string | null;
};

export function InterviewConceptManager({
  concept,
  interviews,
}: {
  concept: ConceptData;
  interviews: InterviewRow[];
}) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [addName, setAddName] = useState("");
  const [addStarted, setAddStarted] = useState(false);
  const [transcriptView, setTranscriptView] = useState<InterviewRow | null>(
    null,
  );
  const [report, setReport] = useState(concept.report);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<InterviewRow | null>(null);
  const [isDeleting, startDelete] = useTransition();

  const completedCount = useMemo(
    () => interviews.filter((i) => i.status === "complete").length,
    [interviews],
  );

  const handleCopyLink = useCallback(() => {
    const url = `${window.location.origin}/interview/${concept.id}`;
    void navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }, [concept.id]);

  const closeAddDialog = useCallback(() => {
    setAddOpen(false);
    setAddName("");
    setAddStarted(false);
    router.refresh();
  }, [router]);

  const handleConfirmDelete = useCallback(() => {
    if (!pendingDelete) return;
    const id = pendingDelete.id;
    startDelete(async () => {
      await deleteInterview(id);
      setPendingDelete(null);
      router.refresh();
    });
  }, [pendingDelete, router]);

  const handleGenerateReport = useCallback(async () => {
    setReportError(null);
    setReportLoading(true);
    try {
      const res = await fetch("/api/interview/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conceptId: concept.id }),
      });
      const data = (await res.json()) as { report?: string; error?: string };
      if (!res.ok || !data.report) {
        throw new Error(data.error ?? "Failed to generate report.");
      }
      setReport(data.report);
      await revalidateInterviewConcept();
    } catch (error) {
      setReportError(
        error instanceof Error ? error.message : "Failed to generate report.",
      );
    } finally {
      setReportLoading(false);
    }
  }, [concept.id]);

  return (
    <div className="container mx-auto flex flex-1 flex-col gap-8 overflow-y-auto px-6 py-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-foreground">
          {concept.title}
        </h1>
        <p className="text-sm/6 text-muted-foreground">
          Collect confidential voice 360 feedback about{" "}
          <span className="font-medium text-foreground">
            {concept.subjectName}
          </span>
          . Share the link and access code below, or start an interview yourself.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-muted/30 p-4">
        <Button type="button" variant="outline" onClick={handleCopyLink}>
          {copied ? (
            <Check className="size-4 text-emerald-600" />
          ) : (
            <Copy className="size-4" />
          )}
          {copied ? "Copied" : "Copy link"}
        </Button>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Access code</span>
          <span className="rounded-md bg-background px-2.5 py-1 font-mono text-sm font-medium text-foreground ring-1 ring-foreground/10">
            {concept.passcode || "—"}
          </span>
        </div>
        <div className="ml-auto">
          <Button type="button" onClick={() => setAddOpen(true)}>
            <Plus className="size-4" />
            Add interview
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-foreground">
            Interviews ({interviews.length})
          </h2>
        </div>

        {interviews.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No interviews yet. Share the link or add one to get started.
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border">
            {interviews.map((interview, index) => (
              <div
                key={interview.id}
                className={
                  index > 0
                    ? "flex items-center gap-4 border-t border-border px-4 py-3"
                    : "flex items-center gap-4 px-4 py-3"
                }
              >
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-sm font-medium text-foreground">
                    {interview.intervieweeName}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(interview.createdAt).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                {interview.status === "complete" ? (
                  <Badge variant="secondary" className="shrink-0">
                    <Check className="size-3" />
                    Complete
                  </Badge>
                ) : (
                  <Badge variant="outline" className="shrink-0">
                    In progress
                  </Badge>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={interview.transcript.length === 0}
                  onClick={() => setTranscriptView(interview)}
                >
                  <FileText className="size-4" />
                  View transcript
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Actions for ${interview.intervieweeName}`}
                    >
                      <MoreVertical className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      variant="destructive"
                      onSelect={() => setPendingDelete(interview)}
                    >
                      <Trash2 className="size-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-col gap-0.5">
            <h2 className="text-sm font-medium text-foreground">Report</h2>
            <p className="text-xs text-muted-foreground">
              {completedCount < 2
                ? `Complete at least 2 interviews to generate a report (${completedCount}/2).`
                : `Synthesized across ${completedCount} completed interviews.`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {completedCount >= 2 && (
              <p className="max-w-2xs text-right text-xs text-muted-foreground">
                {reportLoading
                  ? "Working through every transcript — this can take a minute or two."
                  : "Heads up: this reads every transcript in full and can take a minute or two."}
              </p>
            )}
            <Button
              type="button"
              onClick={handleGenerateReport}
              disabled={completedCount < 2 || reportLoading}
            >
              {reportLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Sparkles className="size-4" />
              )}
              {reportLoading
                ? "Generating…"
                : report
                  ? "Regenerate report"
                  : "Generate report"}
            </Button>
          </div>
        </div>

        {reportError && <p className="text-sm text-destructive">{reportError}</p>}

        {report && (
          <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
            <Markdown className="typography mx-auto">{report}</Markdown>
          </div>
        )}
      </div>

      <Dialog
        open={addOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeAddDialog();
          } else {
            setAddOpen(true);
          }
        }}
      >
        <DialogContent className="flex h-[85dvh] flex-col p-0 sm:max-w-2xl">
          {addStarted ? (
            <InterviewExperience
              conceptId={concept.id}
              subjectName={concept.subjectName}
              intervieweeName={addName.trim()}
              onCompleted={() => router.refresh()}
            />
          ) : (
            <div className="flex flex-1 flex-col justify-center gap-5 p-8">
              <DialogHeader>
                <DialogTitle>Add an interview</DialogTitle>
              </DialogHeader>
              <p className="text-sm/6 text-muted-foreground">
                You're giving feedback on{" "}
                <span className="font-medium text-foreground">
                  {concept.subjectName}
                </span>
                . Enter the interviewee's name to begin.
              </p>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="add-name"
                  className="text-sm font-medium text-foreground"
                >
                  Interviewee name
                </label>
                <Input
                  id="add-name"
                  value={addName}
                  onChange={(event) => setAddName(event.target.value)}
                  placeholder="Enter name"
                  autoFocus
                />
              </div>
              <Button
                type="button"
                size="lg"
                disabled={!addName.trim()}
                onClick={() => setAddStarted(true)}
              >
                Continue
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={transcriptView !== null}
        onOpenChange={(open) => {
          if (!open) setTranscriptView(null);
        }}
      >
        <DialogContent className="flex max-h-[85dvh] flex-col sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {transcriptView?.intervieweeName}'s transcript
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 overflow-y-auto pr-1">
            {transcriptView?.summary && (
              <div className="rounded-lg bg-muted/40 p-3">
                <p className="text-xs font-medium text-foreground">Summary</p>
                <p className="mt-1 whitespace-pre-wrap text-sm/6 text-muted-foreground">
                  {transcriptView.summary}
                </p>
              </div>
            )}
            <div className="flex flex-col gap-3">
              {transcriptView?.transcript.map((entry) => (
                <div
                  key={entry.id}
                  className="flex flex-col gap-0.5"
                >
                  <span className="text-xs font-medium text-muted-foreground">
                    {entry.role === "user"
                      ? transcriptView?.intervieweeName
                      : "Interviewer"}
                  </span>
                  <p className="text-sm/6 text-foreground">{entry.text}</p>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => {
          if (!open && !isDeleting) setPendingDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this interview?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete
                ? `"${pendingDelete.intervieweeName}"'s interview and transcript will be permanently removed from the process. This cannot be undone.`
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isDeleting}
              onClick={(event) => {
                event.preventDefault();
                handleConfirmDelete();
              }}
            >
              {isDeleting && <Loader2 className="size-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
