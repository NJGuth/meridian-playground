CREATE TABLE "interview_concepts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text DEFAULT '360 Interview' NOT NULL,
	"subject_name" text DEFAULT 'Nicholas Guthrie' NOT NULL,
	"passcode" text DEFAULT '' NOT NULL,
	"intro_text" text DEFAULT '' NOT NULL,
	"report" text DEFAULT '' NOT NULL,
	"report_generated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "interviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"concept_id" uuid NOT NULL,
	"interviewee_name" text DEFAULT '' NOT NULL,
	"status" text DEFAULT 'in_progress' NOT NULL,
	"transcript" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"summary" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "interviews" ADD CONSTRAINT "interviews_concept_id_interview_concepts_id_fk" FOREIGN KEY ("concept_id") REFERENCES "public"."interview_concepts"("id") ON DELETE cascade ON UPDATE no action;