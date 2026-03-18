"use client";

import { useEffect, useState, useTransition } from "react";
import { User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { getPeopleForSelector } from "@/server/actions/assessment";
import { usePersonId } from "./person-context";

type PersonOption = {
  id: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  function: string;
};

export function PersonSelectorField() {
  const { personId, setPersonId } = usePersonId();
  const [open, setOpen] = useState(false);
  const [people, setPeople] = useState<PersonOption[]>([]);
  const [, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const result = await getPeopleForSelector();
      setPeople(result);
    });
  }, []);

  const selected = people.find((p) => p.id === personId);
  const displayLabel = selected
    ? `${selected.firstName} ${selected.lastName}${selected.jobTitle ? ` — ${selected.jobTitle}` : ""}`
    : null;

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-foreground">
        Select Talent
      </span>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          className="h-8 flex-1 justify-start gap-2 rounded-lg border-input/60 font-normal text-muted-foreground shadow-xs dark:bg-input/30 dark:hover:bg-input/50"
          onClick={() => setOpen(true)}
        >
          <User className="size-4 shrink-0" />
          <span className="truncate">
            {displayLabel ?? "None selected"}
          </span>
        </Button>
        {personId && (
          <Button
            variant="ghost"
            size="icon"
            className="size-8 shrink-0 text-muted-foreground"
            onClick={() => setPersonId(null)}
          >
            <X className="size-3.5" />
          </Button>
        )}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          aria-describedby={undefined}
          className="border-none! p-0 outline outline-border"
        >
          <DialogTitle className="sr-only">Select Talent</DialogTitle>
          <Command className="**:data-[slot=command-input-wrapper]:h-auto">
            <CommandInput
              className="h-auto py-3.5"
              placeholder="Search people..."
            />
            <CommandList>
              <CommandEmpty>No people found.</CommandEmpty>
              <CommandGroup>
                {people.map((person) => (
                  <CommandItem
                    key={person.id}
                    value={`${person.firstName} ${person.lastName} ${person.jobTitle} ${person.function}`}
                    onSelect={() => {
                      setPersonId(person.id);
                      setOpen(false);
                    }}
                    className="gap-2"
                  >
                    <User className="size-4 shrink-0 text-muted-foreground" />
                    <div className="flex flex-col">
                      <span>
                        {person.firstName} {person.lastName}
                      </span>
                      {person.jobTitle && (
                        <span className="text-xs text-muted-foreground">
                          {person.jobTitle}
                          {person.function ? ` · ${person.function}` : ""}
                        </span>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </div>
  );
}
