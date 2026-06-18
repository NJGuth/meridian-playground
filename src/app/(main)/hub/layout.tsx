import { UserButton } from "@clerk/nextjs";
import { HubTopBar } from "@/components/hub/hub-top-bar";

export default function HubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <header className="flex shrink-0 items-center gap-4 border-b px-6 py-3">
        <HubTopBar />
        <UserButton />
      </header>
      <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
}
