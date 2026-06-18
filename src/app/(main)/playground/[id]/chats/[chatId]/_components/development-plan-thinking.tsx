"use client";

import { Check, LoaderIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Shimmer } from "@/components/ai-elements/shimmer";
import {
  Task,
  TaskContent,
  TaskItem,
  TaskTrigger,
} from "@/components/ai-elements/task";
import { cn } from "@/lib/utils";

const STEPS = [
  "Reviewing your LD12 profile",
  "Identifying development priorities",
  "Drafting goals",
  "Finalizing plan",
];

const STEP_INTERVAL = 1400;

export function DevelopmentPlanThinking() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((step) => Math.min(step + 1, STEPS.length - 1));
    }, STEP_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  return (
    <Task defaultOpen className="w-full">
      <TaskTrigger title="Creating your development plan" />
      <TaskContent>
        {STEPS.map((step, index) => {
          const isDone = index < activeStep;
          const isActive = index === activeStep;
          return (
            <TaskItem key={step} className="flex items-center gap-2">
              {isDone ? (
                <Check className="size-3.5 shrink-0 text-foreground" />
              ) : isActive ? (
                <LoaderIcon className="size-3.5 shrink-0 animate-spin" />
              ) : (
                <span className="size-3.5 shrink-0 rounded-full border border-muted-foreground/30" />
              )}
              {isActive ? (
                <Shimmer as="span">{step}</Shimmer>
              ) : (
                <span className={cn(isDone && "text-foreground")}>{step}</span>
              )}
            </TaskItem>
          );
        })}
      </TaskContent>
    </Task>
  );
}
