import type { ComponentProps, ReactNode } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const SKELETON_IDS = ["a", "b", "c", "d", "e", "f", "g", "h"];

export function CardGrid({
  className,
  children,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardGridSkeleton({
  count = 8,
  children,
}: {
  count?: number;
  children?: ReactNode;
}) {
  return (
    <CardGrid>
      {SKELETON_IDS.slice(0, count).map((id) => (
        <div
          key={id}
          className="flex aspect-square flex-col gap-3 rounded-xl p-5 ring-1 ring-foreground/10"
        >
          {children ?? (
            <>
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
            </>
          )}
        </div>
      ))}
    </CardGrid>
  );
}

export function CreateCard({
  label = "Create",
  className,
  ...props
}: ComponentProps<"button"> & { label?: string }) {
  return (
    <button
      type="button"
      className={cn(
        "flex aspect-square w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-foreground/15 text-muted-foreground transition-colors hover:border-primary hover:text-primary",
        className,
      )}
      {...props}
    >
      <Plus className="size-6" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}
