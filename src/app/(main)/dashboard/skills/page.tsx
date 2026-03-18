"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  DOMAINS,
  DIMENSIONS_BY_DOMAIN,
  SKILLS_BY_DIMENSION,
  DOMAIN_BY_ID,
  DIMENSION_BY_ID,
  type Skill,
} from "@/lib/framework/ld12-definitions";

export default function SkillsFrameworkPage() {
  const [query, setQuery] = useState("");
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  const lowerQuery = query.toLowerCase().trim();

  const filtered = useMemo(() => {
    return DOMAINS.map((domain) => {
      const dimensions = (DIMENSIONS_BY_DOMAIN[domain.id] ?? []).map((dim) => {
        const skills = (SKILLS_BY_DIMENSION[dim.id] ?? []).filter(
          (skill) =>
            !lowerQuery ||
            skill.name.toLowerCase().includes(lowerQuery) ||
            dim.name.toLowerCase().includes(lowerQuery) ||
            domain.name.toLowerCase().includes(lowerQuery),
        );
        return { ...dim, skills };
      }).filter((dim) => dim.skills.length > 0);
      return { ...domain, dimensions };
    }).filter((domain) => domain.dimensions.length > 0);
  }, [lowerQuery]);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="border-b px-6 py-3">
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search skills…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <ScrollArea className="flex-1 overflow-hidden">
        <div className="container mx-auto flex flex-col gap-10 px-6 py-6">
          {filtered.length === 0 && (
            <p className="py-12 text-center text-sm text-muted-foreground">
              No skills match &ldquo;{query}&rdquo;
            </p>
          )}

          {filtered.map((domain) => (
            <section key={domain.id} className="flex flex-col gap-6">
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                  {domain.name}
                </h2>
                <p className="mt-1 text-sm/6 text-muted-foreground">
                  {domain.description}
                </p>
              </div>

              {domain.dimensions.map((dim) => (
                <div key={dim.id} className="flex flex-col gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      {dim.name}
                    </h3>
                    <p className="mt-0.5 text-xs/5 text-muted-foreground">
                      {dim.description}
                    </p>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {dim.skills.map((skill) => (
                      <button
                        key={skill.id}
                        type="button"
                        onClick={() => setSelectedSkill(skill)}
                        className="flex flex-col gap-1 rounded-xl p-4 text-left ring-1 ring-foreground/10 transition-colors hover:bg-muted/50"
                      >
                        <span className="text-sm font-medium text-foreground">
                          {skill.name}
                        </span>
                        <span className="line-clamp-2 text-xs/5 text-muted-foreground">
                          {skill.description}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </section>
          ))}
        </div>
      </ScrollArea>

      <Sheet
        open={selectedSkill !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedSkill(null);
        }}
      >
        <SheetContent className="overflow-y-auto">
          {selectedSkill && (
            <>
              <SheetHeader>
                <SheetDescription>
                  {DOMAIN_BY_ID.get(selectedSkill.domainId)?.name}
                  {" / "}
                  {DIMENSION_BY_ID.get(selectedSkill.dimensionId)?.name}
                </SheetDescription>
                <SheetTitle>{selectedSkill.name}</SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-6 px-4 pb-6">
                <div className="flex flex-col gap-1">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Description
                  </h4>
                  <p className="text-sm/6 text-foreground">
                    {selectedSkill.description}
                  </p>
                </div>

                <div className="flex flex-col gap-1">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    As a Strength
                  </h4>
                  <p className="text-sm/6 text-foreground">
                    {selectedSkill.strengthDescription}
                  </p>
                </div>

                <div className="flex flex-col gap-1">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    As an Opportunity
                  </h4>
                  <p className="text-sm/6 text-foreground">
                    {selectedSkill.opportunityDescription}
                  </p>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
