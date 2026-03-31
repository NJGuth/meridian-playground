"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls,
} from "ai";
import type { UIMessage } from "ai";
import { ArrowUp, Square, MessageSquareText } from "lucide-react";
import type { IdentityToneConfig, FeedbackStyle } from "@/lib/types/identity-tone";
import type { RulesConfig } from "@/lib/types/playground-rules";
import { usePersonId } from "@/app/(main)/playground/[id]/_components/person-context";
import { saveMessage } from "@/server/actions/message";
import { updatePlaygroundFeedbackStyle } from "@/server/actions/playground";
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
import { FeedbackStyleSelector } from "./feedback-style-selector";
import { WaitingIndicator } from "./waiting-indicator";

const INITIATE_TOKEN = "[INITIATE_CONVERSATION]";

interface ToolPart {
  type: string;
  toolCallId: string;
  state: string;
  input?: { currentStyle?: string };
}

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
  onSelectFeedbackStyle,
}: {
  message: UIMessage;
  isLastMessage: boolean;
  isStreaming: boolean;
  onSelectFeedbackStyle?: (style: FeedbackStyle) => void;
}) {
  const reasoningParts = message.parts.filter(
    (part) => part.type === "reasoning",
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

  const toolParts = message.parts.filter(
    (part) => part.type === "tool-selectFeedbackStyle",
  );

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
      {toolParts.map((part) => {
        const tp = part as unknown as ToolPart;
        if (tp.state === "output-available") return null;
        return (
          <FeedbackStyleSelector
            key={tp.toolCallId}
            currentStyle={tp.input?.currentStyle ?? "Reflective"}
            onSelect={(style) => onSelectFeedbackStyle?.(style)}
          />
        );
      })}
    </>
  );
}

export function ChatPanel({
  playgroundId,
  chatId,
  model,
  prompts = [],
  identityTone,
  rulesConfig,
  welcomeMessage,
  initialMessages,
}: {
  playgroundId: string;
  chatId: string;
  model: string;
  prompts?: PromptRecord[];
  identityTone?: IdentityToneConfig;
  rulesConfig?: RulesConfig;
  welcomeMessage?: string;
  initialMessages?: UIMessage[];
}) {
  const [input, setInput] = useState("");
  const [promptsOpen, setPromptsOpen] = useState(false);
  const { personId } = usePersonId();
  const initiatedRef = useRef(false);

  const bodyRef = useRef({
    model,
    identityTone,
    rulesConfig,
    welcomeMessage,
    personId: personId ?? undefined,
  });
  bodyRef.current = {
    model,
    identityTone,
    rulesConfig,
    welcomeMessage,
    personId: personId ?? undefined,
  };

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: () => bodyRef.current,
      }),
    [],
  );

  const onFinish = useCallback(
    ({ message }: { message: UIMessage }) => {
      saveMessage(chatId, message);
    },
    [chatId],
  );

  const { messages, sendMessage, addToolOutput, stop, status } = useChat({
    transport,
    messages: initialMessages,
    onFinish,
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
  });

  const isStreaming = status === "streaming";
  const isPending = status === "submitted";

  const lastMessage = messages.at(-1);
  const isWaitingForContent =
    isPending ||
    (isStreaming &&
      lastMessage?.role === "assistant" &&
      !lastMessage.parts.some(
        (p) =>
          (p.type === "text" && p.text.length > 0) ||
          p.type === "tool-selectFeedbackStyle",
      ));

  useEffect(() => {
    if (initiatedRef.current) return;
    if (initialMessages && initialMessages.length > 0) return;

    initiatedRef.current = true;
    const userMessage: UIMessage = {
      id: crypto.randomUUID(),
      role: "user",
      parts: [{ type: "text", text: INITIATE_TOKEN }],
    };
    saveMessage(chatId, userMessage);
    sendMessage({ text: INITIATE_TOKEN });
  }, [initialMessages, chatId, sendMessage]);

  const persistAndSend = useCallback(
    (text: string) => {
      const userMessage: UIMessage = {
        id: crypto.randomUUID(),
        role: "user",
        parts: [{ type: "text", text }],
      };
      saveMessage(chatId, userMessage);
      sendMessage({ text });
    },
    [chatId, sendMessage],
  );

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    persistAndSend(trimmed);
    setInput("");
  };

  const handleSelectPrompt = (prompt: PromptRecord) => {
    setPromptsOpen(false);
    if (!prompt.content.trim()) return;
    persistAndSend(prompt.content);
  };

  const handleSelectFeedbackStyle = useCallback(
    (style: FeedbackStyle) => {
      const toolPart = messages
        .flatMap((m) => m.parts)
        .find(
          (p) =>
            p.type === "tool-selectFeedbackStyle" &&
            (p as unknown as ToolPart).state !== "output-available",
        ) as unknown as ToolPart | undefined;

      if (!toolPart) return;

      updatePlaygroundFeedbackStyle(playgroundId, style);

      addToolOutput({
        tool: "selectFeedbackStyle",
        toolCallId: toolPart.toolCallId,
        output: { selectedStyle: style },
      });
    },
    [messages, addToolOutput, playgroundId],
  );

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <ChatContainerRoot className="flex-1">
        <ChatContainerContent className="mx-auto w-full max-w-3xl gap-8 px-6 py-6">
          {messages.length === 0 && !isPending && (
            <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
              Starting conversation...
            </div>
          )}
          {messages.map((message, index) => {
            if (message.role === "user") {
              const text = message.parts
                .filter((part) => part.type === "text")
                .map((part) => part.text)
                .join("");

              if (!text || text === INITIATE_TOKEN) return null;

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
              ) ||
              message.parts.some((p) => p.type === "reasoning") ||
              message.parts.some(
                (p) => p.type === "tool-selectFeedbackStyle",
              );

            if (!hasContent) return null;

            return (
              <Message key={message.id}>
                <div className="flex min-w-0 flex-col gap-2">
                  <MessageParts
                    message={message}
                    isLastMessage={index === messages.length - 1}
                    isStreaming={isStreaming}
                    onSelectFeedbackStyle={handleSelectFeedbackStyle}
                  />
                </div>
              </Message>
            );
          })}
          {isWaitingForContent && (
            <Message>
              <WaitingIndicator isFirstMessage={messages.length <= 1} />
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
