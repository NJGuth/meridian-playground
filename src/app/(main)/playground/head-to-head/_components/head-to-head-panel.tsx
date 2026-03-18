"use client";

import { useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import { usePersonId } from "@/app/(main)/playground/[id]/_components/person-context";
import { PersonSelectorField } from "@/app/(main)/playground/[id]/_components/person-selector-field";
import { Button } from "@/components/ui/button";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputActions,
  PromptInputAction,
} from "@/components/ui/prompt-input";
import {
  HeadToHeadChat,
  type HeadToHeadChatHandle,
  type PlaygroundOption,
} from "./head-to-head-chat";

export function HeadToHeadPanel({
  playgrounds,
}: {
  playgrounds: PlaygroundOption[];
}) {
  const [input, setInput] = useState("");
  const { personId } = usePersonId();
  const chatARef = useRef<HeadToHeadChatHandle>(null);
  const chatBRef = useRef<HeadToHeadChatHandle>(null);

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    chatARef.current?.sendMessage(trimmed, personId);
    chatBRef.current?.sendMessage(trimmed, personId);
    setInput("");
  };

  return (
    <div className="flex flex-1 overflow-hidden">
      <aside className="flex w-72 shrink-0 flex-col gap-6 overflow-y-auto border-r px-4 py-4">
        <PersonSelectorField />

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-foreground">Prompt</span>
          <PromptInput
            value={input}
            onValueChange={setInput}
            onSubmit={handleSubmit}
            isLoading={false}
            className="rounded-xl"
          >
            <PromptInputTextarea
              placeholder="Enter a prompt to send to both..."
              className="min-h-[80px] text-sm"
            />
            <PromptInputActions className="justify-end px-2 pb-2">
              <PromptInputAction tooltip="Send to both">
                <Button
                  variant="default"
                  size="icon"
                  className="size-8 rounded-full"
                  disabled={!input.trim()}
                  onClick={handleSubmit}
                >
                  <ArrowUp className="size-4" />
                </Button>
              </PromptInputAction>
            </PromptInputActions>
          </PromptInput>
        </div>
      </aside>

      <div className="flex flex-1 overflow-hidden">
        <HeadToHeadChat
          ref={chatARef}
          playgrounds={playgrounds}
          label="A"
        />
        <HeadToHeadChat
          ref={chatBRef}
          playgrounds={playgrounds}
          label="B"
        />
      </div>
    </div>
  );
}
