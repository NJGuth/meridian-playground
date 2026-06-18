import Link from "next/link";
import { FOLDERS, PROTOTYPES } from "@/hub/registry";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const COMPLEXITY_LABELS = {
  ui: "UI",
  ai: "AI",
  "full-stack": "Full-stack",
} as const;

const folderLabels = Object.fromEntries(
  FOLDERS.map((folder) => [folder.id, folder.label]),
) as Record<string, string>;

export function ConceptsTable() {
  return (
    <div className="overflow-hidden rounded-xl ring-1 ring-foreground/10">
      <table className="w-full text-left text-sm">
        <thead className="border-b bg-muted/40">
          <tr>
            <th className="px-4 py-3 font-medium text-foreground">Concept</th>
            <th className="px-4 py-3 font-medium text-foreground">Category</th>
            <th className="hidden px-4 py-3 font-medium text-foreground md:table-cell">
              Description
            </th>
            <th className="px-4 py-3 font-medium text-foreground">Type</th>
            <th className="px-4 py-3 text-right font-medium text-foreground">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {PROTOTYPES.map((prototype) => (
            <tr
              key={prototype.id}
              className="border-b border-foreground/5 last:border-b-0"
            >
              <td className="px-4 py-3">
                <div className="flex flex-col gap-1">
                  <span className="font-medium text-foreground">
                    {prototype.title}
                  </span>
                  {prototype.status === "draft" && (
                    <Badge variant="outline" className="w-fit">
                      Draft
                    </Badge>
                  )}
                </div>
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {folderLabels[prototype.folder] ?? prototype.folder}
              </td>
              <td className="hidden max-w-md px-4 py-3 text-muted-foreground md:table-cell">
                {prototype.description}
              </td>
              <td className="px-4 py-3">
                <Badge variant="secondary">
                  {COMPLEXITY_LABELS[prototype.complexity]}
                </Badge>
              </td>
              <td className="px-4 py-3 text-right">
                <Button asChild size="sm">
                  <Link href={prototype.href}>Open concept</Link>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
