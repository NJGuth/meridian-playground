import Link from "next/link";
import { Show } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background">
      <main className="flex flex-col items-center gap-8 px-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Meridian Playground
        </h1>
        <p className="max-w-md text-lg/7 text-muted-foreground">
          An AI playground for internal use. Sign in to get started.
        </p>
        <Show when="signed-out">
          <Button asChild size="lg">
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </Show>
        <Show when="signed-in">
          <Button asChild size="lg">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </Show>
      </main>
    </div>
  );
}
