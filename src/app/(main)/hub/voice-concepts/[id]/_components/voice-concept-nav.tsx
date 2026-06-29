"use client";

import Link from "next/link";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useVoiceConcept } from "./voice-concept-config-context";

export function VoiceConceptNav() {
  const { config } = useVoiceConcept();

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-2 text-sm"
    >
      <Button variant="secondary" size="icon" className="size-9" asChild>
        <Link href="/hub">
          <Home className="size-4" />
          <span className="sr-only">Concept Hub</span>
        </Link>
      </Button>
      <Separator orientation="vertical" className="h-5! self-center!" />
      <Link
        href="/hub/voice-concepts"
        className="text-muted-foreground transition-colors hover:text-foreground"
      >
        Voice Concepts
      </Link>
      <span className="text-muted-foreground">/</span>
      <span className="font-medium text-foreground">{config.title}</span>
    </nav>
  );
}
