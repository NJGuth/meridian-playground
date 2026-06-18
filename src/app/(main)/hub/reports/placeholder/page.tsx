export default function ReportsPlaceholderPage() {
  return (
    <div className="container mx-auto flex flex-1 flex-col overflow-y-auto px-6 py-6">
      <p className="mb-8 max-w-2xl text-sm/6 text-muted-foreground">
        Shell for assessment and debrief report concepts. Use this space to
        iterate on layout and section structure before wiring assessment data.
      </p>

      <div className="flex flex-col gap-6">
        <section className="rounded-xl border border-dashed border-foreground/15 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Summary
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Executive summary and key themes will appear here.
          </p>
        </section>

        <section className="rounded-xl border border-dashed border-foreground/15 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Assessment Data
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Hogan, LD12, and Values score visualizations will appear here.
          </p>
        </section>

        <section className="rounded-xl border border-dashed border-foreground/15 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Recommendations
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Coaching recommendations and development priorities will appear here.
          </p>
        </section>
      </div>
    </div>
  );
}
