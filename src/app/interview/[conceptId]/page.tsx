import { notFound } from "next/navigation";
import { getInterviewConcept } from "@/server/interview-service";
import { PublicInterviewFlow } from "./_components/public-interview-flow";

export const dynamic = "force-dynamic";

export default async function PublicInterviewPage({
  params,
}: {
  params: Promise<{ conceptId: string }>;
}) {
  const { conceptId } = await params;
  const concept = await getInterviewConcept(conceptId);

  if (!concept) notFound();

  return (
    <PublicInterviewFlow
      conceptId={concept.id}
      subjectName={concept.subjectName}
      introText={concept.introText}
    />
  );
}
