import { UserButton } from "@clerk/nextjs";
import { NavMenu } from "@/components/layout/nav-menu";

const dashboardNav = [
  { href: "/dashboard/playgrounds", label: "Playgrounds" },
  { href: "/dashboard/prompts", label: "Prompts" },
  { href: "/dashboard/data", label: "Data" },
  { href: "/dashboard/skills", label: "Skills" },
  { href: "/dashboard/values", label: "Values" },
  { href: "/dashboard/scoring", label: "Scoring" },
  { href: "/dashboard/guides", label: "Guides" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <header className="flex items-center justify-between border-b px-6 py-2">
        <NavMenu items={dashboardNav} />
        <UserButton />
      </header>
      <main className="flex flex-1 flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
}
