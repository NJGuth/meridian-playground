"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { BUILTIN_VOICE_CONCEPT_RULES } from "@/lib/voice/build-concept-instructions";
import { OPENAI_REALTIME_VOICES } from "@/lib/voice/voice-options";
import { ConceptDynamicsSidebar } from "./concept-dynamics-sidebar";
import { useVoiceConcept } from "./voice-concept-config-context";

export function ConceptConfigSidebar() {
  const { config, setField, commitField, commit } = useVoiceConcept();
  const [newRule, setNewRule] = useState("");

  function handleAddRule() {
    const trimmed = newRule.trim();
    if (!trimmed) return;
    setNewRule("");
    commit({ rules: [...config.rules, trimmed] });
  }

  function handleRemoveRule(index: number) {
    commit({ rules: config.rules.filter((_, i) => i !== index) });
  }

  return (
    <Sidebar side="right">
      <SidebarHeader className="shrink-0 px-4 py-3">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Configuration
        </span>
      </SidebarHeader>
      <SidebarContent className="overflow-hidden">
        <ScrollArea className="h-full">
          <div className="flex flex-col gap-6 px-4 pb-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="concept-title" className="text-sm font-medium">
              Name
            </label>
            <Input
              id="concept-title"
              value={config.title}
              onChange={(event) => setField("title", event.target.value)}
              onBlur={() => commitField("title")}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="concept-voice" className="text-sm font-medium">
              Voice
            </label>
            <Select
              value={config.voice}
              onValueChange={(value) =>
                commit({ voice: value as (typeof OPENAI_REALTIME_VOICES)[number] })
              }
            >
              <SelectTrigger id="concept-voice" className="w-full capitalize">
                <SelectValue placeholder="Select a voice" />
              </SelectTrigger>
              <SelectContent>
                {OPENAI_REALTIME_VOICES.map((option) => (
                  <SelectItem
                    key={option}
                    value={option}
                    className="capitalize"
                  >
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <SidebarSeparator className="-mx-4" />

          <div className="flex flex-col gap-2">
            <label htmlFor="concept-intro" className="text-sm font-medium">
              Intro text
            </label>
            <Textarea
              id="concept-intro"
              rows={3}
              value={config.introText}
              onChange={(event) => setField("introText", event.target.value)}
              onBlur={() => commitField("introText")}
              placeholder="You are about to have a conversation about your leadership goals and next steps."
              className="min-h-0 resize-none text-sm/6"
            />
            <p className="text-xs/5 text-muted-foreground">
              Shown to the user before they start the call.
            </p>
          </div>

          <SidebarSeparator className="-mx-4" />

          <div className="flex flex-col gap-2">
            <label htmlFor="concept-persona" className="text-sm font-medium">
              Persona
            </label>
            <Textarea
              id="concept-persona"
              rows={3}
              value={config.persona}
              onChange={(event) => setField("persona", event.target.value)}
              onBlur={() => commitField("persona")}
              placeholder="You are a helpful travel agent named Mia who answers questions about destinations."
              className="min-h-0 resize-none text-sm/6"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="concept-script" className="text-sm font-medium">
              Script / task
            </label>
            <Textarea
              id="concept-script"
              rows={4}
              value={config.script}
              onChange={(event) => setField("script", event.target.value)}
              onBlur={() => commitField("script")}
              placeholder="Conduct a 5-minute discovery call about the user's goals and recommend next steps."
              className="min-h-0 resize-none text-sm/6"
            />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">Rules</span>
            <div className="flex flex-col gap-2">
              {BUILTIN_VOICE_CONCEPT_RULES.map((rule) => (
                <Card key={rule} size="sm" className="py-2.5">
                  <div className="px-3">
                    <p className="text-xs/4 text-muted-foreground">{rule}</p>
                    <p className="mt-1 text-[11px]/3.5 text-muted-foreground/80">
                      Built-in — always applied
                    </p>
                  </div>
                </Card>
              ))}
            </div>
            <Textarea
              rows={2}
              value={newRule}
              onChange={(event) => setNewRule(event.target.value)}
              placeholder="e.g. Stay on topic and do not give medical advice."
              className="min-h-0 resize-none text-sm/6"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!newRule.trim()}
              onClick={handleAddRule}
            >
              <Plus className="size-3" />
              Add rule
            </Button>
            {config.rules.length > 0 && (
              <div className="flex flex-col gap-2">
                {config.rules.map((rule, index) => (
                  <Card key={`${rule.slice(0, 32)}-${index}`} size="sm" className="py-2.5">
                    <div className="flex items-start gap-2 px-3">
                      <p className="flex-1 text-xs/4 text-foreground">{rule}</p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        className="shrink-0 text-muted-foreground hover:text-destructive"
                        onClick={() => handleRemoveRule(index)}
                      >
                        <X className="size-3" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="concept-opening" className="text-sm font-medium">
              Opening line
            </label>
            <Textarea
              id="concept-opening"
              rows={2}
              value={config.openingLine}
              onChange={(event) => setField("openingLine", event.target.value)}
              onBlur={() => commitField("openingLine")}
              placeholder="Hi there! I'm Mia. What kind of trip are you planning?"
              className="min-h-0 resize-none text-sm/6"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="concept-context" className="text-sm font-medium">
              Context / knowledge
            </label>
            <Textarea
              id="concept-context"
              rows={4}
              value={config.contextNotes}
              onChange={(event) => setField("contextNotes", event.target.value)}
              onBlur={() => commitField("contextNotes")}
              placeholder="Reference facts, product details, or scenario notes the agent can use."
              className="min-h-0 resize-none text-sm/6"
            />
          </div>

          <ConceptDynamicsSidebar />
          </div>
        </ScrollArea>
      </SidebarContent>
    </Sidebar>
  );
}
