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
  VALUES_DIMENSIONS,
  VALUES_SUB_DIMENSIONS_BY_DIMENSION,
  VALUES_DIMENSION_BY_KEY,
  type ValuesSubDimension,
} from "@/lib/framework/values-definitions";

export default function ValuesFrameworkPage() {
  const [query, setQuery] = useState("");
  const [selectedValue, setSelectedValue] =
    useState<ValuesSubDimension | null>(null);

  const lowerQuery = query.toLowerCase().trim();

  const filtered = useMemo(() => {
    return VALUES_DIMENSIONS.map((dim) => {
      const subs = (VALUES_SUB_DIMENSIONS_BY_DIMENSION[dim.key] ?? []).filter(
        (sub) =>
          !lowerQuery ||
          sub.title.toLowerCase().includes(lowerQuery) ||
          dim.title.toLowerCase().includes(lowerQuery),
      );
      return { ...dim, subs };
    }).filter((dim) => dim.subs.length > 0);
  }, [lowerQuery]);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="border-b px-6 py-3">
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search values…"
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
              No values match &ldquo;{query}&rdquo;
            </p>
          )}

          {filtered.map((dim) => (
            <section key={dim.key} className="flex flex-col gap-4">
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                  {dim.title}
                </h2>
                <p className="mt-1 text-sm/6 text-muted-foreground">
                  {dim.description}
                </p>
              </div>

              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {dim.subs.map((sub) => (
                  <button
                    key={sub.key}
                    type="button"
                    onClick={() => setSelectedValue(sub)}
                    className="flex flex-col gap-1 rounded-xl p-4 text-left ring-1 ring-foreground/10 transition-colors hover:bg-muted/50"
                  >
                    <span className="text-sm font-medium text-foreground">
                      {sub.title}
                    </span>
                    <span className="line-clamp-2 text-xs/5 text-muted-foreground">
                      {sub.description}
                    </span>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      </ScrollArea>

      <Sheet
        open={selectedValue !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedValue(null);
        }}
      >
        <SheetContent className="overflow-y-auto">
          {selectedValue && (
            <>
              <SheetHeader>
                <SheetDescription>
                  {VALUES_DIMENSION_BY_KEY.get(selectedValue.dimensionKey)
                    ?.title ?? selectedValue.dimensionKey}
                </SheetDescription>
                <SheetTitle>{selectedValue.title}</SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-6 px-4 pb-6">
                <div className="flex flex-col gap-1">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Description
                  </h4>
                  <p className="text-sm/6 text-foreground">
                    {selectedValue.description}
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
