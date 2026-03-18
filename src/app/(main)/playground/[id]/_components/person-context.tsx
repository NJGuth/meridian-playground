"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface PersonContextValue {
  personId: string | null;
  setPersonId: (id: string | null) => void;
}

const PersonContext = createContext<PersonContextValue | null>(null);

export function PersonProvider({ children }: { children: ReactNode }) {
  const [personId, setPersonId] = useState<string | null>(null);
  return (
    <PersonContext value={{ personId, setPersonId }}>
      {children}
    </PersonContext>
  );
}

export function usePersonId() {
  const ctx = useContext(PersonContext);
  if (!ctx) throw new Error("usePersonId must be used within PersonProvider");
  return ctx;
}
