import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPromptById } from "@/server/actions/prompt";
import { PromptEditor } from "./_components/prompt-editor";

export default async function PromptDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const prompt = await getPromptById(id);

  if (!prompt) notFound();

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex items-center gap-3 border-b px-4 py-2">
        <Button asChild variant="ghost" size="icon-sm">
          <Link href="/dashboard/prompts">
            <ArrowLeft />
          </Link>
        </Button>
        <h2 className="text-sm font-semibold tracking-tight text-foreground">
          Prompt
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto max-w-3xl px-6 py-6">
          <PromptEditor prompt={prompt} />
        </div>
      </div>
    </div>
  );
}
