import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getPerson } from "@/server/actions/data";
import { Button } from "@/components/ui/button";
import { PersonDetail } from "./_components/person-detail";

export default async function DataDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const person = await getPerson(id);

  if (!person) notFound();

  const ld12 = person.assessments.find((a) => a.type === "ld12");
  const ld12_360 = person.assessments.find((a) => a.type === "ld12_360");
  const values = person.assessments.find((a) => a.type === "values");
  const hogan_hpi = person.assessments.find((a) => a.type === "hogan_hpi");
  const hogan_hds = person.assessments.find((a) => a.type === "hogan_hds");
  const hogan_mvpi = person.assessments.find((a) => a.type === "hogan_mvpi");

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex items-center gap-3 border-b px-4 py-2">
        <Button asChild variant="ghost" size="icon-sm">
          <Link href="/dashboard/data">
            <ArrowLeft />
          </Link>
        </Button>
        <h2 className="text-sm font-semibold tracking-tight text-foreground">
          {person.firstName} {person.lastName}
        </h2>
      </div>
      <PersonDetail
        person={{
          id: person.id,
          firstName: person.firstName,
          lastName: person.lastName,
          jobTitle: person.jobTitle,
          function: person.function,
          level: person.level,
          company: person.company,
          industry: person.industry,
        }}
        assessments={{
          ld12: ld12?.data as Record<string, unknown> | undefined,
          ld12_360: ld12_360?.data as Record<string, unknown> | undefined,
          values: values?.data as Record<string, unknown> | undefined,
          hogan_hpi: hogan_hpi?.data as Record<string, unknown> | undefined,
          hogan_hds: hogan_hds?.data as Record<string, unknown> | undefined,
          hogan_mvpi: hogan_mvpi?.data as Record<string, unknown> | undefined,
        }}
      />
    </div>
  );
}
