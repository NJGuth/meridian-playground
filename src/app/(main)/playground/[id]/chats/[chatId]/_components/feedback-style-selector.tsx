"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  FEEDBACK_STYLE_OPTIONS,
  type FeedbackStyle,
} from "@/lib/types/identity-tone";

export function FeedbackStyleSelector({
  currentStyle,
  onSelect,
}: {
  currentStyle: string;
  onSelect: (style: FeedbackStyle) => void;
}) {
  const [selected, setSelected] = useState<FeedbackStyle | null>(null);

  function handleSelect(style: FeedbackStyle) {
    if (selected) return;
    setSelected(style);
    onSelect(style);
  }

  return (
    <div className="flex flex-col gap-2 py-2">
      <p className="text-xs font-medium text-muted-foreground">
        Choose a feedback style
      </p>
      <div className="flex flex-wrap gap-2">
        {FEEDBACK_STYLE_OPTIONS.map((option) => {
          const isSelected = selected === option.value;
          const isCurrent = !selected && option.value === currentStyle;

          return (
            <Button
              key={option.value}
              variant={
                isSelected ? "default" : isCurrent ? "secondary" : "outline"
              }
              size="sm"
              disabled={!!selected && !isSelected}
              onClick={() => handleSelect(option.value)}
              className="gap-2"
            >
              {isSelected && <Check className="size-3.5" />}
              {option.label}
            </Button>
          );
        })}
      </div>
      {!selected && (
        <p className="text-xs text-muted-foreground">
          Default: <span className="font-medium">{currentStyle}</span>
        </p>
      )}
    </div>
  );
}
