"use client";

import {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import type { UIMessage } from "ai";
import { Square } from "lucide-react";
import type { IdentityToneConfig } from "@/lib/types/identity-tone";
import type { RulesConfig } from "@/lib/types/playground-rules";
import { Button } from "@/components/ui/button";
import {
  ChatContainerRoot,
  ChatContainerContent,
  ChatContainerScrollAnchor,
} from "@/components/ui/chat-container";
import { Message, MessageContent } from "@/components/ui/message";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Reasoning,
  ReasoningTrigger,
  ReasoningContent,
} from "@/components/ai-elements/reasoning";
import { Loader } from "@/components/ui/loader";

export type PlaygroundOption = {
  id: string;
  title: string;
  model: string;
  identityTone: IdentityToneConfig;
  rulesConfig: RulesConfig;
};

export type HeadToHeadChatHandle = {
  sendMessage: (text: string, personId: string | null) => void;
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
    (part) => part.type === "reasoning",
  );
  const reasoningText = reasoningParts.map((part) => part.text).join("\n\n");
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

export const HeadToHeadChat = forwardRef<
  HeadToHeadChatHandle,
  { playgrounds: PlaygroundOption[]; label: string }
>(function HeadToHeadChat({ playgrounds, label }, ref) {
  const [selectedId, setSelectedId] = useState<string>("");

  const selected = playgrounds.find((p) => p.id === selectedId);

  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/chat" }),
    [],
  );

  const { messages, sendMessage, stop, status } = useChat({ transport });

  const isStreaming = status === "streaming";
  const isPending = status === "submitted";

  useImperativeHandle(ref, () => ({
    sendMessage: (text: string, personId: string | null) => {
      if (!selected) return;
      sendMessage(
        { text },
        {
          body: {
            model: selected.model,
            identityTone: selected.identityTone,
            rulesConfig: selected.rulesConfig,
            personId: personId ?? undefined,
          },
        },
      );
    },
  }));

  const modelProvider = selected?.model.split("/")[0];

  return (
    <div className="flex flex-1 flex-col overflow-hidden border-r last:border-r-0">
      <div className="flex items-center gap-3 border-b px-4 py-2">
        <span className="shrink-0 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <Select value={selectedId} onValueChange={setSelectedId}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Select playground" />
          </SelectTrigger>
          <SelectContent>
            {playgrounds.map((pg) => (
              <SelectItem key={pg.id} value={pg.id}>
                <div className="flex items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://models.dev/logos/${pg.model.split("/")[0]}.svg`}
                    alt={pg.model.split("/")[0]}
                    className="size-3.5 invert"
                    width={14}
                    height={14}
                  />
                  {pg.title}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isStreaming && (
          <Button
            variant="outline"
            size="icon"
            className="size-7 shrink-0"
            onClick={stop}
          >
            <Square className="size-3 fill-current" />
          </Button>
        )}
      </div>

      <ChatContainerRoot className="flex-1">
        <ChatContainerContent className="gap-4 px-4 py-4">
          {!selected && messages.length === 0 && (
            <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
              Select a playground to get started.
            </div>
          )}
          {selected && messages.length === 0 && !isPending && (
            <div className="flex flex-1 items-center justify-center">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://models.dev/logos/${modelProvider}.svg`}
                  alt={modelProvider ?? ""}
                  className="size-6 invert opacity-40"
                  width={24}
                  height={24}
                />
                <span className="text-sm">{selected.title}</span>
              </div>
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
                (p) => p.type === "text" && p.text.length > 0,
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
    </div>
  );
});
