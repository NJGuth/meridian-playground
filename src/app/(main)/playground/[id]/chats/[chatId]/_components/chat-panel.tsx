"use client";

import { useMemo, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import type { UIMessage } from "ai";
import { ArrowUp, Square, MessageSquareText } from "lucide-react";
import type { IdentityToneConfig } from "@/lib/types/identity-tone";
import type { RulesConfig } from "@/lib/types/playground-rules";
import { usePersonId } from "@/app/(main)/playground/[id]/_components/person-context";
import { Button } from "@/components/ui/button";
import {
  ChatContainerRoot,
  ChatContainerContent,
  ChatContainerScrollAnchor,
} from "@/components/ui/chat-container";
import { Message, MessageContent } from "@/components/ui/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputActions,
  PromptInputAction,
} from "@/components/ui/prompt-input";
import {
  CommandDialog,
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  Reasoning,
  ReasoningTrigger,
  ReasoningContent,
} from "@/components/ai-elements/reasoning";
import { Loader } from "@/components/ui/loader";

type PromptRecord = {
  id: string;
  content: string;
  positiveExamples: string[];
  negativeExamples: string[];
};

function MessageParts({
  message,
  isLastMessage,
  isStreaming,
}: {
  message: UIMessage;
  isLastMessage: boolean;
  isStreaming: boolean;
}) {
  const reasoningParts = message.parts.filter(
    (part) => part.type === "reasoning"
  );
  const reasoningText = reasoningParts
    .map((part) => part.text)
    .join("\n\n");
  const hasReasoning = reasoningParts.length > 0;

  const lastPart = message.parts.at(-1);
  const isReasoningStreaming =
    isLastMessage && isStreaming && lastPart?.type === "reasoning";

  const textContent = message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");

  return (
    <>
      {hasReasoning && (
        <Reasoning className="w-full" isStreaming={isReasoningStreaming}>
          <ReasoningTrigger />
          <ReasoningContent>{reasoningText}</ReasoningContent>
        </Reasoning>
      )}
      {textContent && (
        <MessageContent variant="prose" markdown>
          {textContent}
        </MessageContent>
      )}
    </>
  );
}

export function ChatPanel({
  model,
  prompts = [],
  identityTone,
  rulesConfig,
}: {
  model: string;
  prompts?: PromptRecord[];
  identityTone?: IdentityToneConfig;
  rulesConfig?: RulesConfig;
}) {
  const [input, setInput] = useState("");
  const [promptsOpen, setPromptsOpen] = useState(false);
  const { personId } = usePersonId();

  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/chat" }),
    [],
  );

  const { messages, sendMessage, stop, status } = useChat({ transport });

  const isStreaming = status === "streaming";
  const isPending = status === "submitted";

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    sendMessage(
      { text: trimmed },
      { body: { model, identityTone, rulesConfig, personId: personId ?? undefined } },
    );
    setInput("");
  };

  const handleSelectPrompt = (prompt: PromptRecord) => {
    setPromptsOpen(false);
    if (!prompt.content.trim()) return;
    sendMessage(
      { text: prompt.content },
      { body: { model, identityTone, rulesConfig, personId: personId ?? undefined } },
    );
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <ChatContainerRoot className="flex-1">
        <ChatContainerContent className="mx-auto w-full max-w-3xl gap-4 px-6 py-6">
          {messages.length === 0 && !isPending && (
            <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
              Send a message to start the conversation.
            </div>
          )}
          {messages.map((message, index) => {
            if (message.role === "user") {
              const text = message.parts
                .filter((part) => part.type === "text")
                .map((part) => part.text)
                .join("");

              if (!text) return null;

              return (
                <Message key={message.id} className="flex-row-reverse">
                  <MessageContent className="bg-primary text-primary-foreground">
                    {text}
                  </MessageContent>
                </Message>
              );
            }

            const hasContent =
              message.parts.some(
                (p) => p.type === "text" && p.text.length > 0
              ) || message.parts.some((p) => p.type === "reasoning");

            if (!hasContent) return null;

            return (
              <Message key={message.id}>
                <div className="flex min-w-0 flex-col gap-2">
                  <MessageParts
                    message={message}
                    isLastMessage={index === messages.length - 1}
                    isStreaming={isStreaming}
                  />
                </div>
              </Message>
            );
          })}
          {isPending && (
            <Message>
              <MessageContent className="bg-secondary">
                <Loader variant="typing" size="sm" />
              </MessageContent>
            </Message>
          )}
          <ChatContainerScrollAnchor />
        </ChatContainerContent>
      </ChatContainerRoot>

      <div className="mx-auto w-full max-w-3xl shrink-0 px-6 pb-6">
        <PromptInput
          value={input}
          onValueChange={setInput}
          onSubmit={handleSubmit}
          isLoading={isStreaming || isPending}
        >
          <PromptInputTextarea placeholder="Ask anything..." />
          <PromptInputActions className="justify-between px-2 pb-2">
            <div className="flex items-center">
              {prompts.length > 0 && (
                <PromptInputAction tooltip="Browse prompts">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-1.5 rounded-full text-xs text-muted-foreground"
                    onClick={() => setPromptsOpen(true)}
                  >
                    <MessageSquareText className="size-4" />
                    Prompts
                  </Button>
                </PromptInputAction>
              )}
            </div>
            <div className="flex items-center">
              {isStreaming ? (
                <PromptInputAction tooltip="Stop generating">
                  <Button
                    variant="default"
                    size="icon"
                    className="size-8 rounded-full"
                    onClick={stop}
                  >
                    <Square className="size-3 fill-current" />
                  </Button>
                </PromptInputAction>
              ) : (
                <PromptInputAction tooltip="Send message">
                  <Button
                    variant="default"
                    size="icon"
                    className="size-8 rounded-full"
                    disabled={!input.trim() || isPending}
                    onClick={handleSubmit}
                  >
                    <ArrowUp className="size-4" />
                  </Button>
                </PromptInputAction>
              )}
            </div>
          </PromptInputActions>
        </PromptInput>
        <CommandDialog
          open={promptsOpen}
          onOpenChange={setPromptsOpen}
          title="Prompts"
          description="Select a prompt to send"
        >
          <Command>
            <CommandInput placeholder="Filter prompts..." />
            <CommandList>
              <CommandEmpty>No prompts found.</CommandEmpty>
              <CommandGroup>
                {prompts.map((prompt) => (
                  <CommandItem
                    key={prompt.id}
                    value={prompt.content}
                    onSelect={() => handleSelectPrompt(prompt)}
                  >
                    <span className="line-clamp-1">{prompt.content || "Empty prompt"}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </CommandDialog>
      </div>
    </div>
  );
}
