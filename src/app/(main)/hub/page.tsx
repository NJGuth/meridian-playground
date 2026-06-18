import { ConceptsTable } from "@/components/hub/concepts-table";

export default function HubPage() {
  return (
    <div className="container mx-auto flex flex-1 flex-col overflow-y-auto px-6 py-6">
      <p className="mb-6 max-w-2xl text-sm/6 text-muted-foreground">
        Team prototypes and experiments. Open any concept to explore it.
      </p>
      <ConceptsTable />
    </div>
  );
}
