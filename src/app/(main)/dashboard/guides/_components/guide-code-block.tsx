"use client";

import { CodeBlock, CodeBlockCode } from "@/components/ui/code-block";

export function GuideCodeBlock({ code }: { code: string }) {
  return (
    <CodeBlock>
      <CodeBlockCode code={code} language="xml" theme="github-dark" />
    </CodeBlock>
  );
}
