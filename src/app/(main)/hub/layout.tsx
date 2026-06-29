import { HubLayoutShell } from "@/components/hub/hub-layout-shell";

export default function HubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <HubLayoutShell>{children}</HubLayoutShell>;
}
