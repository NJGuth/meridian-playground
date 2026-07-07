import {
  getOrCreateInterviewConcept,
  listInterviews,
} from "@/server/interview-service";
import { InterviewConceptManager } from "./_components/interview-concept-manager";

export const dynamic = "force-dynamic";

export default async function InterviewConceptPage() {
  const concept = await getOrCreateInterviewConcept();
  const interviews = await listInterviews(concept.id);

  return (
    <InterviewConceptManager
      concept={{
        id: concept.id,
        title: concept.title,
        subjectName: concept.subjectName,
        passcode: concept.passcode,
        report: concept.report,
        reportGeneratedAt: concept.reportGeneratedAt?.toISOString() ?? null,
      }}
      interviews={interviews.map((interview) => ({
        id: interview.id,
        intervieweeName: interview.intervieweeName,
        status: interview.status,
        summary: interview.summary,
        transcript: interview.transcript,
        createdAt: interview.createdAt.toISOString(),
        completedAt: interview.completedAt?.toISOString() ?? null,
      }))}
    />
  );
}
