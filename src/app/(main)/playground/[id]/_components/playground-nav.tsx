"use client";

import Link from "next/link";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { NavMenu } from "@/components/layout/nav-menu";

export function PlaygroundNav({ id }: { id: string }) {
  const items = [{ href: `/playground/${id}/chats`, label: "Chats" }];

  return (
    <div className="flex items-center gap-2 py-1">
      <Button variant="secondary" size="icon" className="size-9" asChild>
        <Link href="/dashboard/playgrounds">
          <Home />
        </Link>
      </Button>
      <Separator orientation="vertical" className="h-5! self-center!" />
      <NavMenu items={items} />
    </div>
  );
}
