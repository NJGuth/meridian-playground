"use client";

import { useRef, useState, useTransition } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  updatePromptContent,
  addExample,
  removeExample,
  deletePrompt,
} from "@/server/actions/prompt";

type Prompt = {
  id: string;
  content: string;
  positiveExamples: string[];
  negativeExamples: string[];
};

export function PromptEditor({ prompt }: { prompt: Prompt }) {
  return (
    <div className="flex flex-col gap-8">
      <div className="rounded-xl bg-muted/50 p-5 ring-1 ring-foreground/10">
        <PromptContentSection id={prompt.id} defaultValue={prompt.content} />
      </div>
      <ExamplesSection
        id={prompt.id}
        type="positive"
        label="Positive Examples"
        description="Show the model what good responses look like"
        examples={prompt.positiveExamples}
      />
      <ExamplesSection
        id={prompt.id}
        type="negative"
        label="Negative Examples"
        description="Show the model what to avoid"
        examples={prompt.negativeExamples}
      />
      <div className="border-t pt-6">
        <form action={deletePrompt.bind(null, prompt.id)}>
          <Button type="submit" variant="destructive" size="sm">
            <Trash2 className="size-4" />
            Delete Prompt
          </Button>
        </form>
      </div>
    </div>
  );
}

function PromptContentSection({
  id,
  defaultValue,
}: {
  id: string;
  defaultValue: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState(defaultValue);

  function handleBlur() {
    if (value === defaultValue) return;
    startTransition(() => {
      updatePromptContent(id, value);
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor="prompt-content"
        className="text-sm font-medium text-muted-foreground"
      >
        Prompt
      </label>
      <textarea
        id="prompt-content"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
        disabled={isPending}
        placeholder="Write your prompt here..."
        className="w-full resize-none border-none bg-transparent text-xl font-medium text-foreground outline-none field-sizing-content placeholder:text-muted-foreground/50 disabled:opacity-50"
      />
    </div>
  );
}

function ExamplesSection({
  id,
  type,
  label,
  description,
  examples,
}: {
  id: string;
  type: "positive" | "negative";
  label: string;
  description: string;
  examples: string[];
}) {
  const [isPending, startTransition] = useTransition();
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  function handleAdd() {
    if (!inputValue.trim()) return;
    startTransition(async () => {
      await addExample(id, type, inputValue.trim());
      setInputValue("");
      inputRef.current?.focus();
    });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAdd();
    }
  }

  function handleRemove(index: number) {
    startTransition(() => {
      removeExample(id, type, index);
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h3 className="text-sm font-medium text-foreground">{label}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {examples.length > 0 && (
        <div className="flex flex-col gap-2">
          {examples.map((example, index) => (
            <div
              key={`${type}-${example}`}
              className="group flex items-start gap-2 rounded-lg bg-muted/50 px-3 py-2"
            >
              <p className="flex-1 text-sm text-foreground">{example}</p>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                disabled={isPending}
                className="shrink-0 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100 disabled:opacity-50"
              >
                <X className="size-4" />
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="flex items-start gap-2">
        <textarea
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isPending}
          placeholder="Add an example..."
          className="min-h-9 flex-1 resize-none rounded-lg border border-input bg-transparent px-3 py-2 text-sm text-foreground outline-none field-sizing-content placeholder:text-muted-foreground focus:border-ring focus:ring-3 focus:ring-ring/50 disabled:opacity-50"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-9 shrink-0"
          onClick={handleAdd}
          disabled={isPending || !inputValue.trim()}
        >
          <Plus className="size-4" />
        </Button>
      </div>
    </div>
  );
}
