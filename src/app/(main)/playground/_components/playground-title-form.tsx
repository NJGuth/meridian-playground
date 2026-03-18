"use client";

import { useTransition } from "react";
import { Input } from "@/components/ui/input";

type Props = {
  id: string;
  defaultValue: string;
  updatePlayground: (formData: FormData) => Promise<void>;
};

export function PlaygroundTitleForm({
  id,
  defaultValue,
  updatePlayground,
}: Props) {
  const [isPending, startTransition] = useTransition();

  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    const form = e.currentTarget.form;
    if (!form) return;

    const formData = new FormData(form);
    const newTitle = formData.get("title") as string;
    if (newTitle?.trim() === defaultValue.trim()) return;

    startTransition(() => {
      updatePlayground(formData);
    });
  }

  return (
    <form action={updatePlayground} className="flex flex-col gap-2">
      <input type="hidden" name="id" value={id} />
      <label htmlFor="title" className="text-sm font-medium text-foreground">
        Coach Name
      </label>
      <Input
        id="title"
        type="text"
        name="title"
        defaultValue={defaultValue}
        required
        onBlur={handleBlur}
        disabled={isPending}
      />
    </form>
  );
}
