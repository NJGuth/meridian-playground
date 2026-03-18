"use client";

import { useState, useTransition } from "react";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updatePlaygroundIdentityTone } from "@/server/actions/playground";
import {
  FEEDBACK_STYLE_OPTIONS,
  COACHING_POSTURE_OPTIONS,
  type FeedbackStyle,
  type CoachingPosture,
} from "@/lib/types/identity-tone";

export function IdentityToneFields({
  playgroundId,
  defaultRoleDescription,
  defaultFeedbackStyle,
  defaultCoachingPosture,
}: {
  playgroundId: string;
  defaultRoleDescription: string;
  defaultFeedbackStyle: FeedbackStyle;
  defaultCoachingPosture: CoachingPosture;
}) {
  const [roleDescription, setRoleDescription] = useState(
    defaultRoleDescription,
  );
  const [feedbackStyle, setFeedbackStyle] =
    useState<FeedbackStyle>(defaultFeedbackStyle);
  const [coachingPosture, setCoachingPosture] =
    useState<CoachingPosture>(defaultCoachingPosture);
  const [isPending, startTransition] = useTransition();

  function persist(overrides: {
    roleDescription?: string;
    feedbackStyle?: FeedbackStyle;
    coachingPosture?: CoachingPosture;
  }) {
    const config = {
      roleDescription: overrides.roleDescription ?? roleDescription,
      feedbackStyle: overrides.feedbackStyle ?? feedbackStyle,
      coachingPosture: overrides.coachingPosture ?? coachingPosture,
    };
    startTransition(() => {
      updatePlaygroundIdentityTone(playgroundId, config);
    });
  }

  function handleRoleBlur() {
    if (roleDescription.trim() === defaultRoleDescription.trim()) return;
    persist({ roleDescription });
  }

  function handleFeedbackStyleChange(value: FeedbackStyle) {
    setFeedbackStyle(value);
    persist({ feedbackStyle: value });
  }

  function handleCoachingPostureChange(value: CoachingPosture) {
    setCoachingPosture(value);
    persist({ coachingPosture: value });
  }

  return (
    <fieldset disabled={isPending} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label
          htmlFor="roleDescription"
          className="text-sm font-medium text-foreground"
        >
          Role description
        </label>
        <Textarea
          id="roleDescription"
          rows={6}
          maxLength={200}
          value={roleDescription}
          onChange={(e) => setRoleDescription(e.target.value)}
          onBlur={handleRoleBlur}
          placeholder="e.g. AI leadership coach specializing in..."
          className="min-h-0 resize-none text-sm"
        />
        <p className="text-xs/4 text-muted-foreground">
          Describes the coach's purpose and expertise. Injected into the system prompt to shape how the LLM introduces itself.
        </p>
      </div>

      <SelectField
        label="Feedback style"
        options={FEEDBACK_STYLE_OPTIONS}
        value={feedbackStyle}
        onChange={handleFeedbackStyleChange}
      />

      <SelectField
        label="Coaching posture"
        options={COACHING_POSTURE_OPTIONS}
        value={coachingPosture}
        onChange={handleCoachingPostureChange}
      />
    </fieldset>
  );
}

function SelectField<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string; description: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  const selected = options.find((o) => o.value === value);

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <Select value={value} onValueChange={(v) => onChange(v as T)}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent position="popper">
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selected && (
        <p className="text-xs/4 text-muted-foreground">
          {selected.description}
        </p>
      )}
    </div>
  );
}
