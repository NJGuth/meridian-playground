"use client";

import { Loader2, Lock } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InterviewExperience } from "@/components/interview/interview-experience";

type Phase = "passcode" | "name" | "interview";

export function PublicInterviewFlow({
  conceptId,
  subjectName,
  introText,
}: {
  conceptId: string;
  subjectName: string;
  introText: string;
}) {
  const [phase, setPhase] = useState<Phase>("passcode");
  const [passcode, setPasscode] = useState("");
  const [name, setName] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setVerifying(true);
    try {
      const res = await fetch("/api/interview/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conceptId, passcode: passcode.trim() }),
      });
      const data = (await res.json()) as { ok?: boolean };
      if (data.ok) {
        setPhase("name");
      } else {
        setError("That code isn't right. Please check and try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  const handleName = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    setError(null);
    setPhase("interview");
  };

  if (phase === "interview") {
    return (
      <div className="flex min-h-dvh flex-col bg-background">
        <InterviewExperience
          conceptId={conceptId}
          subjectName={subjectName}
          intervieweeName={name.trim()}
          passcode={passcode.trim()}
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-muted/30 px-4 py-12">
      <div className="flex w-full max-w-md flex-col gap-6 rounded-2xl border border-border bg-card p-8 shadow-xs">
        {phase === "passcode" ? (
          <form onSubmit={handleVerify} className="flex flex-col gap-5">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                <Lock className="size-5 text-muted-foreground" />
              </div>
              <div className="flex flex-col gap-1">
                <h1 className="text-xl font-semibold text-foreground">
                  360 Interview
                </h1>
                <p className="text-sm/6 text-muted-foreground">
                  Enter the access code you were given to begin.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="passcode"
                className="text-sm font-medium text-foreground"
              >
                Access code
              </label>
              <Input
                id="passcode"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={passcode}
                onChange={(event) => setPasscode(event.target.value)}
                placeholder="Enter code"
                autoFocus
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" size="lg" disabled={verifying || !passcode.trim()}>
              {verifying && <Loader2 className="size-4 animate-spin" />}
              Continue
            </Button>
          </form>
        ) : (
          <form onSubmit={handleName} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1 text-center">
              <h1 className="text-xl font-semibold text-foreground">
                Before we start
              </h1>
              <p className="text-sm/6 text-muted-foreground">
                You're giving feedback on{" "}
                <span className="font-medium text-foreground">
                  {subjectName}
                </span>
                .
              </p>
            </div>
            {introText.trim() && (
              <p className="rounded-lg bg-muted/50 p-3 text-sm/6 text-muted-foreground">
                {introText}
              </p>
            )}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-foreground"
              >
                Your name
              </label>
              <Input
                id="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter your name"
                autoFocus
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" size="lg" disabled={!name.trim()}>
              Continue
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
