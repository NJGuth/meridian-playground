/**
 * Concept Hub registry — single source of truth for prototypes.
 *
 * To add a new prototype:
 * 1. Add an entry to PROTOTYPES below
 * 2. If new category, add to FOLDERS
 * 3. For kind "route": create src/app/(main)/hub/[folder]/[slug]/page.tsx
 * 4. For kind "external": set href to the existing route
 * 5. Open a PR — review = prototype review
 */

export type PrototypeComplexity = "ui" | "ai" | "full-stack";
export type PrototypeKind = "route" | "external";
export type PrototypeStatus = "draft" | "ready";

export type FolderId = (typeof FOLDERS)[number]["id"];

export type PrototypeEntry = {
  id: string;
  title: string;
  description: string;
  folder: FolderId;
  slug: string;
  complexity: PrototypeComplexity;
  kind: PrototypeKind;
  href: string;
  status?: PrototypeStatus;
};

export const FOLDERS = [
  {
    id: "reports",
    label: "Reports",
    description: "Assessment and debrief report concepts",
  },
  {
    id: "coach",
    label: "Coach",
    description: "AI coaching experiments",
  },
  {
    id: "ai-features",
    label: "AI Features",
    description: "Standalone AI capability demos",
  },
  {
    id: "voice",
    label: "Voice",
    description: "Voice interaction and audio concepts",
  },
] as const;

export const PROTOTYPES: PrototypeEntry[] = [
  {
    id: "reports-placeholder",
    title: "Report Concepts",
    description:
      "Placeholder shell for assessment and debrief report layouts.",
    folder: "reports",
    slug: "placeholder",
    complexity: "ui",
    kind: "route",
    href: "/hub/reports/placeholder",
    status: "draft",
  },
  {
    id: "coach-playgrounds",
    title: "Coach Playgrounds",
    description:
      "Configurable AI coaching sessions with identity, rules, and chat.",
    folder: "coach",
    slug: "playgrounds",
    complexity: "full-stack",
    kind: "external",
    href: "/dashboard/playgrounds",
    status: "ready",
  },
  {
    id: "head-to-head",
    title: "Head-to-Head",
    description: "Side-by-side comparison of two playground configurations.",
    folder: "coach",
    slug: "head-to-head",
    complexity: "full-stack",
    kind: "external",
    href: "/playground/head-to-head",
    status: "ready",
  },
  {
    id: "development-plan",
    title: "Development Plan",
    description:
      "Rich-text development plan editor — sample data sandbox for UI iteration.",
    folder: "ai-features",
    slug: "development-plan",
    complexity: "ai",
    kind: "route",
    href: "/hub/ai-features/development-plan",
    status: "draft",
  },
  {
    id: "voice",
    title: "Voice",
    description: "Voice interaction and audio prototype.",
    folder: "voice",
    slug: "voice",
    complexity: "ui",
    kind: "route",
    href: "/hub/voice",
    status: "draft",
  },
  {
    id: "voice-concepts",
    title: "Voice Concepts",
    description:
      "Create configurable OpenAI Realtime voice experiences with persona, script, and rules.",
    folder: "voice",
    slug: "voice-concepts",
    complexity: "full-stack",
    kind: "route",
    href: "/hub/voice-concepts",
    status: "draft",
  },
  {
    id: "360-interview",
    title: "360 Interview",
    description:
      "Share a passcode-gated link to collect voice 360 feedback, then generate a cross-interview report.",
    folder: "voice",
    slug: "360-interview",
    complexity: "full-stack",
    kind: "route",
    href: "/hub/360-interview",
    status: "draft",
  },
];

export function getFolder(id: string) {
  return FOLDERS.find((folder) => folder.id === id);
}

export function getPrototypesByFolder(folder: string) {
  return PROTOTYPES.filter((prototype) => prototype.folder === folder);
}

export function getPrototype(folder: string, slug: string) {
  return PROTOTYPES.find(
    (prototype) => prototype.folder === folder && prototype.slug === slug,
  );
}

export function getPrototypeCountByFolder(folder: FolderId) {
  return getPrototypesByFolder(folder).length;
}

export function resolveHubContext(pathname: string) {
  if (pathname === "/hub") {
    return { type: "index" as const, title: "Concept Hub" };
  }

  const categoryMatch = pathname.match(/^\/hub\/([^/]+)$/);
  if (categoryMatch) {
    const directPrototype = PROTOTYPES.find(
      (prototype) => prototype.href === pathname,
    );
    if (directPrototype) {
      const folder = getFolder(directPrototype.folder);
      return {
        type: "prototype" as const,
        title: directPrototype.title,
        prototype: directPrototype,
        folder,
      };
    }

    const folder = getFolder(categoryMatch[1]);
    if (folder) {
      return { type: "category" as const, title: folder.label, folder };
    }
  }

  const prototypeMatch = pathname.match(/^\/hub\/([^/]+)\/([^/]+)$/);
  if (prototypeMatch) {
    const prototype = getPrototype(prototypeMatch[1], prototypeMatch[2]);
    if (prototype) {
      const folder = getFolder(prototype.folder);
      return {
        type: "prototype" as const,
        title: prototype.title,
        prototype,
        folder,
      };
    }
  }

  return { type: "unknown" as const, title: "Concept Hub" };
}
