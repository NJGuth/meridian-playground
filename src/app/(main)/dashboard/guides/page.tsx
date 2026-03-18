import { ScrollArea } from "@/components/ui/scroll-area";
import { AIIR_COACHING_GUIDE } from "@/lib/frameworks";
import { GuideCodeBlock } from "./_components/guide-code-block";

export default function GuidesPage() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="border-b px-6 py-3">
        <h1 className="text-sm font-semibold text-foreground">
          AIIR Coaching Guide
        </h1>
        <p className="mt-1 text-xs/5 text-muted-foreground">
          This content is injected into every LLM system prompt as the
          methodology foundation. It governs coaching approach, session
          structure, assessment interpretation, and development principles.
        </p>
      </div>

      <ScrollArea className="flex-1 overflow-hidden">
        <div className="min-w-0 px-6 py-6">
          <GuideCodeBlock code={AIIR_COACHING_GUIDE} />
        </div>
      </ScrollArea>
    </div>
  );
}
